"use strict";

const config = require("./config");
const express = require("express");
const path = require("path");
const mysql = require("mysql");
const DAO_users = require("./DAO_users");
const moment = require("moment");

// create pool of connections
let pool = mysql.createPool({
    database: config.database,
    host: config.host,
    user: config.user,
    password: config.password
});

let daoU = new DAO_users.DaoUsers(pool);

// create express app
let app = express();

// set folder for static elements
const staticElements = path.join(__dirname, "public");

// set ejs engine and views folder
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));




// use middleware ---------------------------------------
app.use(express.static(staticElements));



app.get("/", (request, response) => {

    let user;

    daoU.getUserDetails(1, (err, result) => {

        if(err)
            console.log(err);
        else {



            user = {
                name: result[0].name,
                age: moment().diff(result[0].dob, 'years'),
                gender: result[0].gender,
                points: result[0].points,
                image: result[0].image
            };


            response.status(200);
            response.render("profile/profile", user = user);

        }

    });


});


app.get("/prof_image", (request, response) => {


    daoU.getProfileImage(1, (err, userImage) => {

        if(err)
            console.log(err)
        else if(userImage)
        {
            response.sendFile(path.join(__dirname, "avatar_imgs", userImage));
        }
        else
            response.sendFile(path.join(__dirname, "public", "img", "NoProfile.png"));

    });


});





app.listen(config.port, err => {
    if (err) {
        console.log("No se ha podido iniciar el servidor.")
        console.log(err);
    } else {
        console.log(`Servidor escuchando en puerto ${config.port}.`);
    }
});