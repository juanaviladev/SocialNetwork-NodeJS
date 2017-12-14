const path = require("path");
const viewPath = path.join(__dirname,"/view");

function serverError(error,request, response, next){
    console.log(error.stack);
    response.status(500);
    response.render(path.join(viewPath,"errorPage"), {errMsg: error.message, status: 500});
}

module.exports = serverError;