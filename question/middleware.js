const dbPool = require("./../common/db.js").pool;
const DAOQuestion = require("./dao.js");

const daoQ = new DAOQuestion.clazz(dbPool);

function checkQuestion(request, response, next)
{
    let questionId = request.params.questionId;
    daoQ.exists(questionId,(err, exists) => {

        if(err) {
            next(err);
        }
        else if(!exists)
        {
            response.setAlert({type:"error",alertList: [{msg:"La pregunta no existe"}]});
            response.redirect("/question/");
        }
        else {
            next();
        }

    });



}

module.exports = {
    checkQuestion: checkQuestion
};