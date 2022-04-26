const mongoose = require("mongoose")
const random1 = Math.floor(Math.random() * (5 - 3) + 3)

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    addressId: { type: mongoose.Schema.Types.ObjectId, ref: "Address" },
    product: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: {
            type: Number,
            default: 1
        }
    }],
    price : Number,
    paymentMode: { type: String, enum: ['COD', 'cards', 'mobilePayments', 'bankTransfer'], default: "COD" },
    deliveryMode: {
        type: Date,
    },
    status: { type: String, enum: ['ordered', 'packing' ,'shipping', 'outForDelivery', 'cancelled', 'deliverd'], default: "ordered" }
})

const Order = mongoose.model('Order', orderSchema)
module.exports = Order;



