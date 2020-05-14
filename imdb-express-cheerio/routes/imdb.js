const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");

const { getMovieData, getMovieDataFromList, createObj } = require("../utils");

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
            const response = getMovieDataFromList($);

            // Check if error exist
            // !!response ? resolve(response) : resolve("Fail to load");
            resolve(response);
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
