port = 3003;
const express = require("express");
const app = express();
const cors = require("cors");
const flash = require("connect-flash");
const accessControl = require("./library/accessControl.js");

app.use(cors());
app.use(express.json()); // application/json
app.use(express.urlencoded({ extended: true }));
app.use(flash());
app.use(...accessControl.initialize());

app.use("/article", require("./routes/article.js"));
app.use("/user", require("./routes/user.js"));

app.listen(port, () => {
  console.log(`appが起動しました。localhost:${port}`);
});
