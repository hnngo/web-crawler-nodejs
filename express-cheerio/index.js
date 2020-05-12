const express = require("express");
var fs = require("fs");
var request = require("request");
var cheerio = require("cheerio");

const app = express();

app.get("/scrape", function (req, res) {
  res.send("Hello world");
});

const PORT = 8000;
app.listen(PORT, () => console.log("Crawling...."));
