const fs =
  require("fs");

const pdfParse =
  require("pdf-parse");

/*
|---------------------------------------------------------
| Clean Resume Text
|---------------------------------------------------------
*/

const cleanText = (
  text
) => {
  if (!text) return "";

  return text
    .replace(
      /\r\n/g,
      "\n"
    )
    .replace(
      /\n{2,}/g,
      "\n"
    )
    .replace(
      /\s+/g,
      " "
    )
    .trim();
};

/*
|---------------------------------------------------------
| Extract Sections
|---------------------------------------------------------
*/

const extractSections =
  (
    text
  ) => {
    const sections = {
      skills: [],
      projects: [],
      education: [],
      experience: [],
    };

    const lowerText =
      text.toLowerCase();

    if (
      lowerText.includes(
        "skills"
      )
    ) {
      sections.skills.push(
        "Detected"
      );
    }

    if (
      lowerText.includes(
        "project"
      )
    ) {
      sections.projects.push(
        "Detected"
      );
    }

    if (
      lowerText.includes(
        "education"
      )
    ) {
      sections.education.push(
        "Detected"
      );
    }

    if (
      lowerText.includes(
        "experience"
      )
    ) {
      sections.experience.push(
        "Detected"
      );
    }

    return sections;
  };

/*
|---------------------------------------------------------
| Parse Resume
|---------------------------------------------------------
*/

const parseResume =
  async (
    filePath
  ) => {
    try {
      if (
        !fs.existsSync(
          filePath
        )
      ) {
        throw new Error(
          "Resume file not found."
        );
      }

      const dataBuffer =
        fs.readFileSync(
          filePath
        );

      const data =
        await pdfParse(
          dataBuffer
        );

      const cleanedText =
        cleanText(
          data.text
        );

      const sections =
        extractSections(
          cleanedText
        );

      if (
        !cleanedText ||
        cleanedText.length ===
          0
      ) {
        throw new Error(
          "No text extracted from resume."
        );
      }

      console.log(
        "Resume parsed successfully ✅"
      );

      return {
        text:
          cleanedText,
        sections,
      };
    } catch (
      error
    ) {
      console.error(
        "PDF Parsing Error:",
        error.message
      );

      throw error;
    }
  };

module.exports =
  parseResume;