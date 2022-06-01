const client = require("./client.js");

const beginTransaction = async () => {
  const connection = await client.getConnection();
  connection.beginTransaction();
  return connection;
};

const executeQuery = async (connection, query, values) => {
  return new Promise((resolve, reject) => {
    connection.query(query, values, (err, results) => {
      if (!err) {
        resolve(results);
      } else {
        reject(err);
      }
    });
  });
};

const commit = async (connection) => {
  return new Promise((resolve, reject) => {
    connection.commit((err) => {
      if (!err) {
        resolve(err);
      } else {
        reject(err);
      }
    });
  });
};

const rollback = async (connection) => {
  return new Promise((resolve, reject) => {
    connection.rollback(() => {
      resolve();
    });
  });
};

module.exports = {
  beginTransaction,
  executeQuery,
  commit,
  rollback,
};
