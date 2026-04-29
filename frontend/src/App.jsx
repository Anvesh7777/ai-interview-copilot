import React from "react";
import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ResumeUpload from "./pages/ResumeUpload";
import JobDescriptionUpload from "./pages/JobDescriptionUpload";
import ATSResult from "./pages/ATSResult";
import MockInterview from "./pages/MockInterview";
import InterviewReport from "./pages/InterviewReport";
import RevisionPlanner from "./pages/RevisionPlanner";
import History from "./pages/History";

import Layout from "./components/Layout";

function ProtectedRoute({
  children,
}) {
  const token =
    localStorage.getItem(
      "token"
    );

  if (!token) {
    return (
      <Navigate to="/" replace />
    );
  }

  return children;
}

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/"
        element={<Login />}
      />

      {/* Protected Routes */}
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route
          path="/dashboard"
          element={
            <Dashboard />
          }
        />

        <Route
          path="/resume-upload"
          element={
            <ResumeUpload />
          }
        />

        <Route
          path="/job-description"
          element={
            <JobDescriptionUpload />
          }
        />

        <Route
          path="/ats-result"
          element={
            <ATSResult />
          }
        />

        <Route
          path="/mock-interview"
          element={
            <MockInterview />
          }
        />

        {/* IMPORTANT:
            Keep this as /report
        */}
        <Route
          path="/report"
          element={
            <InterviewReport />
          }
        />

        <Route
          path="/revision-plan"
          element={
            <RevisionPlanner />
          }
        />

        <Route
          path="/history"
          element={
            <History />
          }
        />
      </Route>

      {/* Fallback */}
      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />
    </Routes>
  );
}

export default App;