const {
  groq,
  MODEL,
} = require(
  "../config/groq"
);

const redis = require(
  "../config/redis");

/*
|---------------------------------------------------------
| Evaluate Answer
|---------------------------------------------------------
*/

const evaluateAnswer =
  async (
    question,
    answer
  ) => {
    try {
      const cacheKey =
        `evaluation:${Buffer.from(
          question + answer
        ).toString(
          "base64"
        )}`;

      /*
      |---------------------------------------------
      | Cache Check
      |---------------------------------------------
      */

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
          "Serving feedback from cache ⚡"
        );

        return JSON.parse(
          cached
        );
      }

      /*
      |---------------------------------------------
      | Prompt
      |---------------------------------------------
      */

      const prompt = `
You are an expert technical interviewer.

Evaluate the candidate answer.

Question:
${question}

Candidate Answer:
${answer}

Return ONLY raw JSON.

Required JSON:

{
  "score": 0,
  "feedback": "",
  "strengths": [],
  "weaknesses": [],
  "improvementAreas": [],
  "topic": "",
  "confidenceScore": 0
}
`;

      /*
      |---------------------------------------------
      | LLM Evaluation
      |---------------------------------------------
      */

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
              0.2,
          }
        );

      let raw =
        response
          .choices?.[0]
          ?.message
          ?.content
          ?.trim();

      if (
        !raw
      ) {
        throw new Error(
          "Empty evaluation response."
        );
      }

      /*
      |---------------------------------------------
      | Clean JSON
      |---------------------------------------------
      */

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
          JSON.parse(
            raw
          );
      } catch {
        evaluation =
          {
            score:
              5,
            feedback:
              raw,
            strengths:
              [],
            weaknesses:
              [],
            improvementAreas:
              [],
            topic:
              "",
            confidenceScore:
              5,
          };
      }

      /*
      |---------------------------------------------
      | Cache Save
      |---------------------------------------------
      */

      await redis
        .set(
          cacheKey,
          JSON.stringify(
            evaluation
          ),
          "EX",
          3600
        )
        .catch(
          () => {}
        );

      return evaluation;
    } catch (
      error
    ) {
      console.error(
        "Feedback Error:",
        error.message
      );

      return {
        score: 5,
        feedback:
          "Unable to evaluate answer right now.",
        strengths:
          [],
        weaknesses:
          [],
        improvementAreas:
          [],
        topic: "",
        confidenceScore:
          5,
      };
    }
  };

module.exports =
  evaluateAnswer;