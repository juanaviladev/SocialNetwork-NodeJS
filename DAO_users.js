"use strict";

class DaoUsers {


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

            let sqlStmt = "SELECT email, pass FROM profiles WHERE email=?";

            conn.query(sqlStmt, [email], (err, result) => {

                conn.release();

                if(err)
                {
                    callback(err);
                    return;
                }

                if(result && (result[0].email === email && result[0].pass === pass))
                    callback(null, true);
                else
                    callback(null, false);

            });

        });



    }




    // get user details
    getUserDetails(email, callback)
    {

        this.pool.getConnection((err, conn) => {

            if(err) {
                callback(err);
                return;
            }

            let sqlStmt = "SELECT * FROM profiles WHERE email=?";

            conn.query(sqlStmt, [email], (err, result) => {

                conn.release();

                if(err) {
                    callback(err);
                    return;
                }

                callback(null, result);

            });
        });
    }


    // get the profile image
    getProfileImage(email, callback)
    {

        this.pool.getConnection((err, conn) => {

            if(err) {
                callback(err);
                return;
            }

            let sqlStmt = "SELECT image FROM profiles WHERE email=?";

            conn.query(sqlStmt, [email], (err, result) => {

                conn.release();

                if(err) {
                    callback(err);
                    return;
                }

                if(result)
                    callback(null, result[0].image)
                else
                    callback(null)

            });
        });
    }



    // insert profile details
    insertUserDetails(user, callback)
    {

        this.pool.getConnection((err, conn) => {

            if(err) {
                callback(err);
                return;
            }

            let sqlStmt = "INSERT INTO profiles(email, pass, name, gender, dob, image) VALUES (?,?,?,?,?,?)";

            conn.query(sqlStmt, [user.email, user.pass, user.name, user.gender, user.dob, user.image], err => {

                conn.release();

                callback(err);

            });
        });
    }


}

module.exports = {
    DaoUsers: DaoUsers
};