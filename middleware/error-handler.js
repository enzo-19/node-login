const { StatusCodes } = require('http-status-codes')

const errorHandler = (err, req, res, next) => {
    let customError = {
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        msg : {}
    }

    // login error: el email ingresado no está registrado
    if (err.message === 'incorrect email') {
        customError.msg["email"] = 'este correo no está registrado'
    }
    // login error: la contraseña es incorrecta
    if (err.message === 'incorrect password') {
        customError.msg["password"] = 'contraseña incorrecta'
    }
    // signup error: ocurre cuando intentamos registrar un email que ya está registrado
    if (err.code && err.code === 11000) {
        customError.msg[Object.keys(err.keyValue)] = `${Object.keys(err.keyValue)} is already registered`
        customError.statusCode = StatusCodes.BAD_REQUEST
    }
    // signup error: ocurre cuando el email o la contraseña no cumple con lo que le especificamos en el modelo User 
    if (err.name === 'ValidationError') {
        Object.values(err.errors).forEach(el => {
            customError.msg[el.path] = el.message
        })
        customError.statusCode = StatusCodes.BAD_REQUEST
    }

    // después intentar devolver todo el objeto customError
    return res.status(customError.statusCode).json({error: customError})
}

module.exports = errorHandler