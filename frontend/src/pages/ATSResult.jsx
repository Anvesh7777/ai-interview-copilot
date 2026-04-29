import React, { useState } from "react";
import api from "../api/axios";
import { motion } from "framer-motion";
import { Sparkles, FileText, CheckCircle, AlertTriangle, Target, Loader2 } from "lucide-react";
import atsImage from "../assets/ats.svg";

const ATSResult = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateATS = async () => {
    const userId = localStorage.getItem("userId");
    const resumeId = localStorage.getItem("resumeId");
    const jdId = localStorage.getItem("jobDescriptionId"); // Can be null

    if (!resumeId) {
      return alert("Bhai, pehle Dashboard par Resume upload karo!");
    }

    try {
      setLoading(true);
      const res = await api.post("/ats/analyze", {
        userId,
        resumeId,
        jobDescriptionId: jdId, // Sending null if JD wasn't uploaded
      });

      if (res.data.success) {
        setReport(res.data.report);
      }
    } catch (error) {
      console.error("ATS Error:", error);
      alert("ATS Analysis failed. Check backend console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 px-4 md:px-8 pb-10 max-w-7xl mx-auto">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[40px] shadow-sm border border-slate-100 p-10 flex flex-col md:flex-row items-center justify-between gap-10"
      >
        <div className="flex-1">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-6">
            <Sparkles size={14} /> Recruitment Intelligence
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-4">
            ATS Analysis
          </h1>
          <p className="text-slate-500 text-lg max-w-md font-medium leading-relaxed">
            Compare your resume with the target job requirements. We'll identify keywords to help you beat the bots.
          </p>

          <button
            onClick={generateATS}
            disabled={loading}
            className="mt-10 px-10 py-5 bg-[#6D5BD0] text-white rounded-2xl font-black text-lg shadow-xl shadow-purple-200 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : <FileText size={20} />}
            {loading ? "ANALYZING..." : "GENERATE ATS REPORT"}
          </button>
        </div>
        <img src={atsImage} alt="ATS Illustration" className="w-full max-w-[320px] drop-shadow-2xl" />
      </motion.div>

      {/* Report Section */}
      {report && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {/* Match Score */}
          <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 p-8 flex flex-col items-center text-center">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-8">Match Score</h2>
            <div className="relative flex items-center justify-center">
              <div className="w-32 h-32 rounded-full border-[10px] border-slate-50 flex items-center justify-center">
                <span className="text-4xl font-black text-slate-900">{report.matchScore}%</span>
              </div>
            </div>
            <p className="mt-4 text-slate-400 text-xs font-bold uppercase">Resume Compatibility</p>
          </div>

          {/* Matched Skills */}
          <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 p-8">
            <h2 className="text-xs font-black text-green-600 uppercase tracking-widest mb-6 flex items-center gap-2">
              <CheckCircle size={16} /> Matched Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {report.matchedSkills?.map((skill, i) => (
                <span key={i} className="px-3 py-1.5 bg-green-50 text-green-700 rounded-xl text-xs font-bold border border-green-100">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Missing Skills */}
          <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 p-8">
            <h2 className="text-xs font-black text-red-500 uppercase tracking-widest mb-6 flex items-center gap-2">
              <AlertTriangle size={16} /> Missing Keywords
            </h2>
            <div className="flex flex-wrap gap-2">
              {report.missingSkills?.map((skill, i) => (
                <span key={i} className="px-3 py-1.5 bg-red-50 text-red-700 rounded-xl text-xs font-bold border border-red-100">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* AI Suggestions */}
          <div className="md:col-span-3 bg-slate-900 rounded-[32px] p-10 text-white shadow-2xl">
            <h2 className="text-xl font-black mb-6 flex items-center gap-3">
              <Target className="text-purple-400" /> Optimization Suggestions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {report.suggestions?.map((item, i) => (
                <div key={i} className="flex items-start gap-4 bg-white/5 p-5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all group">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 shrink-0 group-hover:scale-150 transition-transform"></div>
                  <p className="text-slate-300 font-medium leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ATSResult;