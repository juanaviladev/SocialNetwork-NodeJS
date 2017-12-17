const fs = require("fs");
const path = require("path");

// validation middleware
function validateLogin(request, response, next)
{

    request.checkBody("email","Email vacío").notEmpty();
    request.checkBody("password", "Contraseña vacía").notEmpty();

    request.getValidationResult().then(result => {
        if(result.isEmpty())
            next();
        else {
            response.setAlert({type:"error",alertList: result.array()});
            response.redirect("login");
        }
    });

}



function validateProfile(request, response, next)
{

    let redirection = (result) => {
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
        response.setAlert({type: "error", alertList: reducedResult});

        // check the url to redirect to the correct route as same validation is used in two different routes
        if(request.url === "/register")
            response.redirect("register");
        if(request.url === "/modify")
            response.redirect("modify");
    };



    request.checkBody("email", "Email vacío").notEmpty();
    request.checkBody("email", "Email inválido").isEmail();

    request.checkBody("password", "Contraseña vacía").notEmpty();
    request.checkBody("password","Contraseña debe ser entre 4 y 16 carácteres").isLength({min:4,max:16});
    request.checkBody("password","Contraseña debe incluir solo letras y números").matches("[A-Za-z0-9]");

    request.checkBody("name","Nombre vacío").notEmpty();

    request.checkBody("gender","Sexo no seleccionado").notEmpty();

    if(request.body.dob)
        request.checkBody("dob", "Fecha de nacimiento inválida").isBefore((new Date()).toDateString());

    if(request.file)
        request.checkBody("image","Unsupported file, please use: 'jpeg' or 'png'").isImageValid(request.file.mimetype);



    request.getValidationResult().then(result => {

        if(result.isEmpty())
            next();
        else{

            // delete the file if operation is not validated
            if(request.file)
            {
                fs.unlink(path.join(__dirname, "../uploads", request.file.filename),err => {

                    if(err)
                        next(err);
                    else{
                        redirection(result);
                    }
                });
            }
            else
                redirection(result);
        }
    });

}

module.exports = {
    validateProfile: validateProfile,
    validateLogin: validateLogin
};