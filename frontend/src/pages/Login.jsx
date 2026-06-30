import React, {
  useEffect,
  useState,
} from "react";

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
    login: saveLogin,
  } =
    useAuth();

  const [
    serverReady,
    setServerReady,
  ] =
    useState(false);

  const [
    serverMessage,
    setServerMessage,
  ] =
    useState(
      "Initializing AI Interview Copilot..."
    );

useEffect(() => {
  let mounted = true;

  const messages = [
    "Initializing AI Interview Copilot...",
    "Starting AI Services...",
    "Connecting Secure Authentication...",
    "Preparing Interview Engine...",
  ];

  let messageIndex = 0;

  const messageInterval = setInterval(() => {
    if (!mounted) return;

    messageIndex =
      (messageIndex + 1) % messages.length;

    setServerMessage(
      messages[messageIndex]
    );
  }, 3500);

  const wakeServer =
    async () => {
      try {
        await api.get(
          "/health",
          {
            timeout:
              30000,
          }
        );

        if (
          !mounted
        )
          return;

        clearInterval(
          messageInterval
        );

        setServerReady(
          true
        );

        setServerMessage(
          "AI Copilot Ready"
        );
      } catch (
        error
      ) {
        console.error(
          "Server wake-up failed:",
          error.message
        );

        if (
          !mounted
        )
          return;

        setTimeout(
          wakeServer,
          3000
        );
      }
    };

  wakeServer();

  return () => {
    mounted = false;

    clearInterval(
      messageInterval
    );
  };
}, []);

 const login =
  useGoogleLogin(
    {
      onSuccess:
        async (
          tokenResponse
        ) => {
          try {
            if (
              !serverReady
            ) {
              return;
            }

            const res =
              await api.post(
                "/auth/google",
                {
                  token:
                    tokenResponse.access_token,
                }
              );

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
              error.response
                ?.data
                ?.message ||
                "Login failed. Please try again."
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

          alert(
            "Google authentication failed."
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
          <Sparkles size={16} />

          AI Interview Preparation
        </div>

        <h1 className="text-6xl font-black mt-6 leading-tight text-[#493D9E]">
          Crack Interviews Faster With AI
        </h1>

        <p className="text-gray-600 text-lg mt-6 max-w-lg">
          Upload your resume, analyze ATS score,
          practice mock interviews and improve with
          personalized AI feedback.
        </p>

        <div className="mt-10 space-y-4">
          {[
            "Resume Analysis",
            "ATS Score Matching",
            "AI Mock Interviews",
            "Revision Planner",
          ].map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-3"
            >
              <Briefcase className="text-[#6D5BD0]" />

              <p className="font-medium text-gray-700">
                {item}
              </p>
            </div>
          ))}
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
        <div className="absolute top-0 right-0 w-40 h-40 bg-purple-100 rounded-full blur-3xl opacity-60" />

        <div className="relative z-10">

          <div className="w-20 h-20 bg-[#6D5BD0] rounded-3xl flex items-center justify-center mb-8">
            <Bot
              size={40}
              className="text-white"
            />
          </div>

          <h2 className="text-4xl font-black text-[#493D9E]">
            AI Copilot
          </h2>

          <p className="text-gray-500 mt-3">
            Your intelligent interview preparation partner
          </p>

          {/* Status Card */}

          <motion.div
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="mt-6 mb-8 rounded-2xl border border-[#E8E2FF] bg-[#F8F7FF] p-5"
          >
            <div className="flex items-center gap-3">

              <div
                className={`h-3 w-3 rounded-full ${
                  serverReady
                    ? "bg-green-500"
                    : "bg-yellow-500 animate-pulse"
                }`}
              />

              <p className="font-semibold text-[#493D9E]">
                {serverMessage}
              </p>

            </div>

            {!serverReady && (
              <p className="text-sm text-gray-500 mt-3 leading-relaxed">
                This only happens on your first visit while
                Render wakes up your backend and initializes
                AI services.

                <br />

                <span className="font-semibold">
                  Estimated time:
                </span>{" "}
                15–30 seconds.
              </p>
            )}

          </motion.div>

          <img
            src={heroImage}
            alt="hero"
            className="w-[280px] mx-auto mb-8"
          />

          <button
            onClick={() => login()}
            disabled={!serverReady}
            className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all duration-300 ${
              serverReady
                ? "bg-[#6D5BD0] text-white hover:scale-105 shadow-lg"
                : "bg-gray-300 text-gray-600 cursor-not-allowed"
            }`}
          >
            {serverReady ? (
              <>
                <img
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  alt="google"
                  className="w-5 h-5"
                />

                Continue with Google
              </>
            ) : (
              <>
                <div className="h-5 w-5 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />

                Preparing AI Copilot...
              </>
            )}
          </button>

        </div>
      </motion.div>

    </div>
  </div>
);
  };

export default
  Login;