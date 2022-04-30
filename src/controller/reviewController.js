const Review = require("../models/reviewSchema")
const { Product } = require("./../models/productSchema")
const { Image } = require("./../models/imageSchema")
const cloudinary = require('cloudinary').v2
const { CloudName, APIKey, APISecret } = require("./../config/index");
const { isUndefined } = require('lodash');

cloudinary.config({
    cloud_name: CloudName,
    api_key: APIKey,
    api_secret: APISecret,
    secure: true
});


exports.createReview = async (req, res) => {
    try {
        const { productId, rating, comment, image } = req.body
        const findUser = await Review.findOne({ userId: req.id })
        if (findUser) {
            return res.status(400).json({ statusCode: 400, message: "already commited" })
        }
        const product = await Product.findById({ _id: req.body.productId }).populate("review", "rating")
        if (!product) {
            return res.status(400).json({ statusCode: 400, message: "Product not found" })
        }
        const data = new Review({ productId, rating, comment, userId: req.id, image })
        if (!isUndefined(req.files)) {
            const imageData = []
            for (file of req.files) {
                const fileName = file.destination + "/" + file.filename
                await cloudinary.uploader.upload(fileName, function (error, result) {
                    if (error) {
                        res.status(400).json({ statusCode: 400, message: error })
                    }
                    else {
                        const obj = {
                            photoUrl: result.url,
                            public_id: result.public_id
                        }
                        imageData.push(obj)
                    }
                })
            }
            if (req.files && req.files.length > 0) {
                const s = await Image.create({ reviewId: data.id, image: imageData })
                data.image = s._id
            }
        }
        product.rating = rating
        let rate = 0;
        product.review.map((a) => {
            rate += a.rating
        })
        const averageRateing = (rate + data.rating) / (product.review.length + 1)
        const result = await data.save()
        product.review.push(result.id)
        product.rating = averageRateing
        await product.save()
        return res.status(200).json({ statusCode: 200, message: "review submitted successfully", data: data })
    } catch (error) {
        res.status(400).json({ statusCode: 400, message: error.message })
    }
}

exports.updateReview = async (req, res) => {
    try {
        const result = await Review.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true })
        if (result) {
            return res.status(200).json({ statusCode: 200, message: "Review updated successfully", data: result })
        }
        res.status(400).json({ statusCode: 400, message: "Review not found" })
    } catch (error) {
        res.status(400).json({ statusCode: 400, message: error.message })
    }
}

exports.deleteReview = async (req, res) => {
    try {
        const result = await Review.findByIdAndDelete({ _id: req.params.id })
        if (result) {
            return res.status(200).json({ statusCode: 200, message: "Review delete successfully", data: result })
        }
        res.status(400).json({ statusCode: 400, message: "Review not found" })
    } catch (error) {
        res.status(400).json({ statusCode: 400, message: error.message })
    }
}