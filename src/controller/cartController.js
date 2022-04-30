const { Cart } = require("./../models/cartSchema")
const { Product } = require("./../models/productSchema")
const SendError = require("../config/apierror")

const Redis = require("ioredis");
const redis = new Redis();
module.exports = {
    createCart: async (req, res, next) => {
        try {
            const { product } = req.body
            const proLength = product.length
            const productIdArr = product.map((obj) => obj.productId)
            let findCart = await Cart.findOne({ userId: req.id })
            const findproduct = await Product.find({ _id: { $in: productIdArr } })
            if (findproduct.length < proLength) {
                return next(new SendError(400, "product not found"))
            }
            let totalPrice = 0;
            for (i of req.body.product) {
                const findPro = await Product.findOne({ _id: i.productId })
                if (findPro.quantity < i.quantity) {
                    return next(new SendError(400, "product quantity out of stock"))
                }
                const amount = parseInt(findPro.price * i.quantity);
                i.price = amount;
                totalPrice += amount;
            }
            req.body.userId = req.id;
            let createCart;
            if (!findCart) {
                createCart = await Cart.create({ product, userId: req.id });
                return res.status(200).json({ statusCode: 200, message: "Product add in cart successfully", data: createCart, totalPrice: totalPrice });
            }
            for (i of product) {
                findCart.product.push(i)
            }
            createCart = await findCart.save();
            res.status(200).json({ statusCode: 200, message: "Product add in cart successfully", data: createCart, totalPrice: totalPrice })
        } catch (error) {
            console.log(error)
            res.status(400).json({ statusCode: 400, message: error.message });
        }
    },

    showCart: async (req, res) => {
        try {
            const { page = 1, limit = 5 } = req.query;
            const filter = { productId: req.id, isActsive: true }
            let newFilter;
            if (req.query.filter) {
                newFilter = Object.assign(filter, JSON.parse(req.query.filter))
            } else {
                newFilter = filter
            }
            const setRedis = await redis.get("Data")
            const user = await Cart.find({}).limit(limit * 1).skip((page - 1) * limit).sort({ createAt: 1 }).populate("product.productId", "productName productDetail price")
            res.status(200).json({ statusCode: 200, totalItem: user.length, data: user });
        } catch (error) {
            console.log(error)
            res.status(400).json({ statusCode: 400, message: error.message });
        }
    },

    deleteCart: async (req, res, next) => {
        try {
            const { id: _id } = req.params
            const result = await Cart.updateOne({ userId: req.id }, { $pull: { product: { _id } } }, { new: true })
            console.log(result)
            if (result.modifiedCount === 0) {
                return next(new SendError(400, "product not found in cart"))
            }
            else {
                return res.status(200).json({ statusCode: 200, message: "Cart deleted successfully", data: result })
            }
        } catch (error) {
            res.status(400).json({ statusCode: 400, message: error.message });
        }
    },

    deleteAllCart: async (req, res, next) => {
        try {
            const data = await Cart.findOne({ userId: req.params.id })
            if (!data) {
                return next(new SendError(400, "user not found"))
            }
            const result = await Cart.remove({ userId: req.params.id })
            return res.status(200).json({ statusCode: 200, message: "Cart delete successfully", data: result })
        } catch (error) {
            console.log(error)
            return res.status(400).json({ statusCode: 400, message: error.message })
        }
    },

    updateCart: async (req, res) => {
        try {
            const { value } = req.query
            const result = await Cart.findOne({ userId: req.id });
            if (!result) {
                return res.status(400).json({ statusCode: 400, message: 'inavalid cart id' });
            }
            const findObjId = result.product.find((obj) => {
                const newId = obj._id.toString().replace(/new ObjectId/, "")
                return newId == req.params.id
            })
            if (!findObjId) {
                return res.status(400).json({ statusCode: 400, message: 'inavalid cart object id' });
            }
            let quantity = findObjId.quantity
            const findProduct = await Product.findOne({ _id: findObjId.productId });
            if (!findProduct) {
                return res.status(404).json({ statusCode: 400, message: 'product is not available' });
            }
            if (value === "increment") {
                quantity += 1
                if (quantity > findProduct.quantity) {
                    return res.status(404).json({ statusCode: 400, message: 'product out of stoke' });
                }
                const result1 = await Cart.findOneAndUpdate({ userId: req.id, 'product._id': req.params.id },
                    { '$set': { 'product.$.quantity': quantity } })
                return res.status(200).json({ statusCode: 200, message: 'update cartItems successfully.....', data: result1 });
            }
            if (value === "decrement") {
                quantity -= 1
                if (quantity === 0) {
                    return res.status(404).json({ statusCode: 400, message: 'quantity cant not be 0' });
                }
                const result1 = await Cart.findOneAndUpdate({ userId: req.id, 'product._id': req.params.id },
                    { '$set': { 'product.$.quantity': quantity } })
                return res.status(200).json({ statusCode: 200, message: 'update cartitems successfully', data: result1 })
            }
        } catch (error) {
            return res.status(400).json({ statusCode: 400, message: error.message })
        }
    }
}