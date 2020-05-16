const express = require("express");
const { Command } = require("commander");

// Init needed app
const app = express();
const program = new Command();

// Routes for imdb
const imdbRoutes = require("./routes/imdb");
imdbRoutes(app);

// Septup command line
program.version("0.0.1");

program
  .option("-d, --debug", "output extra debugging")
  .option("-s, --small", "small pizza size")
  .option("-p, --pizza-type <type>", "flavour of pizza")
  .parse(process.argv);

if (program.debug) {
  console.log("Debug");
} else {
  const PORT = 8000;
  app.listen(PORT, () => console.log(`Crawling on port ${PORT}....`));
}
