const { User } = require('../models/schema');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { logger } = require('./../shared/logger');
const Brand = require("./../models/brandSchema")
const Category = require("./../models/categorySchema")
const {
  emailSend, otpFunction, generateToken, showToFields, } = require('../middleware/index');
const { port, host, secretKey } = require('./../config/index');
const async = require('hbs/lib/async');

module.exports = {
  adminSignup: async (req, res) => {
    try {
      const { email, fullName, number, password } = req.body
      const foundUser = await User.findOne({ email });
      if (!foundUser) {
        req.body.role = 'admin';
        // const{fullName,number, password } = req.body
        const result = new User({ email, fullName, number, password, role: "admin" });
        result.save();
        const jwtToken = generateToken(result.id);
        res.status(200).json({ status: 200, message: 'singup successfully', jwtToken });
      } else {
        return res.status(409).json({ status: 409, message: 'email already exist', success: false, });
      }
    } catch (err) {
      res.status(400).send({ status: 400, message: err.message });
    }
  },

  signup: async (req, res) => {
    try {
      const email = await User.findOne({ email: req.body.email });
      if (!email) {
        const secret = 'abcdefg';
        const hash = crypto
          .createHmac('sha256', secret, { expiresIn: 350 })
          .update(secretKey)
          .digest('hex');
        req.body.role = 'seller';
        const result = new User(req.body);
        result.token = hash;
        const token = hash;
        const newMail = req.body.email;
        result.save();
        console.log(result.id)
        const jwtToken = generateToken(result.id);
        const link = `http://${host}:${port}/confirmEmail/${token}`;
        emailSend(link, newMail);
        res.status(200).json({ status: 200, message: 'Verification link sent on your email', jwtToken });
      } else {
        return res.status(409).json({ status: 409, message: 'email already exist', success: false, });
      }
    } catch (err) {
      res.status(400).send({ status: 400, message: err.message });
    }
  },

  SellerLogin: async (req, res) => {
    try {
      if (req.body.email) {
        const result = await User.findOne({ email: req.body.email });
        if (result) {
          const passwordMatch = await bcrypt.compare(
            req.body.password,
            result.password
          );
          if (result.isVerified === true) {
            if (result.isApprove === true) {
              if (passwordMatch) {
                if (result.role === 'seller') {
                  const token = generateToken(result.id);
                  res.status(200).json({ status: 200, message: 'Login Successfully', token, role: result.role, success: true, });
                } else {
                  res.status(400).json({ status: 400, message: 'invalid user , not a seller' });
                }
              } else {
                res.status(400).json({ status: 400, message: 'Enter Correct Password', success: false, });
              }
            } else {
              res.status(200).json({ status: 200, message: 'You are not verified by admin', });
            }
          } else {
            res.status(400).json({ status: 400, message: 'Email not verified', success: false });
          }
        } else {
          res.status(400).json({ status: 400, message: 'Email not found', success: false });
        }
      } else if (req.body.number) {
        const result = await User.findOne({ number: req.body.number });
        if (result) {
          const passwordMatch = await bcrypt.compare(
            req.body.password,
            result.password
          );
          if (passwordMatch) {
            if (result.isVerified === true) {
              if (result.isApprove === true) {
                const token = generateToken(result.id);
                res.status(200).json({ status: 200, message: 'Login Successfully', token, role: result.role, success: true });
              } else {
                res.status(400).json({ status: 400, message: 'Not verified by admin' });
              }
            } else {
              const Otp = otpFunction();
              const data = await User.findOneAndUpdate({ number: req.body.number }, { otp: Otp, resetTime: new Date(Date.now() + 10 * 60000) });
              res.status(200).json({ status: 200, message: 'Otp sent on register number', success: true });
            }
          } else {
            res.status(400).json({ status: 400, message: 'Enter Correct Password', success: false, });
          }
        } else {
          res.status(404).json({ status: 404, message: 'User not register', success: false });
        }
      } else {
        res.status(400).json({ status: 400, message: 'Enter number/email', success: false });
      }
    } catch (error) {
      res.status(400).json({ status: 400, message: error.message, success: false });
    }
  },

  adminLogin: async (req, res) => {
    try {
      const result = await User.findOne({ email: req.body.email });
      if (result) {
        const passwordMatch = await bcrypt.compare(req.body.password, result.password);
        if (result.role === 'admin') {
          if (passwordMatch) {
            const token = generateToken(result.id);
            res.status(200).json({ status: 200, message: 'Login Successfully', token, success: true, role: result.role });
          } else {
            res.status(409).json({ status: 409, message: 'Enter Correct Password', success: false });
          }
        } else {
          res.status(400).json({ status: 400, message: 'invalid user , Not a admin' });
        }
      } else {
        res.status(400).json({ status: 400, message: 'Email not register', success: false });
      }
    } catch (error) {
      res.status(400).json({ status: 400, message: 'error', success: false });
    }
  },

  confirmEmail: async (req, res) => {
    try {
      const result = await User.findOne({ token: req.params.token });
      const token = req.params.token;
      const finalResult = result.token;
      if (finalResult === token) {
        const newResult = await User.findOneAndUpdate(
          { token: req.params.token },
          { isVerified: true, token: '' },
          { new: true }
        );
        res.status(200).json({ status: 200, message: 'Email verification successfull', success: true });
      } else {
        res.status(400).json({ status: 400, message: 'Bad request', success: false });
      }
    } catch (error) {
      res.status(400).json({ status: 400, message: 'Insert valid token', success: false });
    }
  },

  verifiedByAdmin: async (req, res) => {
    try {
      const result = await User.findById({ _id: req.body.id });
      if (result) {
        const admin = await User.findByIdAndUpdate({ _id: req.body.id }, { isApprove: true });
        const link = `Verification request successfull , now you can login`;
        res.status(200).json({ status: 200, messsage: 'verified by admin' });
        emailSend(link);
      } else {
        const link = `Verification request failed , try again`;
        res.status(400).json({ status: 400, messsage: 'Invalid user', success: false });
        emailSend(link);
      }
    } catch (err) {
      res.status(400).json({ status: 400, message: 'Invalid id', success: false });
    }
  },

  verifyOtp: async (req, res) => {
    try {
      const result = await User.findOne({ number: req.body.number });
      if (result) {
        const findotp = result.otp;
        const matchOtp = req.body.otp;
        const currentTime = Date.now();
        if (result.resetTime >= currentTime) {
          if (result.isVerified === true) {
            res.status(200).json({ status: 200, message: "You're already verified" });
          } else if (findotp === matchOtp) {
            const newResult = await User.findOneAndUpdate({ number: req.body.number }, { isVerified: true });
            const link = `number verification successfull`;
            res.status(200).json({ status: 200, message: 'Number Verified Successfully' });
          } else {
            res.status(400).json({ status: 400, messsage: 'Enter Correct OTP', success: false });
          }
        } else {
          res.status(400).json({ status: 400, message: 'Otp expire , otp resend after 10 min' });
        }
      } else {
        res.status(400).json({ status: 400, message: 'Enter Correct Number' });
      }
    } catch (error) {
      res.status(400).json({ status: 400, message: error.message });
    }
  },

  getAllSellers: async (req, res) => {
    try {
      const { page = 1, limit = 5 } = req.query;
      const { email = '' } = req.body;
      const fileds = showToFields(req);
      const result = await User.find({ isDeleted: false, email: { $regex: email, $options: '$i' } }, fileds).limit(limit * 1).skip((page - 1) * limit).sort({ createAt: 1 });
      res.status(200).json({ status: 200, message: "All seller list", data: result, success: true });
    } catch (error) {
      res.status(400).json({ status: 400, message: error.message });
    }
  }

}

