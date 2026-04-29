const InterviewSession =
  require(
    "../models/InterviewSession"
  );

const getInterviewHistory =
  async (req, res) => {
    try {
      const { userId } =
        req.params;

      const history =
        await InterviewSession.find(
          {
            user: userId,
            status:
              "completed",
          }
        )
          .populate(
            "resume"
          )
          .populate(
            "jobDescription"
          )
          .sort({
            createdAt:
              -1,
          });

      res.status(200).json({
        success: true,
        history,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

module.exports = {
  getInterviewHistory,
};