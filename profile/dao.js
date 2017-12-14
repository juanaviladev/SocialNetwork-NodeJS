class ProfileDAO
{

    constructor(pool)
    {
        this.pool = pool;
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

    addPointsToUser(userId, newPoints,callback)
    {
        this.pool.getConnection((err, conn) => {

            if(err)
            {
                callback(err);
                return;
            }

            let sqlStmt = "UPDATE users SET points = points + ? WHERE id=?";

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
}

module.exports = {
    ProfileDAO: ProfileDAO
};