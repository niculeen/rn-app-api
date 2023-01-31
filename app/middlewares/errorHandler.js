const msg = require("../config/message.config")
function errorHandler(err, req, res, next) {
    console.log(err)
    if (err) {
        if (!res.statusCode || res.statusCode === 200) {
            res.status(400).send({ message: msg.error._400, err });
        }
        return res.send({ messge: msg.error._500, error: err.message })
    } else {
        next();
    }
}

module.exports = errorHandler;