const User =
  require(
    "../models/User"
  );

const {
  OAuth2Client,
} = require(
  "google-auth-library"
);

const generateToken =
  require(
    "../utils/generateToken"
  );

const client =
  new OAuth2Client(
    process.env
      .GOOGLE_CLIENT_ID
  );

/*
|---------------------------------------------------------
| Google Authentication
|---------------------------------------------------------
*/

const googleAuth =
  async (
    req,
    res
  ) => {
    try {
      const {
        token,
      } =
        req.body;

      if (
        !token
      ) {
        return res
          .status(
            400
          )
          .json({
            success:
              false,
            message:
              "Google token missing",
          });
      }

      /*
      |---------------------------------------------
      | Fetch Google User Info
      |---------------------------------------------
      */

      const googleRes =
        await fetch(
          `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`
        );

      if (
        !googleRes.ok
      ) {
        throw new Error(
          "Google token verification failed"
        );
      }

      const {
        sub,
        email,
        name,
        picture,
      } =
        await googleRes.json();

      if (
        !sub ||
        !email
      ) {
        return res
          .status(
            400
          )
          .json({
            success:
              false,
            message:
              "Invalid Google token",
          });
      }

      let user =
        await User.findOne(
          {
            googleId:
              sub,
          }
        );

      if (
        !user
      ) {
        user =
          await User.create(
            {
              googleId:
                sub,
              email,
              name,
              picture,
            }
          );
      }

      user.lastActive =
        new Date();

      await user.save();

      const sessionToken =
        generateToken(
          user._id
        );

      return res
        .status(
          200
        )
        .json({
          success:
            true,
          user,
          token:
            sessionToken,
        });
    } catch (
      error
    ) {
      console.error(
        "Auth Error:",
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
            "Authentication failed",
        });
    }
  };

module.exports =
  {
    googleAuth,
  };