const JobDescription =
  require(
    "../models/JobDescription"
  );

const parseJobDescription =
  require(
    "../services/jobDescriptionParserService"
  );

const cloudinary =
  require(
    "../config/cloudinary"
  );

const fs =
  require("fs");

/*
|---------------------------------------------------------
| Upload Job Description
|---------------------------------------------------------
*/

const uploadJobDescription =
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
      | Parse Job Description
      |---------------------------------------------
      */

      const parsedData =
        await parseJobDescription(
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
              "job-descriptions",
            resource_type:
              "raw",
          }
        );

      /*
      |---------------------------------------------
      | Save JD
      |---------------------------------------------
      */

      const jd =
        await JobDescription.create(
          {
            user:
              userId,

            originalName:
              req.file
                .originalname,

            filePath,

            cloudinaryUrl:
              cloudinaryResult.secure_url,

            extractedText:
              parsedData.text,

            role:
              parsedData.role ||
              "",

            company:
              parsedData.company ||
              "",

            experienceRequired:
              parsedData.experienceRequired ||
              "",
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
            "Job description uploaded successfully",
          jobDescriptionId:
            jd._id,
          cloudinaryUrl:
            jd.cloudinaryUrl,
        });
    } catch (
      error
    ) {
      console.error(
        "Job Description Upload Error:",
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
            "JD temp file deleted ✅"
          );
        } catch (
          cleanupError
        ) {
          console.error(
            "JD cleanup failed:",
            cleanupError.message
          );
        }
      }
    }
  };

module.exports =
  {
    uploadJobDescription,
  };