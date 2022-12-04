const mongoose =  require('mongoose');
const reviewModel = require('./reviewModel');
const Schema = mongoose.Schema


const ImageSchema = new Schema({

        url : String,
        filename: String,

})

ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload', '/upload/w_200')
})

ImageSchema.virtual('m_thumbnail').get(function(){
    return this.url.replace('/upload', '/upload/c_crop,w_800,h_400')
})

const CampgroundSchema = new Schema ({
    title: {
        type : String,
        required : true},
    price: {
        type : Number,
        required : true,
        min: 1
    },
    images: [ImageSchema],
    description: {
        type : String,
        required : true},
    location: {
        type : String,
        required : true},
    author:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

CampgroundSchema.post('findOneAndDelete', async function (doc){
    console.log(doc)
    if(doc){
        await reviewModel.deleteMany({
                _id:{
                    $in:doc.reviews
                }
            }
        )
    }
})
module.exports = mongoose.model('Campground', CampgroundSchema)
