const {
  groq,
  MODEL,
} = require(
  "../config/groq"
);

const generatePlan =
  async (
    weaknesses
  ) => {
    try {
      const prompt = `
You are an expert interview mentor.

Candidate weaknesses:
${weaknesses.join(", ")}

Generate a personalized revision roadmap.

Return ONLY valid JSON.

Format:

{
  "priorityTopics": ["string"],
  "actionPlan": ["string"],
  "estimatedDays": number
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
              0.4,
          }
        );

      return response
        .choices[0]
        .message.content;
    } catch (error) {
      console.error(
        "Revision Plan Error:",
        error.message
      );

      throw new Error(
        error.message
      );
    }
  };

module.exports =
  generatePlan;