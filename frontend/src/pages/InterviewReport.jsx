import React, {
  useEffect,
  useState,
} from "react";

import api from "../api/axios";

import {
  useParams,
  useNavigate,
} from "react-router-dom";

import {
  AlertCircle,
  ChevronRight,
} from "lucide-react";

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
      const id =
        sessionId ||
        localStorage.getItem("sessionId");

      if (!id) {
        setLoading(false);
        return;
      }

      const res = await api.get(
        `/interview/${id}/report`
      );

      setReport(res.data.session);
    } catch (error) {
      console.error(
        "Report Fetch Error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading report...
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <div>
          <AlertCircle className="mx-auto mb-4 text-red-500" />

          <h2 className="text-2xl font-bold">
            No Report Found
          </h2>

          <button
            onClick={() =>
              navigate("/dashboard")
            }
            className="mt-4 text-purple-600 font-bold"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const totalQuestions =
    report.questions?.length || 0;

  const averageScore =
    totalQuestions > 0
      ? (
          report.totalScore /
          totalQuestions
        ).toFixed(1)
      : "0.0";

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-10 space-y-10">
      <div className="bg-white rounded-3xl shadow-lg p-8">
        <h1 className="text-4xl font-bold text-[#493D9E]">
          Interview Report
        </h1>

        <p className="mt-4 text-lg">
          Total Score: {report.totalScore}
        </p>

        <p className="mt-2 text-lg">
          Average Score: {averageScore}
        </p>

        <button
          onClick={() =>
            navigate(
              `/revision-plan/${sessionId}`
            )
          }
          className="mt-8 px-6 py-4 bg-[#6D5BD0] text-white rounded-2xl flex items-center gap-2 hover:bg-[#493D9E] transition"
        >
          View Revision Plan
          <ChevronRight />
        </button>
      </div>
    </div>
  );
};

export default InterviewReport;