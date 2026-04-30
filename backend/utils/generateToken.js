const jwt =
  require(
    "jsonwebtoken"
  );

/*
|---------------------------------------------------------
| Generate JWT Token
|---------------------------------------------------------
*/

const generateToken =
  (
    id
  ) => {
    if (
      !process.env
        .JWT_SECRET
    ) {
      throw new Error(
        "JWT_SECRET is missing"
      );
    }

    return jwt.sign(
      {
        id,
      },
      process.env
        .JWT_SECRET,
      {
        expiresIn:
          process.env
            .JWT_EXPIRES_IN ||
          "7d",
      }
    );
  };

module.exports =
  generateToken;