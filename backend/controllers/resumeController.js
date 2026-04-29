const Resume = require(
  "../models/Resume"
);

const parseResume =
  require(
    "../services/parserService"
  );

const chunkText =
  require(
    "../utils/chunkText"
  );

const {
  storeResumeEmbeddings,
} = require(
  "../services/ragService"
);

const cloudinary =
  require(
    "../config/cloudinary"
  );

const fs =
  require("fs");

const uploadResume =
  async (req, res) => {
    try {
      console.log(
        "Step 1: File received"
      );

      if (!req.file) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "No file uploaded",
          });
      }

      const userId =
        req.body.userId;

      console.log(
        "Step 2: User ID ->",
        userId
      );

      if (!userId) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "User ID missing",
          });
      }

      const filePath =
        req.file.path;

      console.log(
        "Step 3: Local File Path ->",
        filePath
      );

      console.log(
        "Step 4: Parsing PDF..."
      );

      const extractedText =
        await parseResume(
          filePath
        );

      console.log(
        "Step 5: PDF parsed successfully"
      );

      console.log(
        "Step 6: Uploading to Cloudinary..."
      );

      const cloudinaryResult =
        await cloudinary.uploader.upload(
          filePath,
          {
            folder:
              "resumes",
            resource_type:
              "raw",
          }
        );

      console.log(
        "Step 7: Uploaded to Cloudinary"
      );

      const chunks =
        chunkText(
          extractedText
        );

      console.log(
        "Step 8: Total chunks ->",
        chunks.length
      );

      const resume =
        await Resume.create({
          user: userId,

          originalName:
            req.file.originalname,

          filePath:
            filePath,

          cloudinaryUrl:
            cloudinaryResult.secure_url,

          fileType:
            req.file.mimetype,

          extractedText,

          chunks,

          totalChunks:
            chunks.length,
        });

      console.log(
        "Step 9: Resume saved in Mongo"
      );

      await storeResumeEmbeddings(
        chunks,
        resume._id.toString()
      );

      console.log(
        "Step 10: Embeddings stored"
      );

      resume.vectorized =
        true;

      await resume.save();

      console.log(
        "Step 11: Resume vectorized"
      );

      // Delete local file
      if (
        fs.existsSync(
          filePath
        )
      ) {
        fs.unlinkSync(
          filePath
        );

        console.log(
          "Step 12: Local file deleted"
        );
      }

      return res
        .status(200)
        .json({
          success: true,
          message:
            "Resume uploaded successfully",
          resumeId:
            resume._id,
          cloudinaryUrl:
            resume.cloudinaryUrl,
        });
    } catch (error) {
      console.error(
        "Resume Upload Error:",
        error
      );

      return res
        .status(500)
        .json({
          success: false,
          message:
            error.message,
        });
    }
  };

module.exports = {
  uploadResume,
};