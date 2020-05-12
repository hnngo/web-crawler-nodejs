const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");

const { mapFunc, trimNewLine, trimWhiteSpaceHeadAndTail } = require("../utils");

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

        // Check if 404 exist
        if($('.error_code_404').length > 0) {
          res.send('Please check again your movie id');
          return;
        }
        

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
        const formattedResponse = mapFunc(response, trimWhiteSpaceHeadAndTail);

        // Check if need to write to file
        out &&
          out.toLowerCase() === "true" &&
          fs.writeFile(
            "./output.json",
            JSON.stringify(formattedResponse),
            (err) => {
              console.log(err);
            }
          );

        // Send back to user
        res.send(formattedResponse);
      } else {
        res.send({});
      }
    });

    return;
  });
};
