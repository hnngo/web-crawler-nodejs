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

  const genres = [];
  $(".subtext")
    .children()
    .filter("a")
    .each((index, elem) => {
      const { href } = elem.attribs;
      console.log(elem);
      if (!!href && href.includes("genre")) {
        genres.push(elem.children[0].data);
      }
    });

  // For cases when movie has unknown length
  const lengthElem = $(".subtext").children().get(1);
  const length = lengthElem.name === "time" ? lengthElem.children[0].data : "";

  // For cases when movie not yet release
  let rating = $(".ratingValue").children().first().children().first().text();
  rating = rating ? rating + "/10" : "";

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
    rating,
    posterImage,
    summray,
  };
  const formattedResponse = mapFunc(response, trimWhiteSpaceHeadAndTail);

  return { ...formattedResponse, genres };
};

module.exports = { getMovieData };
