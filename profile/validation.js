const fs = require("fs");
const path = require("path");
const customValidators = require("./../common/validation").customValidator;
const validateProfile = require("./../auth/validation").validateProfile;

customValidators.customValidators.isImageValid = (param, fileType) => {
    switch(fileType){
        case "image/jpeg":
            return true;
        case "image/png":
            return true;
        default:
            return false;
    }
};
customValidators.customValidators.isImageNotEmpty = (param, image) => {
    return !!image;
};

customValidators.customValidators.hasEnoughPoints = (param, points) => {
    return points >= 100;
};


function validateGallery(request, response, next)
{
    request.checkBody("image", "Adjunta un imagen").isImageNotEmpty(request.file);
    if(request.file)
        request.checkBody("image", "Unsupported file, please use: 'jpeg' or 'png'").isImageValid(request.file.mimetype);
    request.checkBody("description", "Descripción de imagen es obligatoria").notEmpty();
    request.checkBody("image", "No tienes suficiente puntos para subir imagen").hasEnoughPoints(response.locals.currentPoints);


    request.getValidationResult().then(result => {
        if(result.isEmpty())
            next();
        else {

            // delete the file if operation is not validated
            if (request.file) {
                fs.unlink(path.join(__dirname, "../uploads", request.file.filename), err => {

                    if (err)
                        next(err);

                });
            }

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
        }
    });
}


module.exports = {
    validateGallery: validateGallery,
    validateProfile:validateProfile
};