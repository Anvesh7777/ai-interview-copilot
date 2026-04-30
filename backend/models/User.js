const mongoose =
  require("mongoose");

const userSchema =
  new mongoose.Schema(
    {
      googleId: {
        type: String,
        required: true,
        unique: true,
      },

      email: {
        type: String,
        required: true,
        unique: true,
      },

      name: {
        type: String,
        required: true,
      },

      picture: {
        type: String,
        default: "",
      },

      role: {
        type: String,
        default: "user",
      },

      targetRole: {
        type: String,
        default: "",
      },

      preferredDomains: [
        {
          type: String,
        },
      ],

      weakDomains: [
        {
          type: String,
        },
      ],

      strongDomains: [
        {
          type: String,
        },
      ],

      interviewCount: {
        type: Number,
        default: 0,
      },

      averageScore: {
        type: Number,
        default: 0,
      },

      totalResumes: {
        type: Number,
        default: 0,
      },

      totalATSReports: {
        type: Number,
        default: 0,
      },

      learningStreak: {
        type: Number,
        default: 0,
      },

      lastActive: {
        type: Date,
        default: Date.now,
      },
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.models.User ||
  mongoose.model(
    "User",
    userSchema
  );