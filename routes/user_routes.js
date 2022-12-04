const express = require('express')
const asyncCatch = require('../utils/asyncCatch')
const router = express.Router()
const User = require('../models/userModel')
const { route } = require('./review_routes')
const passport = require('passport')
const user = require('../controllers/user.js')


router.route('/register').get(user.registerForm)
.post(asyncCatch(user.register))

router.route('/login').get(user.loginForm)
    .post(passport.authenticate('local', {failureFlash:true , failureRedirect:'/login'}), user.login)

router.get('/login', user.loginForm)


router.get('/logout', user.logout)

router.get('/superUser', asyncCatch(async(req,res)=>{
    const user = req.user
    console.log(user)
    const userDB = await User.findById(user._id)
    userDB.status = 'superuser'
    await userDB.save()
    res.send(userDB)
}))

module.exports = router