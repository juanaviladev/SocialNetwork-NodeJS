const express = require('express');
const router = express.Router();
const dbPool = require("./../common/db.js").pool;
const DAOUsers = require("./dao.js");
const path = require("path");
const multiParser = require("../common/session").middlewareMulter;

let daoU = new DAOUsers.DaoAuth(dbPool);

const viewPath = path.join(__dirname,"/view");
const validation = require("../common/validation.js");
const validateLogin = validation.validateLogin;
const validateRegister = validation.validateRegister;





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

router.post("/login", multiParser.none(), validateLogin, (request, response, next) => {

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
                response.setAlert([{msg:"Email y/o contraseña incorrectos"}]);
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

router.post("/register", multiParser.single("image"),validateRegister, (request, response, next) => {

    daoU.checkEmail(request.body.email, (err, exists) => {

        if(err)
            next(err);
        else if(exists)
        {
            response.setAlert([{msg: "Email ya existe"}]);
            response.redirect("register");
        }

    });


    let user = {
        email: request.body.email,
        pass: request.body.password,
        name: request.body.name,
        gender: request.body.gender,
        dob: request.body.dob ? request.body.dob : null,
        image: request.file ? request.file.filename : null
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
