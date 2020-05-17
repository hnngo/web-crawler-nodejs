const { writeJsonToFile } = require("../utils");
const { getMovieData, retriveIdFromPath } = require("./movieData");

// Setup CLI
const initCLI = (program) => {
  program.version("0.0.1");
  program
    .option(
      "-p, --project <project>",
      "select a specific project. Example -p imdb"
    )
    .option("-u, --url <url>", "url to the crawling site")
    .option(
      "-i, --id <id>",
      "id of movie or list of ids of movie separate by -"
    )
    .option(
      "-l, --list <id>",
      "id of list or list of ids of list separate by -"
    )
    .option("-o, --out <name>", "output the result as <name>.json")
    .parse(process.argv);
};

// Process CLI
const processCLI = (program) => {
  let status = false;

  // Crawl imdb project with CLI
  switch (program.project) {
    case "imdb": {
      const outputName = program.out;

      if (program.url) {
        status = true;
        const { ids, isById } = retriveIdFromPath(program.url);
        getMovieData({ ids, isById }).then((res) =>
          outputName ? writeJsonToFile(res, outputName) : console.log(res)
        );
      } else if (program.id) {
        status = true;
        const ids = program.id.split("-");
        getMovieData({ ids }).then((res) =>
          outputName ? writeJsonToFile(res, outputName) : console.log(res)
        );
      } else if (program.list) {
        const ids = program.list.split("-");
        getMovieData({ ids, isById: false }).then((res) =>
          outputName ? writeJsonToFile(res, outputName) : console.log(res)
        );
      }

      break;
    }
    default:
      if (program.id || program.list || program.path || program.out) {
        status = true;
        console.log(
          "Please indicate a specific project by adding -p [project name]"
        );
      }
      break;
  }

  return status;
};

module.exports = {
  initCLI,
  processCLI,
};
