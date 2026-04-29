const mongoose = require("mongoose");

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

      currentLevel: {
        type: Number,
        default: 1,
      },

      weaknesses: [
        {
          type: String,
        },
      ],

      questions: [
  {
    question: String,
    answer: String,
    feedback: String,
    score: Number,
  },
],

      totalScore: {
        type: Number,
        default: 0,
      },

      status: {
        type: String,
        enum: [
          "active",
          "completed",
        ],
        default: "active",
      },
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "InterviewSession",
    interviewSessionSchema
  );