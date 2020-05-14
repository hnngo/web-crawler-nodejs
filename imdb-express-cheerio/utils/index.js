const utilString = require("./string");
const utilResponse = require("./response");
const utilMovie = require("./movieData");
const utilFindClassname = require("./findClassname");

module.exports = {
  ...utilString,
  ...utilResponse,
  ...utilMovie,
  ...utilFindClassname,
};
