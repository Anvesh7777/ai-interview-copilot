const express =
  require(
    "express"
  );

const router =
  express.Router();

const upload =
  require(
    "../middleware/uploadMiddleware"
  );

const authMiddleware =
  require(
    "../middleware/authMiddleware"
  );

const {
  uploadJobDescription,
} = require(
  "../controllers/jobDescriptionController"
);

/*
|---------------------------------------------------------
| Job Description Routes
|---------------------------------------------------------
*/

router.post(
  "/upload",
  authMiddleware,
  upload.single(
    "jobDescription"
  ),
  uploadJobDescription
);

module.exports =
  router;