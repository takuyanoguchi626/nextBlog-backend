const router = require("express").Router();
const { authenticate } = require("../library/accessControl.js");

const bcrypt = require("bcrypt");
const { formatRelativeWithOptions } = require("date-fns/fp");
const { mysqlTool } = require("../library/client.js");
const { sql } = require("@garafu/mysql-fileloader");

router.get("/login/success", (req, res) => {
  console.log("成功しました。");
  res.json({
    message: "成功しました。",
  });
});

router.get("/login/failure", (req, res) => {
  console.log("失敗しました。");
  res.json({
    message: "失敗しました。",
  });
});

router.post("/login", authenticate(), async (req, res) => {
  const email = req.body.email;
  let results;
  try {
    results = await mysqlTool(await sql("SELECT_USER_BY_EMAIL"), [email]);
    if (!results) {
      throw new Error("ユーザー情報がありません");
    }
  } catch (error) {
    console.log(error);
  }
  console.log("ssssss" + results);
  res.json({
    name: results[0].name,
  });
});

//会員登録のAPI。使用時にコメントアウトを解除。
// router.use("/registerUser", require("./registerUser.js"));

module.exports = router;
