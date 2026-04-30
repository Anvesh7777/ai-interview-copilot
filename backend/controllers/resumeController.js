const Resume =
  require(
    "../models/Resume"
  );

const User =
  require(
    "../models/User"
  );

const parseResume =
  require(
    "../services/parserService"
  );

const analyzeATS =
  require(
    "../services/atsService"
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

/*
|---------------------------------------------------------
| Upload Resume
|---------------------------------------------------------
*/

const uploadResume =
  async (
    req,
    res
  ) => {
    let filePath =
      null;

    try {
      if (
        !req.file
      ) {
        return res
          .status(
            400
          )
          .json({
            success:
              false,
            message:
              "No file uploaded",
          });
      }

      /*
      |---------------------------------------------
      | Authenticated User
      |---------------------------------------------
      */

      const userId =
        req.user._id;

      filePath =
        req.file.path;

      /*
      |---------------------------------------------
      | Parse Resume
      |---------------------------------------------
      */

      const {
        text:
          extractedText,
        sections,
      } =
        await parseResume(
          filePath
        );

      /*
      |---------------------------------------------
      | Upload to Cloudinary
      |---------------------------------------------
      */

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

      /*
      |---------------------------------------------
      | Chunk Resume
      |---------------------------------------------
      */

      const chunks =
        chunkText(
          extractedText
        );

      /*
      |---------------------------------------------
      | ATS Analysis
      |---------------------------------------------
      */

      const atsReport =
        await analyzeATS(
          extractedText
        );

      /*
      |---------------------------------------------
      | Create Resume Record
      |---------------------------------------------
      */

      const resume =
        await Resume.create(
          {
            user:
              userId,

            originalName:
              req.file
                .originalname,

            filePath,

            cloudinaryUrl:
              cloudinaryResult.secure_url,

            fileType:
              req.file
                .mimetype,

            extractedText,

            chunks,

            skills:
              sections.skills.map(
                (
                  skill
                ) => ({
                  name:
                    skill,
                })
              ),

            experienceLevel:
              "Unknown",

            atsInsights:
              atsReport,

            totalChunks:
              chunks.length,
          }
        );

      /*
      |---------------------------------------------
      | Store Embeddings
      |---------------------------------------------
      */

      await storeResumeEmbeddings(
        chunks,
        resume._id.toString()
      );

      resume.vectorized =
        true;

      await resume.save();

      /*
      |---------------------------------------------
      | Update User Stats
      |---------------------------------------------
      */

      await User.findByIdAndUpdate(
        userId,
        {
          $inc: {
            totalResumes:
              1,
          },
        }
      );

      return res
        .status(
          200
        )
        .json({
          success:
            true,
          message:
            "Resume uploaded successfully",
          resumeId:
            resume._id,
          cloudinaryUrl:
            resume.cloudinaryUrl,
          atsInsights:
            resume.atsInsights,
        });
    } catch (
      error
    ) {
      console.error(
        "Resume Upload Error:",
        error.message
      );

      return res
        .status(
          500
        )
        .json({
          success:
            false,
          message:
            error.message,
        });
    } finally {
      /*
      |---------------------------------------------
      | Cleanup Local File
      |---------------------------------------------
      */

      if (
        filePath &&
        fs.existsSync(
          filePath
        )
      ) {
        try {
          fs.unlinkSync(
            filePath
          );

          console.log(
            "Resume temp file deleted ✅"
          );
        } catch (
          cleanupError
        ) {
          console.error(
            "Resume cleanup failed:",
            cleanupError.message
          );
        }
      }
    }
  };

module.exports =
  {
    uploadResume,
  };