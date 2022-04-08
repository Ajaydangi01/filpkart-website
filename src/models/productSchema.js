const { array } = require('joi');
const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
    brandId: { type: mongoose.Schema.Types.ObjectId, ref: "Brand" },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    createdBy: String,
    productName: String,
    productDetail: String,
    price: Number,
    image: {
        type: mongoose.Schema.Types.ObjectId, ref: "Image"
    },
    isApprove: {
        type: Boolean,
        default: false,
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        required: true,
        default: Date.now,
    }
});

const Product = mongoose.model('Product', productSchema);
module.exports = { Product };