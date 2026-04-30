const fs = require("fs");
const pdfParse = require("pdf-parse");

/*
|---------------------------------------------------------
| Clean JD Text
|---------------------------------------------------------
*/

const cleanText = (text) => {
  if (!text) return "";

  return text
    .replace(/\r\n/g, "\n")
    .replace(/\n{2,}/g, "\n")
    .replace(/\s+/g, " ")
    .trim();
};

/*
|---------------------------------------------------------
| Extract Job Intelligence
|---------------------------------------------------------
*/

const extractJobData = (text) => {
  const roleMatch = text.match(
    /(software engineer|backend developer|frontend developer|full stack developer|sde intern)/i
  );

  const experienceMatch = text.match(
    /(\d+\+?\s*(years|year))/i
  );

  return {
    role: roleMatch?.[0] || "",
    experienceRequired: experienceMatch?.[0] || "",
  };
};

/*
|---------------------------------------------------------
| Safe PDF Parse (Retry Fix)
|---------------------------------------------------------
*/

const safePdfParse = async (buffer, retries = 2) => {
  for (let i = 0; i < retries; i++) {
    try {
      const data = await pdfParse(buffer);
      return data;
    } catch (error) {
      console.log(
        `PDF Parse Attempt ${i + 1} Failed:`,
        error.message
      );

      if (i === retries - 1) {
        throw error;
      }
    }
  }
};

/*
|---------------------------------------------------------
| Parse Job Description
|---------------------------------------------------------
*/

const parseJobDescription = async (filePath) => {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error(
        "Job description file not found."
      );
    }

    const stats = fs.statSync(filePath);

    if (stats.size === 0) {
      throw new Error(
        "Uploaded file is empty."
      );
    }

    const dataBuffer = fs.readFileSync(filePath);

    const data = await safePdfParse(dataBuffer);

    const cleanedText = cleanText(data.text);

    const extractedData =
      extractJobData(cleanedText);

    if (!cleanedText) {
      throw new Error(
        "No text extracted from job description."
      );
    }

    return {
      text: cleanedText,
      ...extractedData,
    };
  } catch (error) {
    console.error(
      "JD Parsing Error:",
      error.message
    );

    throw new Error(
      "Failed to parse job description PDF."
    );
  }
};

module.exports = parseJobDescription;