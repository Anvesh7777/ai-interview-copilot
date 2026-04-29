import React from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  motion,
} from "framer-motion";

import heroImage from "../assets/hero.svg";

import {
  FileText,
  Briefcase,
  BarChart3,
  History,
} from "lucide-react";

const Dashboard = () => {
  const navigate =
    useNavigate();

  const cards = [
    {
      title:
        "Upload Resume",
      desc:
        "Upload and analyze your resume with AI",
      icon:
        FileText,
      route:
        "/resume-upload",
    },
    {
      title:
        "Job Description",
      desc:
        "Upload target company job description",
      icon:
        Briefcase,
      route:
        "/job-description",
    },
    {
      title:
        "ATS Analysis",
      desc:
        "Check ATS compatibility and missing skills",
      icon:
        BarChart3,
      route:
        "/ats-result",
    },
    {
      title:
        "Interview History",
      desc:
        "Track all your previous interviews",
      icon:
        History,
      route:
        "/history",
    },
  ];

  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <motion.div
        initial={{
          opacity: 0,
          y: 40,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.6,
        }}
        className="bg-white rounded-3xl shadow-lg p-10 flex items-center justify-between"
      >
        <div className="max-w-xl">
          <h1 className="text-5xl font-black text-[#493D9E] leading-tight">
            Crack Your Dream Job
            With AI
          </h1>

          <p className="text-gray-600 mt-5 text-lg">
            Upload your resume,
            analyze ATS score,
            practice personalized
            mock interviews,
            and improve faster.
          </p>

          <div className="flex gap-4 mt-8">
            <button
              onClick={() =>
                navigate(
                  "/resume-upload"
                )
              }
              className="px-6 py-3 bg-[#6D5BD0] text-white rounded-2xl font-semibold shadow-md hover:scale-105 transition"
            >
              Get Started
            </button>

            <button
              onClick={() =>
                navigate(
                  "/mock-interview"
                )
              }
              className="px-6 py-3 border border-[#6D5BD0] text-[#6D5BD0] rounded-2xl font-semibold hover:bg-[#F3F0FF]"
            >
              Start Interview
            </button>
          </div>
        </div>

        <img
          src={heroImage}
          alt="hero"
          className="w-[380px]"
        />
      </motion.div>

      {/* Feature Cards */}
      <div className="grid grid-cols-2 gap-6">
        {cards.map(
          (
            card,
            index
          ) => {
            const Icon =
              card.icon;

            return (
              <motion.div
                key={
                  card.title
                }
                initial={{
                  opacity: 0,
                  y: 30,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay:
                    index *
                    0.15,
                }}
                whileHover={{
                  y: -8,
                }}
                onClick={() =>
                  navigate(
                    card.route
                  )
                }
                className="bg-white p-8 rounded-3xl shadow-md cursor-pointer hover:shadow-xl transition"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#F3F0FF] flex items-center justify-center">
                  <Icon
                    className="text-[#6D5BD0]"
                  />
                </div>

                <h2 className="mt-5 text-2xl font-bold text-[#222]">
                  {
                    card.title
                  }
                </h2>

                <p className="mt-3 text-gray-500">
                  {
                    card.desc
                  }
                </p>
              </motion.div>
            );
          }
        )}
      </div>
    </div>
  );
};

export default Dashboard;