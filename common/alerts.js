function alertsMiddleware(request,response, next)
{

    response.setAlert = (alertObject = {}) => {
        request.session.alert = alertObject;
    };

    response.locals.getAlert = () => {
        let alert = request.session.alert;
        delete request.session.alert;
        return alert;

    };

    next();
}


module.exports = {
    alertsMiddleware: alertsMiddleware
};