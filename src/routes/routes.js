const express = require("express");
const postController = require("./../controller/controller");
const { signupValidation, loginValidation } = require("./../validations")

const router = new express.Router()
router.post("/api/adminLogin", loginValidation, postController.adminLogin)       // -- Admin login
router.get("/api/getAllSellers" , postController.getAllSellers)  // -- Admin get all users
router.post("/api/sellerLogin", postController.SellerLogin)       // -- Seller login By email
router.post("/api/signup", signupValidation, postController.signup)       // -- Signup
router.get("/api/confirmEmail/:token", postController.confirmEmail)         // -- Email confiramtion
router.post("/api/VerifyByAdmin" , postController.verifiedByAdmin)

module.exports = router;