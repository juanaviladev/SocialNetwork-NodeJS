function alertsMiddleware(request,response, next)
{

    response.setAlert = (alertList) => {
        request.session.alertList = alertList;
    };

    response.locals.getAlert = () => {
        let alertList = request.session.alertList;
        delete request.session.alertList;
        return alertList;

    };

    next();
}


module.exports = {
    alertsMiddleware: alertsMiddleware
};