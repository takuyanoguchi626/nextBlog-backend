const router = require("express").Router();
const { sql } = require("../library/client.js");
const transaction = require("../library/transaction.js");

router.post("/", async (req, res) => {
  const nowDate = new Date();
  const body = req.body;
  console.log(req.body);
  let connection;

  try {
    connection = await transaction.beginTransaction();
    const result = await transaction.executeQuery(
      connection,
      await sql("INSERT_INTO_ARTICLE"),
      [body.title, body.summary, body.imgPath, nowDate]
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

// const router = require("express").Router();
// const { mysqlTool, sql } = require("../library/client.js");

// router.post("/", async (req, res) => {
//   const nowDate = new Date();
//   const body = req.body;
//   console.log(req.body);
//   const result = await mysqlTool(await sql("INSERT_INTO_ARTICLE"), [
//     body.title,
//     body.summary,
//     body.imgPath,
//     nowDate,
//   ]);
//   const result2 = await mysqlTool(await sql("INSERT_INTO_CONTENT"), [
//     body.body.contentTitle,
//     body.body.contentImg,
//     body.body.contentBody,
//     body.body.orderNumber,
//   ]);
//   console.log(result);
//   console.log(result2);
//   if (result) {
//     res.json({
//       message: "記事を投稿しました。",
//     });
//   } else {
//     res.json({
//       message: "記事の投稿に失敗しました。",
//     });
//   }
// });

// router.get("/", (req, res) => {
//   res.json({
//     message: "kdkdkdkdkdkk",
//   });
// });

// module.exports = router;
