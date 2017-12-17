"use strict";


const DaoCommon = require("../common/daoCommon.js").DaoCommon;


class ProfileDAO extends DaoCommon
{

    constructor(pool)
    {
        super(pool);
    }

    // get user details
    getUserProfile(userId, callback)
    {
        this.pool.getConnection((err, conn) => {

            if(err) {
                callback(err);
                return;
            }

            let sqlStmt = "SELECT u.id, u.name, u.gender, u.dob, ug.image, ug.description FROM user AS u LEFT JOIN " +
                "user_gallery AS ug ON u.id=ug.user WHERE u.id=?";

            conn.query(sqlStmt, [userId], (err, result) => {

                conn.release();

                if(err) {
                    callback(err);
                    return;
                }

                console.log(result.length);
                if(result.length !== 0) {
                    let finalResult = {
                        id: result[0].id,
                        name: result[0].name,
                        gender: result[0].gender,
                        dob: result[0].dob
                    };

                    if (result[0].image)
                        finalResult.gallery = result.map(row => {
                            return {image: row.image, desc: row.description};
                        });

                    callback(null, finalResult);
                }
                else{
                    callback(null);
                }

            });
        });
    }


    getUserDetails(userId, callback)
    {

        this.pool.getConnection((err, conn) => {

            if(err) {
                callback(err);
                return;
            }

            let sqlStmt = "SELECT * FROM user WHERE id=?";

            conn.query(sqlStmt, [userId], (err, result) => {

                conn.release();

                if(err)
                    callback(err);
                else
                    callback(null, result);

            });
        });
    }



    getUserPoints(userId, callback)
    {

        this.pool.getConnection((err, conn) => {

            if(err) {
                callback(err);
                return;
            }

            let sqlStmt = "SELECT points FROM user WHERE id=?";

            conn.query(sqlStmt, [userId], (err, result) => {

                conn.release();

                if(err) {
                    callback(err);
                    return;
                }

                callback(null, result[0].points);

            });
        });

    }





    // update user details
    updateUserDetails(userId, newData, callback)
    {

        this.pool.getConnection((err, conn) => {

            if(err)
            {
                callback(err);
                return;
            }

            let sqlStmt = "UPDATE user SET email=?, pass=?, name=?, gender=?, dob=?, image=? WHERE id=?";

            conn.query(sqlStmt, [newData.email, newData.pass, newData.name, newData.gender, newData.dob,
                                                                                newData.image, userId], err => {

                conn.release();

                if(err)
                    callback(err);
                else
                    callback(null);

            });
        });
    }

    addPointsToUser(userId, newPoints, callback)
    {
        this.pool.getConnection((err, conn) => {

            if(err)
            {
                callback(err);
                return;
            }

            let sqlStmt = "UPDATE user SET points = points + ? WHERE id=?";

            conn.query(sqlStmt, [newPoints,userId], err => {

                conn.release();

                if(err)
                    callback(err);
                else
                    callback(null);

            });
        });
    }




    // get the profile image
    getProfileImage(userId, callback)
    {

        this.pool.getConnection((err, conn) => {

            if(err) {
                callback(err);
                return;
            }

            let sqlStmt = "SELECT image FROM user WHERE id=?";

            conn.query(sqlStmt, [userId], (err, result) => {

                conn.release();

                if(err) {
                    callback(err);
                    return;
                }

                if(result.length !== 0)
                    callback(null, result[0].image);
                else
                    callback(null);

            });
        });
    }



    saveGalleryImage(userId, image, desc, newPoints, callback)
    {

        this.pool.getConnection((err, conn) => {

            if(err){
                callback(err);
                return;
            }

            conn.beginTransaction(err => {

                if(err){
                    callback(err);
                    conn.release();
                    return;
                }

                let sqlStmt = "INSERT INTO user_gallery VALUES(?,?,?)";

                conn.query(sqlStmt, [userId, image, desc], err => {

                    if(err) {
                        callback(err);
                        conn.rollback();
                        conn.release();
                        return;
                    }

                    let sqlStmt = "UPDATE user SET points = points - ? WHERE id=?";

                    conn.query(sqlStmt, [newPoints,userId], err => {

                        if(err) {
                            callback(err);
                            conn.rollback();
                            conn.release();
                            return;
                        }

                        callback(null);

                        conn.commit();

                        conn.release();
                    });
                });
            });
        });
    }


}

module.exports = {
    ProfileDAO: ProfileDAO
};