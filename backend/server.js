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

/*
|--------------------------------------------------------------------------
| Connect Database
|--------------------------------------------------------------------------
*/

connectDB();

const app = express();

/*
|--------------------------------------------------------------------------
| CORS Configuration
|--------------------------------------------------------------------------
*/

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (
      origin,
      callback
    ) => {
      // allow tools like Postman
      if (!origin) {
        return callback(
          null,
          true
        );
      }

      if (
        allowedOrigins.includes(
          origin
        )
      ) {
        return callback(
          null,
          true
        );
      }

      return callback(
        new Error(
          "CORS policy blocked this origin"
        )
      );
    },
    credentials: true,
  })
);

/*
|--------------------------------------------------------------------------
| Body Parsers
|--------------------------------------------------------------------------
*/

app.use(
  express.json({
    limit: "10mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);

/*
|--------------------------------------------------------------------------
| Health Check
|--------------------------------------------------------------------------
*/

app.get(
  "/",
  (req, res) => {
    res.status(200).json({
      success: true,
      message:
        "AI Interview Copilot API running 🚀",
      environment:
        process.env
          .NODE_ENV ||
        "development",
    });
  }
);

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

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

/*
|--------------------------------------------------------------------------
| 404 Handler (Express 5 safe)
|--------------------------------------------------------------------------
*/

app.use(
  (req, res) => {
    res.status(404).json({
      success: false,
      message:
        "Route not found",
    });
  }
);

/*
|--------------------------------------------------------------------------
| Global Error Handler
|--------------------------------------------------------------------------
*/

app.use(
  (
    err,
    req,
    res,
    next
  ) => {
    console.error(
      "Server Error:",
      err.message
    );

    res.status(
      err.status || 500
    ).json({
      success: false,
      message:
        err.message ||
        "Internal Server Error",
    });
  }
);

/*
|--------------------------------------------------------------------------
| Start Server
|--------------------------------------------------------------------------
*/

const PORT =
  process.env.PORT ||
  5000;

app.listen(
  PORT,
  () => {
    console.log(
      `Server running on port ${PORT} 🚀`
    );
  }
);