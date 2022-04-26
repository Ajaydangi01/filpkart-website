const express = require("express")
const reviewController = require("./../controller/reviewController")
const reviewRouter = new express.Router();
const { tokenVerify } = require("./../middleware/index")
const { reviewValidation } = require("./../validations/index")

reviewRouter.post("/review", tokenVerify, reviewValidation, reviewController.createReview)
reviewRouter.delete("/review/:id",tokenVerify, reviewController.deleteReview)
reviewRouter.put("/review/:id",tokenVerify, reviewController.updateReview)


module.exports = reviewRouter;