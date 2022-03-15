const nodemailer = require("nodemailer");
const OTP = require("./../controller/schema")
const jwt = require("jsonwebtoken")
require('dotenv').config()
const mail = process.env.MAIL
const pass = process.env.PASS
const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN



   exports.emailSend = (token) => {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: mail,
                pass: pass
            }
        })
        const options = {
            from: "ajaydangi.thoughtwin@gmail.com",
            to: "sourabhlodhi.thoughtwin@gmail.com",
            subject: "mail sent with the help of node js",
            text: token
        }
        transporter.sendMail(options, (err, info) => {
            if (err) {
                console.log(err)
                return
            }
            else {
                console.log("sent" + info.response)
            }
        })
    }
   exports.otpFunction = (otp) =>{
        let Otp = Math.floor((Math.random() * 1000000) + 1);
        const client = require('twilio')(accountSid, authToken);
                  client.messages
                      .create({
                          body: `Your verification otp is : ${Otp} , Expirein : 10min`,
                          from: '+13025508518',
                          to: '+919977646601'
                      })
                      .then(message => console.log(message.sid))
                      .catch((err) => {
                          console.log(err)
                      })
       return Otp
      }

      exports.generateToken = () => {
          try {
            const token = jwt.sign({ email: this.email }, "adsfdsfdfdsffsd!", { expiresIn: "1h" })
            console.log( token)
          } catch (error) {
              console.log(error)
          }
      }


    exports.tokenVerify = (req,res) => {
        try {
            const bearerHeader = req.headers['authorization']
                const bearer = bearerHeader.split(' ')
                const token = bearer[1]
            jwt.verify(token, "adsfdsfdfdsffsd!")
            res.status(200).json({status : 200 , message : "Valid token"})
        } catch (error) {
            res.status(400).json({status : 400 , message : "Invalid token"})
        }
    }
