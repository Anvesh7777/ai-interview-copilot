const jwt =
  require(
    "jsonwebtoken"
  );

const User =
  require(
    "../models/User"
  );

/*
|---------------------------------------------------------
| Auth Middleware
|---------------------------------------------------------
*/

const authMiddleware =
  async (
    req,
    res,
    next
  ) => {
    try {
      const authHeader =
        req.headers
          .authorization;

      if (
        !authHeader ||
        !authHeader.startsWith(
          "Bearer "
        )
      ) {
        return res
          .status(
            401
          )
          .json({
            success:
              false,
            message:
              "Unauthorized. Token missing.",
          });
      }

      const token =
        authHeader.split(
          " "
        )[1];

      const decoded =
        jwt.verify(
          token,
          process.env
            .JWT_SECRET
        );

      const user =
        await User.findById(
          decoded.id
        ).select(
          "-__v"
        );

      if (
        !user
      ) {
        return res
          .status(
            401
          )
          .json({
            success:
              false,
            message:
              "User not found.",
          });
      }

      req.user =
        user;

      next();
    } catch (
      error
    ) {
      console.error(
        "Auth Middleware Error:",
        error.message
      );

      return res
        .status(
          401
        )
        .json({
          success:
            false,
          message:
            "Invalid token.",
        });
    }
  };

module.exports =
  authMiddleware;