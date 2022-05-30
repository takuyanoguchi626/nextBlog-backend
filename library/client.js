const path = require("path");
const util = require("util");
const mysql2 = require("mysql2");
const { query } = require("express");
const pool = mysql2.createPool({
  host: "localhost",
  port: "3306",
  user: "admin",
  password: "admintaku46",
  database: "nextblog_backend",
  connectionLimit: 10,
  queueLimit: 0,
});
const { sql } = require("@garafu/mysql-fileloader")({
  root: path.join(__dirname, "./sql"),
});
const executeQuery = util.promisify(pool.query).bind(pool);
const mysqlTool = async (query, values) => {
  const results = await executeQuery(query, values);
  return results;
};

module.exports = {
  mysqlTool,
  sql,
};
