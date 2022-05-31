const express = require('express')
const { signup_get, login_get, signup_post, login_post, logout_get } = require('../controllers/authControllers')
const router = express.Router()

router.route('/signup').get(signup_get).post(signup_post)
router.route('/login').get(login_get).post(login_post)
router.route('/logout').get(logout_get)

module.exports = router