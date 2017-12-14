const dbPool = require("./../common/db.js").pool;
const DAOUsers = require("./dao.js");

const daoU = new DAOUsers.ProfileDAO(dbPool);

function middlewareGetPoints(request, response, next)
{
    daoU.getUserPoints(response.locals.currentUser, (err, points) => {

        if(err)
            next(err);
        else {
            response.locals.currentPoints = points;
            next();
        }

    });



}

module.exports = middlewareGetPoints;