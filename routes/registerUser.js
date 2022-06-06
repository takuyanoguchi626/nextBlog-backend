const router = require("express").Router();
const { sql } = require("../library/client.js");
const transaction = require("../library/transaction.js");
const bcrypt = require("bcrypt");

router.post("/", async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  let connection;
  console.log(name + email + password);
  try {
    connection = await transaction.beginTransaction();
    const user = await transaction.executeQuery(
      connection,
      await sql("SELECT_USER_BY_EMAIL"),
      [email]
    );
    console.log(user.length);
    if (user.length === 0) {
      const hash_pass = bcrypt.hashSync(password, 10);
      console.log("hash" + hash_pass);
      await transaction.executeQuery(connection, await sql("INSERT_USER"), [
        name,
        email,
        hash_pass,
      ]);
      await transaction.commit(connection);
      res.json({
        message: "成功した。",
      });
    } else {
      throw new Error("既にそのメールアドレスは使われています。");
    }
  } catch (error) {
    await transaction.rollback(connection);
    console.log(error);
    res.json({
      message: "失敗した。",
    });
  } finally {
    connection.release();
  }
});

module.exports = router;
