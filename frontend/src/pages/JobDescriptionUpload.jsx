import React,
{
  useState,
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
} from "lucide-react";

import api from "../api/axios";

import uploadImage from "../assets/upload.svg";

const JobDescriptionUpload =
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

    const handleUpload =
      async () => {
        if (
          !file
        ) {
          setError(
            "Please select a job description file."
          );

          return;
        }

        try {
          setLoading(
            true
          );

          setError(
            ""
          );

          const formData =
            new FormData();

          formData.append(
            "jobDescription",
            file
          );

          /*
          |---------------------------------------------
          | JWT auto-attached via interceptor
          |---------------------------------------------
          */

          const res =
            await api.post(
              "/job-description/upload",
              formData,
              {
                headers:
                  {
                    "Content-Type":
                      "multipart/form-data",
                  },
              }
            );

          if (
            res.data
              .success
          ) {
            localStorage.setItem(
              "jobDescriptionId",
              res.data
                .jobDescriptionId
            );

            setSuccess(
              true
            );
          }
        } catch (
          error
        ) {
          console.error(
            error
          );

          setError(
            error.response
              ?.data
              ?.message ||
              "Upload failed"
          );
        } finally {
          setLoading(
            false
          );
        }
      };

    return (
      <div className="space-y-8">
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
            Upload Job
            Description
          </h1>

          <p className="text-gray-500 mt-3">
            Upload the
            target role JD
            to get ATS
            analysis and
            targeted
            interview prep.
          </p>

          <div className="grid grid-cols-2 gap-10 mt-10 items-center">
            {/* Upload Area */}
            <div
              {...getRootProps()}
              className="border-2 border-dashed border-[#DAD2FF] rounded-3xl p-12 text-center cursor-pointer hover:bg-[#FAF9FF] transition"
            >
              <input
                {...getInputProps()}
              />

              <UploadCloud
                size={
                  50
                }
                className="mx-auto text-[#6D5BD0]"
              />

              <p className="mt-5 text-gray-600">
                Drag &
                drop JD
                PDF here
              </p>

              <p className="text-sm text-gray-400 mt-2">
                or click
                to browse
              </p>

              {file && (
                <p className="mt-5 font-semibold text-[#493D9E]">
                  {
                    file.name
                  }
                </p>
              )}
            </div>

            {/* Illustration */}
            <img
              src={
                uploadImage
              }
              alt="upload"
              className="w-[320px]"
            />
          </div>

          {/* Upload Button */}
          <button
            onClick={
              handleUpload
            }
            disabled={
              loading
            }
            className="mt-8 px-8 py-4 bg-[#6D5BD0] text-white rounded-2xl font-semibold shadow-md hover:scale-105 transition"
          >
            {loading
              ? "Uploading..."
              : "Upload Job Description"}
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
              Job Description
              uploaded
              successfully
            </motion.div>
          )}

          {/* Error */}
          {error && (
            <p className="mt-6 text-red-500 font-medium">
              {
                error
              }
            </p>
          )}
        </motion.div>
      </div>
    );
  };

export default
  JobDescriptionUpload;