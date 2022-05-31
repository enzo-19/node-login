const { StatusCodes } = require("http-status-codes")
const User = require('../models/User')
const { UnauthError } = require('../errors')

const login_get = async (req, res) => {
    res.status(StatusCodes.OK).render('login', {route: 'login'}) // route se usa en la vista del formulario
}
const signup_get = async (req, res) => {
    res.status(StatusCodes.OK).render('signup', {route: 'signup'})    
}
const login_post = async (req, res) => {
    // leemos los datos enviados por el cliente
    const { email, password } = req.body
    // buscamos el email supuestamente registrado
    const user = await User.findOne({email})
    if(!user) {
        throw new UnauthError('incorrect email')
    }
    // comprobamos que la contraseña sea correcta     
    const isPWDCorrect = await user.comparePWD(password)
    if(!isPWDCorrect) {
        throw new UnauthError('incorrect password')
    }
    // creamos el token
    const token = user.createJWT()
    // guardamos el token en una cookie
    res.cookie('jwt', token, { httpOnly: true, secure: true, maxAge: 3 * 24 * 60 * 60 * 1000 })
    // devolvemos como respuesta el id del usuario creado
    res.status(StatusCodes.OK).json({ user: user._id })
}
const signup_post = async (req, res) => {
    // leemos los datos enviados por el cliente
    const { email, password } = req.body
    // creamos un nuevo registro
    const user = await User.create({email, password})
    // creamos el token
    const token = user.createJWT()
    // guardamos el token en una cookie
    res.cookie('jwt', token, { httpOnly: true, secure: true, maxAge: 3 * 24 * 60 * 60 * 1000 })
    // devolvemos como respuesta el id del usuario creado
    res.status(StatusCodes.CREATED).json({ user: user._id })
}
const logout_get = async (req, res) => {
    // no se puede eliminar una cookie desde acá, lo que vamos a hacer en cambio es remplazarla por otra cookie que va a expirar luego de 1 milisegundo
    res.cookie('jwt', '', { maxAge: 1})
    res.redirect('/')
}


module.exports = {
    login_get, 
    signup_get,
    login_post,
    signup_post,
    logout_get
}