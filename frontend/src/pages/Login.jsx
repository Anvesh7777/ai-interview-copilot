import React from "react";

import {
  useGoogleLogin,
} from "@react-oauth/google";

import {
  motion,
} from "framer-motion";

import {
  Bot,
  Sparkles,
  Briefcase,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import api from "../api/axios";

import {
  useAuth,
} from "../context/AuthContext";

import heroImage from "../assets/hero.svg";

const Login =
  () => {
    const navigate =
      useNavigate();

    const {
      login:
        saveLogin,
    } =
      useAuth();

    const login =
      useGoogleLogin(
        {
          onSuccess:
            async (
              tokenResponse
            ) => {
              try {
                const res =
                  await api.post(
                    "/auth/google",
                    {
                      token:
                        tokenResponse.access_token,
                    }
                  );

                /*
                |---------------------------------------------
                | Save Auth Session
                |---------------------------------------------
                */

                saveLogin(
                  res.data.user,
                  res.data.token
                );

                navigate(
                  "/dashboard"
                );
              } catch (
                error
              ) {
                console.error(
                  "Login failed:",
                  error.response
                    ?.data ||
                    error.message
                );

                alert(
                  "Login failed"
                );
              }
            },

          onError:
            (
              error
            ) => {
              console.error(
                "Google Login Error:",
                error
              );
            },
        }
      );

    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F8F7FF] to-[#F3F0FF] flex items-center justify-center px-6">
        <div className="max-w-7xl w-full grid grid-cols-2 gap-16 items-center">
          {/* Left */}
          <motion.div
            initial={{
              opacity: 0,
              x: -40,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
          >
            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium">
              <Sparkles
                size={
                  16
                }
              />
              AI Interview Preparation
            </div>

            <h1 className="text-6xl font-black mt-6 leading-tight text-[#493D9E]">
              Crack Interviews
              Faster With AI
            </h1>

            <p className="text-gray-600 text-lg mt-6 max-w-lg">
              Upload your
              resume,
              analyze ATS
              score,
              practice mock
              interviews,
              and improve
              with
              personalized
              AI feedback.
            </p>

            <div className="mt-10 space-y-4">
              {[
                "Resume Analysis",
                "ATS Score Matching",
                "AI Mock Interviews",
                "Revision Planner",
              ].map(
                (
                  item,
                  index
                ) => (
                  <div
                    key={
                      index
                    }
                    className="flex items-center gap-3"
                  >
                    <Briefcase className="text-[#6D5BD0]" />

                    <p className="font-medium text-gray-700">
                      {
                        item
                      }
                    </p>
                  </div>
                )
              )}
            </div>
          </motion.div>

          {/* Right */}
          <motion.div
            initial={{
              opacity: 0,
              x: 40,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            className="bg-white rounded-[40px] shadow-2xl p-12 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-purple-100 rounded-full blur-3xl opacity-60"></div>

            <div className="relative z-10">
              <div className="w-20 h-20 bg-[#6D5BD0] rounded-3xl flex items-center justify-center mb-8">
                <Bot
                  size={
                    40
                  }
                  className="text-white"
                />
              </div>

              <h2 className="text-4xl font-black text-[#493D9E]">
                AI Copilot
              </h2>

              <p className="text-gray-500 mt-3 mb-8">
                Your intelligent interview preparation partner
              </p>

              <img
                src={
                  heroImage
                }
                alt="hero"
                className="w-[280px] mx-auto mb-8"
              />

              <button
                onClick={() =>
                  login()
                }
                className="w-full py-4 bg-[#6D5BD0] text-white font-bold rounded-2xl flex items-center justify-center gap-3 hover:scale-105 transition"
              >
                <img
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  alt="google"
                  className="w-5 h-5"
                />

                Continue
                with
                Google
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  };

export default
  Login;