const express = require('express');
const router = express.Router();
const dbPool = require("./../common/db.js").pool;
const FriendsDAO = require("./../friends/dao.js");
const path = require("path");

const middlewareAuthentication = require('./../auth/auth_middleware.js');
const middlewareGetPoints = require('./../profile/points_middleware.js');

const viewPath = path.join(__dirname,"/view");

let daoU = new FriendsDAO.FriendsDAO(dbPool);

router.get("/", middlewareAuthentication, middlewareGetPoints, (request, response, next) => {

    let word = request.query.search;

    daoU.searchFriends(request.session.currentUser, word, (err, result) => {

        if(err)
            return next(err);

        if(result.length !== 0)
            result.sort((x,y) => x["name"].localeCompare(y["name"]));

        response.render(path.join(viewPath,"search_results"), {searchResult: result, word: word});

    });

});

module.exports = {
    router:router,
    viewPath:__dirname + viewPath
};
