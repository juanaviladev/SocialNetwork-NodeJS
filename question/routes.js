const express = require('express');
const router = express.Router();
const dbPool = require("./../common/db.js").pool;
const dao = require("./dao.js");
const path = require("path");
const friends = require("./../friends/dao.js");
const users = require("./../auth/dao.js");
const profile = require("./../profile/dao.js");
const multiParser = require("../common/multiParser").middlewareMulter;

const middlewareAuthentication = require('./../auth/auth_middleware.js');
const middlewareGetPoints = require('./../profile/points_middleware.js');
const middlewareQuestionCheck = require('./middleware').checkQuestion;

const newQuestionValidator = require('./validation').newQuestionValidator;
const guessValidator = require('./validation').guessValidator;
const customAnswerValidator = require('./validation').customAnswerValidator;

const viewPath = path.join(__dirname,"/view");

let questionDAO = new dao.clazz(dbPool);
let friendsDAO = new friends.FriendsDAO(dbPool);
let usersDAO = new users.DaoAuth(dbPool);
let profileDAO = new profile.ProfileDAO(dbPool);

const defaultNumber = 5;


router.get("/", middlewareAuthentication, middlewareGetPoints, (request, response, next) => {

    questionDAO.getRandomQuestions(defaultNumber,(err, result) => {

        if(err)
            return next(err);

        response.render(path.join(viewPath,"questions_list"), {questions: result});
        console.log(result);
    });

});

router.get("/create", middlewareAuthentication, middlewareGetPoints, (request, response, next) => {

    response.render(path.join(viewPath,"question_create_form"));

});

router.post("/create", middlewareAuthentication, middlewareGetPoints,multiParser.none(), newQuestionValidator,
    (request, response, next) => {

        let questionText = request.body.text;
        let questionAnswers = request.body.answers;

        let answers = questionAnswers.split("\r\n");

        questionDAO.existsQuestionWithSameTitle(questionText,(err, exists) => {

            if (err)
                return next(err);

            if(!exists) {
                questionDAO.saveNewQuestion(questionText, answers, (err, newQuestionId) => {

                    if (err)
                        return next(err);

                    response.redirect("/question/" + newQuestionId);
                });
            }
            else {
                response.setAlert({type:"error",alertList: [{msg:"Lo sentimos, esa pregunta ya existe"}]});
                response.redirect("/question/create");
            }
        });
});

router.post("/:questionId/guess", middlewareAuthentication, middlewareGetPoints,multiParser.none(),middlewareQuestionCheck,  guessValidator,
                                                                                (request, response, next) => {

    let selectedAnswerId = request.body.answer;
    let guesserId = request.session.currentUser;
    let friendId = request.body.friend_id;
    let questionId = request.params.questionId;

    questionDAO.isAPossibleAnswerOf(questionId,selectedAnswerId,(err, hasCorrespondence) => {

                if (err)
                    return next(err);

                if(hasCorrespondence)
                {
                    friendsDAO.areFriends(guesserId,friendId,(err, areFriends) => {

                        if(err)
                            return next(err);

                        if(areFriends)
                        {
                            questionDAO.isCorrectAnswer(friendId,selectedAnswerId,(err, correctAnswer) => {

                                if(err)
                                    return next(err);

                                questionDAO.saveGuessAnswer(questionId, selectedAnswerId, guesserId, friendId,correctAnswer,
                                    (err, question) => {

                                        if(err)
                                            return next(err);

                                        if(correctAnswer)
                                        {
                                            profileDAO.addPointsToUser(guesserId,50,(err, question) => {

                                                if (err)
                                                    return next(err);

                                                response.redirect("/question/"+questionId);
                                            });
                                        }
                                        else
                                        {
                                            response.redirect("/question/"+questionId);
                                        }
                                    });
                            });
                        }
                        else
                        {
                            response.setAlert({type:"error",alertList: [{msg:"Solo puedes responder sobre tus amigos"}]});
                            response.redirect("/question/"+questionId+"/guess?of="+friendId);
                        }
                    });
                }
                else if(friendId)
                {
                    response.setAlert({type:"error",alertList: [{msg:"Seleccione una respuesta válida"}]});
                    response.redirect("/question/"+questionId+"/guess?of="+friendId);
                }
                else {
                    response.redirect("/question/"+questionId);
                }
            });
});

