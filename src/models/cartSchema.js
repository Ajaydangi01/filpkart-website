const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
    productId: String,
    userId: String,
    quantity: {
        type: Number,
        default: 1
    },
    active: {
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

const Cart = mongoose.model("Cart", CartSchema);
module.exports = { Cart };