const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const Campground = require('../models/campModel')
const cities = require('./cities')
const { descriptors, places } = require('./helper')

const app = express()

mongoose.connect('mongodb://localhost:27017/yelpcamp', {
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

const sample = (array)=> array[Math.floor(Math.random() * array.length)]
const seedCamp = async ()=>{
    await Campground.deleteMany({})
    // const c = new Campground({title:'Side Creek'})
    // await c.save()
    for(let i=0 ; i<10 ; i++){
        const random1000 = Math.floor(Math.random()*1000);
        const price = Math.floor(Math.random()*20)+10
        const camp = new Campground({
            title:`${sample(descriptors)} ${sample(places)}`,
            location:`${cities[random1000].city}, ${cities[random1000].state}`,
            author:'61cd894aa21e4baba623e176',
            image:'http://source.unsplash.com/collection/484351',
            description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur",
            price
        })
        await camp.save() 
    }
}

seedCamp()
