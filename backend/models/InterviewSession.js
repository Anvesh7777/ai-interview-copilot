const mongoose =
  require("mongoose");

/*
|---------------------------------------------------------
| Question Schema
|---------------------------------------------------------
*/

const questionSchema =
  new mongoose.Schema(
    {
      question: {
        type: String,
        required: true,
      },

      answer: {
        type: String,
        default: "",
      },

      feedback: {
        type: String,
        default: "",
      },

      score: {
        type: Number,
        default: 0,
        min: 0,
        max: 10,
      },

      difficulty: {
        type: String,
        enum: [
          "easy",
          "medium",
          "hard",
        ],
        default:
          "medium",
      },

      topic: {
        type: String,
        default: "",
      },

      answerTime: {
        type: Number,
        default: 0,
      },

      confidenceScore: {
        type: Number,
        default: 0,
        min: 0,
        max: 10,
      },
    },
    {
      _id: false,
    }
  );

/*
|---------------------------------------------------------
| Analytics Schema
|---------------------------------------------------------
*/

const analyticsSchema =
  new mongoose.Schema(
    {
      averageScore: {
        type: Number,
        default: 0,
      },

      strongestTopics: [
        {
          type: String,
        },
      ],

      weakestTopics: [
        {
          type: String,
        },
      ],

      improvementScore: {
        type: Number,
        default: 0,
      },

      confidenceTrend: [
        {
          type: Number,
        },
      ],
    },
    {
      _id: false,
    }
  );

/*
|---------------------------------------------------------
| Revision Plan Schema
|---------------------------------------------------------
*/

const revisionPlanSchema =
  new mongoose.Schema(
    {
      priorityTopics: [
        {
          type: String,
        },
      ],

      actionPlan: [
        {
          type: String,
        },
      ],

      estimatedDays: {
        type: Number,
        default: 0,
      },
    },
    {
      _id: false,
    }
  );

/*
|---------------------------------------------------------
| Interview Session Schema
|---------------------------------------------------------
*/

const interviewSessionSchema =
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

      domain: {
        type: String,
        required: true,
      },

      domainHistory: [
        {
          type: String,
        },
      ],

      sessionType: {
        type: String,
        enum: [
          "single-domain",
          "complete-interview",
          "company-specific",
        ],
        default:
          "single-domain",
      },

      currentLevel: {
        type: Number,
        default: 1,
      },

      totalQuestions: {
        type: Number,
        default: 10,
      },

      weaknesses: [
        {
          type: String,
        },
      ],

      strengths: [
        {
          type: String,
        },
      ],

      questions: [
        questionSchema,
      ],

      totalScore: {
        type: Number,
        default: 0,
      },

      completionPercentage: {
        type: Number,
        default: 0,
      },

      analytics:
        analyticsSchema,

      revisionPlan:
        revisionPlanSchema,

      startedAt: {
        type: Date,
        default:
          Date.now,
      },

      endedAt: {
        type: Date,
        default: null,
      },

      durationInMinutes: {
        type: Number,
        default: 0,
      },

      status: {
        type: String,
        enum: [
          "active",
          "completed",
          "abandoned",
        ],
        default:
          "active",
      },
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.models
    .InterviewSession ||
  mongoose.model(
    "InterviewSession",
    interviewSessionSchema
  );