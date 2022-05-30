const router = require("express").Router();
const { mysqlTool, sql } = require("../library/client.js");

router.get("/:articleId", async (req, res) => {
  const articleId = req.params.articleId;
  const results = await mysqlTool(await sql("SELECT_USER_BY_ID"));
  res.json(results);
});

module.exports = router;
