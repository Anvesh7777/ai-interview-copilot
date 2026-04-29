const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const analyzeATS = async (resumeText, jdText) => {
  try {
    const isGeneric = !jdText || jdText.includes("General Software Engineering Industry Standards");

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a professional ATS Intelligence Engine. 
          Your goal is to provide a realistic match score. 
          If a Job Description (JD) is provided, score based on Keyword Match. 
          If a JD is NOT provided, score based on Resume Quality (Formatting, Impactful Verbs, Tech Stack Density, and Quantifiable Achievements).`,
        },
        {
          role: "user",
          content: `
          --- SCORING RUBRIC (WHEN JD IS MISSING) ---
          1. Professional Summary & Contact: 10%
          2. Tech Stack Density (Languages, Frameworks): 30%
          3. Quantifiable Impact (Used %, Improved X, Built Y): 40%
          4. Formatting & Structure (Sections present): 20%

          --- INPUT DATA ---
          RESUME: ${resumeText}
          JD: ${isGeneric ? "NONE PROVIDED (Perform General Quality Audit)" : jdText}

          Return ONLY this JSON structure:
          {
            "matchScore": number (0-100),
            "matchedSkills": ["extracted tech skills found"],
            "missingSkills": ["suggest keywords common in target roles"],
            "suggestions": ["syntax/formatting/impact tips if JD is missing, else keyword tips"]
          }`,
        },
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
      temperature: 0.2, 
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Groq Service Error:", error);
    throw new Error("AI Analysis Failed");
  }
};

module.exports = analyzeATS;