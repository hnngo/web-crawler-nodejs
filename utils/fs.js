const fs = require("fs");

const writeJsonToFile = (jsonContent, name = "output") => {
  fs.writeFile(`./${name}.json`, JSON.stringify(jsonContent), (err) => {
    console.log(err);
  });
};

module.exports = {
  writeJsonToFile,
};
