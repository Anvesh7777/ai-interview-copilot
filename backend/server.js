require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB =
  require("./config/db");

const authRoutes =
  require("./routes/auth");

const resumeRoutes =
  require("./routes/resume");

const interviewRoutes =
  require("./routes/interview");

const historyRoutes =
  require("./routes/history");

const jobDescriptionRoutes =
  require(
    "./routes/jobDescription"
  );

const atsRoutes =
  require(
    "./routes/ats"
  );

connectDB();

const app = express();

app.use(
  cors({
    origin:
      "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message:
      "AI Interview Copilot API running 🚀",
  });
});

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/resume",
  resumeRoutes
);

app.use(
  "/api/interview",
  interviewRoutes
);

app.use(
  "/api/history",
  historyRoutes
);

app.use(
  "/api/job-description",
  jobDescriptionRoutes
);

app.use(
  "/api/ats",
  atsRoutes
);

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT} 🚀`
  );
});