"use strict";

const config = require("./config");
const express = require("express");
const path = require("path");
const mysql = require("mysql");
const DAO_users = require("./DAO_users");
const moment = require("moment");
const bodyParser = require("body-parser");

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
app.use(bodyParser.urlencoded({extended: false }));






app.get("/login", (request, response) => {

    response.render("authentication/login");

});


app.get("/register", (request, response) => {

    response.render("authentication/register")

});



app.post("/register", (request, response) => {


    let user = {
        email: request.body.email,
        pass: request.body.password,
        name: request.body.name,
        gender: request.body.gender,
        dob: request.body.dob ? request.body.dob : null,
        image: request.body.imagen ? request.body.imagen : null
    };

    daoU.insertUserDetails(user, err => {

        if(err)
            console.log(err);
        else
            response.redirect("login");

    });

});



app.get("/profile", (request, response) => {

    let user;

    daoU.getUserDetails("pawelchr@ucm.es", (err, result) => {

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


    daoU.getProfileImage("pawelchr@ucm.es", (err, userImage) => {

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