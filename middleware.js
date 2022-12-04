
const Campground = require('./models/campModel');

const isLogin = (req,res,next)=>{
    if(!req.user){
        
        req.flash('error', 'You must sign in first!')
        return res.redirect('/login')
    }
    next();
}

const isAuthor = async(req,res,next)=>{
    const {id} =  req.params
    const camp = await Campground.findById(id)
    if(!camp.author.equals(req.user._id)){
        console.log(camp.author._id , req.user._id)
        req.flash('error' , "You dont have the authorization needed")
        return res.redirect(`/campground/${id}`)
    }
    console.log('author correct')
    next()
}



module.exports.isLogin = isLogin
module.exports.isAuthor = isAuthor
