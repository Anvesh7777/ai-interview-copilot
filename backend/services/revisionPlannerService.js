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
| Generate Revision Plan
|---------------------------------------------------------
*/

const generatePlan =
  async (
    weaknesses,
    domain = ""
  ) => {
    try {
      const cacheKey =
        `revision:${domain}:${weaknesses.join(
          "-"
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
          "Serving revision plan from cache ⚡"
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
You are an expert interview mentor.

Domain:
${domain}

Candidate Weaknesses:
${weaknesses.join(
  ", "
)}

Generate a personalized revision roadmap.

Return ONLY valid JSON.

Format:
{
  "priorityTopics": [],
  "actionPlan": [],
  "recommendedResources": [],
  "estimatedDays": 0
}
`;

      /*
      |---------------------------------------------
      | LLM Call
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
              0.4,
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
          "Empty revision plan response."
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

      let plan;

      try {
        plan =
          JSON.parse(
            raw
          );
      } catch {
        plan = {
          priorityTopics:
            weaknesses,
          actionPlan:
            [
              "Revise weak topics",
              "Practice interview questions",
            ],
          recommendedResources:
            [],
          estimatedDays:
            7,
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
            plan
          ),
          "EX",
          86400
        )
        .catch(
          () => {}
        );

      return plan;
    } catch (
      error
    ) {
      console.error(
        "Revision Plan Error:",
        error.message
      );

      return {
        priorityTopics:
          weaknesses,
        actionPlan:
          [
            "Revise fundamentals",
            "Practice interview questions",
          ],
        recommendedResources:
          [],
        estimatedDays:
          7,
      };
    }
  };

module.exports =
  generatePlan;