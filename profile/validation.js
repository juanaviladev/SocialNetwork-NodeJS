const fs = require("fs");
const path = require("path");
const validateProfile = require("./../auth/validation").validateProfile;




function validateGallery(request, response, next)
{

    let redirection = (result) => {
        // mechanism to only display the first error associated with particular parameter
        let currentParam = null;
        let reducedResult = [];
        result.array().forEach(err => {
            if (currentParam === null || err.param !== currentParam) {
                reducedResult.push({msg: err.msg});
                currentParam = err.param;
            }
        });
        response.setAlert({type: "error", alertList: reducedResult});

        response.redirect("/profile");
    };



    request.checkBody("image", "Adjunta un imagen").isImageNotEmpty(request.file);
    if(request.file)
        request.checkBody("image", "Archivo incompatible, usa formato: 'jpeg' or 'png'").isImageValid(request.file.mimetype);
    request.checkBody("description", "La descripción de la imagen es obligatoria").trim().notEmpty();
    request.checkBody("description", "La descripción de la imagen tiene límito de 255 carácteres").isLength({max: 255});
    request.checkBody("image", "No tienes suficientes puntos para subir imagen").hasEnoughPoints(response.locals.currentPoints);


    request.getValidationResult().then(result => {
        if(result.isEmpty())
            next();
        else {

            // delete the file if operation is not validated
            if (request.file) {
                fs.unlink(path.join(__dirname, "../uploads", request.file.filename), err => {

                    if (err)
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
    validateGallery: validateGallery,
    validateProfile: validateProfile
};