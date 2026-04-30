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
  uploadResume,
} =
  require(
    "../controllers/resumeController"
  );

/*
|---------------------------------------------------------
| Upload Resume
| Protected Route
|---------------------------------------------------------
*/

router.post(
  "/upload",
  authMiddleware,
  upload.single(
    "resume"
  ),
  uploadResume
);

module.exports =
  router;