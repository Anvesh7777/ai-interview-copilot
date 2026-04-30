const InterviewSession =
  require(
    "../models/InterviewSession"
  );

const Resume =
  require(
    "../models/Resume"
  );

const User =
  require(
    "../models/User"
  );

const {
  generateInterviewQuestion,
} = require(
  "../services/ragService"
);

const evaluateAnswer =
  require(
    "../services/feedbackService"
  );

const generatePlan =
  require(
    "../services/revisionPlannerService"
  );

const fullInterviewDomains =
  [
    "DSA",
    "Core CS",
    "DBMS",
    "OS",
    "OOPs",
    "System Design",
    "Backend",
    "Frontend",
    "Projects",
  ];

const MAX_QUESTIONS =
  10;

/*
|---------------------------------------------------------
| Start Interview
|---------------------------------------------------------
*/

const startInterview =
  async (
    req,
    res
  ) => {
    try {
      const userId =
        req.user._id;

      const {
        resumeId,
        jobDescriptionId,
        domain,
      } =
        req.body;

      if (
        !resumeId ||
        !domain
      ) {
        return res
          .status(400)
          .json({
            success:
              false,
            message:
              "Missing required fields",
          });
      }

      const resume =
        await Resume.findOne(
          {
            _id:
              resumeId,
            user:
              userId,
          }
        );

      if (
        !resume
      ) {
        return res
          .status(404)
          .json({
            success:
              false,
            message:
              "Resume not found",
          });
      }

      if (
        !resume.vectorized
      ) {
        return res
          .status(400)
          .json({
            success:
              false,
            message:
              "Resume not vectorized yet",
          });
      }

      const selectedDomain =
        domain ===
        "Complete Interview"
          ? fullInterviewDomains[0]
          : domain;

      const firstQuestion =
        await generateInterviewQuestion(
          selectedDomain,
          resumeId
        );

      const session =
        await InterviewSession.create(
          {
            user:
              userId,
            resume:
              resumeId,
            jobDescription:
              jobDescriptionId ||
              null,
            domain,
            domainHistory:
              [
                selectedDomain,
              ],
            sessionType:
              domain ===
              "Complete Interview"
                ? "complete-interview"
                : "single-domain",
            currentLevel:
              1,
            totalQuestions:
              MAX_QUESTIONS,
            questions:
              [
                {
                  question:
                    firstQuestion,
                },
              ],
            startedAt:
              new Date(),
          }
        );

      return res
        .status(201)
        .json({
          success:
            true,
          sessionId:
            session._id,
          firstQuestion,
        });
    } catch (
      error
    ) {
      console.error(
        "Start Interview Error:",
        error.message
      );

      return res
        .status(500)
        .json({
          success:
            false,
          message:
            error.message,
        });
    }
  };

/*
|---------------------------------------------------------
| Submit Answer
|---------------------------------------------------------
*/

