const { User, Otp } = require("./schema")
const bcrypt = require("bcrypt")
const crypto = require('crypto')
const jwt = require('jsonwebtoken');
const { emailSend, otpFunction } = require("../middleware/index");
const { AwsInstance } = require("twilio/lib/rest/accounts/v1/credential/aws");
require('dotenv').config()
const port = process.env.PORT
const host = process.env.HOST
const secretKey = process.env.KEY

module.exports = {
    signup: async (req, res) => {
        const email = await User.findOne({ email: req.body.email })
        if (email) {
            res.status(409).json({ status: 409, message: "email already exist" , success : false })
        }
        else if (req.body.number) {
            const result = await User.findOne({ number: req.body.number })
            if (result) {
                res.status(404).json({ status: 404, message: "email already exist", success : false  })
            }
            else {
                const result = new User(req.body)
                result.save().then((dataResult) => {
                    const newData = otpFunction()
                    const otpresult = Otp.create({ number: req.body.number, otp: newData })
                    res.status(200).json({ status: 200, message: "singup successfully", success : true  })
                }).catch((error) => {
                    console.log(error)
                })
            }
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
                        if (result.isVerifiedByAdmin === true) {
                            if (passwordMatch) {
                                const token = jwt.sign({ email: this.email }, "adsfdsfdfdsffsd!", { expiresIn: "1h" }, (err, decoded) => {
                                    if (decoded) { console.log(decoded) } else { console.log(err) }
                                    res.status(200).json({ status: 200, message: "Login Successfully" , success : true })
                                })
                            }
                            else {
                                res.status(400).json({ status: 400, message: "Enter Correct Password", success : false  })
                            }
                        }
                        else {
                            res.status(200).json({ status: 200, message: "You are not verified by admin" })
                        }
                    }
                    else {
                        res.status(400).json({ status: 400, message: "Email not verified", success : false  })
                    }
                }
                else {
                    res.status(400).json({ status: 400, message: "Email not found", success : false  })
                }
            }
            else if (req.body.number) {
                const result = await User.findOne({ number: req.body.number })
                if (result) {
                    const otpMatch = await Otp.findOne({ otp: req.body.otp })
                    if (otpMatch) {
                        const newResult = await Otp.findOneAndUpdate({ otp: req.body.otp }, { isVerified: true }, { new: true })
                        if (newResult.isVerified === true) {
                            res.status(200).json({ status: 200, message: "Login Successfully", success : true  })
                        }
                        else {
                            res.status(409).json({ status: 409, message: "Number not verified" , success : false  })
                        }
                    }
                    else {
                        res.status(400).json({ status: 400, message: "Enter Correct Otp" , success : false })
                    }
                }
                else {
                    res.status(404).json({ status: 404, message: "User not found", success : false  })
                }
            }
            else {
                res.status(400).json({ status: 400, message: "Enter number/email", success : false  })
            }
        } catch (error) {
            console.log(error)
            res.status(400).json({status : 400 , message : error, success : false })
        }
    },

    adminLogin: async (req, res) => {
        try {
            if (req.body.email) {
                const result = await User.findOne({ email: req.body.email })
                if (result) {
                    const passwordMatch = await bcrypt.compare(req.body.password, result.password);
                    if (result.role === "admin") {
                        if (result.isVerified === true) {
                            if (passwordMatch) {
                                res.status(200).json({ status: 200, message: "Login Successfully" , success : true })
                            }
                            else {
                                res.status(409).json({ status: 409, message: "Enter Correct Password", success : false  })
                            }
                        }
                        else {
                            res.status(200).json({ status: 200, message: "Email not verified", success : false  })
                        }
                    }
                    else {
                        res.status(400).json({ status: 400, message: "invalid user , Not a admin" , success : false  })
                    }
                }
                else {
                    res.status(400).json({ status: 400, message: "Email not found", success : false  })
                }
            } else if (req.body.number) {
                const result = await User.findOne({ number: req.body.number })
                if (result) {
                    const otpMatch = await Otp.findOne({ otp: req.body.otp })
                    if (otpMatch) {
                        const newResult = await Otp.findOneAndUpdate({ otp: req.body.otp }, { isVerified: true }, { new: true })
                        if (newResult.isVerified === true) {
                            res.status(200).json({ status: 200, message: "Login Successfully", success : true  })
                        }
                        else {
                            res.status(409).json({ status: 409, message: "Enter Correct Otp", success : false  })
                        }
                    }
                    else {
                        res.status(400).json({ status: 400, message: "Number not verified" , success : false })
                    }
                }
                else {
                    res.status(404).json({ status: 404, message: "User not found", success : false  })
                }
            }
            else {
                res.status(400).json({ status: 400, message: "Enter number/email" , success : false })
            }
        } catch (error) {
            res.status(400).json({ status: 400, message: error, success : false  })
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
                res.status(200).json({ status: 200, message: "You're eligible for login", success : true  })
            }
            else {
                res.status(400).json({ status: 400, message: "Bad request", success : false  })
            }
        } catch (error) {
            res.status(400).json({ status: 400, message: "Insert valid token" , success : false })
        }
    },

    verifiedByAdmin: async (req, res) => {
        try {
            const result = await User.findOne({ email: req.body.email });
            if (!result) {
                return res.status(400).send({ status: 400, message: "invalid user" })
            } else {
                const admin = await User.updateOne({ email: req.body.email }, { isVerifiedByAdmin: true })
                res.status(200).json({ messsage: "verified by admin" })
            }
        } catch (err) {
            res.status(400).json({status : 400, messsage: "invalid id", success : false  })
        }
    },

    getAllSellers: async (req, res) => {
        try {
            const result = await User.find()
            res.status(200).json({ status: 200, message: result , success : true })
        } catch (error) {
            console.log(error)
        }
    },



}

