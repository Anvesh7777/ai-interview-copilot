const InterviewSession = require("../models/InterviewSession");
const Resume = require("../models/Resume");
const {
  generateInterviewQuestion,
} = require("../services/ragService");
const evaluateAnswer = require("../services/feedbackService");
const generatePlan = require("../services/revisionPlannerService");

const fullInterviewDomains = [
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

const MAX_QUESTIONS = 10;

/*
|--------------------------------------------------------------------------
| Helper: Safe JSON Parser
|--------------------------------------------------------------------------
*/
const parseJSONSafely = (raw) => {
  try {
    if (!raw) return null;

    if (typeof raw === "object") {
      return raw;
    }

    const jsonMatch =
      raw.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      return null;
    }

    return JSON.parse(
      jsonMatch[0]
    );
  } catch (err) {
    console.error(
      "JSON Parse Error:",
      err
    );
    return null;
  }
};

/*
|--------------------------------------------------------------------------
| Start Interview
|--------------------------------------------------------------------------
*/
const startInterview =
  async (req, res) => {
    try {
      const {
        userId,
        resumeId,
        jobDescriptionId,
        domain,
      } = req.body;

      console.log(
        "Start Interview Request:",
        req.body
      );

      if (
        !userId ||
        !resumeId ||
        !domain
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Missing required fields",
          });
      }

      const resume =
        await Resume.findById(
          resumeId
        );

      if (!resume) {
        return res
          .status(404)
          .json({
            success: false,
            message:
              "Resume not found",
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
            user: userId,
            resume:
              resumeId,
            jobDescription:
              jobDescriptionId ||
              null,
            domain,
            currentLevel: 1,
            questions: [
              {
                question:
                  firstQuestion,
                answer: "",
                feedback:
                  "",
                score: 0,
              },
            ],
          }
        );

      return res
        .status(201)
        .json({
          success: true,
          sessionId:
            session._id,
          firstQuestion,
        });
    } catch (error) {
      console.error(
        "Start Interview Error FULL:",
        error
      );

      return res
        .status(500)
        .json({
          success: false,
          message:
            error.message ||
            "Failed to start interview",
          stack:
            process.env
              .NODE_ENV ===
            "development"
              ? error.stack
              : null,
        });
    }
  };

/*
|--------------------------------------------------------------------------
| Submit Answer
|--------------------------------------------------------------------------
*/
const submitAnswer =
  async (req, res) => {
    try {
      const {
        sessionId,
        question,
        answer,
      } = req.body;

      const session =
        await InterviewSession.findById(
          sessionId
        );

      if (!session) {
        return res
          .status(404)
          .json({
            success: false,
            message:
              "Session not found",
          });
      }

      const finalAnswer =
        answer?.trim() ||
        "I don't know";

      const evaluationRaw =
        await evaluateAnswer(
          question,
          finalAnswer
        );

      let evaluation =
        parseJSONSafely(
          evaluationRaw
        );

      if (!evaluation) {
        evaluation = {
          score: 0,
          feedback:
            typeof evaluationRaw ===
            "string"
              ? evaluationRaw
              : "Response recorded.",
          weaknesses:
            [],
          followUpQuestion:
            "",
          isWeak: true,
        };
      }

      const lastIndex =
        session.questions
          .length - 1;

      session.questions[
        lastIndex
      ].answer =
        finalAnswer;

      session.questions[
        lastIndex
      ].feedback =
        String(
          evaluation.feedback ||
            "Processed"
        );

      session.questions[
        lastIndex
      ].score = Number(
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
        session.weaknesses.push(
          ...evaluation.weaknesses
        );
      }

      if (
        session.currentLevel >=
        MAX_QUESTIONS
      ) {
        session.status =
          "completed";

        await session.save();

        return res
          .status(200)
          .json({
            success: true,
            completed: true,
            evaluation,
          });
      }

      session.currentLevel += 1;

      let nextQuestion;

      if (
        evaluation.followUpQuestion &&
        evaluation.isWeak
      ) {
        nextQuestion =
          evaluation.followUpQuestion;
      } else {
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
        }

        nextQuestion =
          await generateInterviewQuestion(
            nextDomain,
            session.resume.toString()
          );
      }

      session.questions.push(
        {
          question:
            nextQuestion,
          answer: "",
          feedback: "",
          score: 0,
        }
      );

      await session.save();

      return res
        .status(200)
        .json({
          success: true,
          completed: false,
          evaluation,
          nextQuestion,
          currentLevel:
            session.currentLevel,
        });
    } catch (error) {
      console.error(
        "Submit Answer Error FULL:",
        error
      );

      return res
        .status(500)
        .json({
          success: false,
          message:
            error.message,
        });
    }
  };

/*
|--------------------------------------------------------------------------
| Interview Report
|--------------------------------------------------------------------------
*/
const getInterviewReport =
  async (req, res) => {
    try {
      const session =
        await InterviewSession.findById(
          req.params.sessionId
        )
          .populate("user")
          .populate("resume")
          .populate(
            "jobDescription"
          );

      if (!session) {
        return res
          .status(404)
          .json({
            success: false,
            message:
              "Report not found",
          });
      }

      return res
        .status(200)
        .json({
          success: true,
          session,
        });
    } catch (error) {
      console.error(
        "Report Error:",
        error
      );

      return res
        .status(500)
        .json({
          success: false,
          message:
            "Failed to fetch report",
        });
    }
  };

/*
|--------------------------------------------------------------------------
| Revision Plan
|--------------------------------------------------------------------------
*/
const generateRevisionPlan =
  async (req, res) => {
    try {
      const session =
        await InterviewSession.findById(
          req.params.sessionId
        );

      if (!session) {
        return res
          .status(404)
          .json({
            success: false,
            message:
              "Session not found",
          });
      }

      const uniqueWeaknesses =
        [
          ...new Set(
            session.weaknesses
          ),
        ];

      const planRaw =
        await generatePlan(
          uniqueWeaknesses
        );

      const parsedPlan =
        parseJSONSafely(
          planRaw
        );

      return res
        .status(200)
        .json({
          success: true,
          revisionPlan:
            parsedPlan || {
              priorityTopics:
                [],
              actionPlan:
                [],
              estimatedDays: 7,
            },
        });
    } catch (error) {
      console.error(
        "Revision Plan Error:",
        error
      );

      return res
        .status(500)
        .json({
          success: false,
          message:
            "Failed to generate plan",
        });
    }
  };

module.exports = {
  startInterview,
  submitAnswer,
  getInterviewReport,
  generateRevisionPlan,
};