const express = require('express')
const asyncCatch = require('../utils/asyncCatch')
const router = express.Router()
const User = require('../models/userModel')
const { route } = require('./review_routes')
const passport = require('passport')
const user = require('../controllers/user.js')
const middleware = require('../middleware.js')

router.route('/register').get(user.registerForm)
.post(asyncCatch(user.register))

router.route('/login').get(user.loginForm)
    .post(passport.authenticate('local', {failureFlash:true , failureRedirect:'/login'}), user.login)

router.get('/login', user.loginForm)

router.get('/profile', middleware.isLogin, user.profile)

router.get('/logout', user.logout)

module.exports = router