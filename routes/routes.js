const express = require("express");
const postController = require("./../controller/controller");
const { signupValidation, loginValidation } = require("./../validations")

const router = new express.Router()
router.post("/api/signup", signupValidation, postController.signup)       // -- Signup
router.post("/api/adminLogin", loginValidation, postController.adminLogin)       // -- Admin login
router.post("/api/SellerLogin", postController.SellerLogin)       // -- Seller login By email
router.get("/api/confirmEmail/:token", postController.confirmEmail)         // -- Email confiramtion
router.post("/api/verifyOtp" , postController.verifyOtp)       // -- Otp verify
router.get("/api/getAllSellers" , postController.getAllSellers)  // -- Admin get all users

module.exports = router;