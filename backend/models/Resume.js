const mongoose =
  require("mongoose");

const resumeSchema =
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

      fileType: {
        type: String,
        required: true,
      },

      extractedText: {
        type: String,
        default: "",
      },

      chunks: [
        {
          type: String,
        },
      ],

      skills: [
        {
          type: String,
        },
      ],

      experienceLevel: {
        type: String,
        default:
          "Unknown",
      },

      vectorized: {
        type: Boolean,
        default: false,
      },

      totalChunks: {
        type: Number,
        default: 0,
      },
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.models.Resume ||
  mongoose.model(
    "Resume",
    resumeSchema
  );