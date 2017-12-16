"use strict";

//---------------------------------------------------------------------------------------
// superclass for hosting common methods
//---------------------------------------------------------------------------------------

class DaoCommon {

    constructor(pool)
    {
        this.pool = pool;
    }

    checkEmail(email, callback)
    {
        this.pool.getConnection((err, conn) => {

            if(err) {
                callback(err);
                return;
            }

            let sqlStmt = "SELECT * FROM users WHERE email=?";

            conn.query(sqlStmt, [email],(err, result) => {

                conn.release();

                if(err) {
                    callback(err);
                    return;
                }

                if(result.length !== 0)
                    callback(null, result[0].id);
                else
                    callback(null);

            });
        });
    }

}


module.exports = {
    DaoCommon: DaoCommon
};

