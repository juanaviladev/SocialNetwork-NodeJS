const expressValidator = require("express-validator");


function validationAlerts(request,response, next)
{

    response.setAlert = (alertList) => {
        request.session.alertList = alertList;
    };

    response.locals.getAlert = () => {
        let alertList = request.session.alertList;
        delete request.session.alertList;
        return alertList;

    };

    next();
}


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



module.exports = {
    validationMiddleware: expressValidator,
    validationAlerts: validationAlerts,
    validateLogin: validateLogin,
    validateRegister: validateRegister

};