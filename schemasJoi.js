const Joi = require('joi')

module.exports.campgroundSchema = Joi.object({
    campground : Joi.object({
        title: Joi.string().required(),
        price: Joi.number().min(1).required(),
        location : Joi.string().required(),
        description : Joi.string().required(),
    }).required(), 
    deleteImage : Joi.array()
})

module.exports.ReviewSchema = Joi.object({
    review : Joi.object({
        rating: Joi.number().required(),
        msg: Joi.string(),
    }).required()
})