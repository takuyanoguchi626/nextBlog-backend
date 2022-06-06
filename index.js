port = 3003;
const express = require("express");
const app = express();
const cors = require("cors");
const flash = require("connect-flash");
const accessControl = require("./library/accessControl.js");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const mysql2 = require("mysql2/promise");

//mysql2の場合のsessionID
const options = {
  host: "localhost",
  port: "3306",
  user: "admin",
  password: "admintaku46",
  database: "nextblog_backend",
};
const connection = mysql2.createPool(options);
const sessionStore = new MySQLStore({}, connection);
app.use(
  session({
    store: sessionStore,
    secret: "YOUR_SESSION_SECRET_STRING",
    resave: false,
    saveUninitialized: true,
    name: "sid",
  })
);

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
