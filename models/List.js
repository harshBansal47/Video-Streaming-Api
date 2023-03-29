const mongoose = require('mongoose')

const ListSchema= mongoose.Schema({
    title:{
        type:String,
        required:true,
        unique:true
    },
    type:{
        type:String
    },
    genre:{
        type:String
    },
    content:{
        type:Array
    }
},{timestamps:true})

const list = mongoose.model('list',ListSchema)

module.exports = list