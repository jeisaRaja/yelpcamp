if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

console.log(process.env.CLOUDINARY_SECRET)

const dbURL = process.env.DB_URL
const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const Campground = require('./models/campModel')
const Review = require('./models/reviewModel')
const ejsMate = require('ejs-mate')
const appError = require('./utils/appError')
const asyncCatch = require('./utils/asyncCatch')
const {campgroundSchema, ReviewSchema} = require('./schemasJoi')
const app = express()
const methodOverride = require('method-override')
const session = require('express-session')
const MongoDBStore = require('connect-mongo')
const flash = require('connect-flash')
const passport = require('passport')
const passportLocal = require('passport-local')
const User  = require('./models/userModel')


const review_routes = require('./routes/review_routes')
const campground_routes = require('./routes/campground_routes')
const user_routes = require('./routes/user_routes')
// mongodb://localhost:27017/yelpcamp
mongoose.connect(dbURL, {
    useNewUrlParser:true,
}).then(()=>{
    console.log('success')
})
.catch((err)=>{
    console.log('fail', err)    
})


db = mongoose.connection
db.once("open", ()=>{
    console.log("Database Connected!")
})


app.engine('ejs', ejsMate)
app.use(methodOverride('_method'))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname,'views'))
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname, 'public')))

// const store = new MongoDBStore({
//     url: dbURL,
//     secret: 'this_is_the_secret!youKnow',
//     touchAfter: 24*60*60,
// })

// store.on("error", (e)=>{
//     console.log(e)
// })
const session_config = {
    store: MongoDBStore.create({
        mongoUrl : dbURL,
        secret: 'this_is_the_secret!youKnow',
        touchAfter: 24*60*60,
    }),
    secret: 'this_is_the_secret',
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:false,
        expires: Date.now()+ 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    }
}
app.use(session(session_config))
app.use(passport.initialize())
app.use(passport.session())
passport.use(new passportLocal(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use(flash());   

app.use((req,res,next)=>{

    if (!['/login', '/register','/logout', '/'].includes(req.originalUrl)){
        req.session.returnTo = req.originalUrl
    }
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currUser = req.user
    next();
})

app.get('/', (req,res)=>{
    res.redirect('/campground')
})

app.get('/fakeuser' , async(req,res)=>{
    const user = new User({email:"colt@gmail.com" , username:'colt'})
    const newUser = await User.register(user , "passwordku")
    res.send(newUser)

})

// Campground routes
app.use('/campground' , campground_routes);
// Review routes
app.use('/campground/:id', review_routes);
// User routes
app.use('/', user_routes)

app.all('*', (req,res,next)=>{
    next(new appError('Page Not Found', 404))
})
app.use((err,req,res,next)=>{
    const {message = "Something went wrong", statusCode = 500} = err
    res.status(statusCode).render('error' , {message,statusCode})
})

app.listen(process.env.PORT, ()=>{
    console.log('Serving the localhost')
})