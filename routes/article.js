const router = require("express").Router();

router.use("/articleDetail", require("./articleDetail.js"));

router.use("/createArticle", require("./createArticle.js"));

router.use("/articleList", require("./articleList.js"));

module.exports = router;
