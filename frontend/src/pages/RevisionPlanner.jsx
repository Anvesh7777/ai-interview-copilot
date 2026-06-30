import React, {
  useEffect,
  useState,
} from "react";

import api from "../api/axios";

import {
  useParams,
} from "react-router-dom";

import {
  Target,
  BookOpen,
  Clock,
  CheckCircle,
} from "lucide-react";

const RevisionPlanner = () => {
  const { sessionId } = useParams();

  const [plan, setPlan] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlan();
  }, [sessionId]);

  const fetchPlan = async () => {
    try {
      const id =
        sessionId ||
        localStorage.getItem("sessionId");

      if (!id) {
        setLoading(false);
        return;
      }

      const res = await api.get(
        `/interview/${id}/revision-plan`
      );

      setPlan(
        res.data?.revisionPlan || null
      );
    } catch (error) {
      console.error(
        "Revision plan error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const renderItem = (item) => {
    if (typeof item === "string")
      return item;

    if (
      typeof item === "object" &&
      item !== null
    ) {
      return (
        item.topic ||
        item.title ||
        item.name ||
        item.resource ||
        item.description ||
        JSON.stringify(item)
      );
    }

    return String(item);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700 text-lg font-medium">
        Loading revision plan...
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Target className="mx-auto mb-4 text-gray-400" />

          <p className="text-gray-700 text-lg">
            No revision plan found
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 px-4 md:px-10 pb-16 pt-6 max-w-7xl mx-auto">
      <div className="bg-white rounded-3xl shadow-lg p-8">
        <h1 className="text-4xl font-bold text-[#493D9E]">
          Revision Plan
        </h1>

        {/* Priority Topics */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2 mb-4">
            <BookOpen />
            Priority Topics
          </h2>

          <div className="space-y-3">
            {(plan.priorityTopics || []).map(
              (topic, index) => (
                <div
                  key={index}
                  className="bg-purple-50 border border-purple-100 rounded-xl p-4 text-gray-800"
                >
                  {renderItem(topic)}
                </div>
              )
            )}
          </div>
        </div>

        {/* Action Plan */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2 mb-4">
            <CheckCircle />
            Action Plan
          </h2>

          <div className="space-y-3">
            {(plan.actionPlan || []).map(
              (action, index) => (
                <div
                  key={index}
                  className="bg-green-50 border border-green-100 rounded-xl p-4 text-gray-800"
                >
                  {renderItem(action)}
                </div>
              )
            )}
          </div>
        </div>

        {/* Recommended Resources */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2 mb-4">
            <BookOpen />
            Recommended Resources
          </h2>

          <div className="space-y-3">
            {(plan.recommendedResources || []).map(
              (resource, index) => (
                <div
                  key={index}
                  className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-gray-800"
                >
                  {renderItem(resource)}
                </div>
              )
            )}
          </div>
        </div>

        {/* Estimated Days */}
        <div className="mt-8 bg-[#F8F7FF] rounded-2xl p-6 border border-purple-100">
          <h2 className="text-xl font-bold text-[#493D9E] flex items-center gap-2">
            <Clock />
            Estimated Completion Time
          </h2>

          <p className="mt-3 text-gray-800 text-lg">
            {plan.estimatedDays || 0} days
          </p>
        </div>
      </div>
    </div>
  );
};

export default RevisionPlanner;