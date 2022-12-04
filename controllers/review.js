const express = require('express')
const router = express.Router({mergeParams:true})
const Campground = require('../models/campModel')
const { ReviewSchema} = require('../schemasJoi')
const Review = require('../models/reviewModel')
const appError = require('../utils/appError')
const asyncCatch = require('../utils/asyncCatch')

module.exports.createReview = async(req,res)=>{
    console.log(req.body)
    const {id}  = req.params;
    const review = new Review(req.body.review);
    const campground = await Campground.findById(id);
    review.author = req.user._id
    campground.reviews.push(review);
    await campground.save()
    await review.save()
    res.redirect(`/campground/${campground._id}`)
}

module.exports.deleteReview = async(req,res)=>{
    console.log(req.body)
    const {reviewid, id} = req.params
    const deleted_review = await Review.findByIdAndRemove(reviewid)
    console.log(deleted_review)
    res.redirect(`/campground/${id}`)

}
