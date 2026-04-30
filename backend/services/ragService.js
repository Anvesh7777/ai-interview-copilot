const { Chroma } = require("@langchain/community/vectorstores/chroma");
const embeddings = require("./embeddingService");
const { groq, MODEL } = require("../config/groq");
const redis = require("../config/redis");

// Ensure URL doesn't have a trailing slash which can cause 404s on some API calls
const CHROMA_URL = process.env.CHROMA_URL?.replace(/\/$/, "") || "http://localhost:8000";
const COLLECTION_NAME = "resume_chunks";

/**
 * Store Resume Embeddings
 * Logic Check: Using fromTexts is correct for initial uploads. 
 * Added logging to track chunk counts and metadata types.
 */
const storeResumeEmbeddings = async (chunks, resumeId) => {
  console.log(`[RAG_SERVICE] Starting storage for Resume: ${resumeId} (${chunks?.length} chunks)`);
  
  try {
    if (!chunks || chunks.length === 0) {
      throw new Error("No chunks provided for embedding.");
    }

    await Chroma.fromTexts(
      chunks,
      chunks.map((_, index) => ({
        resumeId: String(resumeId), // Ensure string for consistent filtering
        chunkIndex: index,
      })),
      embeddings,
      {
        collectionName: COLLECTION_NAME,
        url: CHROMA_URL,
        // Optional: tenant and database are usually default_tenant/default_database
        // Adding them only if explicitly required by your Chroma setup
      }
    );

    console.log(`[RAG_SERVICE] Embeddings successfully stored in Chroma ✅`);
  } catch (error) {
    console.error("[RAG_SERVICE_ERROR] Chroma Store Failure:", error.message);
    throw error;
  }
};

/**
 * Generate Interview Question
 * Logic Check: 
 * 1. Fixed Cache Key (removed Date.now() so it actually caches).
 * 2. Added context check.
 * 3. Added fallback response.
 */
const generateInterviewQuestion = async (domain, resumeId) => {
  console.log(`[RAG_SERVICE] Generating question. Domain: ${domain}, ResumeID: ${resumeId}`);

  try {
    // FIX: Remove Date.now() from cache key to enable actual caching
    const sanitizedDomain = domain.toLowerCase().replace(/\s+/g, "_");
    const cacheKey = `question:${resumeId}:${sanitizedDomain}`;

    // 1. Check Redis
    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        console.log(`[RAG_SERVICE] Cache Hit 🎯`);
        return cached;
      }
    } catch (redisErr) {
      console.warn("[RAG_SERVICE] Redis unavailable, skipping cache.");
    }

    // 2. Fetch from Chroma
    console.log(`[RAG_SERVICE] Querying Chroma at ${CHROMA_URL}...`);
    const vectorStore = await Chroma.fromExistingCollection(embeddings, {
      collectionName: COLLECTION_NAME,
      url: CHROMA_URL,
    });

    const docs = await vectorStore.similaritySearch(domain, 3, {
      resumeId: String(resumeId),
    });

    console.log(`[RAG_SERVICE] Found ${docs.length} relevant chunks.`);

    const context = docs.length > 0
      ? docs.map((doc) => doc.pageContent).join("\n")
      : "No specific resume context found for this domain.";

    // 3. Groq AI Call
    const prompt = `
You are an expert technical interviewer.
Candidate Resume Context: ${context}
Interview Domain: ${domain}

Task: Generate ONE strong technical interview question.
Rules: Must be domain-specific, practical, and technical. Return ONLY the question text.`;

    const response = await groq.chat.completions.create({
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const question = response.choices?.[0]?.message?.content?.trim();

    if (!question) throw new Error("Groq returned empty content.");

    // 4. Update Cache
    await redis.set(cacheKey, question, "EX", 3600).catch(() => {});

    console.log(`[RAG_SERVICE] Question generated successfully ✅`);
    return question;

  } catch (error) {
    console.error("[RAG_SERVICE_ERROR] Generation failed:", error.message);
    
    // Safety Fallback: Don't let the interview crash
    return `Can you explain your experience and best practices when working with ${domain}?`;
  }
};

module.exports = {
  storeResumeEmbeddings,
  generateInterviewQuestion,
};