const router = require("express").Router();
const { authenticate } = require("../library/accessControl.js");
const { mysqlTool } = require("../library/client.js");
const { sql } = require("@garafu/mysql-fileloader");

router.get("/login/failure", (req, res) => {
  console.log("ログインに失敗しました。");
  res.json({
    message: "メールアドレスまたはパスワードが間違っています。",
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
  res.json({
    name: results[0].name,
  });
});

// 会員登録のAPI。使用時にコメントアウトを解除。
router.use("/registerUser", require("./registerUser.js"));

module.exports = router;
