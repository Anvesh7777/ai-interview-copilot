const Redis =
  require(
    "ioredis"
  );

/*
|---------------------------------------------------------
| Validate Environment
|---------------------------------------------------------
*/

if (
  !process.env
    .REDIS_URL
) {
  throw new Error(
    "REDIS_URL is missing"
  );
}

/*
|---------------------------------------------------------
| Redis Client
|---------------------------------------------------------
*/

const redis =
  new Redis(
    process.env
      .REDIS_URL,
    {
      maxRetriesPerRequest:
        3,

      retryStrategy:
        (
          times
        ) => {
          const delay =
            Math.min(
              times *
                200,
              2000
            );

          console.log(
            `Redis reconnecting in ${delay}ms...`
          );

          return delay;
        },
    }
  );

/*
|---------------------------------------------------------
| Redis Events
|---------------------------------------------------------
*/

redis.on(
  "connect",
  () => {
    console.log(
      "Redis connected ✅"
    );
  }
);

redis.on(
  "ready",
  () => {
    console.log(
      "Redis ready 🚀"
    );
  }
);

redis.on(
  "reconnecting",
  () => {
    console.log(
      "Redis reconnecting 🔄"
    );
  }
);

redis.on(
  "error",
  (
    err
  ) => {
    console.error(
      "Redis Error:",
      err.message
    );
  }
);

module.exports =
  redis;