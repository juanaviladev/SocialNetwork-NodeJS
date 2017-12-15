const multer = require("multer");
const path = require("path");
const multerFactory = multer({dest: path.join(__dirname, "../uploads")});



module.exports = {
    middlewareMulter: multerFactory
};