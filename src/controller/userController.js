const { User } = require('./../models/schema');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
var cron = require('node-cron');
const {
  emailSend,
  otpFunction,
  generateToken,
  emailMsgSend
} = require('./../middleware/index');
const { port, host, secretKey } = require('./../config/index')


cron.schedule('0 1 * * * *', async() => {
  const result = await User.find({isVerified : true})
  console.log(result)
  await emailMsgSend("sourabhlodhi.thoughtwin@gmail.com")
  console.log('running a task every minute');
});


module.exports = {
  user_signup: async (req, res) => {
    try {
      const result = await User.findOne({ email: req.body.email });
      if (!result) {
        const secret = 'abcdefg';
        const hash = crypto
          .createHmac('sha256', secret, { expiresIn: 350 })
          .update(secretKey)
          .digest('hex');
        req.body.role = 'user';
        const result = new User(req.body);
        result.token = hash;
        const token = hash;
        const newMail = req.body.email;
        result.save();
        const jwtToken = generateToken(result.id);
        const link = `http://${host}:${port}/api/confirmEmail/${token}`;
        emailSend(link, newMail);
        res
          .status(200)
          .json({ status: 200, message: 'singup successfully', jwtToken });
      } else {
        return res.status(409).json({
          status: 409,
          message: 'email already exist',
          success: false,
        });
      }
    } catch (error) {
      res.status(400).json({ status: 400, message: error.message });
    }
  },

  user_login: async (req, res) => {
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
                if (result.role === 'user') {
                  const token = generateToken(result.id);
                  res.status(200).json({ status: 200, message: 'Login Successfully', token, success: true, });
                } else {
                  res.status(400).json({ status: 400, message: 'invalid user , not a user', });
                }
              } else {
                res.status(400).json({ status: 400, message: 'Enter Correct Password', success: false, });
              }
            } else {
              res.status(200).json({ status: 200, data: result, message: 'You are not verified by admin', });
            }
          } else {
            res.status(400).json({ status: 400, message: 'Email not verified', success: false, });
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
                res.status(200).json({ status: 200, message: 'Login Successfully', token, success: true, });
              } else {
                res.status(400).json({ status: 400, message: 'Not verified by admin' });
              }
            } else {
              const Otp = otpFunction();
              const data = await User.findOneAndUpdate(
                { number: req.body.number },
                { otp: Otp, resetTime: new Date(Date.now() + 10 * 60000) }
              );
              res.status(200).json({ status: 200, message: 'Otp sent on register number', success: true, });
            }
          } else {
            res.status(400).json({ status: 400, message: 'Enter Correct Password', success: false, });
          }
        } else {
          res.status(404).json({ status: 404, message: 'User not register', success: false, });
        }
      } else {
        res.status(400).json({ status: 400, message: 'Enter number/email', success: false });
      }
    } catch (error) {
      res.status(400).json({ status: 400, message: error.message, success: false });
    }
  },

  confirm_email: async (req, res) => {
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
        res.status(200).json({
          status: 200,
          message: 'Email verification successfull',
          success: true,
        });
      } else {
        res.status(400).json({ status: 400, message: 'Bad request', success: false });
      }
    } catch (error) {
      res.status(400).json({ status: 400, message: 'Insert valid token', success: false });
    }
  },

  verify_otp: async (req, res) => {
    try {
      const result = await User.findOne({ number: req.body.number });
      if (result) {
        const findotp = result.otp;
        const matchOtp = req.body.otp;
        const currentTime = Date.now();
        if (result.resetTime >= currentTime) {
          if (result.isVerified === true) {
            res
              .status(200)
              .json({ status: 200, message: "You're already verified" });
          } else if (findotp === matchOtp) {
            const newResult = await User.findOneAndUpdate(
              { number: req.body.number },
              { isVerified: true }
            );
            const link = `number verification successfull`;
            res.status(200).json({ status: 200, message: 'Number Verified Successfully' });
          } else {
            res.status(400).json({ status: 400, messsage: 'Enter Correct OTP', success: false, });
          }
        } else {
          res.status(400).json({ status: 400, message: 'Otp expire , otp resend after 10 min', });
        }
      } else {
        res.status(400).json({ status: 400, message: 'Enter Correct Number' });
      }
    } catch (error) {
      res.status(400).json({ status: 400, message: error.message, success: false });
    }
  },

  user_update: async (req, res) => {
    try {
      const result = await User.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true })
      res.status(200).json({ status: 200, message: "Successfully Updated", data: result })
    } catch (error) {
      res.status(400).json({ status: 400, message: error.message, success: false })
    }
  }
};
