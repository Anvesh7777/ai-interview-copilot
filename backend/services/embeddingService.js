const {
  HuggingFaceTransformersEmbeddings,
} = require(
  "@langchain/community/embeddings/hf_transformers"
);

const EMBEDDING_MODEL =
  process.env
    .EMBEDDING_MODEL ||
  "Xenova/all-MiniLM-L6-v2";

/*
|---------------------------------------------------------
| Embedding Service
|---------------------------------------------------------
*/

let embeddings =
  null;

const getEmbeddings =
  () => {
    try {
      if (
        !embeddings
      ) {
        embeddings =
          new HuggingFaceTransformersEmbeddings(
            {
              model:
                EMBEDDING_MODEL,
            }
          );

        console.log(
          `Embedding model initialized: ${EMBEDDING_MODEL} ✅`
        );
      }

      return embeddings;
    } catch (
      error
    ) {
      console.error(
        "Embedding Initialization Error:",
        error.message
      );

      throw error;
    }
  };

module.exports =
  getEmbeddings();