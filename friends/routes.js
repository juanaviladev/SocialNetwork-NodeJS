const express = require('express');
const router = express.Router();
const authMiddleware = require('./../auth/auth_middleware.js');
const middlewareGetPoints = require('./../profile/points_middleware.js');
const path = require("path");
const multiParser = require("../common/session").middlewareMulter;

const viewPath = path.join(__dirname,"/view");
const dbPool = require("./../common/db.js").pool;
const FriendsDAO = require("./dao.js");
let daoU = new FriendsDAO.FriendsDAO(dbPool);

router.post("/accept", authMiddleware, middlewareGetPoints, multiParser.none(),(request, response, next) => {

    daoU.acceptFriendRequest(request.session.currentUser, request.body.otherUser, err => {

        if(err)
            return next(err);

        let word = request.body.currentWord;

        if(word === undefined)
            response.redirect("/friends");
        else
            response.redirect("/search?" + "search=" + word);


    });

});

router.post("/reject", authMiddleware, middlewareGetPoints, multiParser.none(),(request, response, next) => {

    daoU.rejectFriendRequest(request.session.currentUser, request.body.otherUser, err => {

        if(err)
            return next(err);

        let word = request.body.currentWord;

        if(word === undefined)
            response.redirect("/friends");
        else
            response.redirect("/search?" + "search=" + word);


    });

});

router.post("/request", authMiddleware, middlewareGetPoints, multiParser.none(),(request, response, next) => {

    daoU.friendRequest(request.session.currentUser, request.body.otherUser, err => {

        if(err)
            return next(err);

        let word = request.body.currentWord;

        response.redirect("/search?" + "search=" + word);

    });

});

router.get("/", authMiddleware, middlewareGetPoints, (request, response, next) => {

    let user = request.session.currentUser;

    daoU.getFriendshipDetails(user, (err, result) => {

        if(err)
            return next(err);

        let friends = [];
        let pending = [];
        let friendRequests = [];

        if(result.length)
        {
            result.forEach(row => {

                if(row.status === "accepted") {
                    if(row.from_user === user)
                        friends.push({id: row.to_user, name: row.name2});
                    else
                        friends.push({id: row.from_user, name: row.name1});
                }

                if(row.status === "pending")
                {
                    if(row.from_user === user)
                        pending.push({id: row.to_user, name: row.name2});
                    else
                        friendRequests.push({id: row.from_user, name: row.name1});
                }

            });
        }
        if(friends.length !== 0)
            friends.sort((x,y) => x["name"].localeCompare(y["name"]));
        if(pending.length !== 0)
            pending.sort((x,y) => x["name"].localeCompare(y["name"]));
        if(friendRequests.length !== 0)
            friendRequests.sort((x,y) => x["name"].localeCompare(y["name"]));

        response.render(path.join(viewPath,"friends"), {friends: friends, pending: pending,
            friendRequests: friendRequests});


    });
});

module.exports = {
    router: router
};
