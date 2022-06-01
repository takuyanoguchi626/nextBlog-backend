const router = require("express").Router();
const { sql } = require("../library/client.js");
const transaction = require("../library/transaction.js");
const { format } = require("date-fns");

router.post("/", async (req, res) => {
  const formatDate = format(new Date(), "yyyy/MM/dd");
  const body = req.body;
  console.log(req.body);
  let connection;

  try {
    connection = await transaction.beginTransaction();
    const result = await transaction.executeQuery(
      connection,
      await sql("INSERT_INTO_ARTICLE"),
      [body.title, body.summary, body.imgPath, formatDate]
    );
    console.log(result);
    for (const content of body.body) {
      await transaction.executeQuery(
        connection,
        await sql("INSERT_INTO_CONTENT"),
        [
          content.contentTitle,
          content.contentImg,
          content.contentBody,
          content.orderNumber,
          result.insertId,
        ]
      );
    }
    await transaction.commit(connection);
    res.json({
      status: "success",
      message: "記事の投稿に成功しました。",
    });
  } catch (error) {
    console.log("errorに来ました");
    console.log(error);
    await transaction.rollback(connection);
    res.json({
      status: "error",
      message: "記事の投稿に失敗しました。",
    });
  } finally {
    connection.release();
  }
});

router.get("/", (req, res) => {
  try {
    throw new Error();
  } catch (error) {}
  res.json({
    message: "Getで呼ばれました",
  });
});

module.exports = router;
