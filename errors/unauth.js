const { StatusCodes } = require('http-status-codes')

class UnauthError extends Error {
    constructor(message) {
        super(message)
        this.statusCode = StatusCodes.UNAUTHORIZED
    }
}
module.exports = UnauthError