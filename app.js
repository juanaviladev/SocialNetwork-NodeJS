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
        response.redirect("/login");

}


function middlewareGetPoints(request, response, next)
{
    daoU.getUserPoints(response.locals.currentUser, (err, points) => {

        if(err)
            next(err);
        else {
            response.locals.currentPoints = points;
            next();
        }

    });



}


app.get("/", middlewareAuthentication, (request, response) => {

    response.redirect("profile/" + request.session.currentUser);

});


app.get("/login", (request, response) => {

    response.render("authentication/login");

});



app.post("/login", (request, response, next) => {

    let user = request.body.email;

    daoU.isUserCorrect(user, request.body.password, (err, exists) => {

        if(err) {
            next(err);
        }
        else
        {
            if(exists)
            {
                request.session.currentUser = exists;
                response.redirect("profile/" + request.session.currentUser);
            }
            else {
                response.redirect("login");
            }
        }
    });
});



app.get("/logout", (request, response) => {

    request.session.destroy();

    response.redirect("/login");

});




app.get("/register", (request, response) => {

    response.render("authentication/register")

});



app.post("/register", (request, response, next) => {


    let user = {
        email: request.body.email,
        pass: request.body.password,
        name: request.body.name,
        gender: request.body.gender,
        dob: request.body.dob ? request.body.dob : null,
    };

    daoU.insertUserDetails(user, err => {

        if(err) {
            next(err);
        }
        else
            response.redirect("login");

    });

});



app.get("/profile/:userId", middlewareAuthentication, middlewareGetPoints ,(request, response, next) => {

    daoU.getUserDetails(request.params.userId, (err, result) => {

        if(err) {
            next(err);
        }
        else {

            let gender;

            switch(result[0].gender){

                case 'male':
                    gender = "Hombre";
                    break;
                case 'female':
                    gender = "Mujer";
                    break;
                default:
                    gender = "Otro";

            }


            let userDetails = {
                id: result[0].id,
                name: result[0].name,
                age: moment().diff(result[0].dob, 'years'),
                gender: gender,
            };


            response.status(200);
            response.render("profile/profile", userDetails);

        }

    });


});



app.get("/modify",middlewareAuthentication, middlewareGetPoints , (request, response, next) => {

    daoU.getUserDetails(request.session.currentUser, (err, result) => {

        if(err) {
            next(err);
        }
        else
        {
            let user = {
                email: result[0].email,
                pass: result[0].pass,
                name: result[0].name,
                gender: result[0].gender,
                dob: moment(result[0].dob).format('YYYY-MM-DD'),
            };

            response.render("authentication/modify_profile", user);

        }
    });
});




app.post("/modify",middlewareAuthentication, middlewareGetPoints, (request, response, next) => {


    let user = {
        email: request.body.email,
        pass: request.body.password,
        name: request.body.name,
        gender: request.body.gender,
        dob: request.body.dob ? request.body.dob : null,
    };

    daoU.updateUserDetails(request.session.currentUser, user, err => {

        if (err) {
            next(err);
        }
        else {
            response.redirect("profile");
        }

    });

});




app.get("/friends", middlewareAuthentication, middlewareGetPoints, (request, response, next) => {

    let user = request.session.currentUser;

    daoU.getFriendshipDetails(user, (err, result) => {

        if(err)
            return next(err);

        let friends = [];
        let pending = [];
        let friendRequests = [];

        if(result.length)
        {
            result.forEach(row => {

                if(row.status === "accepted") {
                    if(row.from_user === user)
                        friends.push({id: row.to_user, name: row.name2});
                    else
                        friends.push({id: row.from_user, name: row.name1});
                }

                if(row.status === "pending")
                {
                    if(row.from_user === user)
                        pending.push({id: row.to_user, name: row.name2});
                    else
                        friendRequests.push({id: row.from_user, name: row.name1});
                }

            });
        }
        if(friends.length !== 0)
            friends.sort((x,y) => x["name"].localeCompare(y["name"]));
        if(pending.length !== 0)
            pending.sort((x,y) => x["name"].localeCompare(y["name"]));
        if(friendRequests.length !== 0)
            friendRequests.sort((x,y) => x["name"].localeCompare(y["name"]));

        response.render("friends/friends", {friends: friends, pending: pending, friendRequests: friendRequests});


    });
});





app.get(["/search"], middlewareAuthentication, middlewareGetPoints, (request, response, next) => {

    let word = request.query.search;

    daoU.searchFriends(request.session.currentUser, word, (err, result) => {

        if(err)
            return next(err);

        if(result.length !== 0)
            result.sort((x,y) => x["name"].localeCompare(y["name"]));

        response.render("search/search_results", {searchResult: result, word: word});

    });

});



app.post("/accept_friend", middlewareAuthentication, middlewareGetPoints, (request, response, next) => {

    daoU.acceptFriendRequest(request.session.currentUser, request.body.otherUser, err => {

        if(err)
            return next(err);

        let word = request.body.currentWord;

        if(word === undefined)
            response.redirect("friends");
        else
            response.redirect("search?" + "search=" + word);


    });

});



app.post("/reject_friend", middlewareAuthentication, middlewareGetPoints, (request, response, next) => {

    daoU.rejectFriendRequest(request.session.currentUser, request.body.otherUser, err => {

        if(err)
            return next(err);

        let word = request.body.currentWord;

        if(word === undefined)
            response.redirect("friends");
        else
            response.redirect("search?" + "search=" + word);


    });

});



app.post("/friend_request", middlewareAuthentication, middlewareGetPoints, (request, response, next) => {

    daoU.friendRequest(request.session.currentUser, request.body.otherUser, err => {

        if(err)
            return next(err);

        let word = request.body.currentWord;

        response.redirect("search?" + "search=" + word);

    });

});





app.get("/prof_image/:userId", middlewareAuthentication,middlewareGetPoints,(request, response, next) => {


    daoU.getProfileImage(request.params.userId, (err, userImage) => {

        if(err) {
            next(err);
        }
        else if(userImage)
        {
            response.sendFile(path.join(__dirname, "avatar_imgs", userImage));
        }
        else
            response.sendFile(path.join(__dirname, "public", "img", "NoProfile.png"));

    });


});



app.use((request, response, next) => {

    response.status(404);
    response.render("error/errorPage", {errMsg: "Not Found !", status: 404});

});



app.use((error, request, response, next) => {

    console.log(error.stack);
    response.status(500);
    response.render("error/errorPage", {errMsg: error.message, status: 500});



});





app.listen(config.port, err => {
    if (err) {
        console.log("No se ha podido iniciar el servidor.");
        console.log(err);
    } else {
        console.log(`Servidor escuchando en puerto ${config.port}.`);
    }
});