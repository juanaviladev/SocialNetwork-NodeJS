const express = require('express');
const router = express.Router();
const dbPool = require("./../common/db.js").pool;
const DAOUsers = require("./dao.js");
const path = require("path");
const multiParser = require("../common/session").middlewareMulter;


let daoU = new DAOUsers.DaoAuth(dbPool);

const viewPath = path.join(__dirname,"/view");

router.get("/login", (request, response) => {
    let user = request.session.currentUser;
    if(user)
    {
        response.redirect("/profile")
    }
    else
    {
        response.render(path.join(viewPath,"login"));
    }
});

router.post("/login", multiParser.none(), (request, response, next) => {

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

router.get("/logout", (request, response) => {

    request.session.destroy();

    response.redirect("/login");

});

router.get("/register", (request, response) => {

    response.render(path.join(viewPath,"register"));

});

router.post("/register", multiParser.none(), (request, response, next) => {


    let user = {
        email: request.body.email,
        pass: request.body.password,
        name: request.body.name,
        gender: request.body.gender,
        dob: request.body.dob ? request.body.dob : null,
    };

    daoU.registerUser(user, err => {

        if(err) {
            next(err);
        }
        else
            response.redirect("login");

    });

});

module.exports.router = router;
