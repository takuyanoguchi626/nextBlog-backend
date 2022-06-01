const router = require("express").Router();
const { mysqlTool, sql } = require("../library/client.js");

router.get("/", async (req, res) => {
  const articleList = await mysqlTool(await sql("SELECT_ARTICLE_LIST"));
  res.json(articleList);
});

module.exports = router;
