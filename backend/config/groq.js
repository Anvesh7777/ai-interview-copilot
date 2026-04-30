const Groq =
  require(
    "groq-sdk"
  );

/*
|---------------------------------------------------------
| Validate Environment
|---------------------------------------------------------
*/

if (
  !process.env
    .GROQ_API_KEY
) {
  throw new Error(
    "GROQ_API_KEY is missing"
  );
}

/*
|---------------------------------------------------------
| Groq Client
|---------------------------------------------------------
*/

const groq =
  new Groq(
    {
      apiKey:
        process.env
          .GROQ_API_KEY,
    }
  );

/*
|---------------------------------------------------------
| Model Configuration
|---------------------------------------------------------
*/

const MODEL =
  process.env
    .GROQ_MODEL ||
  "llama-3.3-70b-versatile";

console.log(
  `Groq configured with model: ${MODEL} ✅`
);

module.exports =
  {
    groq,
    MODEL,
  };