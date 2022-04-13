const { Cart } = require("./../models/cartSchema")
const { User } = require('./../models/schema');
const { Product } = require("./../models/productSchema")

const Redis = require("ioredis");
const redis = new Redis();

module.exports = {
    createCart: async (req, res) => {
        try {
            const result = await Cart.findOne({ productId: req.body.productId, userId: req.body.userId });
            if (result) {
                result.quantity += 1
                await result.save()
                const setRedis = await redis.set("Data", result)
                await Cart.findOne({ _id: result.id })
                return res.status(200).json({ success: true, status: 200, message: "Product add in cart successfully", data: setRedis })
            }
            const data = await Cart.create(req.body)
            req.body.userId = data.userId
            req.body.productId = data.productId
            res.status(200).json({ success: true, status: 200, message: "Product add in cart successfully" })
        } catch (error) {
            console.log(error)
            res.status(400).json({ status: 400, message: error.message });
        }
    },

    showCart: async (req, res) => {
        try {
            const { page = 1, limit = 5 } = req.query;
            const filter = { productId: req.id, isActive: true }
            let newFilter;
            if (req.query.filter) {
                newFilter = Object.assign(filter, JSON.parse(req.query.filter))
            } else {
                newFilter = filter
            }
            const user = await Cart.find({}).limit(limit * 1).skip((page - 1) * limit).sort({ createAt: 1 });
            res.status(200).json({ status: 200, totalItem: user.length, data: user, success: true });
        } catch (error) {
            res.status(400).json({ status: 400, message: error.message, success: false });
        }
    },

    updateCart: async (req, res) => {
        try {
            const result = await Cart.findOne({ _id: req.params.id });
            if (!result) {
                return res.status(400).json({ status: 400, message: 'inavalid cart id', succes: false });
            }
            const findProduct = await Product.findOne({ _id: result.productId });
            if (!findProduct) {
                return res.status(400).json({ status: 400, message: 'this card is not available', succes: false });
            }
            if (req.query.value === 'increment') {
                result.quantity += 1;
                if (findProduct.quantity < result.quantity) {
                    return res.status(400).json({ status: 400, message: 'out of stock', succes: false });
                }
                await result.save();
                const increment = await Cart.findOne({ _id: result.id });
                return res.status(200).json({ status: 200, data: increment, message: 'find cart successfully', succes: true });
            }
            if (0 == result.quantity) {
                return res.status(400).json({ status: 400, message: 'quantity cloud not be less than zero', succes: false });
            }
            result.quantity -= 1;
            await result.save();
            const increment = await Cart.findOne({ _id: result.id });
            return res.status(200).json({ status: 200, data: increment, message: 'find cart successfully', success: true });
        } catch (error) {
            console.log(error);
            return res.status(400).json({ status: 400, message: error.message, succes: false });
        }
    },

    deleteCart: async (req, res) => {
        try {
            const result = await Cart.findById({ _id: req.params.id })
            if (result) {
                const newResult = await Cart.findByIdAndDelete({ _id: req.params.id })
                res.status(200).json({ status: 200, message: "Cart deleted successfully", success: true })
            }
            else {
                res.status(400).json({ status: 400, message: "Nothing in cart", success: false });
            }
        } catch (error) {
            res.status(400).json({ status: 400, message: error.message, success: false });
        }
    },

    deleteAllCart: async (req, res) => {
        try {
            const data = await Cart.find({ userId: req.params.id })
            if (data) {
                const result = await Cart.deleteMany({ userId: req.params.id })
                res.status(200).json({ status: 200, message: "Cart delete successfully", success: true })
            }
            else {
                res.status(400).json({ status: 400, message: "Cart not found", success: false });
            }
        } catch (error) {
            console.log(error)
            res.status(400).json({ status: 400, message: error.message, success: false })
        }
    }
};


