"use strict";

const config = require("./config");
const express = require("express");
const path = require("path");
const mysql = require("mysql");
const DAO_users = require("./DAO_users");
const moment = require("moment");
const bodyParser = require("body-parser");
const session = require("express-session");
const mysqlSession = require("express-mysql-session");



const MysqlStore = mysqlSession(session);
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
app.use(middlewareSession);


function middlewareAuthentication(request, response, next){

    let user = request.session.currentUser;

    if(user)
    {
        response.locals.currentUser = user;
        next();
    }
    else
        response.redirect("login");

}





app.get("/login", (request, response) => {

    response.render("authentication/login");

});



app.post("/login", (request, response) => {

    let user = request.body.email;

    daoU.isUserCorrect(user, request.body.password, (err, exists) => {

        if(err)
            console.log(err);
        else
        {
            if(exists)
            {
                request.session.currentUser = user;
                response.redirect("profile");
            }
            else {
                response.redirect("login");
            }
        }


    });

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



app.get("/profile", middlewareAuthentication ,(request, response) => {

    daoU.getUserDetails(request.session.currentUser, (err, result) => {

        if(err)
            console.log(err);
        else {

            let gender;

            switch(result[0].gender){

                case 'm':
                    gender = "Hombre";
                    break;
                case 'f':
                    gender = "Mujer";
                    break;
                default:
                    gender = "Otro";

            }


            let userDetails = {
                name: result[0].name,
                age: moment().diff(result[0].dob, 'years'),
                gender: result[0].gender,
                points: result[0].points,
                image: result[0].image
            };


            response.status(200);
            response.render("profile/profile", userDetails);

        }

    });


});


app.get("/prof_image", middlewareAuthentication,(request, response) => {


    daoU.getProfileImage(request.session.currentUser, (err, userImage) => {

        if(err)
            console.log(err);
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