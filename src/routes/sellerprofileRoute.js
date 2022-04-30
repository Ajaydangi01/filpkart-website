const express = require('express');
const SellerProfileController = require('./../controller/SellerProfileController');
const { sellerProfileValidation } = require("./../validations/index")
const sellerProRouter = new express.Router();
const { tokenVerify } = require("./../middleware/index")

sellerProRouter.post('/createSellerprofile', sellerProfileValidation, tokenVerify, SellerProfileController.create_profile);

module.exports = sellerProRouter;
