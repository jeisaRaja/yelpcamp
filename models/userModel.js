const passport = require('passport')
const passportLocalMongoose = require('passport-local-mongoose')
const mongoose = require('mongoose')
const {Schema} = require('mongoose')


const UserSchema = new Schema({
    email : {
        type: String,
        required: true,
        unique: true
    },
    status : {
        type: String,
        enum: ['member' , 'superuser'],
        default:'member',
    }
})
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User' , UserSchema)