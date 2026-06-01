require(
  "dotenv"
).config();

const express =
  require(
    "express"
  );

const cors =
  require(
    "cors"
  );
  
const axios = require("axios");

const connectDB =
  require(
    "./config/db"
  );

const authRoutes =
  require(
    "./routes/auth"
  );

const resumeRoutes =
  require(
    "./routes/resume"
  );

const interviewRoutes =
  require(
    "./routes/interview"
  );

const historyRoutes =
  require(
    "./routes/history"
  );

const jobDescriptionRoutes =
  require(
    "./routes/jobDescription"
  );

const atsRoutes =
  require(
    "./routes/ats"
  );

const app =
  express();

/*
|---------------------------------------------------------
| Database Connection
|---------------------------------------------------------
*/

const startServer =
  async () => {
    try {
      await connectDB();

      console.log(
        "MongoDB connected ✅"
      );

      const PORT =
        process.env.PORT ||
        5000;

  app.listen(
  PORT,
  async () => {
    console.log(
      `Server running on port ${PORT} 🚀`
    );

    try {
      const response =
        await axios.get(
          `${process.env.CHROMA_URL}/api/v1/heartbeat`
        );

      console.log(
        "Chroma warmup successful ✅",
        response.data
      );
    } catch (error) {
      console.error(
        "Chroma warmup failed ❌",
        error.message
      );
    }
  }
);
    } catch (
      error
    ) {
      console.error(
        "Server startup failed:",
        error.message
      );

      process.exit(
        1
      );
    }
  };

/*
|---------------------------------------------------------
| CORS Configuration
|---------------------------------------------------------
*/

const allowedOrigins =
  [
    "http://localhost:5173",
    process.env
      .FRONTEND_URL,
  ].filter(
    Boolean
  );

app.use(
  cors({
    origin: (
      origin,
      callback
    ) => {
      if (
        !origin
      ) {
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
          "CORS blocked this origin"
        )
      );
    },
    credentials:
      true,
  })
);

/*
|---------------------------------------------------------
| Body Parsers
|---------------------------------------------------------
*/

app.use(
  express.json({
    limit:
      "10mb",
  })
);

app.use(
  express.urlencoded(
    {
      extended:
        true,
      limit:
        "10mb",
    }
  )
);

/*
|---------------------------------------------------------
| Health Check
|---------------------------------------------------------
*/

app.get(
  "/",
  (
    req,
    res
  ) => {
    res.status(
      200
    ).json({
      success:
        true,
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
|---------------------------------------------------------
| Routes
|---------------------------------------------------------
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
|---------------------------------------------------------
| 404 Handler
|---------------------------------------------------------
*/

app.use(
  (
    req,
    res
  ) => {
    res.status(
      404
    ).json({
      success:
        false,
      message:
        "Route not found",
    });
  }
);

/*
|---------------------------------------------------------
| Global Error Handler
|---------------------------------------------------------
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
      err.status ||
        500
    ).json({
      success:
        false,
      message:
        err.message ||
        "Internal Server Error",
    });
  }
);

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy",
  });
});

/*
|---------------------------------------------------------
| Process-Level Error Handling
|---------------------------------------------------------
*/

process.on(
  "unhandledRejection",
  (
    error
  ) => {
    console.error(
      "Unhandled Rejection:",
      error.message
    );
  }
);

process.on(
  "uncaughtException",
  (
    error
  ) => {
    console.error(
      "Uncaught Exception:",
      error.message
    );

    process.exit(
      1
    );
  }
);



/*
|---------------------------------------------------------
| Start Server
|---------------------------------------------------------
*/

startServer();