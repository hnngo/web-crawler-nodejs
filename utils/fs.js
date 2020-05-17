const fs = require("fs");

const writeJsonToFile = (jsonContent, name = "output") => {
  fs.writeFile(`./${name}.json`, JSON.stringify(jsonContent), () => {});
};

module.exports = {
  writeJsonToFile,
};
