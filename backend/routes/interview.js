const express =
  require("express");

const router =
  express.Router();

const {
  startInterview,
  submitAnswer,
  getInterviewReport,
  generateRevisionPlan,
} = require(
  "../controllers/interviewController"
);

router.post(
  "/start",
  startInterview
);

router.post(
  "/answer",
  submitAnswer
);

router.get(
  "/report/:sessionId",
  getInterviewReport
);

router.get(
  "/revision-plan/:sessionId",
  generateRevisionPlan
);

module.exports =
  router;