const _ = require('underscore');

class QuestionDAO
{
    constructor(pool)
    {
        this.pool = pool;
    }

    getRandomQuestions(number, callback)
    {
        this.pool.getConnection((err, conn) => {

            if(err) {
                callback(err);
                return;
            }

            let sqlStmt = "SELECT * FROM question ORDER BY RAND() LIMIT ?";

            conn.query(sqlStmt,number,(err, result) => {

                conn.release();

                if(err) {
                    callback(err);
                    return;
                }

                callback(null, result);

            });
        });
    }

    __saveNewAnswer(questionId,text,conn,callback)
    {
            let sqlStmt = "INSERT INTO answer (question,text) VALUES (?,?)";

            conn.query(sqlStmt,[questionId,text],(err, result) => {

                if(err) {
                    callback(err);
                    return;
                }

                callback(null, result.insertId);

            });
    }

    __saveNewAnswers(questionId,text,conn,callback)
    {
        let sqlStmt = "INSERT INTO answer (question,text) VALUES ?";

        let pairs = [];

        text.forEach((answer) => {
            pairs.push([questionId,answer])
        });

        conn.query(sqlStmt,[pairs],(err, result) => {

            if(err) {
                callback(err);
                return;
            }

            callback(null, result.insertId);

        });
    }

    saveSelfAnswer(loggedUser,questionId,answerId,callback)
    {
        this.pool.getConnection((err, conn) => {

            if(err) {
                callback(err);
                return;
            }

            let sqlStmt = "INSERT INTO self_answer (user,selected_answer) VALUES (?,?)";

            conn.query(sqlStmt,[loggedUser,answerId],(err, result) => {

                conn.release();

                if(err) {
                    callback(err);
                    return;
                }

                callback(null, result);

            });
        });
    }

    getQuestion(questionId, callback)
    {
        this.pool.getConnection((err, conn) => {

            if(err) {
                callback(err);
                return;
            }

                let sqlStmt = "SELECT A.id AS answer_id, A.text AS answer_text,Q.text As question_text FROM " +
                    "question Q JOIN answer A "  +
                    "   ON Q.id = A.question " +
                    "WHERE Q.id = ?";

            conn.query(sqlStmt,[questionId],(err, result) => {

                conn.release();

                if(err) {
                    callback(err);
                    return;
                }

                let options = [];

                result.forEach((row) =>{
                    options.push({
                       id: row.answer_id,
                       text: row.answer_text
                    });
                });


                let bundle = {
                    id: questionId,
                    text: result[0].question_text,
                    options: options
                };

                callback(null, bundle);

            });
        });
    }

    getUserSelfAnswer(user, questionId, callback) {
        this.pool.getConnection((err, conn) => {

            if (err) {
                callback(err);
                return;
            }

            let sqlStmt = "SELECT Count(selfA.user) AS count,A.text AS self_answer,Q.text AS question_text FROM " +
                "question Q JOIN answer A " +
                "   ON Q.id = A.question " +
                "JOIN self_answer selfA " +
                "   ON selfA.selected_answer = A.id " +
                "WHERE selfA.user = ? AND Q.id = ?";

            conn.query(sqlStmt, [user, questionId], (err, result) => {

                conn.release();

                if (err) {
                    callback(err);
                    return;
                }

                let answer = {
                    questionId: questionId,
                    wasAnswered: result[0].count === 1,
                    questionText: result[0].question_text
                };

                let selfAnswer = result[0].self_answer;

                if(selfAnswer)
                {
                    answer.userAnswer =selfAnswer;
                }

                callback(null, answer);

            });
        });
    }

    saveNewQuestion(questionText, answers, callback) {

        let sqlStmt = "INSERT INTO question (text) VALUES (?)";

        this.pool.getConnection((err, conn) => {

            if (err) {
                callback(err);
                return;
            }

            conn.query(sqlStmt, [questionText], (err, questionResult) => {

                if (err) {
                    callback(err);
                    return;
                }

                this.__saveNewAnswers(questionResult.insertId, answers, conn, (err, result) => {

                    conn.release();

                    if (err) {
                        callback(err);
                        return;
                    }

                    callback(null, questionResult.insertId);
                });
            });
        });
    }

