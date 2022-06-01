const router = require("express").Router();
const { sql } = require("../library/client.js");
const transaction = require("../library/transaction.js");
const { format } = require("date-fns");

router.post("/", async (req, res) => {
  const formatDate = format(new Date(), "yyyy/MM/dd");
  const body = req.body;
  const contentCount = body.body.length;
  let connection;
  try {
    connection = await transaction.beginTransaction();
    await transaction.executeQuery(connection, await sql("UPDATE_ARTICLE"), [
      body.title,
      body.summary,
      body.imgPath,
      formatDate,
      body.articleId,
    ]);
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
    res.json({
      status: "success",
      message: "記事の編集に成功しました。",
    });
  } catch (error) {
    await transaction.rollback(connection);
    console.log(error);
    res.json({
      status: "success",
      message: "記事の編集に失敗しました。",
    });
  } finally {
    connection.release();
  }
});

module.exports = router;
