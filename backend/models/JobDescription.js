const mongoose =
  require("mongoose");

const jobDescriptionSchema =
  new mongoose.Schema(
    {
      user: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      originalName: {
        type: String,
        required: true,
      },

      filePath: {
        type: String,
        required: true,
      },

      cloudinaryUrl: {
        type: String,
        required: true,
      },

      extractedText: {
        type: String,
        default: "",
      },
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "JobDescription",
    jobDescriptionSchema
  );