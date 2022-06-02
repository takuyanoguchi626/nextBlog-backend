const router = require("express").Router();

router.use("/articleDetail", require("./articleDetail.js"));

router.use("/createArticle", require("./createArticle.js"));

router.use("/articleList", require("./articleList.js"));

router.use("/articleDelete", require("./articleDelete.js"));

router.use("/articleEdit", require("./articleEdit.js"));

module.exports = router;
