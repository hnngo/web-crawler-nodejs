const utilString = require("./string");
const utilResponse = require("./response");
const utilMovie = require("./movieData");

module.exports = { ...utilString, ...utilResponse, ...utilMovie };
