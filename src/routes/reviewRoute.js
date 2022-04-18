const express = require("express")
const reviewController = require("./../controller/reviewController")
const reviewRouter = new express.Router();
const {tokenVerify} = require("./../middleware/index")

reviewRouter.post("/review", tokenVerify, reviewController.createReview)
reviewRouter.delete("/review", reviewController.deleteReview)

module.exports = reviewRouter;