const InterviewSession =
  require(
    "../models/InterviewSession"
  );

/*
|---------------------------------------------------------
| Get Interview History
|---------------------------------------------------------
*/

const getInterviewHistory =
  async (
    req,
    res
  ) => {
    try {
      const userId =
        req.user._id;

      const page =
        Number(
          req.query.page
        ) || 1;

      const limit =
        Number(
          req.query.limit
        ) || 10;

      const skip =
        (page - 1) *
        limit;

      const totalSessions =
        await InterviewSession.countDocuments(
          {
            user:
              userId,
            status:
              "completed",
          }
        );

      const history =
        await InterviewSession.find(
          {
            user:
              userId,
            status:
              "completed",
          }
        )
          .populate(
            "resume",
            "originalName"
          )
          .populate(
            "jobDescription",
            "role company"
          )
          .sort({
            createdAt:
              -1,
          })
          .skip(
            skip
          )
          .limit(
            limit
          );

      const formattedHistory =
        history.map(
          (
            session
          ) => ({
            sessionId:
              session._id,
            domain:
              session.domain,
            totalScore:
              session.totalScore,
            averageScore:
              session.analytics
                ?.averageScore ||
              0,
            weaknesses:
              session.weaknesses,
            strengths:
              session.strengths,
            durationInMinutes:
              session.durationInMinutes,
            completedAt:
              session.endedAt,
            resume:
              session.resume,
            jobDescription:
              session.jobDescription,
          })
        );

      return res
        .status(
          200
        )
        .json({
          success:
            true,
          totalSessions,
          currentPage:
            page,
          totalPages:
            Math.ceil(
              totalSessions /
                limit
            ),
          history:
            formattedHistory,
        });
    } catch (
      error
    ) {
      console.error(
        "Interview History Error:",
        error.message
      );

      return res
        .status(
          500
        )
        .json({
          success:
            false,
          message:
            error.message,
        });
    }
  };

module.exports =
  {
    getInterviewHistory,
  };