"use strict";

class FriendsDAO
{
    constructor(pool)
    {
        this.pool = pool;
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

            let sqlStmt = "SELECT from_user, to_user, status, u1.name AS name1, u2.name AS name2 FROM friendship, " +
                "users AS u1, users AS u2 WHERE friendship.from_user=u1.id AND friendship.to_user=u2.id AND " +
                "(friendship.from_user=? OR friendship.to_user=?)";

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

            let sqlStmt = "SELECT id, name, from_user, to_user, status FROM users LEFT JOIN friendship ON " +
                "(users.id=friendship.from_user AND friendship.to_user=?) OR (users.id=friendship.to_user AND " +
                "friendship.from_user=?) WHERE id<>? AND name LIKE ?";


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

    areFriends(user1, user2, callback)
    {
        this.pool.getConnection((err, conn) => {

            if (err) {
                callback(err);
                return;
            }

            let sqlStmt = "SELECT Count(from_user) AS are_friends FROM friendship WHERE ((from_user = ? AND to_user = ?) OR" +
                "(from_user = ? AND to_user = ?)) AND status = ?";

            conn.query(sqlStmt, [user1, user2,user2,user1,"accepted"], (err,result) => {

                conn.release();

                if(err)
                    return callback(err);

                callback(null,result[0].are_friends === 1);

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


            let sqlStmt = "UPDATE friendship SET status='accepted' WHERE from_user=? AND to_user=?";

            conn.query(sqlStmt, [user2, user1], err => {
                conn.release();

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


            let sqlStmt = "DELETE FROM friendship WHERE from_user=? AND to_user=?";

            conn.query(sqlStmt, [user2, user1], err => {
                conn.release();

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


            let sqlStmt = "INSERT INTO friendship VALUES (?)";

            conn.query(sqlStmt, [[user1, user2, "pending"]], err => {
                conn.release();

                if(err)
                    return callback(err);

                callback(null);

            });
        });



    }

}

module.exports = {
    FriendsDAO: FriendsDAO
};