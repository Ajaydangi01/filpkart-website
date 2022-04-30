const { User } = require('../models/schema');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const SendError = require("../config/apierror")

const { emailSend, otpFunction, generateToken, showToFields, } = require('../middleware/index');
const { port, host, secretKey } = require('./../config/index');

module.exports = {
  adminSignup: async (req, res, next) => {
    try {
      const { email, fullName, number, password } = req.body
      const foundUser = await User.findOne({ role: "admin" });
      if (!foundUser) {
        const result = new User({ email, fullName, number, password, role: "admin" });
        result.save();
        const jwtToken = generateToken(result.id);
        res.status(200).json({ statusCode: 200, message: 'singup successfully', data: result, jwtToken });
      } else {
        return next(new SendError(400, "admin already exist"))

      }
    } catch (err) {
      res.status(400).send({ statusCode: 400, message: err.message });
    }
  },

  signup: async (req, res, next) => {
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
        const link = `http://${host}:${port}/confirmEmail/${token}`;
        emailSend(link, newMail);
        res.status(200).json({ statusCode: 200, message: 'Verification link sent on your email' });
      } else {
        return next(new SendError(400, "email already exist"))
      }
    } catch (err) {
      res.status(400).send({ statusCode: 400, message: err.message });
    }
  },

  SellerLogin: async (req, res, next) => {
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
                  res.status(200).json({ statusCode: 200, message: 'Login Successfully', token, role: result.role });
                } else {
                  return next(new SendError(400, "invalid user , not a seller"))
                }
              } else {
                return next(new SendError(400, "Enter Correct Password"))
              }
            } else {
              return next(new SendError(400, "You are not verified by admin"))
            }
          } else {
            return next(new SendError(400, "Email not verified"))
          }
        } else {
          return next(new SendError(400, "Email not found"))
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
                res.status(200).json({ statusCode: 200, message: 'Login Successfully', token, role: result.role });
              } else {
                return next(new SendError(400, "Not verified by admin"))
              }
            } else {
              const Otp = otpFunction();
              const data = await User.findOneAndUpdate({ number: req.body.number }, { otp: Otp, resetTime: new Date(Date.now() + 10 * 60000) });
              res.status(200).json({ statusCode: 200, message: 'Otp sent on register number' });
            }
          } else {
            return next(new SendError(400, "Enter Correct Password"))
          }
        } else {
          return next(new SendError(400, "User not register"))
        }
      } else {
        return next(new SendError(400, "Enter number/email"))
      }
    } catch (error) {
      res.status(400).json({ statusCode: 400, message: error.message });
    }
  },

  adminLogin: async (req, res, next) => {
    try {
      const result = await User.findOne({ email: req.body.email });
      if (result) {
        const passwordMatch = await bcrypt.compare(req.body.password, result.password);
        if (result.role === 'admin') {
          if (passwordMatch) {
            const token = generateToken(result.id);
            res.status(200).json({ statusCode: 200, message: 'Login Successfully', token, role: result.role });
          } else {
            return next(new SendError(400, "Enter Correct Password"))
          }
        } else {
          return next(new SendError(400, "invalid user , Not a admin"))
        }
      } else {
        return next(new SendError(400, "Email not register"))
      }
    } catch (error) {
      res.status(400).json({ statusCode: 400, message: 'error' });
    }
  },

  confirmEmail: async (req, res, next) => {
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
        res.status(200).json({ statusCode: 200, message: 'Email verification successfull' });
      } else {
        return next(new SendError(400, "Bad request"))
      }
    } catch (error) {
      return next(new SendError(400, "Insert valid token"))
    }
  },

  verifiedByAdmin: async (req, res, next) => {
    try {
      const result = await User.findById({ _id: req.body.id });
      if (result) {
        const admin = await User.findByIdAndUpdate({ _id: req.body.id }, { isApprove: true }, { new: true });
        const link = `Verification request successfull , now you can login`;
        res.status(200).json({ statusCode: 200, messsage: 'verified by admin', data: admin });
        emailSend(link);
      } else {
        const link = `Verification request failed , try again`;
        return next(new SendError(400, "Invalid user"))
        emailSend(link);
      }
    } catch (err) {
      res.status(400).json({ statusCode: 400, message: 'Invalid id' });
    }
  },

  verifyOtp: async (req, res, next) => {
    try {
      const result = await User.findOne({ number: req.body.number });
      if (result) {
        const findotp = result.otp;
        const matchOtp = req.body.otp;
        const currentTime = Date.now();
        if (result.resetTime >= currentTime) {
          if (result.isVerified === true) {
            res.status(200).json({ statusCode: 200, message: "You're already verified", data: result });
          } else if (findotp === matchOtp) {
            const newResult = await User.findOneAndUpdate({ number: req.body.number }, { isVerified: true });
            const link = `number verification successfull`;
            res.status(200).json({ statusCode: 200, message: 'Number Verification Successful , now you can login' });
          } else {
            return next(new SendError(400, "Enter Correct OTP"))
          }
        } else {
          return next(new SendError(400, "Otp expire , otp resend after 10 min"))
        }
      } else {
        res.status(400).json({ statusCode: 400, message: 'Enter Correct Number' });
      }
    } catch (error) {
      res.status(400).json({ statusCode: 400, message: error.message });
    }
  },

  getAllSellers: async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const { email = '' } = req.body;
      const fileds = showToFields(req);
      const result = await User.find({ role: "seller" }, { isDeleted: false, }, fileds).limit(limit * 1).skip((page - 1) * limit).sort({ createAt: 1 });
      res.status(200).json({ statusCode: 200, message: "All seller list", totalSeller: result.length, data: result });
    } catch (error) {
      console.log(error)
      res.status(400).json({ statusCode: 400, message: error.message });
    }
  },

  getAllUsers: async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const { email = '' } = req.body;
      const fileds = showToFields(req);
      const result = await User.find({ role: "user" }, { isDeleted: false, }, fileds).limit(limit * 1).skip((page - 1) * limit).sort({ createAt: 1 });
      res.status(200).json({ statusCode: 200, message: "All user list", totalSeller: result.length, data: result });
    } catch (error) {
      console.log(error)
      res.status(400).json({ statusCode: 400, message: error.message });
    }
  }

}