const submitAnswer =
  async (
    req,
    res
  ) => {
    try {
      const userId =
        req.user._id;

      const {
        question,
        answer,
      } =
        req.body;

      const {
        sessionId,
      } =
        req.params;

      const session =
        await InterviewSession.findOne(
          {
            _id:
              sessionId,
            user:
              userId,
          }
        );

      if (
        !session
      ) {
        return res
          .status(404)
          .json({
            success:
              false,
            message:
              "Session not found",
          });
      }

      const finalAnswer =
        answer?.trim() ||
        "No answer provided";

      const evaluation =
        await evaluateAnswer(
          question,
          finalAnswer
        );

      const lastIndex =
        session.questions.length -
        1;

      session.questions[
        lastIndex
      ].answer =
        finalAnswer;

      session.questions[
        lastIndex
      ].feedback =
        evaluation.feedback;

      session.questions[
        lastIndex
      ].score =
        Number(
          evaluation.score ||
            0
        );

      session.totalScore +=
        Number(
          evaluation.score ||
            0
        );

      if (
        Array.isArray(
          evaluation.weaknesses
        )
      ) {
        session.weaknesses =
          [
            ...new Set(
              [
                ...session.weaknesses,
                ...evaluation.weaknesses,
              ]
            ),
          ];
      }

      if (
        Array.isArray(
          evaluation.strengths
        )
      ) {
        session.strengths =
          [
            ...new Set(
              [
                ...session.strengths,
                ...evaluation.strengths,
              ]
            ),
          ];
      }

      session.analytics =
        session.analytics ||
        {};

      session.analytics.averageScore =
        session.totalScore /
        session.currentLevel;

      if (
        session.currentLevel >=
        MAX_QUESTIONS
      ) {
        session.status =
          "completed";

        session.endedAt =
          new Date();

        session.durationInMinutes =
          Math.ceil(
            (session.endedAt -
              session.startedAt) /
              60000
          );

        await User.findByIdAndUpdate(
          userId,
          {
            $inc: {
              interviewCount:
                1,
            },
          }
        );

        await session.save();

        return res
          .status(200)
          .json({
            success:
              true,
            completed:
              true,
            evaluation,
          });
      }

      session.currentLevel +=
        1;

      let nextDomain =
        session.domain;

      if (
        session.domain ===
        "Complete Interview"
      ) {
        const domainIndex =
          (session.currentLevel -
            1) %
          fullInterviewDomains.length;

        nextDomain =
          fullInterviewDomains[
            domainIndex
          ];

        session.domainHistory.push(
          nextDomain
        );
      }

      const nextQuestion =
        await generateInterviewQuestion(
          nextDomain,
          session.resume.toString()
        );

      session.questions.push(
        {
          question:
            nextQuestion,
        }
      );

      await session.save();

      return res
        .status(200)
        .json({
          success:
            true,
          completed:
            false,
          evaluation,
          nextQuestion,
          currentLevel:
            session.currentLevel,
        });
    } catch (
      error
    ) {
      console.error(
        "Submit Answer Error:",
        error.message
      );

      return res
        .status(500)
        .json({
          success:
            false,
          message:
            error.message,
        });
    }
  };

/*
|---------------------------------------------------------
| Interview Report
|---------------------------------------------------------
*/

const getInterviewReport =
  async (
    req,
    res
  ) => {
    try {
      const userId =
        req.user._id;

      const session =
        await InterviewSession.findOne(
          {
            _id:
              req.params
                .sessionId,
            user:
              userId,
          }
        )
          .populate(
            "user"
          )
          .populate(
            "resume"
          )
          .populate(
            "jobDescription"
          );

      if (
        !session
      ) {
        return res
          .status(404)
          .json({
            success:
              false,
            message:
              "Report not found",
          });
      }

      return res
        .status(200)
        .json({
          success:
            true,
          session,
        });
    } catch {
      return res
        .status(500)
        .json({
          success:
            false,
          message:
            "Failed to fetch report",
        });
    }
  };

/*
|---------------------------------------------------------
| Generate Revision Plan
|---------------------------------------------------------
*/

const generateRevisionPlan =
  async (
    req,
    res
  ) => {
    try {
      const userId =
        req.user._id;

      const session =
        await InterviewSession.findOne(
          {
            _id:
              req.params
                .sessionId,
            user:
              userId,
          }
        );

      if (
        !session
      ) {
        return res
          .status(404)
          .json({
            success:
              false,
            message:
              "Session not found",
          });
      }

      const plan =
        await generatePlan(
          session.weaknesses
        );

      session.revisionPlan =
        plan;

      await session.save();

      return res
        .status(200)
        .json({
          success:
            true,
          revisionPlan:
            plan,
        });
    } catch {
      return res
        .status(500)
        .json({
          success:
            false,
          message:
            "Failed to generate revision plan",
        });
    }
  };

module.exports =
  {
    startInterview,
    submitAnswer,
    getInterviewReport,
    generateRevisionPlan,
  };