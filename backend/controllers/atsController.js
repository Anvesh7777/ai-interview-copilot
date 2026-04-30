const Resume =
  require(
    "../models/Resume"
  );

const JobDescription =
  require(
    "../models/JobDescription"
  );

const ATSReport =
  require(
    "../models/ATSReport"
  );

const User =
  require(
    "../models/User"
  );

const analyzeATS =
  require(
    "../services/atsService"
  );

/*
|---------------------------------------------------------
| Generate ATS Report
|---------------------------------------------------------
*/

const generateATSReport =
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
      } =
        req.body;

      if (
        !resumeId
      ) {
        return res
          .status(
            400
          )
          .json({
            success:
              false,
            message:
              "Resume ID is required",
          });
      }

      /*
      |---------------------------------------------
      | Fetch Resume
      |---------------------------------------------
      */

      const resume =
        await Resume.findById(
          resumeId
        );

      if (
        !resume
      ) {
        return res
          .status(
            404
          )
          .json({
            success:
              false,
            message:
              "Resume not found",
          });
      }

      const finalResumeText =
        resume.extractedText;

      if (
        !finalResumeText ||
        finalResumeText.length <
          10
      ) {
        return res
          .status(
            400
          )
          .json({
            success:
              false,
            message:
              "Resume text is empty. Please re-upload.",
          });
      }

      /*
      |---------------------------------------------
      | Fetch Job Description (Optional)
      |---------------------------------------------
      */

      let jdText =
        "General Software Engineering Industry Standards";

      let jobDescription =
        null;

      if (
        jobDescriptionId &&
        jobDescriptionId !==
          "null"
      ) {
        jobDescription =
          await JobDescription.findById(
            jobDescriptionId
          );

        if (
          jobDescription
        ) {
          jdText =
            jobDescription.extractedText;
        }
      }

      /*
      |---------------------------------------------
      | Analyze ATS
      |---------------------------------------------
      */

      const atsData =
        await analyzeATS(
          finalResumeText,
          jdText
        );

      /*
      |---------------------------------------------
      | Save ATS Report
      |---------------------------------------------
      */

      const report =
        await ATSReport.create(
          {
            user:
              userId,
            resume:
              resumeId,
            jobDescription:
              jobDescriptionId ||
              null,
            matchScore:
              Number(
                atsData.matchScore ||
                  0
              ),
            matchedSkills:
              atsData.matchedSkills ||
              [],
            missingSkills:
              atsData.missingSkills ||
              [],
            strengths:
              atsData.strengths ||
              [],
            weaknesses:
              atsData.weaknesses ||
              [],
            suggestions:
              atsData.suggestions ||
              [],
            roleFit:
              atsData.roleFit ||
              "",
          }
        );

      /*
      |---------------------------------------------
      | Update Resume ATS Insights
      |---------------------------------------------
      */

      resume.atsInsights =
        {
          score:
            report.matchScore,
          matchedSkills:
            report.matchedSkills,
          missingSkills:
            report.missingSkills,
          suggestions:
            report.suggestions,
        };

      await resume.save();

      /*
      |---------------------------------------------
      | Update Job Description Match Insights
      |---------------------------------------------
      */

      if (
        jobDescription
      ) {
        jobDescription.matchInsights =
          {
            score:
              report.matchScore,
            matchedSkills:
              report.matchedSkills,
            missingSkills:
              report.missingSkills,
            suggestions:
              report.suggestions,
          };

        await jobDescription.save();
      }

      /*
      |---------------------------------------------
      | Update User Analytics
      |---------------------------------------------
      */

      await User.findByIdAndUpdate(
        userId,
        {
          $inc: {
            totalATSReports:
              1,
          },
        }
      );

      return res
        .status(
          200
        )
        .json({
          success:
            true,
          report,
        });
    } catch (
      error
    ) {
      console.error(
        "ATS Controller Error:",
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
    generateATSReport,
  };