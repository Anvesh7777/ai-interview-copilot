const chunkText =
  (
    text,
    chunkSize = 700,
    overlap = 150
  ) => {
    if (
      !text ||
      typeof text !==
        "string"
    ) {
      return [];
    }

    const cleanedText =
      text
        .replace(
          /\s+/g,
          " "
        )
        .trim();

    const chunks =
      [];

    let start =
      0;

    while (
      start <
      cleanedText.length
    ) {
      let end =
        start +
        chunkSize;

      /*
      |---------------------------------------------
      | Try to end at sentence boundary
      |---------------------------------------------
      */

      if (
        end <
        cleanedText.length
      ) {
        const nextPeriod =
          cleanedText.indexOf(
            ".",
            end
          );

        if (
          nextPeriod !==
          -1
        ) {
          end =
            nextPeriod +
            1;
        }
      }

      const chunk =
        cleanedText
          .slice(
            start,
            end
          )
          .trim();

      if (
        chunk.length >
        0
      ) {
        chunks.push(
          chunk
        );
      }

      start =
        end -
        overlap;

      if (
        start < 0
      ) {
        start = 0;
      }
    }

    return chunks;
  };

module.exports =
  chunkText;