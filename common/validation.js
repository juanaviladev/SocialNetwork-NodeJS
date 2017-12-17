const expressValidator = require("express-validator");



// custom validator
let customValidator = {
    customValidators: {
        isImageValid: (param, fileType) => {
            switch (fileType) {
                case "image/jpeg":
                    return true;
                case "image/png":
                    return true;
                default:
                    return false;
            }
        },
        isImageNotEmpty: (param, image) => {
            return !!image;
        },
        hasEnoughPoints: (param, points) => {
            return points >= 100;
        },
        isAnswersLengthCorrect: (param,answers) => {
            let answersArray = answers.split("\r\n").filter((answer) => {
                return answer.trim().length > 0 && answer.trim().length <= 255;
            });
            return answersArray.length > 2;
        },
        isCustomAnswerValid: (param,answerId,answerText) => {
            if (answerId === "custom-answer") {
                return answerText.trim().length > 0 && answerText.trim().length <= 255;
            }
            else {
                return true;
            }
        }
    }
};




module.exports = {
    validationMiddleware: expressValidator,
    customValidator: customValidator
};