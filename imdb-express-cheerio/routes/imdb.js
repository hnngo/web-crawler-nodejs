const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");

const { getMovieData } = require("../utils");

module.exports = (app) => {
  app.get("/imdb/:id", function (req, res) {
    const id = req.params.id;
    const { out } = req.query;
    if (!id) {
      res.send({});
      return;
    }

    // Prepare URL
    url = `http://www.imdb.com/title/${id}`;
    console.log(`Visiting ${url}...`);

    request(url, function (error, response, html) {
      if (!error) {
        // Load html to $ using cheerio
        const $ = cheerio.load(html);

        // Get all needed movie data
        const response = getMovieData($);

        // Check if 404 exist
        if (!response) {
          res.send("Please check again your movie id");
          return;
        }

        // Check if need to write to file
        out &&
          out.toLowerCase() === "true" &&
          fs.writeFile("./output.json", JSON.stringify(response), (err) => {
            console.log(err);
          });

        // Send back to user
        res.send(response);
      } else {
        res.send({});
      }
    });

    return;
  });
};
