const router = require("express").Router();

router.use("/articleDetail", require("./articleDetail.js"));

module.exports = router;
