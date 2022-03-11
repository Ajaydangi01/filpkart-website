const { User, Otp } = require("./schema")
const bcrypt = require("bcrypt")
const crypto = require('crypto')
const { emailSend, otpFunction } = require("../middleware/index")
require('dotenv').config()
const port = process.env.PORT
const host = process.env.HOST
const secretKey = process.env.KEY

module.exports = {
    signup: async (req, res) => {
        const email = await User.findOne({ email: req.body.email })
        if (email) {
            res.status(409).json({ status: 409, message: "email already exist" })
        }
        else {
            const secret = 'abcdefg';
            const hash = crypto.createHmac('sha256', secret)
                .update(secretKey)
                .digest('hex');
            const result = new User(req.body)
            result.token = hash
            const token = hash
            console.log(token)
            result.save().then((dataResult) => {
                const link = `http://${host}:${port}/api/confirmEmail/${token}`;
                res.status(200).json({ status: 200, message: "singup successfully" })
                emailSend(link);
            }).catch((error) => {
                console.log(error)
            })
        }
    },

    SellerLogin: async (req, res) => {
        try {
            if (req.body.email) {
                const result = await User.findOne({ email: req.body.email })
                if (result) {
                    const passwordMatch = await bcrypt.compare(req.body.password, result.password);
                    if (result.isVerified === true) {
                        if (passwordMatch) {
                            res.status(200).json({ status: 200, message: "Login Successfully" })
                        }
                        else {
                            res.status(409).json({ status: 409, message: "Enter Correct Password" })
                        }
                    }
                    else {
                        res.status(400).json({ status: 400, message: "Email not verified" })
                    }
                }
                else{
                    res.status(400).json({ status: 400, message: "Email not found" })
                }
            }
            else if (req.body.number) {
                const result = await User.findOne({ number: req.body.number })
                if (result) {
                    const newData = otpFunction()
                    const otpresult = await Otp.create({ number: req.body.number, otp: newData })
                    res.status(200).json({ status: 200, message: "OTP sent on your number" })
                }
                else {
                    res.status(404).json({ status: 404, message: "User not found" })
                }
            }
            else {
                res.status(400).json({ status: 400, message: "Enter number/email" })
            }
        } catch (error) {
            console.log(error)
        }
    },

    adminLogin: async (req, res) => {
        try {
            const result = await User(req.body)
            result.save().then((dataResult) => {
                res.status(200).json({ status: 200, message: "Admin login" })
            })
        } catch (error) {
            res.status(400).json({ status: 400, message: error })
        }
    },

    confirmEmail: async (req, res) => {
        try {
            const result = await User.findOne({ token: req.params.token })
            const token = req.params.token
            const finalResult = result.token
            const verify = result.isVerified
             if (finalResult === token) {
                const newResult = await User.findOneAndUpdate({ token: req.params.token }, { isVerified: true, token: "" }, { new: true })
                res.status(200).json({ status: 200, message: "You're eligible for login" })
            }
            else {
                res.status(400).json({ status: 400, message: "Bad request" })
            }
        } catch (error) {
            res.status(400).json({ status: 400, message: "Insert valid token" })
        }
    },

    verifyOtp: async (req, res) => {
        try {
            if (req.body.number) {
                const result = await Otp.findOne({ number: req.body.number })
                if (result) {
                    const otpMatch = await Otp.findOne({ otp: req.body.otp })
                    if (otpMatch) {
                        const newResult = await Otp.findOneAndUpdate({ otp: req.body.otp }, { isVerified: true}, { new: true })
                        if (newResult.isVerified === true) {
                            res.status(200).json({ status: 200, message: "Login Successfully" })
                        }
                        else {
                            res.status(409).json({ status: 409, message: "Enter Correct Otp" })
                        }
                    }
                    else {
                        res.status(400).json({ status: 400, message: "Number not verified" })
                    }
                }
                else{
                    res.status(400).json({ status: 400, message: "Number not found" })
                }
            }
            else{
                res.status(400).json({ status: 400, message: "Empty filled not allowed , Enter number" })
            }
        } catch (error) {
            console.log(error)
        }

    },

    getAllSellers : async (req,res) => {
        try {
            const result = await User.find()
            res.status(200).json({status : 200 , message : result})
        } catch (error) {
            console.log(error)
        }
    },

    
    
}

