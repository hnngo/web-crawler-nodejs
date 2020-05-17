const { writeJsonToFile, getMovieData } = require("../utils");

// Setup CLI
const initCLI = (program) => {
  program.version("0.0.1");
  program
    .option("-imdb, --imdb", "select imdb project")
    .option(
      "-i, --id <id>",
      "id of move or list of ids of movie delimeter by -"
    )
    .option(
      "-l, --list <id>",
      "id of list or list of ids of list delimeter by -"
    )
    .option("-o, --out <name>", "output the result as <name>.json")
    .parse(process.argv);
};

// Process CLI
const processCLI = (program) => {
  // Crawl imdb project with CLI
  if (program.imdb) {
    const outputName = program.out;

    if (program.id) {
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
    return true;
  }

  return false;
};

module.exports = {
  initCLI,
  processCLI,
};
