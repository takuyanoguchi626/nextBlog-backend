const router = require("express").Router();
const { header } = require("express/lib/response");
const { mysqlTool, sql } = require("../library/client.js");

router.post("/", async (req, res) => {
  header("Access-Control-Allow-Origin: *");
  const nowDate = new Date();
  const body = req.body;
  const result = await mysqlTool(await sql("INSERT_INTO_ARTICLE"), [
    body.title,
    body.summary,
    body.imgPath,
    nowDate,
  ]);
  const result2 = await mysqlTool(await sql("INSERT_INTO_CONTENT"), [
    body.body.contentTitle,
    body.body.contentImg,
    body.body.contentBody,
  ]);
  console.log(result);
  console.log(result2);
  if (result && result2) {
    res.json({
      message: "記事を投稿しました。",
    });
  } else {
    res.json({
      message: "記事の投稿に失敗しました。",
    });
  }
});

router.get("/", (req, res) => {
  res.json({
    message: "kdkdkdkdkdkk",
  });
});

module.exports = router;
