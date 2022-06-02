const router = require("express").Router();
const { sql } = require("@garafu/mysql-fileloader");
const transaction = require("../library/transaction.js");

router.delete("/:articleId", async (req, res) => {
  const articleId = req.params.articleId;
  let connection;

  try {
    connection = await transaction.beginTransaction();
    const result = await transaction.executeQuery(connection, await sql(""), [
      articleId,
    ]);
    const result2 = await transaction.executeQuery(connection, await sql(""), [
      articleId,
    ]);
    await transaction.commit(connection);
  } catch (error) {
    await transaction.rollback(connection);
  } finally {
    connection.release();
  }
});
