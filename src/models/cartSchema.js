const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
    product: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: {
            type: Number,
            default: 1
        }
    }],
    userId: String,
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