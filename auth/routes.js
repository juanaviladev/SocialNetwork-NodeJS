const express = require('express');
const router = express.Router();
const dbPool = require("./../common/db.js").pool;
const DAOUsers = require("./dao.js");
const path = require("path");
const multiParser = require("../common/session").middlewareMulter;
const moment = require("moment");

let daoU = new DAOUsers.DaoAuth(dbPool);

const viewPath = path.join(__dirname,"/view");


// validation middleware
function validateLogin(request, response, next)
{

    request.checkBody("email","Email vacío").notEmpty();
    request.checkBody("password", "Contraseña vacía").notEmpty();

    request.getValidationResult().then(result => {
        if(result.isEmpty())
            next();
        else {
            response.setAlert(result.array());
            response.redirect("login");
        }
    });

}



function validateRegister(request, response, next)
{
    request.checkBody("email", "Email vacío").notEmpty();
    request.checkBody("email", "Email inválido").isEmail();

    request.checkBody("password", "Contraseña vacía").notEmpty();
    request.checkBody("password","Contraseña debe ser entre 4 y 16 carácteres").isLength({min:4,max:16});
    request.checkBody("password","Contraseña debe incluir solo letras y números").matches("[A-Za-z0-9]");

    request.checkBody("name","Nombre vacío").notEmpty();

    request.checkBody("gender","Sexo no seleccionado").notEmpty();

    if(request.body.dob)
        request.checkBody("dob", "Fecha de nacimiento inválida").isBefore((new Date()).toDateString());



    request.getValidationResult().then(result => {

        if(result.isEmpty())
            next();
        else{
            // mechanism to only display the first error associated with particular parameter
            let currentParam = null;
            let reducedResult = [];
            result.array().forEach(err => {
                if(currentParam === null || err.param !== currentParam)
                {
                    reducedResult.push({msg: err.msg});
                    currentParam = err.param;
                }
            });
            response.setAlert(reducedResult);
            response.redirect("register");
        }
    });

}




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
