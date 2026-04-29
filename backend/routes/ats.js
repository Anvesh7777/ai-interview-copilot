const express =
  require("express");

const router =
  express.Router();

const {
  generateATSReport,
} = require(
  "../controllers/atsController"
);

router.post(
  "/analyze",
  generateATSReport
);

module.exports =
  router;