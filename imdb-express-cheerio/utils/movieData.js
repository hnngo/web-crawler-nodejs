const { trimNewLine, trimWhiteSpaceHeadAndTail } = require("./string");
const { mapFunc } = require("./response");

const getMovieData = ($) => {
  // Check if 404 exist
  if ($(".error_code_404").length > 0) {
    return false;
  }

  const titleWrapper = $(".title_wrapper").children().first();
  const title = titleWrapper.get(0).children[0].data;
  const release = titleWrapper.children().first().children().first().text();
  const length = $(".subtext").children().get(1).children[0].data;
  const genres = $(".subtext").children().get(3).children[0].data;
  const rating =
    $(".ratingValue").children().first().children().first().text() + "/10";
  const posterImage = $(".poster")
    .children()
    .first()
    .children()
    .first()
    .attr("src");
  const summray = $(".summary_text").text();

  // Format the response
  const response = {
    title,
    release,
    length: trimNewLine(length),
    genres,
    rating,
    posterImage,
    summray,
  };
  const formattedResponse = mapFunc(response, trimWhiteSpaceHeadAndTail);

  return formattedResponse;
};

module.exports = { getMovieData };
