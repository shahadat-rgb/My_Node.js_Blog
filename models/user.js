const mongoose = require("mongoose");

// define schema
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        minlength:4
    },
    email:{
        type:String,
        required:true
    },

    password:{
        type:String,
        required:true,
        minlength:6
    }

},{timestamps:true})

// // create model 
const Users = mongoose.model("user", userSchema);
module.exports = Users;