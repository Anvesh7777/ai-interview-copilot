const {
  groq,
  MODEL,
} = require(
  "../config/groq"
);

const redis = require(
  "../config/redis"
);

const evaluateAnswer =
  async (
    question,
    answer
  ) => {
    try {
      const cacheKey =
        `evaluation:${question}:${answer}`;

      const cached =
        await redis.get(
          cacheKey
        );

      if (cached) {
        console.log(
          "Serving evaluation from cache ⚡"
        );

        return JSON.parse(
          cached
        );
      }

      const prompt = `
You are an expert technical interviewer.

Evaluate the candidate answer.

Question:
${question}

Candidate Answer:
${answer}

Rules:
1. Score from 1 to 10
2. Give concise feedback
3. Identify weaknesses
4. Keep feedback professional
5. Return ONLY raw JSON
6. DO NOT wrap JSON inside markdown
7. DO NOT use backticks
8. DO NOT add extra text

Required JSON format:

{
  "score": 0,
  "feedback": "",
  "weaknesses": []
}
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
              0.2,
          }
        );

      let raw =
        response
          .choices[0]
          .message.content
          .trim();

      // remove markdown if model adds it
      raw = raw
        .replace(
          /```json/g,
          ""
        )
        .replace(
          /```/g,
          ""
        )
        .trim();

      let evaluation;

      try {
        evaluation =
          JSON.parse(raw);
      } catch {
        evaluation = {
          score: 5,
          feedback:
            raw,
          weaknesses:
            [],
        };
      }

      await redis.set(
        cacheKey,
        JSON.stringify(
          evaluation
        ),
        "EX",
        3600
      );

      return evaluation;
    } catch (error) {
      console.error(
        "Evaluation Error:",
        error.message
      );

      throw new Error(
        error.message
      );
    }
  };

module.exports =
  evaluateAnswer;