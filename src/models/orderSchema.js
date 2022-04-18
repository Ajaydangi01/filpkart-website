const mongoose = require("mongoose")
const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    addressId: { type: mongoose.Schema.Types.ObjectId, ref: "Address" },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    quantity: Number,
    deliveryTime: {
        type: Date, required: true, default: new Date(+new Date() + 7 * 24 * 60 * 60 * 1000),
    },
    status: { type: String, enum: ['ordered', 'shipped', 'cancelled', 'deliverd'], default: "ordered" }
})

const Order = mongoose.model('Order', orderSchema)
module.exports = Order;