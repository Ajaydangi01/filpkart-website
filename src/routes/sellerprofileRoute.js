const express = require('express');
const SellerProfileController = require('./../controller/SellerProfileController');
const { sellerProfileValidation } = require("./../validations/index")
const sellerProRouter = new express.Router();
const { tokenVerify } = require("./../middleware/index")

sellerProRouter.post('/api/create_sellerprofile', sellerProfileValidation, tokenVerify, SellerProfileController.create_profile);
// sellerProRouter.get('/api/show_profile/:id', SellerProfileController.show_profile);
// sellerProRouter.put('/api/update_profile/:id', SellerProfileController.update_profile);

module.exports = sellerProRouter;