    getFriendsWhoAnswered(loggedUser, questionId, callback) {

        this.pool.getConnection((err, conn) => {

            if (err) {
                callback(err);
                return;
            }

            let sqlStmt = "SELECT DISTINCT users.id, users.name, users.image, answer.question, guess_answer_q.of_user, guess_answer_q.status FROM users " +
                "                JOIN friendships  " +
                "                                ON (users.id = friendships.from_user AND friendships.to_user = ? AND friendships.status = 'accepted') OR (users.id =   friendships.to_user AND friendships.from_user = ? AND friendships.status = 'accepted')   " +
                "                JOIN self_answer " +
                "                 ON self_answer.user = users.id " +
                "                JOIN answer " +
                "                 ON answer.id = self_answer.selected_answer " +
                "                 LEFT JOIN(SELECT guess_answer.*, answer.question FROM  " +
                "                      guess_answer JOIN answer " +
                "                       ON guess_answer.answer = answer.id " +
                "                ) AS guess_answer_q " +
                "                 ON guess_answer_q.question = answer.question AND guess_answer_q.of_user = users.id" +
                " WHERE answer.question = ?";

            conn.query(sqlStmt, [loggedUser,loggedUser,questionId,loggedUser], (err, result) => {

                conn.release();

                if (err) {
                    callback(err);
                    return;
                }

                callback(null,result);

            });
        });
    }

    getQuestionRelatedWith(questionId, user, callback) {
        this.pool.getConnection((err, conn) => {

            if(err) {
                callback(err);
                return;
            }

            let sqlStmt = "SELECT DISTINCT answer.id AS answer_id, answer.text AS answer_text, answer.question AS question_id, question.text AS question_text FROM " +
            "answer LEFT JOIN self_answer " +
            "     ON answer.id = self_answer.selected_answer " +
            "    JOIN question " +
            "     ON question.id = answer.question " +
            "WHERE answer.question = ?" +
            "ORDER BY (self_answer.user = ?) DESC " +
            "LIMIT 4";

            conn.query(sqlStmt,[questionId,user],(err, result) => {

                conn.release();

                if(err) {
                    callback(err);
                    return;
                }

                let options = [];


                result.forEach((row) =>{
                    options.push({
                        id: row.answer_id,
                        text: row.answer_text
                    });
                });


                let bundle = {
                    id: questionId,
                    text: result[0].question_text,
                    options: _.shuffle(options)
                };

                callback(null, bundle);

            });
        });
    }

    saveGuessAnswer(questionId, selectedAnswerId, guesserId, friendId, status, callback) {
        this.pool.getConnection((err, conn) => {


            if (err) {
                callback(err);
                return;
            }

            let sqlStmt = "INSERT INTO guess_answer (guess_user,of_user,answer,status) VALUES (?,?,?,?)";

            if (status) {
                status = "correct";
            }
            else {
                status = "wrong";
            }

            conn.query(sqlStmt, [guesserId, friendId, selectedAnswerId, status], (err, result) => {

                conn.release();

                if (err) {
                    callback(err);
                    return;
                }

                callback(null);

            });
        });
    }

    checkAnswer(userId, selectedAnswerId, callback) {
        this.pool.getConnection((err, conn) => {

            if (err) {
                callback(err);
                return;
            }
        let sqlStmt = "SELECT Count(user) AS check_result FROM self_answer WHERE user = ? AND selected_answer = ?";

        conn.query(sqlStmt,[userId,selectedAnswerId],(err, result) => {
            conn.release();

            if(err) {
                callback(err);
                return;
            }
            callback(null, result[0].check_result === 1);

        });

    });
    }

    exists(questionId, callback) {
        this.pool.getConnection((err, conn) => {

            if (err) {
                callback(err);
                return;
            }
            let sqlStmt = "SELECT Count(id) AS check_result FROM question WHERE id = ?";

            conn.query(sqlStmt,[questionId],(err, result) => {
                conn.release();

                if(err) {
                    callback(err);
                    return;
                }
                console.log(result);
                callback(null, result[0].check_result === 1);

            });
    });
    }

    isAValidAnswerOf(questionId, answerId, callback) {
        this.pool.getConnection((err, conn) => {

            if (err) {
                callback(err);
                return;
            }
            let sqlStmt = "SELECT Count(id) AS check_result FROM answer WHERE id = ? AND question = ?";

            conn.query(sqlStmt,[answerId,questionId],(err, result) => {
                conn.release();

                if(err) {
                    callback(err);
                    return;
                }
                console.log(result);
                callback(null, result[0].check_result === 1);

            });
        });
}
}

module.exports = {
    clazz: QuestionDAO
};