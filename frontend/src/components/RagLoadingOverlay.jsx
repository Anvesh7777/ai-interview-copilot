import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Loader2,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

const RagLoadingOverlay = ({
  open,
  progress,
  currentStep,
  steps,
}) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-md px-4"
        >
          <motion.div
            initial={{
              opacity: 0,
              y: 30,
              scale: 0.96,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            transition={{
              duration: 0.35,
            }}
            className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl p-10"
          >
            {/* Header */}

            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-[#F3F0FF] flex items-center justify-center">
                <Brain
                  size={34}
                  className="text-[#6D5BD0]"
                />
              </div>

              <div>
                <h2 className="text-3xl font-black text-[#493D9E]">
                  Preparing Your AI Interview Copilot
                </h2>

                <p className="text-gray-500 mt-1">
                  We're building your personalized
                  interview knowledge base.
                </p>
              </div>
            </div>

            {/* Progress */}

            <div className="mt-8">
              <div className="flex justify-between mb-2">
                <span className="font-semibold text-[#493D9E]">
                  {progress}%
                </span>

                <span className="text-gray-500">
                  Estimated Time: 1–2 min
                </span>
              </div>

              <div className="w-full h-3 rounded-full bg-gray-200 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-[#6D5BD0]"
                  animate={{
                    width: `${progress}%`,
                  }}
                  transition={{
                    duration: 0.6,
                  }}
                />
              </div>
            </div>

            {/* Current Stage */}

            <motion.div
              key={currentStep}
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="mt-6 flex items-center gap-3 text-[#493D9E] font-semibold text-lg"
            >
              <Loader2 className="animate-spin" />

              {steps[currentStep]}
            </motion.div>

            {/* Checklist */}

            <div className="mt-8 space-y-4">

              {steps.map((step, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3"
                >
                  {index < currentStep ? (
                    <CheckCircle2
                      className="text-green-500"
                      size={22}
                    />
                  ) : index === currentStep ? (
                    <Loader2
                      size={22}
                      className="animate-spin text-[#6D5BD0]"
                    />
                  ) : (
                    <Sparkles
                      size={20}
                      className="text-gray-300"
                    />
                  )}

                  <span
                    className={`${
                      index <= currentStep
                        ? "text-gray-800"
                        : "text-gray-400"
                    }`}
                  >
                    {step}
                  </span>
                </div>
              ))}
            </div>

            {/* Info */}

            <div className="mt-8 rounded-2xl bg-[#F8F7FF] border border-[#E8E2FF] p-5">
              <p className="font-semibold text-[#493D9E]">
                Creating your personalized RAG Pipeline...
              </p>

              <p className="text-gray-600 mt-2 leading-relaxed">
                This process usually takes
                <span className="font-semibold">
                  {" "}
                  1–2 minutes
                </span>{" "}
                depending on your resume size.
                <br />
                Please keep this page open while
                we extract your resume, generate
                vector embeddings and prepare your
                AI Interview Copilot.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RagLoadingOverlay;