const router = require("express").Router();
const { sql } = require("../library/client.js");
const transaction = require("../library/transaction.js");

router.get("/:articleId", async (req, res, next) => {
  const articleId = req.params.articleId;
  let connection;
  let article;
  let content;

  try {
    connection = await transaction.beginTransaction();
    article = await transaction.executeQuery(
      connection,
      await sql("SELECT_ARTICLE_BY_ID"),
      [articleId]
    );
    content = await transaction.executeQuery(
      connection,
      await sql("SELECT_CONTENT_BY_ID"),
      [articleId]
    );
    console.log(article);
    console.log(content);
    article[0].body = content;
    await transaction.commit(connection);
  } catch (error) {
    await transaction.rollback(connection);
  } finally {
    connection.release();
  }

  res.json(article[0]);
});

module.exports = router;
