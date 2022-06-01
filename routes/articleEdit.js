const router = require("express").Router();
const { sql } = require("../library/client.js");
const transaction = require("../library/transaction.js");
const { format } = require("date-fns");

router.post("/", async (req, res) => {
  const formatDate = format(new Date(), "yyyy/MM/dd");
  //   const articleId = req.params.articleId;
  const body = req.body;
  console.log(body);
  const contentCount = body.body.length;
  let connection;
  try {
    connection = await transaction.beginTransaction();
    const result = await transaction.executeQuery(
      connection,
      await sql("UPDATE_ARTICLE"),
      [body.title, body.summary, body.imgPath, formatDate, body.articleId]
    );
    console.log(result);
    await transaction.executeQuery(
      connection,
      await sql("DELETE_CONTENT_BY_ORDER_NUMBER"),
      [contentCount, body.articleId]
    );
    const result2 = await transaction.executeQuery(
      connection,
      await sql("SELECT_COUNT_CONTENT_BY_ARTICLE_ID"),
      [body.articleId]
    );
    console.log(Object.values(result2[0])[0]);
    const contentCountByDb = Object.values(result2[0])[0];
    for (const content of body.body) {
      if (content.orderNumber <= contentCountByDb) {
        await transaction.executeQuery(
          connection,
          await sql("UPDATE_CONTENT"),
          [
            content.contentTitle,
            content.contentImg,
            content.contentBody,
            content.orderNumber,
            body.articleId,
          ]
        );
      } else {
        await transaction.executeQuery(
          connection,
          await sql("INSERT_INTO_CONTENT"),
          [
            content.contentTitle,
            content.contentImg,
            content.contentBody,
            content.orderNumber,
            body.articleId,
          ]
        );
      }
    }
    await transaction.commit(connection);
  } catch (error) {
    await transaction.rollback(connection);
    console.log(error);
  } finally {
    connection.release();
  }
});

module.exports = router;
