const {
  trimNewLine,
  trimWhiteSpaceHeadAndTail,
  trimParenthesis,
  trimWhiteSpace,
} = require("./string");
const { findClassname, findName } = require("./findElem");
const { mapFunc } = require("./response");

// Util for geting movie data from id detail page
const getMovieData = ($) => {
  // Check if 404 exist
  if ($(".error_code_404").length > 0) {
    return false;
  }

  const titleWrapper = $(".title_wrapper").children().first();
  const title = titleWrapper.get(0).children[0].data;
  const release = titleWrapper.children().first().children().first().text();

  // Get all genres
  const genres = [];
  $(".subtext")
    .children()
    .filter("a")
    .each((index, elem) => {
      const { href } = elem.attribs;

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

const getMovieDataFromList = ($) => {
  const res = {};
  const listOfMovies = $(".lister-item");

  listOfMovies.each((index, elem) => {
    const content = elem.children.find((e) =>
      findClassname(e, "lister-item-content")
    );
    const header = content.children.find((e) =>
      findClassname(e, "lister-item-header")
    );
    const title = header.children.find((e) => findName(e, "a")).children[0]
      .data;

    // For case unknown release year
    let releaseYear = header.children.find((e) =>
      findClassname(e, "lister-item-year")
    ).children[0];
    releaseYear = releaseYear ? trimParenthesis(releaseYear.data) : "";

    // Genre
    const genre = trimWhiteSpace(
      trimNewLine($(".genre").get(index).children[0].data)
    ).split(",");

    // Length
    let length = $(".genre")
      .get(index)
      .parent.childNodes.find((e) => findClassname(e, "runtime"));
    length = length ? length.children[0].data : "";

    // Rating
    let rating = "";
    const ratingElem = content.childNodes.find((e) =>
      findClassname(e, "ipl-rating-widget")
    );
    if (ratingElem) {
      rating = ratingElem.childNodes
        .find((e) => findClassname(e, "ipl-rating-star"))
        .childNodes.find((e) => findClassname(e, "ipl-rating-star__rating"))
        .children[0].data;
    }

    // Summary
    let summary = content.childNodes.find(
      (e) =>
        findName(e, "p") &&
        e.children[0].type === "text" &&
        e.children[0].data.length > 40
    );
    summary = summary
      ? trimWhiteSpaceHeadAndTail(trimNewLine(summary.children[0].data))
      : "";

    // Poster
    const poster = $(".lister-item-image")
      .get(index)
      .childNodes.find((e) => findName(e, "a"))
      .childNodes.find((e) => findName(e, "img")).attribs.loadlate;

    // Movie id
    const id = $(".lister-item-image").get(index).attribs["data-tconst"];

    res[id] = {
      title,
      releaseYear,
      genre,
      length,
      rating,
      summary,
      poster,
    };
  });

  return res;
};

module.exports = { getMovieData, getMovieDataFromList };
