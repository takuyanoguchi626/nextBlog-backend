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
    console.log("length" + user.length);
    if (user.length === 0) {
      bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(password, salt, async function (err, hash) {
          console.log("hhhhhhh" + hash);
          await transaction.executeQuery(connection, await sql("INSERT_USER"), [
            name,
            email,
            hash,
          ]);
        });
      });
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
