const express = require("express");
const fs = require("fs");
const app = express();

// Routes
const imdbRoutes = require("./routes/imdb");
imdbRoutes(app);

// app.get("/scrape", function (req, res) {
//   // The URL we will scrape from - in our example Anchorman 2.
//   url = "http://www.imdb.com/title/tt1229340/";
//   console.log(`Visiting ${url}...`);

//   request(url, function (error, response, html) {
//     if (!error) {
//       const $ = cheerio.load(html);

//       const titleWrapper = $(".title_wrapper").children().first();
//       const title = titleWrapper.get(0).children[0].data;
//       const release = titleWrapper.children().first().children().first().text();
//       const length = $(".subtext").children().get(1).children[0].data;
//       const genres = $(".subtext").children().get(3).children[0].data;
//       const rating =
//         $(".ratingValue").children().first().children().first().text() + "/10";
//       const posterImage = $(".poster")
//         .children()
//         .first()
//         .children()
//         .first()
//         .attr("src");
//       const summray = $(".summary_text").text();

//       // Format the response
//       const response = {
//         title,
//         release,
//         length: trimNewLine(length),
//         genres,
//         rating,
//         posterImage,
//         summray,
//       };
//       res.send(mapFunc(response, trimWhiteSpaceHeadAndTail));
//     }
//   });

//   return;
// });

const PORT = 8000;
app.listen(PORT, () => console.log("Crawling...."));
