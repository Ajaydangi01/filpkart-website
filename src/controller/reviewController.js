const Review = require("../models/reviewSchema")
const { User } = require("./../models/schema")
const { Product } = require("./../models/productSchema")

exports.createReview = async (req, res) => {
    try {
        const product = await Product.findById({ _id: req.body.productId })
        if (!product) {
           return res.status(400).json({ status: 400, success: false, message: "Product not found" })
        }
        req.body.userId = req.id
        const data = new Review(req.body)
        const result = await data.save()
        return res.status(200).json({ status: 200, success: true, message: "review submitted successfully", data: data })
    } catch (error) {
        res.status(400).json({ status: 400, success: false, message: error.message })
    }
}

exports.deleteReview = async(req,res) => {
    try {
        
    } catch (error) {
        
    }
}