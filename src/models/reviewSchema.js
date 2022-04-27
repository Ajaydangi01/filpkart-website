const mongoose = require("mongoose")

const reviewSchema = new mongoose.Schema({
    productId: String,
    userId: String,
    rating: Number,
    comment: {
        type: String,
        trim: true
    },
    image: [{
        photoUrl: String,
        public_id: String
    }],
})

const Review = mongoose.model("Review", reviewSchema)

module.exports = Review;