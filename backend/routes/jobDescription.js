const express =
  require("express");

const router =
  express.Router();

const upload =
  require(
    "../middleware/uploadMiddleware"
  );

const {
  uploadJobDescription,
} = require(
  "../controllers/jobDescriptionController"
);

router.post(
  "/upload",
  upload.single(
    "jobDescription"
  ),
  uploadJobDescription
);

module.exports =
  router;