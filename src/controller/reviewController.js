const Review = require("../models/reviewSchema")
// const { User } = require("./../models/schema")
const { Product } = require("./../models/productSchema")

exports.createReview = async (req, res) => {
    try {
        const product = await Product.findById({ _id: req.body.productId })
        if (!product) {
            return res.status(400).json({ statusCode: 400, success: false, message: "Product not found" })
        }
        req.body.userId = req.id
        const data = new Review(req.body)
        const result = await data.save()
        return res.status(200).json({ statusCode: 200, success: true, message: "review submitted successfully", data: data })
    } catch (error) {
        res.status(400).json({ statusCode: 400, success: false, message: error.message })
    }
}

exports.updateReview = async (req, res) => {
    try {
        const result = await Review.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true })
        if (result) {
            return res.status(200).json({ statusCode: 200, message: "Review updated successfully", data: result })
        }
        res.status(400).json({ statusCode: 400, success: false, message: "Review not found" })
    } catch (error) {
        res.status(400).json({ statusCode: 400, success: false, message: error.message })
    }
}

exports.deleteReview = async (req, res) => {
    try {
        const result = await Review.findByIdAndDelete({ _id: req.params.id })
        if (result) {
            return res.status(200).json({ statusCode: 200, message: "Review delete successfully", data: result })
        }
        res.status(400).json({ statusCode: 400, success: false, message: "Review not found" })
    } catch (error) {
        res.status(400).json({ statusCode: 400, success: false, message: error.message })
    }
}