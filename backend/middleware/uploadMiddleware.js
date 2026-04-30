const multer =
  require(
    "multer"
  );

const fs =
  require(
    "fs"
  );

const path =
  require(
    "path"
  );

/*
|---------------------------------------------------------
| Ensure Upload Directory Exists
|---------------------------------------------------------
*/

const uploadDir =
  path.join(
    process.cwd(),
    "uploads"
  );

if (
  !fs.existsSync(
    uploadDir
  )
) {
  fs.mkdirSync(
    uploadDir,
    {
      recursive:
        true,
    }
  );
}

/*
|---------------------------------------------------------
| Storage Configuration
|---------------------------------------------------------
*/

const storage =
  multer.diskStorage(
    {
      destination:
        (
          req,
          file,
          cb
        ) => {
          cb(
            null,
            uploadDir
          );
        },

      filename:
        (
          req,
          file,
          cb
        ) => {
          const safeName =
            file.originalname.replace(
              /\s+/g,
              "-"
            );

          cb(
            null,
            `${Date.now()}-${safeName}`
          );
        },
    }
  );

/*
|---------------------------------------------------------
| File Filter
|---------------------------------------------------------
*/

const fileFilter =
  (
    req,
    file,
    cb
  ) => {
    const isPDFMime =
      file.mimetype ===
      "application/pdf";

    const isPDFExt =
      path.extname(
        file.originalname
      ).toLowerCase() ===
      ".pdf";

    if (
      isPDFMime &&
      isPDFExt
    ) {
      return cb(
        null,
        true
      );
    }

    return cb(
      new Error(
        "Only PDF files are allowed"
      ),
      false
    );
  };

/*
|---------------------------------------------------------
| Multer Upload Config
|---------------------------------------------------------
*/

const upload =
  multer({
    storage,
    fileFilter,
    limits:
      {
        fileSize:
          5 *
          1024 *
          1024,
      },
  });

module.exports =
  upload;