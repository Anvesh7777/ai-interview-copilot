const Groq =
  require(
    "groq-sdk"
  );

const redis = require(
  "../config/redis"
);

const groq =
  new Groq({
    apiKey:
      process.env
        .GROQ_API_KEY,
  });

/*
|---------------------------------------------------------
| Analyze ATS
|---------------------------------------------------------
*/

const analyzeATS =
  async (
    resumeText,
    jdText = ""
  ) => {
    try {
      const cacheKey =
        `ats:${Buffer.from(
          resumeText +
            jdText
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
          "Serving ATS from cache ⚡"
        );

        return JSON.parse(
          cached
        );
      }

      const isGeneric =
        !jdText ||
        jdText.includes(
          "General Software Engineering Industry Standards"
        );

      /*
      |---------------------------------------------
      | Prompt
      |---------------------------------------------
      */

      const completion =
        await groq.chat.completions.create(
          {
            messages:
              [
                {
                  role:
                    "system",
                  content: `
You are a professional ATS Intelligence Engine.

Analyze the resume and compare it against the job description.

Return ONLY valid JSON.
`,
                },
                {
                  role:
                    "user",
                  content: `
Resume:
${resumeText}

Job Description:
${
  isGeneric
    ? "Not Provided"
    : jdText
}

Return JSON:
{
  "matchScore": 0,
  "matchedSkills": [],
  "missingSkills": [],
  "strengths": [],
  "weaknesses": [],
  "suggestions": [],
  "roleFit": ""
}
`,
                },
              ],
            model:
              "llama-3.3-70b-versatile",
            response_format:
              {
                type:
                  "json_object",
              },
            temperature:
              0.2,
          }
        );

      let raw =
        completion
          .choices?.[0]
          ?.message
          ?.content
          ?.trim();

      if (
        !raw
      ) {
        throw new Error(
          "Empty ATS response."
        );
      }

      let report;

      try {
        report =
          JSON.parse(
            raw
          );
      } catch {
        report = {
          matchScore:
            50,
          matchedSkills:
            [],
          missingSkills:
            [],
          strengths:
            [],
          weaknesses:
            [],
          suggestions:
            [],
          roleFit:
            "Average",
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
            report
          ),
          "EX",
          86400
        )
        .catch(
          () => {}
        );

      return report;
    } catch (
      error
    ) {
      console.error(
        "ATS Service Error:",
        error.message
      );

      return {
        matchScore:
          50,
        matchedSkills:
          [],
        missingSkills:
          [],
        strengths:
          [],
        weaknesses:
          [],
        suggestions:
          [],
        roleFit:
          "Unknown",
      };
    }
  };

module.exports =
  analyzeATS;