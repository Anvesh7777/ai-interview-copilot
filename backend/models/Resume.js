const mongoose =
  require("mongoose");

const skillSchema =
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      default: "General",
    },
    confidence: {
      type: Number,
      default: 0,
    },
  });

const projectSchema =
  new mongoose.Schema({
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    technologies: [
      {
        type: String,
      },
    ],
  });

const atsSchema =
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

const interviewInsightsSchema =
  new mongoose.Schema({
    strongAreas: [
      {
        type: String,
      },
    ],
    weakAreas: [
      {
        type: String,
      },
    ],
    improvementAreas: [
      {
        type: String,
      },
    ],
  });

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
        skillSchema,
      ],

      projects: [
        projectSchema,
      ],

      education: [
        {
          type: String,
        },
      ],

      certifications: [
        {
          type: String,
        },
      ],

      achievements: [
        {
          type: String,
        },
      ],

      experienceLevel: {
        type: String,
        default:
          "Unknown",
      },

      atsInsights:
        atsSchema,

      interviewInsights:
        interviewInsightsSchema,

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