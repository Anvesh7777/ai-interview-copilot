const express =
  require(
    "express"
  );

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

const authMiddleware =
  require(
    "../middleware/authMiddleware"
  );

/*
|---------------------------------------------------------
| Interview Routes
|---------------------------------------------------------
*/

router.post(
  "/start",
  authMiddleware,
  startInterview
);

router.post(
  "/:sessionId/answer",
  authMiddleware,
  submitAnswer
);

router.get(
  "/:sessionId/report",
  authMiddleware,
  getInterviewReport
);

router.get(
  "/:sessionId/revision-plan",
  authMiddleware,
  generateRevisionPlan
);

module.exports =
  router;