const request = require("request");
const cheerio = require("cheerio");
const {
  trimNewLine,
  trimWhiteSpaceHeadAndTail,
  trimParenthesis,
  trimWhiteSpace,
  findClassname,
  findName,
  mapFunc,
  createObj,
} = require("../utils");

const getMovieData = ({ ids, isById = true }) => {
  const promises = [];
  ids.forEach((id, index) => {
    // Prepare URL
    url = isById
      ? `http://www.imdb.com/title/${id}`
      : `http://www.imdb.com/list/${id}`;
    console.log(`Visiting ${url}...`);

    promises[index] = new Promise((resolve) => {
      request(url, function (error, _, html) {
        if (!error) {
          // Load html to $ using cheerio
          const $ = cheerio.load(html);

          // Get all needed movie data
          const response = isById ? getMovieDataById($) : getMovieDataByList($);

          // Check if error exist
          !!response ? resolve(response) : resolve("Fail to load");
        } else {
          resolve("Fail to load");
        }
      });
    });
  });

  return Promise.all(promises).then((value) => {
    console.log(`Done crawling ${url}...`);
    const response = createObj(ids, value);
    return response;
  });
};

// Util for geting movie data from id detail page
const getMovieDataById = ($) => {
  // Check if 404 exist
  if ($(".error_code_404").length > 0) {
    return false;
  }

  const titleWrapper = $(".title_wrapper").children().first();
  const title = titleWrapper.get(0).children[0].data;
  const release = titleWrapper.children().first().children().first().text();

  // Genres
  const genres = [];
  $(".subtext")
    .children()
    .filter("a")
    .each((_, elem) => {
      const { href } = elem.attribs;

      if (!!href && href.includes("genre")) {
        genres.push(elem.children[0].data);
      }
    });

  // Length
  const lengthElem = $(".subtext")
    .children()
    .get()
    .find((e) => findName(e, "time"));
  const length = lengthElem ? lengthElem.children[0].data : "";

  // Year Release
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

const getMovieDataByList = ($) => {
  // Check if 404 exist
  if ($(".error_code_404").length || $("#unavailable").length) {
    return false;
  }

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
    let genre = [];
    let genreElem = content.childNodes
      .find((e) => findName(e, "p"))
      .childNodes.find((e) => findClassname(e, "genre"));
    if (!!genreElem) {
      genre = trimWhiteSpace(trimNewLine(genreElem.children[0].data)).split(
        ","
      );
    }

    // Length
    let length = "";
    let lengthElem = content.childNodes
      .find((e) => findName(e, "p"))
      .childNodes.find((e) => findClassname(e, "runtime"));
    if (!!lengthElem) {
      length = lengthElem.children[0].data;
    }

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

// Retrieve id or list from path
const retriveIdFromPath = (path) => {
  const pathArr = path.split("/");
  let ids;
  let isById = true;
  if (pathArr.includes("www.imdb.com")) {
    const titleIndex = pathArr.indexOf("title");
    const listIndex = pathArr.indexOf("list");

    if (titleIndex >= 0) {
      ids = pathArr[titleIndex + 1];
    } else if (listIndex >= 0) {
      ids = pathArr[listIndex + 1];
      isById = false;
    }
  }

  return { ids: ids.split("-"), isById };
};

module.exports = {
  getMovieData,
  getMovieDataById,
  getMovieDataByList,
  retriveIdFromPath,
};
