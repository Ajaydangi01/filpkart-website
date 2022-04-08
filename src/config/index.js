require('dotenv').config();
const port = process.env.PORT;
const host = process.env.HOST;
const mail = process.env.MAIL;
const pass = process.env.PASS;
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const sendFrom = process.env.SEND_FROM;
const sendTo = process.env.SEND_TO;
const adminRole = process.env.ADMIN;
const sellerRole = process.env.SELLER;
const userRole = process.env.USERS;
const secretKey = process.env.KEY;
const CloudName = process.env.CLOUD_NAME;
const APIKey = process.env.CLOUD_API_KEY;
const APISecret = process.env.CLOUD_API_SECRET;


module.exports = {
  port,
  host,
  mail,
  pass,
  accountSid,
  authToken,
  sendFrom,
  sendTo,
  adminRole,
  sellerRole,
  userRole,
  secretKey,
  CloudName,
  APIKey,
  APISecret
};
