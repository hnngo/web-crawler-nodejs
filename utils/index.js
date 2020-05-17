const utilString = require("./string");
const utilResponse = require("./response");
const utilMovie = require("./movieData");
const ultilFindElem = require("./findElem");
const utilFs = require("./fs");

module.exports = {
  ...utilString,
  ...utilResponse,
  ...utilMovie,
  ...ultilFindElem,
  ...utilFs,
};
