const customValidators = require("../common/validation").customValidator.customValidators;

function validateNewQuestionForm(request, response, next)
{
    request.checkBody("text","Enunciado de la pregunta vacío").notEmpty();
    request.checkBody("answers", "Campo de respuestas vacío").notEmpty();
    request.checkBody("answers","Se requiren al menos dos respuestas").isAnswersLengthCorrect(request.body.answers);

    request.getValidationResult().then(result => {
        if(result.isEmpty())
            next();
        else{
            response.setAlert({type:"error",alertList: result.array()});
            response.redirect("/question/create");
        }
    });

}

function customAnswerValidator(request, response, next)
{
    request.checkBody("answer","La respuesta personalizada no puede estar en blanco").isCustomAnswerValid(
        request.body.answer,
        request.body["custom-answer-text"]
    );

    request.getValidationResult().then(result => {
        if(result.isEmpty())
            next();
        else{
            let questionId = request.params.questionId;
            response.setAlert({type:"error",alertList: result.array()});
            response.redirect("/question/"+questionId+"/answer");
        }
    });

}


function guessValidator(request, response, next)
{
    request.checkBody("answer","Selecciona una respuesta de la lista").notEmpty();
    request.checkBody("friend_id","No hemos podido ver a que amigo respondias :(").notEmpty();

    request.getValidationResult().then(result => {
        if(result.isEmpty())
            next();
        else{
            let friendId = request.body.friend_id;
            let questionId = request.params.questionId;

            console.log(request.body);

            response.setAlert({type:"error",alertList: result.array()});

            if(friendId)
            {
                console.log("No responses");
                response.redirect("/question/"+questionId+"/guess?of="+friendId);
            }
            else
            {
                console.log("No responses and friend");
                response.redirect("/question/"+questionId);
            }
        }
    });

}

customValidators.isAnswersLengthCorrect = (param,answers) => {
            let answersArray = answers.split("\r\n").filter((answer) => {
                return answer.length > 0;
            });
            return answersArray.length > 2;
};

customValidators.isCustomAnswerValid = (param,answerId,answerText) => {
    if(answerId === "custom-answer")
    {
        return answerText.trim().length >0;
    }
    else {
        return true;
    }
};

module.exports = {
    newQuestionValidator: validateNewQuestionForm,
    guessValidator: guessValidator,
    customAnswerValidator: customAnswerValidator
};