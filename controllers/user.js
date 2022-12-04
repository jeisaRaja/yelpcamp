const express = require('express')
const asyncCatch = require('../utils/asyncCatch')
const router = express.Router()
const User = require('../models/userModel')
const { route } = require('../routes/review_routes')
const passport = require('passport')

module.exports.registerForm = (req,res)=>{
    res.render('./user/register')
}

module.exports.register = async(req,res)=>{
    try{
        const {username,email,password} = req.body.user
        const user = new User({email , username})
        const regUser = await User.register(user, password)
        req.login(regUser, (err)=>{
            if(err){
                return next()
            }
            else{
                req.flash('success', "account made!")
                res.redirect('/campground')
            }
        })

    }catch(e){
        console.log(e)
        req.flash('error', e.message)
        res.redirect('/register')
    }
    
}

module.exports.loginForm = async(req,res)=>{
    res.render('./user/login')
}

module.exports.login =  (req,res)=>{
    const returnTo = req.session.returnTo || '/campground'
    console.log(returnTo)
    delete req.session.returnTo
    req.flash('success', "welcome back!")
    res.redirect(returnTo)
}

module.exports.logout = (req,res)=>{
    req.logOut();
    res.redirect('/login')
}