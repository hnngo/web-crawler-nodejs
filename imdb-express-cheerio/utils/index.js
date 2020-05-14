const utilString = require("./string");
const utilResponse = require("./response");
const utilMovie = require("./movieData");
const findElem = require("./findElem");

module.exports = {
  ...utilString,
  ...utilResponse,
  ...utilMovie,
  ...findElem,
};
