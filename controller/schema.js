const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const { hash } = require("bcrypt")
const { func, bool, boolean } = require("joi")
const UserSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    number: String,
    email: String,
    password: String,
    verifiedByAdmin:{ 
        type: Boolean,
        default: false
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    token: String,
    otp : Number,
    createdAt: {
        type: Date, required: true, default: Date.now
    }
})

const otpSchema = new mongoose.Schema({
    number : String,
    otp : Number,
    isVerified : {
        type : Boolean,
        default : false
    }

})

UserSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10)
    }
    next()
})

const User = mongoose.model('User', UserSchema);
const Otp = mongoose.model('Otp' , otpSchema)
module.exports = {User , Otp };