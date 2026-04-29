import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { motion } from "framer-motion";
import {
  BookOpen,
  Target,
  Calendar,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  Clock
} from "lucide-react";

const RevisionPlanner = () => {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlan();
  }, []);

  const fetchPlan = async () => {
    try {
      const sessionId = localStorage.getItem("sessionId");
      if (!sessionId) {
        setLoading(false);
        return;
      }
      const res = await api.get(`/interview/revision-plan/${sessionId}`);
      setPlan(res.data.revisionPlan);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600 font-bold animate-pulse uppercase tracking-widest text-xs">Generating your roadmap...</p>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-6">
        <div className="text-center bg-gray-50 p-10 rounded-[32px] border border-gray-100 shadow-sm">
          <Target className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="text-xl font-bold text-gray-800">No revision plan found</p>
          <p className="text-gray-500 mt-2">Complete a mock interview to identify your weak areas.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 px-4 md:px-10 pb-16 pt-6 max-w-7xl mx-auto">
      {/* Header - High Contrast Tech Look */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900 rounded-[40px] shadow-2xl p-10 text-white relative overflow-hidden"
      >
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-purple-500/20 text-purple-300 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border border-purple-500/30">
            <Sparkles size={14} />
            AI-Engineered Roadmap
          </div>
          <h1 className="text-5xl font-black mt-6 tracking-tighter">
            Revision Planner
          </h1>
          <p className="text-slate-400 mt-4 text-lg max-w-2xl font-medium">
            We've analyzed your performance. Focus on these high-impact areas to bridge the gap before your next interview.
          </p>
        </div>
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-[100px]"></div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Topics & Timeline */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-purple-100 rounded-xl text-purple-600">
                <BookOpen size={20} />
              </div>
              <h2 className="text-xl font-black text-slate-900">Priority Topics</h2>
            </div>

            <div className="space-y-3">
              {plan.priorityTopics?.map((topic, index) => (
                <motion.div
                  key={index}
                  whileHover={{ x: 5 }}
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-100 text-slate-800 font-bold flex items-center gap-3 hover:border-purple-200 transition-colors"
                >
                  <div className="w-2 h-2 bg-purple-500 rounded-full shadow-lg shadow-purple-500/50"></div>
                  {topic}
                </motion.div>
              ))}
            </div>
          </div>

          <div className="bg-purple-600 rounded-[32px] shadow-xl p-8 text-white">
            <div className="flex items-center gap-3 mb-4 opacity-80">
              <Clock size={20} />
              <h2 className="text-sm font-black uppercase tracking-widest">Estimated Effort</h2>
            </div>
            <p className="text-5xl font-black">{plan.estimatedDays}<span className="text-xl ml-1 opacity-60">Days</span></p>
            <div className="mt-6 pt-6 border-t border-white/10 text-sm font-medium text-purple-100 italic">
              Focused preparation recommended for peak performance.
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Action Plan */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 p-8 h-full">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-green-100 rounded-xl text-green-600">
                <CheckCircle2 size={20} />
              </div>
              <h2 className="text-xl font-black text-slate-900">Detailed Action Plan</h2>
            </div>

            <div className="space-y-4">
              {plan.actionPlan?.map((task, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group p-6 rounded-[24px] bg-white border border-slate-100 hover:border-purple-200 hover:shadow-md transition-all flex items-start gap-6"
                >
                  <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center font-black text-slate-400 group-hover:bg-purple-600 group-hover:text-white transition-colors shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-800 font-bold leading-relaxed">
                      {task}
                    </p>
                  </div>
                  <ChevronRight className="text-slate-200 group-hover:text-purple-300 transition-colors" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevisionPlanner;