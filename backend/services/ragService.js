const {
  Chroma,
} = require(
  "@langchain/community/vectorstores/chroma"
);

const embeddings = require(
  "./embeddingService"
);

const {
  groq,
  MODEL,
} = require(
  "../config/groq"
);

const redis = require(
  "../config/redis"
);

const CHROMA_URL =
  process.env.CHROMA_URL ||
  "http://localhost:8000";

const COLLECTION_NAME =
  "resume_chunks";

const TENANT =
  process.env.CHROMA_TENANT ||
  "default_tenant";

const DATABASE =
  process.env.CHROMA_DATABASE ||
  "default_database";

/*
|---------------------------------------------------------
| Store Resume Embeddings
|---------------------------------------------------------
*/

const storeResumeEmbeddings =
  async (
    chunks,
    resumeId
  ) => {
    try {
      if (
        !chunks ||
        chunks.length === 0
      ) {
        throw new Error(
          "No chunks provided for embedding."
        );
      }

      await Chroma.fromTexts(
        chunks,
        chunks.map(
          (_, index) => ({
            resumeId: String(
              resumeId
            ),
            chunkIndex:
              index,
          })
        ),
        embeddings,
        {
          collectionName:
            COLLECTION_NAME,
          url:
            CHROMA_URL,
          tenant:
            TENANT,
          database:
            DATABASE,
        }
      );

      console.log(
        "Embeddings stored in Chroma ✅"
      );
    } catch (error) {
      console.error(
        "Chroma Store Error:",
        error.message
      );
      throw error;
    }
  };

/*
|---------------------------------------------------------
| Generate Interview Question
|---------------------------------------------------------
*/

const generateInterviewQuestion =
  async (
    domain,
    resumeId
  ) => {
    try {
      if (!domain) {
        throw new Error(
          "Domain is required."
        );
      }

      if (!resumeId) {
        throw new Error(
          "Resume ID is required."
        );
      }

      const cacheKey =
        `question:${String(
          resumeId
        )}:${domain}:${Date.now()}`;

      const vectorStore =
        new Chroma(
          embeddings,
          {
            collectionName:
              COLLECTION_NAME,
            url:
              CHROMA_URL,
            tenant:
              TENANT,
            database:
              DATABASE,
          }
        );

      const retriever =
        vectorStore.asRetriever({
          k: 3,
          filter: {
            resumeId: String(
              resumeId
            ),
          },
        });

      const docs =
        await retriever.invoke(
          domain
        );

      const context =
        docs.length > 0
          ? docs
              .map(
                (doc) =>
                  doc.pageContent
              )
              .join("\n")
          : "No resume context found";

      const prompt = `
You are an expert technical interviewer.

Candidate Resume Context:
${context}

Interview Domain:
${domain}

Task:
Generate ONE strong interview question.

Rules:
1. Must be domain-specific
2. Must be practical
3. Must be technical
4. Must be non-generic
5. Must be different from previous questions
6. Prefer resume-based questions if relevant
7. Return only plain question text
8. No numbering
9. No markdown
10. No explanation
`;

      const response =
        await groq.chat.completions.create(
          {
            model: MODEL,
            messages: [
              {
                role: "user",
                content:
                  prompt,
              },
            ],
            temperature:
              0.7,
          }
        );

      const question =
        response
          .choices[0]
          .message.content
          .trim();

      await redis.set(
        cacheKey,
        question,
        "EX",
        3600
      );

      console.log(
        "Question generated and cached ✅"
      );

      return question;
    } catch (error) {
      console.error(
        "Question Generation Error:",
        error.message
      );
      throw error;
    }
  };

module.exports = {
  storeResumeEmbeddings,
  generateInterviewQuestion,
};