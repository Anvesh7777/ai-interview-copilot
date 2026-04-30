const mongoose =
  require(
    "mongoose"
  );

/*
|---------------------------------------------------------
| Connect MongoDB
|---------------------------------------------------------
*/

const connectDB =
  async () => {
    try {
      if (
        !process.env
          .MONGODB_URI
      ) {
        throw new Error(
          "MONGODB_URI is missing"
        );
      }

      const conn =
        await mongoose.connect(
          process.env
            .MONGODB_URI,
          {
            serverSelectionTimeoutMS:
              10000,
            socketTimeoutMS:
              45000,
          }
        );

      console.log(
        `MongoDB Connected: ${conn.connection.host} ✅`
      );

      /*
      |---------------------------------------------
      | Connection Events
      |---------------------------------------------
      */

      mongoose.connection.on(
        "disconnected",
        () => {
          console.log(
            "MongoDB disconnected ⚠️"
          );
        }
      );

      mongoose.connection.on(
        "reconnected",
        () => {
          console.log(
            "MongoDB reconnected 🔄"
          );
        }
      );
    } catch (
      error
    ) {
      console.error(
        "MongoDB connection failed ❌",
        error.message
      );

      process.exit(
        1
      );
    }
  };

module.exports =
  connectDB;