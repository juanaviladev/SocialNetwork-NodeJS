const session = require("express-session");
const mysqlSession = require("express-mysql-session");
const MysqlStore = mysqlSession(session);
const config = require("./../config.js");
const multer = require("multer");
const path = require("path");

const sessionStore = new MysqlStore({
    host: config.host,
    database: config.database,
    user: config.user,
    password: config.password
});

const middlewareSession = session({
    saveUninitialized: false,
    resave: false,
    secret: "Secret string",
    store: sessionStore
});

const multerFactory = multer({dest: path.join(__dirname, "../uploads")});


module.exports = {
    middleware: middlewareSession,
    store : sessionStore,
    middlewareMulter: multerFactory
};