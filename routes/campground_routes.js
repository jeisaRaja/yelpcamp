const express = require('express')
const router = express.Router()
const passport = require('passport')
const {campgroundSchema} = require('../schemasJoi')
const asyncCatch = require('../utils/asyncCatch')
const appError = require('../utils/appError')
const middleware = require('../middleware')
const Campground = require('../models/campModel')
const {storage} = require('../cloudinary')
const multer = require('multer')
const upload = multer({storage})

const campground = require('../controllers/campground')
const validateCampground = (req,res,next)=>{
    const { error } = campgroundSchema.validate(req.body);
    console.log(error);
    if (error) {
        console.log("validate error")
        const msg = error.details.map(el => el.message).join(',')
        throw new appError(msg, 400)
    } else {
        next();
    }
}

router.route('/')
    .get(asyncCatch(campground.index))
    // .post(middleware.isLogin, validateCampground,asyncCatch(campground.createCampground))
    .post(middleware.isLogin, upload.array('images') , validateCampground, asyncCatch(campground.createCampground))

router.get('/new', middleware.isLogin, campground.renderNewForm)


router.route('/:id')
    .get(asyncCatch(campground.showCampground))
    .put(middleware.isLogin,upload.array('images'), validateCampground, asyncCatch(campground.editCampground))
    .delete( middleware.isLogin, campground.deleteCampground)

router.get('/:id/edit' , middleware.isLogin,campground.editForm)

module.exports = router;