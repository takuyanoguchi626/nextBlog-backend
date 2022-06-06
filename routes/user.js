const router = require("express").Router();
const { authenticate } = require("../library/accessControl.js");

const bcrypt = require("bcrypt");

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

router.post("/login", authenticate());

//会員登録のAPI。使用時にコメントアウトを解除。
// router.use("/registerUser", require("./registerUser.js"));

module.exports = router;
