const express = require('express')
const router = express.Router({mergeParams:true})
const Campground = require('../models/campModel')
const { ReviewSchema} = require('../schemasJoi')
const Review = require('../models/reviewModel')

const appError = require('../utils/appError')
const asyncCatch = require('../utils/asyncCatch')
const review = require('../controllers/review')
const validateReview = (req,res,next)=>{
    const {error} = ReviewSchema.validate(req.body);
    if(error){
        console.log(error)
        throw new appError(error.message, 400)
    }
    else{
        next()
    }
}
router.get('/review/:reviewid', async (req,res)=>{
    const reviewid = req.params.reviewid
    const id = req.params.id
    const editreview = await Review.findById(reviewid)
    const campground = await Campground.findById(id) 
    console.log(editreview)

    res.render('review/edit.ejs', {editreview, campground})
})

router.put('/review/:reviewid', async(req,res)=>{
    const {id,reviewid} = req.params
    const editreview = await Review.findByIdAndUpdate(reviewid, {...req.body.review},{ runValidators: false })
    res.redirect(`/campground/${id}`)
})

router.post('/review', validateReview,asyncCatch(review.createReview))
router.delete('/review/:reviewid', asyncCatch(review.deleteReview))
module.exports = router;