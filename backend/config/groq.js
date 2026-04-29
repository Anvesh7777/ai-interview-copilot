const Groq =
  require("groq-sdk");

const groq =
  new Groq({
    apiKey:
      process.env
        .GROQ_API_KEY,
  });

const MODEL =
  "llama-3.3-70b-versatile";

module.exports = {
  groq,
  MODEL,
};