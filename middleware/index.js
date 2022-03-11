const nodemailer = require("nodemailer");
// const OTP = require("./../controller/schema")
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
