const express = require("express");
const { Command } = require("commander");

const { getMovieData } = require("./utils");

// Init needed app
const app = express();
const program = new Command();

// Routes for imdb
const imdbRoutes = require("./routes/imdb");
imdbRoutes(app);

// Septup command line
program.version("0.0.1");
program
  .option("-i, --id <id>", "id of move or list of ids of movie delimeter by -")
  .option("-l, --list <id>", "id of list or list of ids of list delimeter by -")
  .option("-o, --out <name>", "output the result")
  .parse(process.argv);

if (program.id) {
  // Crawl with CLI
  const ids = program.id.split("-");

  getMovieData({ ids }).then(console.log);
} else {
  // Crawl with UI
  const PORT = 8000;
  app.listen(PORT, () => console.log(`Crawling on port ${PORT}....`));
}
