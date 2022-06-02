const router = require("express").Router();
const { sql } = require("@garafu/mysql-fileloader");
const transaction = require("../library/transaction.js");

router.delete("/:articleId", async (req, res) => {
  const articleId = req.params.articleId;
  let connection;

  try {
    connection = await transaction.beginTransaction();
    await transaction.executeQuery(connection, await sql("DELETE_ARTICLE"), [
      articleId,
    ]);
    await transaction.executeQuery(connection, await sql("DELETE_CONTENT"), [
      articleId,
    ]);
    await transaction.commit(connection);
    res.json({
      status: "success",
      message: "記事の削除に成功しました。",
    });
  } catch (error) {
    await transaction.rollback(connection);
    res.json({
      status: "success",
      message: "記事の削除に失敗しました。",
    });
  } finally {
    connection.release();
  }
});

module.exports = router;
