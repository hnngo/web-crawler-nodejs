const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");

const {
  getMovieData,
  createObj,
  trimParenthesis,
  trimWhiteSpace,
  trimNewLine,
  findClassname,
  findName,
  trimWhiteSpaceHeadAndTail,
} = require("../utils");

module.exports = (app) => {
  // Route crawling by ID
  app.get("/imdb/:ids", function (req, res) {
    const { out } = req.query;
    let ids = req.params.ids;

    // Check if ids exist
    if (!ids) {
      res.send({});
      return;
    }
    ids = ids.split("-");

    const promises = [];
    ids.forEach((id, index) => {
      // Prepare URL
      url = `http://www.imdb.com/title/${id}`;
      console.log(`Visiting ${url}...`);

      promises[index] = new Promise((resolve) => {
        request(url, function (error, response, html) {
          if (!error) {
            // Load html to $ using cheerio
            const $ = cheerio.load(html);

            // Get all needed movie data
            const response = getMovieData($);

            // Check if error exist
            !!response ? resolve(response) : resolve("Fail to load");
          } else {
            resolve("Fail to load");
          }
        });
      });
    });

    Promise.all(promises).then((value) => {
      const response = createObj(ids, value);
      res.send(response);

      // Check if need to write to file
      out &&
        out.toLowerCase() === "true" &&
        fs.writeFile("./output.json", JSON.stringify(response), (err) => {
          console.log(err);
        });
    });

    return;
  });

  // Route crawling by lists
  app.get("/imdb/l/:ids", function (req, res) {
    const { out } = req.query;
    let ids = req.params.ids;

    // Check if ids exist
    if (!ids) {
      res.send({});
      return;
    }
    ids = ids.split("-");

    const promises = [];
    ids.forEach((id, index) => {
      // Prepare URL
      url = `http://www.imdb.com/list/${id}`;
      console.log(`Visiting ${url}...`);

      promises[index] = new Promise((resolve) => {
        request(url, function (error, response, html) {
          if (!error) {
            // Load html to $ using cheerio
            const $ = cheerio.load(html);

            // Get all needed movie data
            // const response = getMovieData($);
            const listOfMovies = $(".lister-item");

            listOfMovies.each((index, elem) => {
              const content = elem.children.find((e) =>
                findClassname(e, "lister-item-content")
              );
              const header = content.children.find((e) =>
                findClassname(e, "lister-item-header")
              );
              const title = header.children.find((e) => findName(e, "a"))
                .children[0].data;

              // For case unknown release year
              let releaseYear = header.children.find((e) =>
                findClassname(e, "lister-item-year")
              ).children[0];
              releaseYear = releaseYear
                ? trimParenthesis(releaseYear.data)
                : "";

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
                  .childNodes.find((e) =>
                    findClassname(e, "ipl-rating-star__rating")
                  ).children[0].data;
              }

              // Summary
              let summary = content.childNodes.find(
                (e) =>
                  findName(e, "p") &&
                  e.children[0].type === "text" &&
                  e.children[0].data.length > 40
              );
              summary = summary
                ? trimWhiteSpaceHeadAndTail(
                    trimNewLine(summary.children[0].data)
                  )
                : "";

              // Poster
              const poster = $(".lister-item-image")
                .get(index)
                .childNodes.find((e) => findName(e, "a"))
                .childNodes.find((e) => findName(e, "img")).attribs.loadlate;
            });

            // Check if error exist
            // !!response ? resolve(response) : resolve("Fail to load");
            resolve({ a: "" });
          } else {
            resolve("Fail to load");
          }
        });
      });
    });

    Promise.all(promises).then((value) => {
      const response = createObj(ids, value);
      res.send(response);

      // Check if need to write to file
      out &&
        out.toLowerCase() === "true" &&
        fs.writeFile("./output.json", JSON.stringify(response), (err) => {
          console.log(err);
        });
    });

    return;
    return;
  });
};
