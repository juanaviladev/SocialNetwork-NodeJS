

function validateNewQuestionForm(request, response, next)
{
    request.checkBody("text","Enunciado de la pregunta vacío").notEmpty().len({min:1,max:255});
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

            response.setAlert({type:"error",alertList: result.array()});

            if(friendId)
            {
                response.redirect("/question/"+questionId+"/guess?of="+friendId);
            }
            else
            {
                response.redirect("/question/"+questionId);
            }
        }
    });

}




module.exports = {
    newQuestionValidator: validateNewQuestionForm,
    guessValidator: guessValidator,
    customAnswerValidator: customAnswerValidator
};