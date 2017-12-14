function middlewareAuthentication(request, response, next){

    let user = request.session.currentUser;

    if(user)
    {
        response.locals.currentUser = user;
        next();
    }
    else
        response.redirect("/login");

}

module.exports = middlewareAuthentication;