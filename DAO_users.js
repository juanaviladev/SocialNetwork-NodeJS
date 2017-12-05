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

            let sqlStmt = "SELECT id, email, pass FROM profiles WHERE email=?";

            conn.query(sqlStmt, [email], (err, result) => {

                conn.release();

                if(err)
                {
                    callback(err);
                    return;
                }

                if(result && (result[0].email === email && result[0].pass === pass))
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

            let sqlStmt = "SELECT * FROM profiles WHERE id=?";

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

            let sqlStmt = "SELECT points FROM profiles WHERE id=?";

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

            let sqlStmt = "UPDATE profiles SET email=?, pass=?, name=?, gender=?, dob=? WHERE id=?";

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

            let sqlStmt = "SELECT user1, user2, status, u1.name AS name1, u2.name AS name2 FROM friendships, " +
                "profiles AS u1, profiles AS u2 WHERE friendships.user1=u1.id AND friendships.user2=u2.id AND " +
                "(friendships.user1=? OR friendships.user2=?)";

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

            let sqlStmt = "SELECT id, name, user1, user2, status FROM profiles LEFT JOIN friendships ON " +
                "(profiles.id=friendships.user1 AND friendships.user2=?) OR (profiles.id=friendships.user2 AND " +
                "friendships.user1=?) WHERE id<>? AND name LIKE ?";


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


            let sqlStmt = "UPDATE friendships SET status=0 WHERE user1=? AND user2=?";

            let users;

            if (user1 < user2)
                users = [user1, user2];
            else
                users = [user2, user1];

            conn.query(sqlStmt, users, err => {

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


            let sqlStmt = "DELETE FROM friendships WHERE user1=? AND user2=?";

            let users;

            if (user1 < user2)
                users = [user1, user2];
            else
                users = [user2, user1];

            conn.query(sqlStmt, users, err => {

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

            let users;

            if (user1 < user2)
                users = [user1, user2, 1];
            else
                users = [user2, user1, 2];

            conn.query(sqlStmt, [users], err => {

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

            let sqlStmt = "SELECT image FROM profiles WHERE id=?";

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