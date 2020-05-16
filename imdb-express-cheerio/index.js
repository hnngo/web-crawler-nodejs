const express = require("express");
const fs = require("fs");
const app = express();

// Routes for imdb
const imdbRoutes = require("./routes/imdb");
imdbRoutes(app);

const PORT = 8000;
app.listen(PORT, () => console.log(`Crawling on port ${PORT}....`));
