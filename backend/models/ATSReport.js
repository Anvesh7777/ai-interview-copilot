const mongoose = require("mongoose");

const atsReportSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  resume: { type: mongoose.Schema.Types.ObjectId, ref: "Resume", required: true },
  jobDescription: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "JobDescription", 
    required: false, // MANDATORY FIX
    default: null 
  },
  matchScore: { type: Number, default: 0 },
  matchedSkills: [String],
  missingSkills: [String],
  suggestions: [String],
}, { timestamps: true });

module.exports = mongoose.model("ATSReport", atsReportSchema);