const Order = require("./../models/orderSchema")
const { Address } = require("./../models/addressSchema")
const { Product } = require("./../models/productSchema")
const { User } = require("../models/schema")
const { sendPdfByEmail } = require("./../middleware/index")
const SendError = require("../config/apierror")

exports.createOrder = async (req, res, next) => {
    try {
        const user = await User.findOne({ _id: req.id })
        const email = user.email
        const proLength = req.body.product.length
        const productIdArr = req.body.product.map((obj) => obj.productId)
        const { addressId, paymentMode, } = req.body
        const product = await Product.find({ _id: { $in: productIdArr } });
        const productPrice = product.map((x) => x.price)
        const productQuantity = req.body.product.map((x) => x.quantity)
        if (product.length < proLength) {
            return next(new SendError(400, "product not found"))
        }
        const address = await Address.findById({ _id: addressId })
        if (!address) {
            return next(new SendError(400, "address not found"))
        }
        for (i of req.body.product) {
            const findPro = await Product.findOne({ _id: i.productId })
            if (findPro.quantity < i.quantity) {
                return next(new SendError(400, "Product quantity out of stock"))
            }
            findPro.quantity -= i.quantity
            findPro.save()
        }
        let sum = 0;
        for (let i = 0; i < productPrice.length; i++) {
            sum += productPrice[i] * productQuantity[i];
        }
        if (sum < 500) {
            sum += 40
        }
        userId = req.id
        const random = Math.floor(Math.random() * (6 - 3)) + 3;
        const date = req.body.deliveryMode == "fast"
            ? new Date(+new Date() + 1 * 24 * 60 * 60 * 1000)
            : new Date(+new Date() + random * 24 * 60 * 60 * 1000);
        const result = new Order({ userId, addressId, product: req.body.product, paymentMode, deliveryMode: date, price: sum })
        const data = await result.save()
        if (data.price < 500) {
            return res.status(200).json({ statusCode: 200, message: "order placed successfully", totalPrice: `${sum} 40₹ Delivery charges included`, deliveryDate: data.deliveryMode, data: data })
        }
        const pdfData = await Order.findOne({ _id: data.id }).populate("product.productId", "productName price createdBy productDetail").populate("addressId")
        sendPdfByEmail(pdfData, email)
        return res.status(200).json({ statusCode: 200, message: "order placed successfully", totalPrice: `${sum} + Free Delivery`, deliveryDate: data.deliveryMode, data: data })
    } catch (error) {
        res.status(400).json({ statusCode: 400, message: error.message })
    }
}

exports.cancelOrder = async (req, res, next) => {
    try {
        const data = await Order.findById({ _id: req.params.id })
        if (!data) {
            return next(new SendError(400, "order not found"))
        }
        if (data.status == "ordered" || data.status == "packing") {
            const result = await Order.findByIdAndUpdate({ _id: req.params.id }, { status: "cancelled" })
            return res.status(200).json({ statusCode: 200, message: "order cancelled successfully", data: result })
        }
        return next(new SendError(400, "Order cannot be canceled"))
    } catch (error) {
        res.status(400).json({ statusCode: 400, message: error.message })
    }
}

exports.getOneOrder = async (req, res, next) => {
    try {
        const result = await Order.findById({ _id: req.params.id })
        if (result) {
            return res.status(200).json({ status: 200, message: "Order find successfully", data: result })
        }
        return next(new SendError(400, "Order not found"))

    } catch (error) {
        res.status(400).json({ statusCode: 400, message: error.message })
    }
}

exports.getAllOrder = async (req, res, next) => {
    try {
        const result = await Order.find({ userId: req.id })
        if (!result) {
            return next(new SendError(400, "Order not found"))
        }
        else {
            res.status(200).json({ statusCode: 200, message: "all order list", totalOrders: result.length, data: result })
        }
    } catch (error) {
        res.status(400).json({ statusCode: 400, message: error.message })
    }
}

exports.changeStatus = async (req, res, next) => {
    try {
        const result = await Order.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true })
        if (!result) {
            return next(new SendError(400, "Order not found"))
        }
        return res.status(200).json({ statusCode: 200, message: "order status change successfully", data: result })
    } catch (error) {
        res.status(400).json({ statusCode: 400, message: error.message })
    }
}

exports.shipped = async (req, res) => {
    try {
        const random = Math.floor(Math.random() * (6 - 3)) + 3;
        const date = req.query.deliveryMode == "fast"
            ? new Date(+new Date() + 1 * 24 * 60 * 60 * 1000)
            : new Date(+new Date() + random * 24 * 60 * 60 * 1000);
        const result = new Order({ deliveryMode: date })
        const data = await result
        console.log(data)
        return res.status(200).json({ statusCode: 200, message: "order placed successfully", dataDate: data.deliveryMode })

    } catch (error) {
        res.status(400).json({ statusCode: 400, message: error.message })
    }
}


