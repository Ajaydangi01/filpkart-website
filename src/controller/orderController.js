const Order = require("./../models/orderSchema")
const { Address } = require("./../models/addressSchema")
const { Product } = require("./../models/productSchema")

exports.createOrder = async (req, res) => {
    try {
        const { userId, addressId, productId, quantity } = req.body
        const product = await Product.findById({ _id: productId })
        if (!product) {
            res.status(400).json({ status: 400, success: false, message: "product not found" })
        }
        const address = await Address.findById({ _id: addressId })
        if (!address) {
            res.status(400).json({ status: 400, success: false, message: "address not found" })
        }
        if (req.body.quantity > 0) {
            req.body.userId = req.id
            const result = new Order({ userId, addressId, productId, quantity })
            const data = await result.save()
            return res.status(200).json({ status: 200, success: true, message: "order placed successfully", data: data })
        }
        res.status(400).json({ status: 400, success: false, message: "select minimum 1 item." })
    } catch (error) {
        res.status(400).json({ status: 400, success: false, message: error.message })
    }
}

exports.cancelOrder = async (req, res) => {
    try {
        const result = await Order.findByIdAndUpdate({ _id: req.params.id }, { status: "cancelled" })
        if (result) {
            return res.status(200).json({ status: 200, success: true, message: "order cancelled successfully" })
        }
        res.status(400).json({ status: 400, success: false, message: "order not found" })
    } catch (error) {
        res.status(400).json({ status: 400, success: false, message: error.message })
    }
}

exports.getOneOrder = async (req, res) => {
    try {
        const result = await Order.findById({ _id: req.params.id })
        if (result) {
            return res.status(200).json({ status: 200, success: true, message: "Order find successfully", data: result })
        }
        res.status(400).json({ status: 400, success: false, message: "Order not found" })
    } catch (error) {
        res.status(400).json({ status: 400, success: false, message: error.message })
    }
}

exports.getAllOrder = async (req, res) => {
    try {
        const result = await Order.find({ userId: req.id, status: "ordered" })
        if (!result) {
            return res.status(400).json({ status: 400, success: false, message: "no order found" })
        }
        else {
            res.status(200).json({ status: 200, success: true, message: "all order list", totalOrders: result.length, data: result })
        }
    } catch (error) {
        res.status(400).json({ status: 400, success: false, message: error.message })
    }
}

exports.changeStatus = async (req, res) => {
    try {
        const result = await Order.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true })
        if (result) {
            return res.status(200).json({ status: 200, success: true, data: result })
        }
        res.status(400).json({ status: 400, success: false, message: "order not found" })
    } catch (error) {
        res.status(400).json({ status: 400, success: false, message: error.message })
    }
}