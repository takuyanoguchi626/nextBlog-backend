port = 3000;
const express = require("express");
const app = express();

app.use("/article", require("./routes/article.js"));
