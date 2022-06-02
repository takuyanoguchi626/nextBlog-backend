const router = require("express").Router();
const { authenticate } = require("../library/accessControl.js");

const bcrypt = require("bcrypt");

// router.get("/", (req, res) => {
//   const pass = "taku";
//   const hash_pass = bcrypt.hashSync(pass, 10);
//   console.log(hash_pass);
//   console.log(bcrypt.compareSync("taku", hash_pass));
//   console.log(bcrypt.compareSync("fake_hoge", hash_pass));
// });

router.get("/login/success", (req, res) => {
  console.log("成功しました。");
  res.json({
    message: "成功",
  });
});

router.get("/login/failure", (req, res) => {
  console.log("失敗しました。");
  res.json({
    message: req.flash("message"),
  });
});

router.post("/login", authenticate());

module.exports = router;
