const mongoose = require("mongoose")
const UserSchema = new mongoose.Schema({
    firstName :{
        type: String,
        required: true},
    lastName  :String,
    number:Number,
    email:{
        type: String,
        required: true,
        unique : true
    },
    password:String,
})


const User = mongoose.model('User', UserSchema);

module.exports = User ;