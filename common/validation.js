const expressValidator = require("express-validator");

// custom validator
let customValidator = {
    customValidators: {}
};



module.exports = {
    validationMiddleware: expressValidator,
    customValidator: customValidator
};