import React,
{
  useEffect,
  useState,
} from "react";

import api from "../api/axios";

import {
  motion,
} from "framer-motion";

import historyImage from "../assets/history.svg";

import {
  History as HistoryIcon,
  Calendar,
  Trophy,
  Briefcase,
} from "lucide-react";

const History =
  () => {
    const [
      history,
      setHistory,
    ] =
      useState(
        []
      );

    const [
      loading,
      setLoading,
    ] =
      useState(
        true
      );

    useEffect(
      () => {
        fetchHistory();
      },
      []
    );

    const fetchHistory =
      async () => {
        try {
          const res =
            await api.get(
              "/history"
            );

          setHistory(
            res.data
              .history ||
              []
          );
        } catch (
          error
        ) {
          console.error(
            "History Fetch Error:",
            error
          );
        } finally {
          setLoading(
            false
          );
        }
      };

    if (
      loading
    ) {
      return (
        <div className="min-h-screen flex items-center justify-center text-xl font-semibold">
          Loading
          history...
        </div>
      );
    }

    return (
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="bg-white rounded-3xl shadow-lg p-8 flex justify-between items-center"
        >
          <div>
            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium">
              <HistoryIcon
                size={
                  16
                }
              />

              Interview
              Records
            </div>

            <h1 className="text-4xl font-black mt-4 text-[#493D9E]">
              Interview
              History
            </h1>

            <p className="text-gray-500 mt-3">
              Review your
              previous
              interview
              sessions
            </p>
          </div>

          <img
            src={
              historyImage
            }
            alt="history"
            className="w-[280px]"
          />
        </motion.div>

        {/* Empty State */}
        {history.length ===
          0 && (
          <div className="bg-white rounded-3xl shadow-lg p-10 text-center">
            <p className="text-xl text-gray-500">
              No interview
              history found
            </p>
          </div>
        )}

        {/* History Cards */}
        <div className="space-y-6">
          {history.map(
            (
              item,
              index
            ) => {
              const totalQuestions =
                item.questions?.filter(
                  (
                    q
                  ) =>
                    q.answer
                )
                  .length ||
                0;

              const averageScore =
                totalQuestions >
                0
                  ? (
                      item.totalScore /
                      totalQuestions
                    ).toFixed(
                      1
                    )
                  : 0;

              return (
                <motion.div
                  key={
                    item.sessionId
                  }
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay:
                      index *
                      0.1,
                  }}
                  whileHover={{
                    y: -5,
                  }}
                  className="bg-white rounded-3xl shadow-lg p-8"
                >
                  <div className="flex justify-between items-center">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Briefcase className="text-[#6D5BD0]" />

                        <h2 className="text-2xl font-bold">
                          {
                            item.domain
                          }
                        </h2>
                      </div>

                      <div className="flex items-center gap-2 text-gray-500">
                        <Calendar
                          size={
                            18
                          }
                        />

                        {new Date(
                          item.completedAt
                        ).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center gap-2 justify-end text-green-600">
                        <Trophy
                          size={
                            18
                          }
                        />

                        <span className="font-bold text-xl">
                          {
                            averageScore
                          }
                          /10
                        </span>
                      </div>

                      <p className="text-gray-500 mt-2">
                        Avg Score
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            }
          )}
        </div>
      </div>
    );
  };

export default
  History;