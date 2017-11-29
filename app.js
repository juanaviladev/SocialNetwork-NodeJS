"use strict";

const config = require("./config.js");
const express = require("express");
const path = require("path");



let app = express();
const staticElements = path.join(__dirname, "public");


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(staticElements));



app.get("/", (request, response) => {

    response.status(200);
    response.render("answer/friend_answer_form");

});





app.listen(config.port, err => {
    if (err) {
        console.log("No se ha podido iniciar el servidor.")
        console.log(err);
    } else {
        console.log(`Servidor escuchando en puerto ${config.port}.`);
    }
});