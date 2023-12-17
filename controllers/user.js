const express = require('express')
const asyncCatch = require('../utils/asyncCatch')
const router = express.Router()
const User = require('../models/userModel')
const Campground = require('../models/campModel')
const { route } = require('../routes/review_routes')
const passport = require('passport')

module.exports.profile = async (req, res) => {
    const user = req.user

    res.render('./user/profile')
}

module.exports.registerForm = (req, res) => {
    res.render('./user/register')
}

module.exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body.user
        const user = new User({ email, username })
        const regUser = await User.register(user, password)
        req.login(regUser, (err) => {
            if (err) {
                return next()
            }
            else {
                req.flash('success', "account made!")
                res.redirect('/campground')
            }
        })

    } catch (e) {
        console.log(e)
        req.flash('error', e.message)
        res.redirect('/register')
    }

}

module.exports.loginForm = async (req, res) => {
    if (req.user) {
        req.flash('warning', 'you already logged in!')
        return res.redirect('/campground')
    }
    res.render('./user/login')
}

module.exports.login = (req, res) => {
    const returnTo = req.session.returnTo || '/campground'
    delete req.session.returnTo
    req.flash('success', "welcome back!")
    return res.redirect(returnTo)
}

module.exports.logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        return res.redirect('/');
    });
    res.redirect('/login')
}

module.exports.profile = async (req, res, next) => {
    if (!req.user) {
        req.flash('warning', "Please login first!")
        return res.redirect('/login')
    }
    const userCamps = await Campground.find({ author: req.user._id }); 

    res.render('./user/profile', {userCamps})
}