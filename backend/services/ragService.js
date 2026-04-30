const {
  Chroma,
} = require(
  "@langchain/community/vectorstores/chroma"
);

const embeddings =
  require(
    "./embeddingService"
  );

const {
  groq,
  MODEL,
} = require(
  "../config/groq"
);

const redis =
  require(
    "../config/redis"
);

const CHROMA_URL =
  process.env.CHROMA_URL?.replace(
    /\/$/,
    ""
  ) ||
  "http://localhost:8000";

const COLLECTION_NAME =
  "resume_chunks";

/*
|---------------------------------------------------------
| Get Existing Chroma Collection
|---------------------------------------------------------
*/

const getVectorStore =
  async () => {
    try {
      return new Chroma(
        embeddings,
        {
          collectionName:
            COLLECTION_NAME,

          url:
            CHROMA_URL,
        }
      );
    } catch (
      error
    ) {
      console.error(
        "[RAG] VectorStore Error:",
        error.message
      );

      throw error;
    }
  };

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
        !chunks.length
      ) {
        throw new Error(
          "No chunks provided."
        );
      }

      console.log(
        `[RAG] Storing ${chunks.length} chunks for resume ${resumeId}`
      );

      await Chroma.fromTexts(
        chunks,
        chunks.map(
          (
            _,
            index
          ) => ({
            resumeId:
              String(
                resumeId
              ),
            chunkIndex:
              index,
            chunkType:
              "resume",
          })
        ),
        embeddings,
        {
          collectionName:
            COLLECTION_NAME,

          url:
            CHROMA_URL,
        }
      );

      console.log(
        "[RAG] Embeddings stored ✅"
      );
    } catch (
      error
    ) {
      console.error(
        "[RAG] Store Error:",
        error.message
      );

      throw error;
    }
  };

/*
|---------------------------------------------------------
| Duplicate Question Check
|---------------------------------------------------------
*/

const isDuplicateQuestion =
  async (
    resumeId,
    question
  ) => {
    try {
      const key =
        `asked:${resumeId}`;

      const existing =
        await redis.lrange(
          key,
          0,
          -1
        );

      return existing.includes(
        question
      );
    } catch {
      return false;
    }
  };

const saveQuestionMemory =
  async (
    resumeId,
    question
  ) => {
    try {
      const key =
        `asked:${resumeId}`;

      await redis.rpush(
        key,
        question
      );

      await redis.expire(
        key,
        86400
      );
    } catch {
      console.log(
        "[RAG] Redis save skipped"
      );
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
      const normalizedDomain =
        domain
          .trim()
          .toLowerCase();

      const cacheKey =
        `question:${resumeId}:${normalizedDomain}`;

      const cached =
        await redis
          .get(
            cacheKey
          )
          .catch(
            () => null
          );

      if (
        cached
      ) {
        console.log(
          "[RAG] Cache hit 🎯"
        );

        return cached;
      }

      const vectorStore =
        await getVectorStore();

      const docs =
        await vectorStore.similaritySearch(
          normalizedDomain,
          3,
          {
            resumeId:
              String(
                resumeId
              ),
          }
        );

      console.log(
        `[RAG] Retrieved ${docs.length} chunks`
      );

      const context =
        docs.length > 0
          ? docs
              .map(
                (
                  doc
                ) =>
                  doc.pageContent
              )
              .join(
                "\n"
              )
          : "No relevant resume context found.";

      const prompt = `
You are an expert technical interviewer.

Candidate Resume Context:
${context}

Interview Domain:
${domain}

Generate ONE technical interview question.

Rules:
1. Domain-specific
2. Resume-specific if possible
3. Project-based preferred
4. Practical
5. No explanation
6. Return only the question
`;

      const response =
        await groq.chat.completions.create(
          {
            model:
              MODEL,
            messages:
              [
                {
                  role:
                    "user",
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
          .choices?.[0]
          ?.message
          ?.content
          ?.trim();

      if (
        !question
      ) {
        throw new Error(
          "Question generation failed"
        );
      }

      const duplicate =
        await isDuplicateQuestion(
          resumeId,
          question
        );

      if (
        duplicate
      ) {
        return `Can you explain your real-world implementation experience in ${domain}?`;
      }

      await saveQuestionMemory(
        resumeId,
        question
      );

      await redis
        .set(
          cacheKey,
          question,
          "EX",
          3600
        )
        .catch(
          () => {}
        );

      console.log(
        "[RAG] Question generated ✅"
      );

      return question;
    } catch (
      error
    ) {
      console.error(
        "[RAG] Generate Error:",
        error.message
      );

      return `Can you explain your experience with ${domain}?`;
    }
  };

module.exports =
  {
    storeResumeEmbeddings,
    generateInterviewQuestion,
  };