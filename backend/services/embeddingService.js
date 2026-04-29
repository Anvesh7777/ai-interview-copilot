const {
  HuggingFaceTransformersEmbeddings,
} = require(
  "@langchain/community/embeddings/huggingface_transformers"
);

const embeddings =
  new HuggingFaceTransformersEmbeddings({
    model:
      "Xenova/all-MiniLM-L6-v2",
  });

module.exports =
  embeddings;