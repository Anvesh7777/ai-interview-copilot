import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import {
  Trophy,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Brain,
  ArrowLeft,
  ChevronRight,
  MessageSquare,
  Activity
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const InterviewReport = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReport();
  }, [sessionId]);

  const fetchReport = async () => {
    try {
      const id = sessionId || localStorage.getItem("sessionId");
      const res = await api.get(`/interview/report/${id}`);
      setReport(res.data.session);
    } catch (error) {
      console.error("Report Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-bold tracking-widest uppercase text-xs">Generating Performance Analysis...</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-center p-10">
        <div>
          <AlertCircle size={48} className="mx-auto text-red-400 mb-4" />
          <h2 className="text-2xl font-bold text-slate-800">No Report Found</h2>
          <button onClick={() => navigate('/dashboard')} className="mt-4 text-purple-600 font-bold">Back to Dashboard</button>
        </div>
      </div>
    );
  }

  const averageScore = (report.totalScore / report.questions.length).toFixed(1);

  const chartData = report.questions.map((item, index) => ({
    question: `Q${index + 1}`,
    score: item.score || 0,
  }));

  const uniqueWeaknesses = [...new Set(report.weaknesses)];

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-10 space-y-10">
      {/* HEADER SECTION */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900 rounded-[40px] shadow-2xl p-10 text-white relative overflow-hidden"
      >
        <div className="relative z-10">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-purple-400 text-xs font-black mb-6 hover:text-purple-300 transition-all uppercase tracking-widest"
          >
            <ArrowLeft size={14} /> Back to Dashboard
          </button>
          <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border border-green-500/30">
            <Trophy size={14} /> Interview Completed
          </div>
          <h1 className="text-5xl font-black mt-6 tracking-tighter">Performance Analysis</h1>
          <p className="text-slate-400 mt-4 text-lg max-w-2xl">
            Check your detailed score breakdown and technical feedback to prepare for the real deal.
          </p>
        </div>
        <Activity className="absolute -bottom-10 -right-10 text-white/5" size={300} />
      </motion.div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: "Total Questions", value: report.questions.length, color: "text-[#493D9E]" },
          { title: "Total Score", value: `${report.totalScore}`, color: "text-[#6D5BD0]" },
          { title: "Avg. Score", value: `${averageScore}/10`, color: "text-green-500" },
        ].map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -5 }}
            className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100"
          >
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{item.title}</p>
            <h2 className={`text-5xl font-black mt-4 ${item.color}`}>{item.value}</h2>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* CHART SECTION */}
        <div className="lg:col-span-2 bg-white rounded-[32px] shadow-sm border border-slate-100 p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-purple-100 rounded-xl text-purple-600"><TrendingUp size={20} /></div>
            <h2 className="text-xl font-black text-slate-900">Performance Trend</h2>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="question" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 'bold'}} />
                <YAxis domain={[0, 10]} axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 'bold'}} />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontWeight: 'bold'}}
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#6D5BD0" 
                  strokeWidth={4} 
                  dot={{ r: 6, fill: '#6D5BD0', strokeWidth: 3, stroke: '#fff' }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* WEAK AREAS SECTION */}
        <div className="lg:col-span-1 bg-white rounded-[32px] shadow-sm border border-slate-100 p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-red-100 rounded-xl text-red-600"><AlertCircle size={20} /></div>
            <h2 className="text-xl font-black text-slate-900">Weak Areas</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {uniqueWeaknesses.length > 0 ? uniqueWeaknesses.map((item, index) => (
              <span key={index} className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-xs font-black border border-red-100">
                {item}
              </span>
            )) : <p className="text-slate-400 italic">No specific weaknesses identified.</p>}
          </div>
        </div>
      </div>

      {/* QUESTION BREAKDOWN - THE TRANSCRIPT */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 ml-2">
          <div className="p-2 bg-purple-100 rounded-xl text-purple-600"><Brain size={20} /></div>
          <h2 className="text-2xl font-black text-slate-900">Detailed Transcript</h2>
        </div>

        <div className="space-y-6">
          {report.questions.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden"
            >
              <div className="p-8 border-b border-slate-50 flex justify-between items-start">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black shrink-0">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Technical Question</p>
                    <p className="text-xl font-bold text-slate-800 leading-tight">{item.question}</p>
                  </div>
                </div>
                <div className={`px-4 py-2 rounded-2xl font-black text-sm ${item.score >= 7 ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                  {item.score}/10
                </div>
              </div>

              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Your Answer</h4>
                  <p className="text-slate-600 font-medium italic bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    "{item.answer || "No response provided"}"
                  </p>
                </div>
                <div>
                  <h4 className="text-xs font-black text-purple-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <MessageSquare size={14} /> AI Feedback
                  </h4>
                  <p className="text-slate-700 font-semibold leading-relaxed">
                    {item.feedback || "Evaluation pending..."}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* OVERALL PERFORMANCE BANNER */}
      <div className="bg-[#6D5BD0] rounded-[40px] p-10 text-white text-center shadow-xl shadow-purple-100">
        <h2 className="text-sm font-black uppercase tracking-widest opacity-70 mb-2">Final Verdict</h2>
        <h3 className="text-4xl font-black mb-6">
          {averageScore >= 8 ? "🔥 Elite Performance" : averageScore >= 6 ? "⚡ Strong Potential" : "🛠️ Needs Focused Practice"}
        </h3>
        <button 
          onClick={() => navigate('/revision-plan')}
          className="bg-white text-purple-600 px-10 py-5 rounded-2xl font-black flex items-center gap-2 mx-auto hover:scale-105 transition-all shadow-lg shadow-black/10"
        >
          VIEW REVISION PLAN <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default InterviewReport;