const fs =
  require("fs");

const {
  PDFParse,
} = require("pdf-parse");

const parseResume =
  async (
    filePath
  ) => {
    try {
      const dataBuffer =
        fs.readFileSync(
          filePath
        );

      const parser =
        new PDFParse({
          data:
            dataBuffer,
        });

      const data =
        await parser.getText();

      return data.text;
    } catch (
      error
    ) {
      console.error(
        "PDF Parsing Error:",
        error
      );

      throw error;
    }
  };

module.exports =
  parseResume;