router.get("/:questionId/guess", middlewareAuthentication, middlewareGetPoints,middlewareQuestionCheck,
     (request, response, next) => {

    //Comprobar que el usuario que entra en esta ruta no ha respondido ya a la pregunta
    let questionId = request.params.questionId;
    let friendId = request.query.of;
    let loggedUser = request.session.currentUser;

         friendsDAO.areFriends(loggedUser,friendId,(err, areFriends) => {

             if(err)
                 return next(err);

             if(areFriends)
             {
                 questionDAO.hasUserTriedToGuess(loggedUser,friendId,questionId,(err, hasTried) => {

                     if(err)
                         return next(err);

                     if(!hasTried)
                     {
                         usersDAO.getUser(friendId,(err, friend) => {

                             if(err)
                                 return next(err);

                             questionDAO.getQuestionRelatedWith(questionId,friendId,(err, question) => {

                                 if(err)
                                     return next(err);

                                 response.render(path.join(viewPath,"friend_answer_form"), {friend: friend,question: question});
                             });

                         });
                     }
                     else
                     {
                         response.setAlert({type:"error",alertList: [{msg:"Ya has respondido a esta pregunta sobre tu amigo"}]});
                         response.redirect("/question/"+questionId);
                     }
                 });
             }
             else
             {
                 response.setAlert({type:"error",alertList: [{msg:"Solo puedes responder sobre tus amigos"}]});
                 response.redirect("/question/"+questionId);
             }
         });

});

router.get("/:questionId/answer", middlewareAuthentication, middlewareGetPoints,multiParser.none(),middlewareQuestionCheck,
    (request, response, next) => {

    let questionId = request.params.questionId;
    let loggedUser = request.session.currentUser;

    questionDAO.getUserSelfAnswer(loggedUser,questionId,(err, userAnswer) => {

        if(err)
            return next(err);

        if(userAnswer.wasAnswered)
        {
            response.setAlert({type:"error",alertList: [{msg:"Pregunta ya respondida"}]});
            response.redirect("/question/"+questionId);
        }
        else {
            questionDAO.getQuestion(questionId,(err, result) => {

                if(err)
                    return next(err);

                response.render(path.join(viewPath,"answer_form"), {question: result});
            });
        }
    });


});

router.post("/:questionId/answer", middlewareAuthentication, middlewareGetPoints,multiParser.none(),middlewareQuestionCheck,
    customAnswerValidator, (request, response, next) => {
    let answerId = request.body.answer;
    let questionId = request.params.questionId;
    let loggedUser = request.session.currentUser;

    if(answerId === "custom-answer")
    {
        let text = request.body["custom-answer-text"];
        questionDAO.saveSelfCustomAnswer(loggedUser,questionId,text,(err, result) => {
            if(err)
                next(err);

            response.redirect("/question/"+questionId);
        });
    }
    else
    {
        questionDAO.isAPossibleAnswerOf(questionId,answerId,(err, areFamily) => {
            if(err)
                next(err);

            if(areFamily)
            {
                questionDAO.saveSelfAnswer(loggedUser,questionId,answerId,(err, result) => {
                    if(err)
                        next(err);

                    response.redirect("/question/"+questionId);
                });
            }
            else
            {
                response.setAlert({type:"error",alertList: [{msg:"Elija una de las respuestas de la lista"}]});
                response.redirect("/question/"+questionId+"/answer");
            }
        });
    }
});

router.get("/:questionId", middlewareAuthentication, middlewareGetPoints,middlewareQuestionCheck, (request, response, next) => {

    let loggedUser = request.session.currentUser;
    let questionId = request.params.questionId;

            questionDAO.getFriendsWhoAnswered(loggedUser,questionId, (err, friends) => {

                questionDAO.getUserSelfAnswer(loggedUser,questionId,(err, result) => {

                    if(err)
                        return next(err);

                    response.render(path.join(viewPath,"question_page"), {question: result,friends:friends});
                    console.log(result);
                });
            });
});

module.exports = {
    router:router,
    viewPath:__dirname + viewPath
};
