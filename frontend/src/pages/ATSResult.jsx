import React, {
  useState,
} from "react";

import api from "../api/axios";

import {
  motion,
} from "framer-motion";

import {
  Sparkles,
  CheckCircle,
  Loader2,
  FileText,
  Target,
} from "lucide-react";

import atsImage from "../assets/ats.svg";

const ATSResult =
  () => {
    const [
      report,
      setReport,
    ] =
      useState(
        null
      );

    const [
      loading,
      setLoading,
    ] =
      useState(
        false
      );

    const generateATS =
      async () => {
        const resumeId =
          localStorage.getItem(
            "resumeId"
          );

        const jdId =
          localStorage.getItem(
            "jobDescriptionId"
          );

        if (
          !resumeId
        ) {
          return alert(
            "Please upload your resume first."
          );
        }

        if (
          !jdId
        ) {
          return alert(
            "Please upload a Job Description first."
          );
        }

        try {
          setLoading(
            true
          );

          const res =
            await api.post(
              "/ats/analyze",
              {
                resumeId,
                jobDescriptionId:
                  jdId,
              }
            );

          console.log(
            "ATS Response:",
            res.data
          );

          if (
            res.data
              ?.success
          ) {
            setReport(
              res.data
                .report
            );
          }
        } catch (
          error
        ) {
          console.error(
            "ATS Error:",
            error
          );

          alert(
            error.response
              ?.data
              ?.message ||
              "ATS analysis failed."
          );
        } finally {
          setLoading(
            false
          );
        }
      };

    const score =
      report
        ?.matchScore ||
      0;

    const summary =
      score >= 80
        ? "Excellent match! Your resume strongly aligns with the job description."
        : score >= 60
        ? "Good alignment. A few improvements can increase your chances."
        : "Low alignment. Optimize your resume for better ATS matching.";

    return (
      <div className="space-y-10 px-4 md:px-8 pb-10 max-w-7xl mx-auto">
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="flex flex-col md:flex-row items-center justify-between gap-8"
        >
          <div>
            <h1 className="text-4xl font-bold text-[#493D9E]">
              ATS Analysis
            </h1>

            <p className="text-gray-600 mt-2">
              Analyze how well your resume matches the job description.
            </p>
          </div>

          <img
            src={
              atsImage
            }
            alt="ATS"
            className="w-72"
          />
        </motion.div>

        {!report && (
          <div className="bg-white rounded-3xl shadow-lg p-8 flex flex-col items-center text-center">
            <Target
              className="text-[#6D5BD0] mb-4"
              size={
                50
              }
            />

            <h2 className="text-2xl font-bold text-gray-900">
              Generate ATS Report
            </h2>

            <p className="text-gray-600 mt-2 max-w-md">
              Upload both your resume and job description to generate an ATS compatibility report.
            </p>

            <button
              onClick={
                generateATS
              }
              disabled={
                loading
              }
              className="mt-8 px-8 py-4 bg-[#6D5BD0] hover:bg-[#493D9E] text-white rounded-2xl font-semibold flex items-center gap-2 transition-all"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  Generate ATS
                  <Sparkles />
                </>
              )}
            </button>
          </div>
        )}

        {report && (
          <div className="bg-white rounded-3xl shadow-lg p-8 space-y-8">
            {/* ATS Score */}
            <div>
              <div className="flex items-center gap-3">
                <Target className="text-[#493D9E]" />

                <h2 className="text-3xl font-bold text-gray-900">
                  ATS Score
                </h2>
              </div>

              <p className="text-6xl font-bold text-[#493D9E] mt-4">
                {score}%
              </p>
            </div>

            {/* Summary */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                Summary
              </h3>

              <p className="mt-3 text-gray-700 text-lg">
                {summary}
              </p>
            </div>

            {/* Strengths */}
            <div>
              <h3 className="text-2xl font-bold text-green-600 flex items-center gap-2 mb-4">
                <CheckCircle />
                Strengths
              </h3>

              <div className="space-y-3">
                {(report.matchedSkills ||
                  []
                ).map(
                  (
                    skill,
                    index
                  ) => (
                    <div
                      key={
                        index
                      }
                      className="bg-green-50 border border-green-100 rounded-xl p-4 text-gray-800"
                    >
                      {skill}
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Suggestions */}
            <div>
              <h3 className="text-2xl font-bold text-blue-600 flex items-center gap-2 mb-4">
                <FileText />
                Suggestions
              </h3>

              <div className="space-y-3">
                {(report.suggestions ||
                  []
                ).map(
                  (
                    suggestion,
                    index
                  ) => (
                    <div
                      key={
                        index
                      }
                      className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-gray-800"
                    >
                      {suggestion}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

export default
  ATSResult;