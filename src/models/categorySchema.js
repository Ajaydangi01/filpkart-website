const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    categoryName: String,
    description: String,
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

const Category = mongoose.model('Category', categorySchema);
module.exports = Category 