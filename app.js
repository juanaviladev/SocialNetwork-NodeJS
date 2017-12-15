"use strict";

const config = require("./config");
const express = require("express");
const path = require("path");
const session = require("./common/session.js");

//const answerRoutes = require("./answer/routes.js");
const auth = require("./auth/routes.js");
const friends = require("./friends/routes.js");
const profile  = require("./profile/routes.js");
const question = require("./question/routes.js");
const search = require("./search/routes.js");

const authRoutes = auth.router;
const friendsRoutes = friends.router;
const profileRoutes = profile.router;
const questionRoutes = question.router;
const searchRoutes = search.router;

const notFoundErrorMiddleware = require("./error/404_middleware.js");
const serverErrorMiddleware = require("./error/500_middleware.js");
const middlewareAuthentication = require('./auth/auth_middleware.js');
const validationMiddleware = require("./common/validation.js").validationMiddleware;

const alertsMiddleware = require("./common/alerts.js").alertsMiddleware;

let app = express();

app.set("view engine", "ejs");
const staticElements = path.join(__dirname, "public");



app.use(express.static(staticElements));
app.use(session.middleware);
app.use(validationMiddleware());
app.use(alertsMiddleware);


//Home
app.get("/", middlewareAuthentication, (request, response) => {

    response.redirect("profile/" + request.session.currentUser);

});


// Routes
app.use('/friends',friendsRoutes);
app.use('/profile',profileRoutes);
app.use('/search',searchRoutes);
app.use('/question',questionRoutes);
app.use(authRoutes);



//Errors
app.use(notFoundErrorMiddleware);
app.use(serverErrorMiddleware);


app.listen(config.port, err => {
    if (err) {
        console.log("No se ha podido iniciar el servidor.");
        console.log(err);
    } else {
        console.log(`Servidor escuchando en puerto ${config.port}.`);
    }
});