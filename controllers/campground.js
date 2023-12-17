const Campground = require('../models/campModel')
const {cloudinary} = require('../cloudinary')


module.exports.index = async(req,res)=>{
    const limit = req.query.limit || 5
    const currPage = req.query.page || 1
    const searchTerm = req.query.s || null
    let query = {}
    if (searchTerm) {
        query.$or = [
          { title: { $regex: new RegExp(searchTerm, 'i') } },
          { location: { $regex: new RegExp(searchTerm, 'i') } }
        ];
      }
    const count = await Campground.countDocuments(query)
    const campground = await Campground.find(query).skip((currPage-1)*limit).limit(limit)
    const totalPage = Math.ceil(count/limit)
    res.render('./campground/index' , {campground,totalPage, currPage, searchTerm})
}

module.exports.renderNewForm = async(req,res)=>{
    res.render('./campground/new')
}
module.exports.editForm = async(req,res)=>{
    const {id} = req.params
    const campground = await Campground.findById(id)
    res.render('./campground/edit' , {campground})
}
module.exports.createCampground = async(req,res,next)=>{
    const data = req.body.campground
    const images = req.files.map(f=>({url:f.path, filename:f.filename}))
    const newcamp = new Campground(data)
    newcamp.images = images
    newcamp.author = req.user
    await newcamp.save();
    req.flash('success', 'Added New Campground')
    res.redirect(`/campground/${newcamp._id}`)
}
module.exports.editCampground = async(req,res,next)=>{
    const {id} =  req.params
    console.log(req.body)
    const imgs = req.files.map(f=>({url:f.path, filename:f.filename}))
    const editedCampground = await Campground.findByIdAndUpdate(id, {...req.body.campground},{ runValidators: false })
    editedCampground.images.push(...imgs)
    await editedCampground.save()
    if(req.body.deleteImage){
        for(let filename of req.body.deleteImage){
            await cloudinary.uploader.destroy(filename)
        }
        await editedCampground.updateOne({$pull:{images:{filename:{$in: req.body.deleteImage}}}})
    }
    res.redirect(`/campground/${id}`)
}

module.exports.deleteCampground = async(req,res)=>{
    const {id} =  req.params
    const camp = await Campground.findById(id).populate('author')
    if(camp.author.equals(req.user)){
        const deleted = await Campground.findByIdAndDelete(id)
        return redirect('/campground')
    }
    else{
        req.flash('error' , "Only the author can remove campground!")
        return res.redirect(`/campground/${id}`)
    }

}

module.exports.showCampground =async(req,res)=>{
    const user = req.user
    const {id} = req.params
    const campground = await Campground.findById(id).populate({path:'reviews', populate:'author'})
    .populate('author')
    const response = await fetch(`https://geocode.search.hereapi.com/v1/geocode?q=${campground.location}&apiKey=${process.env.HERE_MAP_API_KEY}`)
    const resData = await response.json()
    console.log()
    const position = resData.items[0].position
    console.log(position)
    if(!campground) throw new appError()
    return res.render('./campground/show', {campground, user, position})
}