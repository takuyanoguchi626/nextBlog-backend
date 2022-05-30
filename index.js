port = 3003;
const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());

app.use("/article", require("./routes/article.js"));

app.listen(port, () => {
  console.log(`appが起動しました。localhost:${port}`);
});
