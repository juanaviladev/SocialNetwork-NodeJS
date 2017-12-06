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




    // get user details
    getUserDetails(userId, callback)
    {

        this.pool.getConnection((err, conn) => {

            if(err) {
                callback(err);
                return;
            }

            let sqlStmt = "SELECT * FROM users WHERE id=?";

            conn.query(sqlStmt, [userId], (err, result) => {

                conn.release();

                if(err) {
                    callback(err);
                    return;
                }

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

            let sqlStmt = "SELECT points FROM users WHERE id=?";

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

            let sqlStmt = "UPDATE users SET email=?, pass=?, name=?, gender=?, dob=? WHERE id=?";

            conn.query(sqlStmt, [newData.email, newData.pass, newData.name, newData.gender, newData.dob, userId], err => {

                conn.release();

                if(err)
                    callback(err);
                else
                    callback(null);

            });
        });
    }




    // get friendships
    getFriendshipDetails(userId, callback)
    {

        this.pool.getConnection((err, conn) => {

            if(err)
            {
                callback(err);
                return;
            }

            let sqlStmt = "SELECT from_user, to_user, status, u1.name AS name1, u2.name AS name2 FROM friendships, " +
                "users AS u1, users AS u2 WHERE friendships.from_user=u1.id AND friendships.to_user=u2.id AND " +
                "(friendships.from_user=? OR friendships.to_user=?)";

            conn.query(sqlStmt, [userId, userId], (err, result) => {

                conn.release();

                if(err){
                    callback(err);
                    return;
                }

                callback(null, result);

            });
        });
    }






    // get friendships
    searchFriends(userId, word, callback)
    {

        this.pool.getConnection((err, conn) => {

            if(err)
            {
                callback(err);
                return;
            }

            let sqlStmt = "SELECT id, name, from_user, to_user, status FROM users LEFT JOIN friendships ON " +
                "(users.id=friendships.from_user AND friendships.to_user=?) OR (users.id=friendships.to_user AND " +
                "friendships.from_user=?) WHERE id<>? AND name LIKE ?";


            conn.query(sqlStmt, [userId, userId, userId, "%" + word + "%"], (err, result) => {

                conn.release();

                if(err){
                    callback(err);
                    return;
                }

                callback(null, result);

            });
        });
    }



    acceptFriendRequest(user1, user2, callback)
    {

        this.pool.getConnection((err, conn) => {

            if (err) {
                callback(err);
                return;
            }


            let sqlStmt = "UPDATE friendships SET status='accepted' WHERE from_user=? AND to_user=?";

            conn.query(sqlStmt, [user2, user1], err => {

                if(err)
                    return callback(err);

                callback(null);

            });
        });
    }





    rejectFriendRequest(user1, user2, callback)
    {

        this.pool.getConnection((err, conn) => {

            if (err) {
                callback(err);
                return;
            }


            let sqlStmt = "DELETE FROM friendships WHERE from_user=? AND to_user=?";

            conn.query(sqlStmt, [user2, user1], err => {

                if(err)
                    return callback(err);

                callback(null);

            });
        });
    }




    friendRequest(user1, user2, callback)
    {

        this.pool.getConnection((err, conn) => {

            if (err) {
                callback(err);
                return;
            }


            let sqlStmt = "INSERT INTO friendships VALUES (?)";

            conn.query(sqlStmt, [[user1, user2, "pending"]], err => {

                if(err)
                    return callback(err);

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

            let sqlStmt = "SELECT image FROM users WHERE id=?";

            conn.query(sqlStmt, [userId], (err, result) => {

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

            let sqlStmt = "INSERT INTO users(email, pass, name, gender, dob, image) VALUES (?,?,?,?,?,?)";

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