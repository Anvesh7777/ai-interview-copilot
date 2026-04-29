const express = require(
  "express"
);

const router =
  express.Router();

const {
  getInterviewHistory,
} = require(
  "../controllers/historyController"
);

router.get(
  "/:userId",
  getInterviewHistory
);

module.exports = router;