const path = require("path");
const viewPath = path.join(__dirname,"/view");

function notFound(request, response){
    console.log("ROUTE NOT FOUND: " + request.path);
    response.status(404);
    response.render(path.join(viewPath,"errorPage"), {errMsg: "Not Found !", status: 404});
}

module.exports = notFound;