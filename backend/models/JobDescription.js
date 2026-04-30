const mongoose =
  require("mongoose");

const matchInsightsSchema =
  new mongoose.Schema({
    score: {
      type: Number,
      default: 0,
    },

    matchedSkills: [
      {
        type: String,
      },
    ],

    missingSkills: [
      {
        type: String,
      },
    ],

    suggestions: [
      {
        type: String,
      },
    ],
  });

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

      role: {
        type: String,
        default: "",
      },

      company: {
        type: String,
        default: "",
      },

      requiredSkills: [
        {
          type: String,
        },
      ],

      preferredSkills: [
        {
          type: String,
        },
      ],

      experienceRequired: {
        type: String,
        default: "",
      },

      matchInsights:
        matchInsightsSchema,
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.models
    .JobDescription ||
  mongoose.model(
    "JobDescription",
    jobDescriptionSchema
  );