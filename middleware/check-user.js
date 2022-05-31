const jwt = require('jsonwebtoken')
const User = require('../models/User')

const checkUser = (req, res, next) => {
    const token = req.cookies.jwt

    if(token) { 
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
            if (err) {
                console.log(err.message)
                res.locals.user = null
            } else {
                // console.log(decodedToken)
                let user = await User.findById(decodedToken.userId)
                // console.log(user)
                res.locals.user = user
            }
            next()
        })

    } else {
        res.locals.user = null
        next()
    }

}

module.exports = checkUser