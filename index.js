const express = require("express");
const { Command } = require("commander");

const { initCLI, processCLI } = require("./services/cli");

// Init needed app
const app = express();
const program = new Command();

// Routes for imdb
const imdbRoutes = require("./routes/imdb");
imdbRoutes(app);

// Septup CLI
initCLI(program);
const isProcressed = processCLI(program);

// Start the server if user does not choose to crawl by CLI
if (!isProcressed) {
  const PORT = 8000;
  app.listen(PORT, () => console.log(`Crawling on port ${PORT}....`));
}
