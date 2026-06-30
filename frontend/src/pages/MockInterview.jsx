import React, { useState, useEffect } from "react";
import api from "../api/axios";
import { motion } from "framer-motion";
import {
  Timer,
  Send,
  Sparkles,
  CheckCircle,
  ArrowRight,
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
    "Complete Interview",
    "Backend",
    "Frontend",
    "MERN",
    "React",
    "Node.js",
    "DSA",
    "System Design",
    "Core CS",
    "DBMS",
    "OS",
    "OOPs",
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

  const startInterview = async () => {
  try {
    if (!domain) {
      alert("Please select a domain");
      return;
    }

    const resumeId = localStorage.getItem("resumeId");

    if (!resumeId) {
      alert("Please upload your resume first.");
      return;
    }

    // Clear any previous interview session only when starting a new one
    localStorage.removeItem("sessionId");

    setLoadingQuestion(true);

    const response = await api.post("/interview/start", {
      resumeId,
      jobDescriptionId:
        localStorage.getItem("jobDescriptionId") || null,
      domain,
    });

    const {
      sessionId: id,
      firstQuestion,
    } = response.data;

    // Save current interview session
    setSessionId(id);
    localStorage.setItem("sessionId", id);

    // Initialize interview state
    setQuestion(firstQuestion);
    setPendingQuestion("");
    setAnswer("");
    setFeedback(null);

    setQuestionNumber(1);
    setTimeLeft(300);
  } catch (error) {
    console.error("Start Interview Error:", error);

    alert(
      error.response?.data?.message ||
        "Failed to start interview. Please try again."
    );
  } finally {
    setLoadingQuestion(false);
  }
};

  const submitAnswer = async (customAnswer = null) => {
    try {
      const finalAnswer = customAnswer || answer;

      if (!finalAnswer.trim()) {
        alert("Please provide an answer");
        return;
      }

      setLoadingAnswer(true);

      const response = await api.post(
        `/interview/${sessionId}/answer`,
        {
          question,
          answer: finalAnswer,
        }
      );

      setFeedback(response.data.evaluation);
      setPendingQuestion(response.data.nextQuestion || "");
      setAnswer("");

      if (response.data.completed) {
        navigate(`/report/${sessionId}`);
      }
    } catch (error) {
      console.error("Submit Error:", error);
    } finally {
      setLoadingAnswer(false);
    }
  };

  const nextQuestion = () => {
    if (questionNumber >= MAX_QUESTIONS) {
      navigate(`/report/${sessionId}`);
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
    await submitAnswer("Skipped this question");
  };

  const dontKnow = async () => {
    await submitAnswer("I don't know this answer");
  };

  return (
    <div className="space-y-8 px-4 md:px-8 pb-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row items-center justify-between gap-8"
      >
        <div>
          <h1 className="text-4xl font-bold text-[#493D9E]">
            Mock Interview
          </h1>

          <p className="text-gray-600 mt-2">
            Practice technical interviews with AI-generated questions.
          </p>
        </div>

        <img
          src={interviewImage}
          alt="Interview"
          className="w-72"
        />
      </motion.div>

      {!sessionId && (
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Select Domain
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {domains.map((item) => (
              <button
                key={item}
                onClick={() => setDomain(item)}
                className={`p-4 rounded-2xl border font-medium transition-all ${
                  domain === item
                    ? "bg-[#493D9E] text-white border-[#493D9E]"
                    : "bg-white text-gray-800 border-gray-300 hover:bg-gray-50"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <button
            onClick={startInterview}
            disabled={loadingQuestion}
            className="mt-8 px-8 py-4 bg-[#6D5BD0] hover:bg-[#493D9E] text-white rounded-2xl font-semibold flex items-center gap-2 transition-all"
          >
            {loadingQuestion ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                Start Interview
                <ArrowRight />
              </>
            )}
          </button>
        </div>
      )}

      {sessionId && question && (
        <div className="bg-white rounded-3xl shadow-lg p-8 space-y-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-[#493D9E] font-semibold text-lg">
              <Timer />
              {formatTime(timeLeft)}
            </div>

            <p className="text-gray-700 font-medium">
              Question {questionNumber}/{MAX_QUESTIONS}
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-gray-900 leading-relaxed">
              {question}
            </h2>
          </div>

          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            rows="8"
            className="w-full border border-gray-300 rounded-2xl p-4 outline-none resize-none text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#6D5BD0]"
            placeholder="Write your answer here..."
          />

          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => submitAnswer()}
              disabled={loadingAnswer}
              className="px-6 py-3 bg-[#6D5BD0] hover:bg-[#493D9E] text-white rounded-2xl flex items-center gap-2 transition-all"
            >
              {loadingAnswer ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  Submit
                  <Send />
                </>
              )}
            </button>

            <button
              onClick={skipQuestion}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50"
            >
              Skip
            </button>

            <button
              onClick={dontKnow}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50"
            >
              Don’t Know
            </button>
          </div>

          {feedback && (
            <div className="bg-[#F8F7FF] rounded-2xl p-6 space-y-4 border border-purple-100">
              <h3 className="text-xl font-bold flex items-center gap-2 text-[#493D9E]">
                <Sparkles />
                AI Feedback
              </h3>

              <p className="text-gray-800 leading-relaxed">
                {feedback.feedback}
              </p>

              <div className="flex items-center gap-2 text-green-600 font-semibold">
                <CheckCircle />
                Score: {feedback.score}/10
              </div>

              <button
                onClick={nextQuestion}
                className="mt-4 px-6 py-3 bg-[#493D9E] hover:bg-[#3c3282] text-white rounded-2xl transition-all"
              >
                Next Question
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default MockInterview;