const BadRequest = require("./bad-request");
const CustomAPIError = require("./custom-error");
const UnauthError = require("./unauth");
const NotFound = require("./unauth");

module.exports = {
    CustomAPIError,
    BadRequest,
    UnauthError,
    NotFound
}