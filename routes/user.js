const router = require("express").Router();

const bcrypt = require("bcrypt");

router.get("/", (req, res) => {
  const pass = "taku";
  const hash_pass = bcrypt.hashSync(pass, 10);
  console.log(hash_pass);
  console.log(bcrypt.compareSync("taku", hash_pass));
  console.log(bcrypt.compareSync("fake_hoge", hash_pass));
});

router.post("/login");

module.exports = router;
