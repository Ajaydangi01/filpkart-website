const Brand = require("./../models/brandSchema")
const cloudinary = require('cloudinary').v2
const Category = require("./../models/categorySchema")
const { Image } = require("./../models/imageSchema")
const SendError = require("../config/apierror")
const { isUndefined } = require('lodash');
const { CloudName, APIKey, APISecret } = require("./../config/index");
cloudinary.config({ cloud_name: CloudName, api_key: APIKey, api_secret: APISecret, secure: true });

module.exports = {
    createBrand: async (req, res) => {
        try {
            const result = await Brand.findOne({ brandName: req.body.brandName });
            if (result) {
                return res.status(400).json({ statusCode: 200, message: 'Brand already exist' });
            }
            const createBrand = await Brand.create(req.body)
            if (!isUndefined(req.file)) {
                const fileName = req.file.destination + "/" + req.file.filename
                const imageData = []
                await cloudinary.uploader.upload(fileName, function async(error, result) {
                    if (error) {
                        res.send(error)
                    }
                    else {
                        const obj = {
                            photoUrl: result.url,
                            public_id: result.public_id
                        }
                        imageData.push(obj)
                    }
                });
                const s = await Image.create({ brandId: createBrand.id, image: imageData })
            }
            const newdata = await Brand.findOne({ _id: createBrand.id })
                .populate("image", "image.photoUrl")
            return res.status(200).json({ statusCode: 200, message: ' brand create successfully', data: newdata, });
        } catch (error) {
            return res.status(400).json({ statusCode: 400, message: error.message, succes: false, });
        }
    },

    showBrand: async (req, res) => {
        try {
            const { page = 1, limit = 5 } = req.query;
            const filter = { productId: req.id, isActive: true }
            let newFilter;
            if (req.query.filter) {
                newFilter = Object.assign(filter, JSON.parse(req.query.filter))
            } else {
                newFilter = filter
            }
            const regex = new RegExp(req.query.search, "i")
            const user = await Brand.find({ $or: [{ "brandName": regex }, { "description": regex }] }).limit(limit * 1).skip((page - 1) * limit).sort({ createAt: 1 });
            res.status(200).json({ statusCode: 200, message: "All brands", totalBrands: user.length, data: user });
        } catch (error) {
            res.status(400).json({ statusCode: 400, message: error.message });
        }
    },

    showOneBrand: async (req, res , next) => {
        try {
            const result = await Brand.findById({ _id: req.params.id })
            if (!result) {
                return next(new SendError(400, "Brand not found"))
            }
            else {
                res.status(200).json({ statusCode: 200, message: "Brand find by id", data: result })
            }
        } catch (error) {
            res.status(400).json({ statusCode: 400, message: error.message })
        }
    },

    deleteBrand: async (req, res , next) => {
        try {
            const result = await Brand.findByIdAndDelete({ _id: req.params.id })
            if (!result) {
                return next(new SendError(400, "Brand not found"))
            }
            res.status(200).json({ statusCode: 200, message: "Brand deleted successfully", data: result })
        } catch (error) {
            res.status(400).json({ statusCode: 400, message: error.message });
        }
    },

    updateBrand: async (req, res, next) => {
        try {
            const data = await Brand.findById({ _id: req.params.id })
            if (!data) {
                return next(new SendError(400, "Brand not found"))
            }
            else {
                const result = await Brand.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true })
                res.status(200).json({ statusCode: 200, message: "Brand update successfully", data: result });
            }
        } catch (error) {
            res.status(400).json({ statusCode: 400, message: error.message });
        }
    },

    createCategory: async (req, res, next) => {
        try {
            const result = await Category.findOne({ categoryName: req.body.categoryName });
            if (result) {
                return next(new SendError(400, "Category already exist"))
            }
            const{categoryName , description} = req.body
            const createBrand = await Category.create({categoryName , description})
            if (!isUndefined(req.file)) {
                const fileName = req.file.destination + "/" + req.file.filename
                const imageData = []
                await cloudinary.uploader.upload(fileName, function async(error, result) {
                    if (error) {
                        res.send(error)
                    }
                    else {
                        const obj = {
                            photoUrl: result.url,
                            public_id: result.public_id
                        }
                        imageData.push(obj)
                    }
                });
                const s = await Image.create({ categoryId: createBrand.id, image: imageData })
            }
            const newdata = await Category.findOne({ _id: createBrand.id })
            return res.status(200).json({ statusCode: 200, message: ' Category create successfully', data: newdata, });
        } catch (error) {
            console.log(error)
            return res.status(400).json({ statusCode: 400, message: error.message, succes: false, });
        }
    },

    show_category: async (req, res) => {
        try {
            const { page = 1, limit = 5 } = req.query;
            const filter = { productId: req.id, isActive: true }
            let newFilter;
            if (req.query.filter) {
                newFilter = Object.assign(filter, JSON.parse(req.query.filter))
            } else {
                newFilter = filter
            }
            const regex = new RegExp(req.query.search, "i")
            const result = await Category.find({ $or: [{ "categoryName": regex }, { "description": regex }, { "price": regex }] }).limit(limit * 1).skip((page - 1) * limit).sort({ createAt: 1 })
            res.status(200).json({ statusCode: 200, message: "All Category", totalCategory: result.length, data: result });
        } catch (error) {
            res.status(400).json({ statusCode: 400, message: error.message });
        }
    },

    show_one_category: async (req, res,next) => {
        try {
            const result = await Category.findById({ _id: req.params.id })
            if (!result) {
                return next(new SendError(400, "Category not found"))
            }
            else {
                res.status(200).json({ statusCode: 200, message: "Category find by id", data: result, })
            }
        } catch (error) {
            res.status(400).json({ status: 400, message: error.message })
        }
    },

    delete_category: async (req, res,next) => {
        try {
            const result = await Category.findByIdAndDelete({ _id: req.params.id })
            if (!result) {
                return next(new SendError(400, "Category not found"))
            }
            res.status(200).json({ statusCode: 200, message: "Category deleted successfully", data: result })
        } catch (error) {
            res.status(400).json({ statusCode: 400, message: error.message });
        }
    },

    update_category: async (req, res,next) => {
        try {
            const data = await Category.findById({ _id: req.params.id })
            if (!data) {
                return next(new SendError(400, "Category not found"))
            }
            else {
                const result = await Category.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true })
                res.status(200).json({ statusCode: 200, message: "Category update successfully", data: result });

            }
        } catch (error) {
            res.status(400).json({ statusCode: 400, message: error.message });
        }
    },
}

