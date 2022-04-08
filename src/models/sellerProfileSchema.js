const mongoose = require('mongoose');
const sellerProSchema = new mongoose.Schema({
    sellerId: String,
    GSTIN: String,
    aadhaarNo: String,
    pancardNo : String,
    isKYC: {
        type: Boolean,
        default: false
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

const SellerProfile = mongoose.model('SellerProfile', sellerProSchema);
module.exports = { SellerProfile };
