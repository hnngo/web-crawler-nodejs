const request = require("request");
const cheerio = require("cheerio");

const { mapFunc, trimNewLine, trimWhiteSpaceHeadAndTail } = require("../utils");

module.exports = (app) => {
  app.get("/imdb/:id", function (req, res) {
    const id = req.params.id;
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

        const titleWrapper = $(".title_wrapper").children().first();
        const title = titleWrapper.get(0).children[0].data;
        const release = titleWrapper
          .children()
          .first()
          .children()
          .first()
          .text();
        const length = $(".subtext").children().get(1).children[0].data;
        const genres = $(".subtext").children().get(3).children[0].data;
        const rating =
          $(".ratingValue").children().first().children().first().text() +
          "/10";
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
        res.send(mapFunc(response, trimWhiteSpaceHeadAndTail));
      }
    });

    return;
  });
};
