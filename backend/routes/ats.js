const express =
  require(
    "express"
  );

const router =
  express.Router();

const authMiddleware =
  require(
    "../middleware/authMiddleware"
  );

const {
  generateATSReport,
} = require(
  "../controllers/atsController"
);

/*
|---------------------------------------------------------
| ATS Routes
|---------------------------------------------------------
*/

router.post(
  "/analyze",
  authMiddleware,
  generateATSReport
);

module.exports =
  router;