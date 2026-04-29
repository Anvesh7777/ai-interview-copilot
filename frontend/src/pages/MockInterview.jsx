import React, { useState, useEffect } from "react";
import api from "../api/axios";
import { motion } from "framer-motion";
import {
  Brain,
  Timer,
  Send,
  Sparkles,
  CheckCircle,
  SkipForward,
  ArrowRight,
  Lightbulb,
  Loader2,
} from "lucide-react";
import interviewImage from "../assets/interview.svg";
import { useNavigate } from "react-router-dom";

function MockInterview() {
  const navigate = useNavigate();

  const [domain, setDomain] = useState("");
  const [question, setQuestion] = useState("");
  const [pendingQuestion, setPendingQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [loadingQuestion, setLoadingQuestion] = useState(false);
  const [loadingAnswer, setLoadingAnswer] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);
  const [questionNumber, setQuestionNumber] = useState(1);
  const MAX_QUESTIONS = 10;

  const domains = [
    "Complete Interview", "Backend", "Frontend", "MERN", "React",
    "Node.js", "DSA", "System Design", "Core CS", "DBMS", "OS", "OOPs",
  ];

  useEffect(() => {
    if (!sessionId) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [sessionId]);

  useEffect(() => {
    if (sessionId && timeLeft === 0) {
      skipQuestion();
    }
  }, [timeLeft, sessionId]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const parseFeedback = (data) => {
    try {
      if (typeof data === "string") return JSON.parse(data);
      return data;
    } catch {
      return { score: 0, feedback: "Evaluation in progress...", weaknesses: [] };
    }
  };

  const startInterview = async () => {
    try {
      if (!domain) return alert("Please select a domain");
      setLoadingQuestion(true);

      const response = await api.post("/interview/start", {
        userId: localStorage.getItem("userId"),
        resumeId: localStorage.getItem("resumeId"),
        jobDescriptionId: localStorage.getItem("jobDescriptionId"),
        domain,
      });

      const id = response.data?.sessionId; 
      if (!id) throw new Error("Session ID missing");

      setSessionId(id);
      localStorage.setItem("sessionId", id);
      setQuestion(response.data?.firstQuestion || "Tell me about yourself.");
      setQuestionNumber(1);
      setTimeLeft(300);
      setFeedback(null);
    } catch (error) {
      console.error("Start Error:", error);
      alert("Failed to start session.");
    } finally {
      setLoadingQuestion(false);
    }
  };

  const submitAnswer = async (customAnswer = null) => {
    try {
      const finalAnswer = customAnswer || answer;
      if (!finalAnswer.trim()) return alert("Please provide an answer");
      setLoadingAnswer(true);

      const response = await api.post("/interview/answer", {
        sessionId,
        question,
        answer: finalAnswer,
      });

      const evalData = parseFeedback(response.data?.evaluation);
      setFeedback(evalData);
      setPendingQuestion(response.data?.nextQuestion);
      setAnswer("");

      if (response.data?.completed) {
        setTimeout(() => navigate("/report"), 2000);
      }
    } catch (error) {
      console.error("Submit Error:", error);
    } finally {
      setLoadingAnswer(false);
    }
  };

  const nextQuestion = () => {
    if (questionNumber >= MAX_QUESTIONS) {
      navigate("/report");
      return;
    }
    if (pendingQuestion) {
      setQuestion(pendingQuestion);
      setPendingQuestion("");
    }
    setQuestionNumber((prev) => prev + 1);
    setFeedback(null);
    setTimeLeft(300);
  };

  const skipQuestion = async () => {
    await submitAnswer("I would like to skip this question.");
  };

  const dontKnow = async () => {
    await submitAnswer("I am not sure about this specific question.");
  };

  return (
    <div className="space-y-8 px-4 md:px-8 pb-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col md:flex-row justify-between items-center gap-8">
        <div>
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium">
            <Sparkles size={16} /> AI Interview Session
          </div>
          <h1 className="text-4xl font-black mt-4 text-[#493D9E]">Mock Interview</h1>
        </div>
        <img src={interviewImage} alt="Interview" className="w-64 md:w-80" />
      </motion.div>

      {sessionId && (
        <div className="sticky top-4 z-20 bg-white/80 backdrop-blur-md border border-purple-100 rounded-3xl shadow-lg p-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Timer className="text-[#6D5BD0]" />
            <div>
              <p className="font-semibold text-black text-sm">Time Left</p>
              <p className="text-xs text-gray-400 font-bold">Q{questionNumber} / {MAX_QUESTIONS}</p>
            </div>
          </div>
          <p className="text-3xl font-mono font-bold text-[#493D9E]">{formatTime(timeLeft)}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          {!sessionId ? (
            <div className="bg-white rounded-3xl shadow-lg p-8">
              <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Select Domain</label>
              <select value={domain} onChange={(e) => setDomain(e.target.value)} className="w-full p-4 rounded-2xl border-2 border-gray-50 focus:border-purple-200 outline-none text-black transition-all">
                <option value="">-- Choose Specialization --</option>
                {domains.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
              <button onClick={startInterview} disabled={loadingQuestion} className="w-full mt-6 py-4 rounded-2xl bg-[#6D5BD0] text-white font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2">
                {loadingQuestion ? <Loader2 className="animate-spin" /> : "START INTERVIEW"}
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-lg p-8 border-l-4 border-purple-500">
              <h2 className="text-sm font-bold text-purple-400 mb-2 uppercase tracking-widest">Question {questionNumber}</h2>
              <p className="text-xl text-gray-800 leading-relaxed font-medium">{question || "Generating question..."}</p>
            </div>
          )}
        </div>

        <div>
          {question && (
            <div className="bg-white rounded-3xl shadow-lg p-8">
              <textarea value={answer} onChange={(e) => setAnswer(e.target.value)} rows={8} placeholder="Type your response..." className="w-full border-2 border-gray-50 focus:border-purple-100 rounded-2xl p-5 text-black outline-none resize-none" />
              <div className="grid grid-cols-2 gap-4 mt-5">
                <button onClick={() => submitAnswer()} disabled={loadingAnswer || feedback} className="py-4 rounded-2xl bg-[#6D5BD0] text-white font-bold disabled:opacity-50 flex items-center justify-center gap-2">
                  {loadingAnswer ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />} Submit
                </button>
                <button onClick={skipQuestion} disabled={feedback} className="py-4 rounded-2xl bg-gray-50 text-gray-500 font-bold hover:bg-gray-100 transition-all">Skip</button>
                <button onClick={dontKnow} disabled={feedback} className="py-4 rounded-2xl bg-orange-50 text-orange-600 font-bold hover:bg-orange-100 transition-all">I Don't Know</button>
                <button onClick={nextQuestion} disabled={!feedback} className="py-4 rounded-2xl bg-green-500 text-white font-bold hover:bg-green-600 disabled:bg-gray-100 transition-all flex items-center justify-center gap-2">
                  Next <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {feedback && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#493D9E] text-white rounded-3xl shadow-xl p-8 mt-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2"><CheckCircle className="text-green-400" /> Evaluation</h2>
                <span className="text-2xl font-black">{feedback?.score}/10</span>
              </div>
              <p className="text-purple-100 leading-relaxed italic">"{feedback?.feedback}"</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MockInterview;