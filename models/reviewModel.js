const Joi = require('joi')
const mongoose= require('mongoose')
const {Schema} = require('mongoose')
const userModel = require('./userModel')

const ReviewSchema = new Schema({
    rating: {
        type : Number,
        required : false
    },
    msg: {
        type: String,
        required: false
    },
    author:{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }
})

module.exports = mongoose.model("Review" , ReviewSchema)