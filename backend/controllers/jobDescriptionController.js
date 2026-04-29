const JobDescription =
  require(
    "../models/JobDescription"
  );

const parseResume =
  require(
    "../services/parserService"
  );

const cloudinary =
  require(
    "../config/cloudinary"
  );

const fs =
  require("fs");

const uploadJobDescription =
  async (req, res) => {
    try {
      console.log(
        "Step 1: JD file received"
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
        "Step 2: Parsing JD..."
      );

      const extractedText =
        await parseResume(
          filePath
        );

      console.log(
        "Step 3: JD parsed successfully"
      );

      console.log(
        "Step 4: Uploading JD to Cloudinary..."
      );

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

      console.log(
        "Step 5: JD uploaded to Cloudinary"
      );

      const jd =
        await JobDescription.create(
          {
            user: userId,

            originalName:
              req.file
                .originalname,

            filePath:
              filePath,

            cloudinaryUrl:
              cloudinaryResult.secure_url,

            extractedText,
          }
        );

      console.log(
        "Step 6: JD saved in Mongo"
      );

      if (
        fs.existsSync(
          filePath
        )
      ) {
        fs.unlinkSync(
          filePath
        );

        console.log(
          "Step 7: Local JD deleted"
        );
      }

      return res
        .status(200)
        .json({
          success: true,
          message:
            "Job description uploaded successfully",
          jobDescriptionId:
            jd._id,
          cloudinaryUrl:
            jd.cloudinaryUrl,
        });
    } catch (error) {
      console.error(
        "Job Description Upload Error:",
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
  uploadJobDescription,
};