const fs = require("fs");
const { getMovieData } = require("../services/movieData");

module.exports = async (app) => {
  // Route crawling by ID
  app.get("/imdb/:ids", async function (req, res) {
    const { out } = req.query;
    let ids = req.params.ids;

    // Check if ids exist
    if (!ids) {
      res.send({});
      return;
    }
    ids = ids.split("-");

    const response = await getMovieData({ ids });

    // Check if need to write to file
    out &&
      out.toLowerCase() === "true" &&
      fs.writeFile("./output.json", JSON.stringify(response), (err) => {
        console.log(err);
      });

    res.send(response);
    return;
  });

  // Route crawling by lists
  app.get("/imdb/l/:ids", async function (req, res) {
    const { out } = req.query;
    let ids = req.params.ids;

    // Check if ids exist
    if (!ids) {
      res.send({});
      return;
    }
    ids = ids.split("-");

    const response = await getMovieData({ ids, isById: false });

    // Check if need to write to file
    out &&
      out.toLowerCase() === "true" &&
      fs.writeFile("./output.json", JSON.stringify(response), (err) => {
        console.log(err);
      });

    res.send(response);
    return;
  });
};
