const mariadb = require("mariadb/callback");

function asyncSQL(sql, callback) {
  const conn = mariadb.createConnection({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    port: process.env.dbport,
    database: process.env.database,
    supportBigNumbers: true,
    bigNumberStrings: true,
  });

  conn.query(sql, (err, rows) => {
    callback(err, rows);
    conn.end();
  });
}

module.exports = asyncSQL;
