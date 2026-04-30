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
  getInterviewHistory,
} = require(
  "../controllers/historyController"
);

/*
|---------------------------------------------------------
| History Routes
|---------------------------------------------------------
*/

router.get(
  "/",
  authMiddleware,
  getInterviewHistory
);

module.exports =
  router;