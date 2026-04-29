const Resume = require("../models/Resume");
const JobDescription = require("../models/JobDescription");
const ATSReport = require("../models/ATSReport");
const analyzeATS = require("../services/atsService");

const parseJSONSafely = (raw) => {
  try {
    if (typeof raw === "object") return raw;
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : null;
  } catch (err) { return null; }
};

const generateATSReport = async (req, res) => {
  try {
    const { userId, resumeId, jobDescriptionId } = req.body;

    // 1. Fetch Resume
    const resume = await Resume.findById(resumeId);
    if (!resume) return res.status(404).json({ success: false, message: "Resume missing" });

    // DEBUG LOG: Ise terminal mein check karo
    console.log("DEBUG: Resume Text Length ->", resume.resumeText?.length || 0);
    
    // Agar resumeText undefined hai, toh extractedText try karo
    const finalResumeText = resume.resumeText || resume.extractedText;

    if (!finalResumeText || finalResumeText.length < 10) {
      return res.status(400).json({ 
        success: false, 
        message: "Resume text is empty in database. Re-upload your resume." 
      });
    }

    // 2. Fetch JD (Optional)
    let jdText = "General Software Engineering Industry Standards";
    if (jobDescriptionId && jobDescriptionId !== "null") {
      const jobDescription = await JobDescription.findById(jobDescriptionId);
      jdText = jobDescription?.extractedText || jobDescription?.jdText || "";
    }

    // 3. Groq Analysis
    const atsRaw = await analyzeATS(finalResumeText, jdText);
    const atsData = parseJSONSafely(atsRaw);

    if (!atsData) throw new Error("Could not parse Groq response");

    // 4. Save Report
    const report = await ATSReport.create({
      user: userId,
      resume: resumeId,
      jobDescription: (jobDescriptionId && jobDescriptionId !== "null") ? jobDescriptionId : null,
      matchScore: Number(atsData.matchScore || 0),
      matchedSkills: atsData.matchedSkills || [],
      missingSkills: atsData.missingSkills || [],
      suggestions: atsData.suggestions || [],
    });

    res.status(200).json({ success: true, report });
  } catch (error) {
    console.error("ATS Controller Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { generateATSReport };