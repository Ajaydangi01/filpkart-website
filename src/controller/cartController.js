const { Cart } = require("./../models/cartSchema")
const { Product } = require("./../models/productSchema")

const Redis = require("ioredis");
const redis = new Redis();

module.exports = {
    createCart: async (req, res) => {
        try {
            const { product } = req.body
            const proLength = product.length
            const productIdArr = product.map((obj) => obj.productId)
            const findproduct = await Product.find({ _id: { $in: productIdArr } })
            if (findproduct.length < proLength) {
                return res.status(400).json({ statusCode: 400, message: "product not found", success: false })
            }
            for (i of req.body.product) {
                const findPro = await Product.findOne({ _id: i.productId })
                if (findPro.quantity < i.quantity) {
                    return res.status(400).json({ statusCode: 200, message: " product quantity out of stock", success: false })
                }
            }
            const data = new Cart({ product, userId: req.id })
            const result1 = await data.save()
            res.status(200).json({ statusCode: 200, message: "Product add in cart successfully", data: result1 })
        } catch (error) {
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
            const user = await Cart.find({}).limit(limit * 1).skip((page - 1) * limit).sort({ createAt: 1 });
            res.status(200).json({ statusCode: 200, totalItem: user.length, data: user });
        } catch (error) {
            console.log(error)
            res.status(400).json({ statusCode: 400, message: error.message, success: false });
        }
    },

    deleteCart: async (req, res) => {
        try {
            const result = await Cart.findById({ _id: req.params.id })
            if (result) {
                const newResult = await Cart.findByIdAndDelete({ _id: req.params.id })
                res.status(200).json({ statusCode: 200, message: "Cart deleted successfully", data: newResult })
            }
            else {
                res.status(400).json({ statusCode: 400, message: "Nothing in cart", success: false });
            }
        } catch (error) {
            res.status(400).json({ statusCode: 400, message: error.message, success: false });
        }
    },

    deleteAllCart: async (req, res) => {
        try {
            const data = await Cart.findOne({ userId: req.params.id })
            if (!data) {
                return res.status(400).json({ statusCode: 400, message: "Cart not found", success: false });
            }
            const result = await Cart.remove({ userId: req.params.id })
            return res.status(200).json({ statusCode: 200, message: "Cart delete successfully", data: result })
        } catch (error) {
            console.log(error)
            return res.status(400).json({ statusCode: 400, message: error.message, success: false })
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
                console.log(obj)
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








 // updateCart: async (req, res) => {
    //     try {
    //         const result = await Cart.findById({ _id: req.params.id });
    //         const findData = result.product.map((obj) => obj.productId)
    //         if (!result) {
    //             return res.status(400).json({ statusCode: 400, message: 'cart not found', succes: false });
    //         }
    //         const findProduct = await Product.find({ _id: findData });
    //         if (req.query)
    //             if (req.query.value === 'increment') {
    //                 result.quantity += 1;
    //                 if (findProduct.quantity < result.quantity) {
    //                     return res.status(400).json({ statusCode: 400, message: 'out of stock', succes: false });
    //                 }
    //                 await result.save();
    //                 const increment = await Cart.findOne({ _id: result.id });
    //                 return res.status(200).json({ statusCode: 200, message: 'update cart successfully', data: increment, });
    //             }
    //         if (0 == result.quantity) {
    //             return res.status(400).json({ statusCode: 400, message: 'quantity cloud not be less than zero', succes: false });
    //         }
    //         result.quantity -= 1;
    //         await result.save();
    //         const increment = await Cart.findOne({ _id: result.id });
    //         return res.status(200).json({ statusCode: 200, message: 'find cart successfully', data: increment });
    //     } catch (error) {
    //         console.log(error);
    //         return res.status(400).json({ statusCode: 400, message: error.message, succes: false });
    //     }
    // },