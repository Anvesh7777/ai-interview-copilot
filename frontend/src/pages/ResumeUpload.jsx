import React, {
  useState,
  useEffect,
  useRef,
} from "react";

import {
  useDropzone,
} from "react-dropzone";

import {
  motion,
} from "framer-motion";

import {
  UploadCloud,
  CheckCircle,
  Loader2,
} from "lucide-react";

import api from "../api/axios";

import uploadImage from "../assets/upload.svg";

import RagLoadingOverlay from "../components/RagLoadingOverlay";

const ResumeUpload =
  () => {
    const [
      file,
      setFile,
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

    const [
      success,
      setSuccess,
    ] =
      useState(
        false
      );

    const [
      error,
      setError,
    ] =
      useState(
        ""
      );
    const [progress, setProgress] = useState(0);

const [currentStep, setCurrentStep] = useState(0);

const progressRef = useRef(null);

const steps = [
  "Uploading Resume...",
  "Extracting Resume...",
  "Analyzing Resume...",
  "Creating Vector Embeddings...",
  "Building Knowledge Base...",
  "Creating your RAG Pipeline...",
  "Finalizing AI Interview Copilot...",
];

    const onDrop =
      (
        acceptedFiles
      ) => {
        if (
          acceptedFiles.length >
          0
        ) {
          setFile(
            acceptedFiles[0]
          );

          setSuccess(
            false
          );

          setError(
            ""
          );
        }
      };

    const {
      getRootProps,
      getInputProps,
    } =
      useDropzone(
        {
          onDrop,
          accept:
            {
              "application/pdf":
                [
                  ".pdf",
                ],
            },
          multiple:
            false,
        }
      );
    useEffect(() => {
  if (!loading) return;

  progressRef.current = setInterval(() => {
    setProgress((prev) => {
      if (prev >= 95) return 95;

      const next = prev + 1;

      if (next >= 90) setCurrentStep(6);
      else if (next >= 75) setCurrentStep(5);
      else if (next >= 60) setCurrentStep(4);
      else if (next >= 45) setCurrentStep(3);
      else if (next >= 30) setCurrentStep(2);
      else if (next >= 15) setCurrentStep(1);
      else setCurrentStep(0);

      return next;
    });
  }, 1200);

  return () => clearInterval(progressRef.current);
}, [loading]);

   const handleUpload = async () => {
  if (!file) {
    setError("Please select a resume file.");
    return;
  }

  try {
    setLoading(true);
    setSuccess(false);
    setError("");

    setProgress(5);
    setCurrentStep(0);

    const formData = new FormData();
    formData.append("resume", file);

    const res = await api.post(
      "/resume/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    clearInterval(progressRef.current);

    setProgress(100);
    setCurrentStep(6);

    await new Promise((resolve) =>
      setTimeout(resolve, 1000)
    );

    if (res.data.success) {
      localStorage.setItem(
        "resumeId",
        res.data.resumeId
      );

      setSuccess(true);
    }
  } catch (error) {
    console.error(error);

    setError(
      error.response?.data?.message ||
        "Upload failed"
    );
  } finally {
    clearInterval(progressRef.current);

    setLoading(false);

    setProgress(0);

    setCurrentStep(0);
  }
};

    return (
  <div className="space-y-8">
    <RagLoadingOverlay
      open={loading}
      progress={progress}
      currentStep={currentStep}
      steps={steps}
    />

    <motion.div
      initial={{
        opacity: 0,
        y: 30,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="bg-white rounded-3xl shadow-lg p-10"
    >
      <h1 className="text-4xl font-black text-[#493D9E]">
        Upload Resume
      </h1>

      <p className="text-gray-500 mt-3">
        Upload your resume and let AI analyze your profile.
      </p>

      <div className="grid grid-cols-2 gap-10 mt-10 items-center">
        {/* Upload Area */}
        <div
          {...getRootProps()}
          className="border-2 border-dashed border-[#DAD2FF] rounded-3xl p-12 text-center cursor-pointer hover:bg-[#FAF9FF] transition"
        >
          <input {...getInputProps()} />

          <UploadCloud
            size={50}
            className="mx-auto text-[#6D5BD0]"
          />

          <p className="mt-5 text-gray-600">
            Drag & drop your PDF here
          </p>

          <p className="text-sm text-gray-400 mt-2">
            or click to browse
          </p>

          {file && (
            <p className="mt-5 font-semibold text-[#493D9E]">
              {file.name}
            </p>
          )}
        </div>

        {/* Illustration */}
        <img
          src={uploadImage}
          alt="upload"
          className="w-[320px]"
        />
      </div>

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={loading}
        className="mt-8 px-8 py-4 bg-[#6D5BD0] text-white rounded-2xl font-semibold shadow-md hover:scale-105 transition disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading
          ? "Preparing AI Copilot..."
          : "Analyze Resume"}
      </button>

      {/* Success */}
      {success && (
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          className="mt-8 flex items-center gap-3 text-green-600 font-medium"
        >
          <CheckCircle />

          Resume uploaded successfully. Your AI Interview Copilot is ready.
        </motion.div>
      )}

      {/* Error */}
      {error && (
        <p className="mt-6 text-red-500 font-medium">
          {error}
        </p>
      )}
    </motion.div>
  </div>
);
  };

export default
  ResumeUpload;