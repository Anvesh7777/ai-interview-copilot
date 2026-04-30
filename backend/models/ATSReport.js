const mongoose =
  require("mongoose");

const atsReportSchema =
  new mongoose.Schema(
    {
      user: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      resume: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "Resume",
        required: true,
      },

      jobDescription: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "JobDescription",
        default: null,
      },

      matchScore: {
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

      keywordDensity: [
        {
          keyword:
            String,
          count:
            Number,
        },
      ],

      strengths: [
        {
          type: String,
        },
      ],

      weaknesses: [
        {
          type: String,
        },
      ],

      suggestions: [
        {
          type: String,
        },
      ],

      roleFit: {
        type: String,
        default: "",
      },
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.models
    .ATSReport ||
  mongoose.model(
    "ATSReport",
    atsReportSchema
  );