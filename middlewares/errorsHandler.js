module.exports = function errorHandler(err, req, res, next) {
    let status = err.status || 500
    let message = err.message || "Internal server error"
    console.log(err)
    switch (err.name) {
        case "SequelizeValidationError":
        case "SequelizeUniqueConstrainError":
            status = 400
            message = err.errors[0].message;
            break;
        case "NoEmail":
            status = 400
            message = "Email required"
            break;
        case "NoPassword":
            status = 400
            message = "Password required"
            break;
        case "InvalidToken":
        case "JsonWebTokenError":
            status = 401
            message = "Invalid token"
            break;
        case "Invalid email/password":
            status = 401
            message = "Invalid email/password"
            break;
    }
    res.status(status).json({ message });
}