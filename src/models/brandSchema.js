const mongoose = require('mongoose');
const brandSchema = new mongoose.Schema({
    brandName: String,
    description: String,
    photoUrl: {
        type: String,
        default: null,
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    }
});

const Brand = mongoose.model('Brand', brandSchema);
module.exports = Brand