const mysql = require("mysql");
const config = require("./../config.js");
// create pool of connections
let pool = mysql.createPool({
    database: config.database,
    host: config.host,
    user: config.user,
    password: config.password
});

module.exports = {
  pool : pool
};