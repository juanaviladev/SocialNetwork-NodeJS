"use strict";

class DaoAuth {
    constructor(pool)
    {
        this.pool = pool;
    }

    // authenticate user
    isUserCorrect(email, pass, callback)
    {

        this.pool.getConnection((err, conn) => {

            if(err) {
                callback(err);
                return;
            }

            let sqlStmt = "SELECT id, email, pass FROM users WHERE email=?";

            conn.query(sqlStmt, [email], (err, result) => {

                conn.release();

                if(err)
                {
                    callback(err);
                    return;
                }

                if(result.length !== 0 && (result[0].email === email && result[0].pass === pass))
                    callback(null, result[0].id);
                else
                    callback(null, 0);

            });

        });
    }

    checkEmail(email, callback)
    {
        this.pool.getConnection((err, conn) => {

            if(err) {
                callback(err);
                return;
            }

            let sqlStmt = "SELECT * FROM users WHERE email=?";

            conn.query(sqlStmt, [email],(err, exists) => {

                conn.release();

                if(err) {
                    callback(err);
                    return;
                }

                if(exists.length !== 0)
                    callback(null, true);
                else
                    callback(null, false);

            });

        });


    }

    getUser(userId,callback)
    {
        this.pool.getConnection((err, conn) => {

            if(err) {
                callback(err);
                return;
            }

            let sqlStmt = "SELECT * FROM users WHERE id = ?";

            conn.query(sqlStmt, [userId], (err,result) => {

                conn.release();


                callback(err,result[0]);
            });
        });
    }

    // insert profile details
    registerUser(user, callback)
    {

        this.pool.getConnection((err, conn) => {

            if(err) {
                callback(err);
                return;
            }

            let sqlStmt = "INSERT INTO users(email, pass, name, gender, dob, image) VALUES (?,?,?,?,?,?)";

            conn.query(sqlStmt, [user.email, user.pass, user.name, user.gender, user.dob, user.image], err => {

                conn.release();

                callback(err);

            });
        });
    }
}

module.exports = {
    DaoAuth: DaoAuth
};