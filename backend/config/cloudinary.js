const cloudinary =
  require(
    "cloudinary"
  ).v2;

/*
|---------------------------------------------------------
| Validate Environment Variables
|---------------------------------------------------------
*/

const requiredEnv =
  [
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
  ];

requiredEnv.forEach(
  (
    key
  ) => {
    if (
      !process.env[
        key
      ]
    ) {
      throw new Error(
        `Missing Cloudinary env: ${key}`
      );
    }
  }
);

/*
|---------------------------------------------------------
| Cloudinary Config
|---------------------------------------------------------
*/

cloudinary.config(
  {
    cloud_name:
      process.env
        .CLOUDINARY_CLOUD_NAME,

    api_key:
      process.env
        .CLOUDINARY_API_KEY,

    api_secret:
      process.env
        .CLOUDINARY_API_SECRET,
  }
);

console.log(
  "Cloudinary configured ✅"
);

module.exports =
  cloudinary;