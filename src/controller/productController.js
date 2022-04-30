const cloudinary = require('cloudinary').v2
const { Product } = require('../models/productSchema');
const { User } = require('./../models/schema');
const Category = require("./../models/categorySchema")
const Brand = require("./../models/brandSchema")
const { Image } = require("./../models/imageSchema")
const { CloudName, APIKey, APISecret } = require("./../config/index");
const { isUndefined, result } = require('lodash');
const ObjectId = require('mongodb').ObjectId

cloudinary.config({
    cloud_name: CloudName,
    api_key: APIKey,
    api_secret: APISecret,
    secure: true
});

module.exports = {
    createProduct: async (req, res) => {
        try {
            if (!req.body) {
                return res.status(400).json({ statusCode: 400, message: 'Empty filled not allowed', succes: true });
            }
            const newresult = await User.findOne({ _id: req.id });
            if (!newresult) {
                return res.status(400).json({ statusCode: 400, message: 'invalid sellerId', succes: false });
            }
            else {
                const createdBy = req.body.createdBy = newresult.id
                const { brandId, categoryId, productName, productDetail, price, image, quantity } = req.body
                const data = new Product({ brandId, createdBy, categoryId, productName, productDetail, price, image, quantity, })
                if (!isUndefined(req.files)) {
                    const imageData = []
                    for (file of req.files) {
                        const fileName = file.destination + "/" + file.filename
                        await cloudinary.uploader.upload(fileName, function (error, result) {
                            if (error) {
                                res.status(400).json({ statusCode: 400, message: error })
                            }
                            else {
                                const obj = {
                                    photoUrl: result.url,
                                    public_id: result.public_id
                                }
                                imageData.push(obj)
                            }
                        });
                    }
                    if (req.files && req.files.length > 0) {
                        const s = await Image.create({ productId: data._id, image: imageData })
                        data.image = s.id
                    }
                }
                const category = await Category.findOne({ _id: req.data.categoryId })
                if (category) {
                    const brand = await Brand.findOne({ _id: req.data.brandId })
                    if (brand) {
                        await data.save()
                        const newdata = await Product.findOne({ _id: data.id })
                            .populate("brandId", "brandName").populate("categoryId", "categoryName").populate("image", "image.photoUrl")
                        return res.status(200).json({ statusCode: 200, message: 'Product create successfully', data: newdata, });
                    }
                    else {
                        res.status(400).json({ statusCode: 400, message: "Brand not found" });
                    }
                }
                else {
                    res.status(400).json({ statusCode: 400, message: "Category not found" });
                }
            }
        } catch (error) {
            res.status(400).json({ statusCode: 400, message: error.message });
        }
    },

    showProduct: async (req, res) => {
        try {
            if (req.role === "seller") {
                const { page = 1, limit = 5 } = req.query;
                const filter = { productId: req.id, isActive: true }
                let newFilter;
                if (req.query.filter) {
                    newFilter = Object.assign(filter, JSON.parse(req.query.filter))
                } else {
                    newFilter = filter
                }
                const regex = new RegExp(req.query.search, "i")
                const result = await Product.find({ createdBy: req.id }, newFilter).limit(limit * 1).skip((page - 1) * limit).sort({ createAt: 1 })
                    .populate("brandId", "brandName").populate("categoryId", "categoryName").populate("image", "image.photoUrl")
                if (result) {
                    return res.status(200).json({ statusCode: 200, totalProduct: result.length, data: result });
                }
                else {
                    return res.status(400).json({ statusCode: 400, message: "no product found" });
                }
            }
            if (req.role == "user") {
                const { page = 1, limit = 5 } = req.query;
                const filter = { productId: req.id, isActive: true }
                let newFilter;
                if (req.query.filter) {
                    newFilter = Object.assign(filter, JSON.parse(req.query.filter))
                } else {
                    newFilter = filter
                }
                const regex = new RegExp(req.query.search, "i")
                const result = await Product.find({ isApproveByAdmin: true }).limit(limit * 1).skip((page - 1) * limit).sort({ createAt: 1 })
                    .populate("brandId", "brandName").populate("categoryId", "categoryName").populate("image", "image.photoUrl")
                if (result) {
                    return res.status(200).json({ statusCode: 200, totalProduct: result.length, data: result });
                }
                else {
                    return res.status(400).json({ statusCode: 400, message: "no product found" });
                }
            }
            const { page = 1, limit = 5 } = req.query;
            const filter = { productId: req.id, isActive: true }
            let newFilter;
            if (req.query.filter) {
                newFilter = Object.assign(filter, JSON.parse(req.query.filter))
            } else {
                newFilter = filter
            }
            const regex = new RegExp(req.query.search, "i")
            const result = await Product.find(newFilter).limit(limit * 1).skip((page - 1) * limit).sort({ createAt: 1 })
                .populate("brandId", "brandName").populate("categoryId", "categoryName").populate("image", "image.photoUrl")
            if (result) {
                return res.status(200).json({ statusCode: 200, totalProduct: result.length, data: result });
            }
            else {
                return res.status(400).json({ statusCode: 400, message: "no product found" });
            }
        } catch (error) {
            res.status(400).json({ statusCode: 400, message: error.message });
        }
    },

    showOneProduct: async (req, res) => {
        try {
            if (ObjectId.isValid(req.params.id) === false) {
                return res.status(400).json({ statusCode: 400, message: "invalid id format" })
            }
            const data = await Product.findById({ _id: req.params.id })
                .populate("brandId", "brandName").populate("categoryId", "categoryName").populate("image", "image.photoUrl")
            if (data) {
                res.status(200).json({ statusCode: 200, message: "Product find by id", data: data })
            }
            else {
                res.status(400).json({ statusCode: 400, message: "Product not found" })
            }
        } catch (error) {
            res.status(400).json({ statusCode: 400, message: error.message })
        }
    },


    deleteProduct: async (req, res) => {
        try {
            const data = await Product.findById({ _id: req.params.id })
            if (data) {
                const result = await Product.findByIdAndUpdate({ _id: req.params.id }, { isActive: false })
                    .populate("brandId", "brandName").populate("categoryId", "categoryName").populate("image", "image.photoUrl")
                res.status(200).json({ statusCode: 200, message: "Product deleted successfully", data: result })
            }
            else if (data) {
                const result = await Product.findByIdAndUpdate({ _id: req.params.id }, { isActive: false })
                    .populate("brandId", "brandName").populate("categoryId", "categoryName").populate("image", "image.photoUrl")
                res.status(200).json({ statusCode: 200, message: "Product deleted successfully", data: result })
                let user = await Image.findOne({ productId: req.params.id });
                const newData = user.image
                await newData.map((x) => {
                    cloudinary.uploader.destroy(x.public_id);
                });
                await user.remove();
            }
            else {
                res.status(400).json({ statusCode: 400, message: "Product Not Found" });
            }
        } catch (error) {
            return res.status(400).json({ statusCode: 400, message: error.message });
        }
    },

    updateProduct: async (req, res) => {
        try {
            if (Object.keys(req.body).length == 0 && req.files == undefined) {
                return res.status(400).json({ statusCode: 400, message: 'please add some fileds' });
            }
            req.body.images = req.photoUrl;
            const result = await Product.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true })
            if (!result) {
                return res.status(400).json({ statusCode: 400, message: 'Product not found'});
            }
            const findProduct = await Image.findOne({ productId: result.id });
            if (req.files.length > 0) {
                await findProduct.image.map((x) => {
                    cloudinary.uploader.destroy(x.public_id);
                });
                const product_id = result.id;
                const data = { product_id, image: req.images };
                const cloudUpdate = await Image.updateOne({ productId: product_id }, data,)
            }
            const newResult = await Product.findOne({ _id: result.id })
                .populate("brandId", "brandName").populate("categoryId", "categoryName").populate("image", "image.photoUrl")
            return res.status(200).json({ statusCode: 200, message: 'product update successfully', data: newResult });
        } catch (error) {
            return res.status(400).json({ statusCode: 400, message: error.message});
        }
    },

    productVerify: async (req, res) => {
        try {
            const product = await Product.findById({ _id: req.body.id })
            if (product) {
                const data = await Product.findByIdAndUpdate({ _id: req.body.id }, { isApproveByAdmin: true }, { new: true })
                return res.status(200).json({ statusCode: 200, message: "Product verified by admin", data: data })
            }
            return res.status(400).json({ statusCode: 400, message: "Product not found" })
        } catch (error) {
            return res.status(400).json({ statusCode: 400, message: error.message });
        }
    }

}