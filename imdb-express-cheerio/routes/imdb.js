const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");

const { getMovieData, createObj } = require("../utils");

module.exports = (app) => {
  app.get("/imdb/:ids", function (req, res) {
    let ids = req.params.ids;
    const { out } = req.query;
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
};
