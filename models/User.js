const mongoose = require('mongoose')

//defining Schemas

const userSchema = new mongoose.Schema({
    name:{type:String, required:true, trim:true},
    email:{type:String, required:true, trim:true},
    password:{type:String, required:true, trim:true},
    tc:{type:Boolean, required:true}
})

//defining models for schema

const UserModel = mongoose.model('sRuser', userSchema)

module.exports =  UserModel