const Brand = require("./../models/brandSchema")
const cloudinary = require('cloudinary').v2
const Category = require("./../models/categorySchema")
const { Image } = require("./../models/imageSchema")
const { isUndefined, result } = require('lodash');
const { CloudName, APIKey, APISecret } = require("./../config/index");
cloudinary.config({
    cloud_name: CloudName,
    api_key: APIKey,
    api_secret: APISecret,
    secure: true
});

module.exports = {
    createBrand: async (req, res) => {
        try {
            const result = await Brand.findOne({ brandName: req.body.brandName });
            if (result) {
                return res.status(400).json({ status: 200, message: 'Brand already exist', succes: false, });
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
            // console.log(newdata)
            return res.status(200).json({ status: 200, data: newdata, message: ' brand create successfully', succes: true, });
        } catch (error) {
            return res.status(400).json({ status: 400, message: error.message, succes: false, });
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
            const user = await Brand.find({ $or: [{ "brandName": regex }, { "description": regex }] }, newFilter).limit(limit * 1).skip((page - 1) * limit).sort({ createAt: 1 });
            // console.log("<<<>>>" , user)
            res.status(200).json({ status: 200, message: "All brands", totalBrands: user.length, data: user, success: true });
        } catch (error) {
            res.status(400).json({ status: 400, message: error.message, success: false });
        }
    },

    showOneBrand: async (req, res) => {
        try {
            const result = await Brand.findById({ _id: req.params.id })
            if (result) {
                res.status(200).json({ status: 200, message: result, success: true })
            }
            else {
                res.status(400).json({ status: 400, message: "Brand not found", success: false })
            }
        } catch (error) {
            res.status(400).json({ status: 400, message: error.message, success: false })
        }
    },

    deleteBrand: async (req, res) => {
        try {
            const result = await Brand.findByIdAndDelete({ _id: req.params.id })
            res.status(200).json({ status: 200, message: "Brand deleted successfully" })
        } catch (error) {
            console.log(error)
            res.status(400).json({ status: 400, message: error.message, success: false });
        }
    },

    updateBrand: async (req, res) => {
        try {
            console.log(req.body)
            const data = await Brand.findById({ _id: req.params.id })
            if (data) {
                const result = await Brand.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true })
                res.status(200).json({ status: 200, message: "Brand update successfully", success: true });
            }
            else {
                res.status(400).json({ status: 400, message: "Brand not found", success: true });
            }
        } catch (error) {
            res.status(400).json({ status: 400, message: error.message, success: false });
        }
    },

    createCategory: async (req, res) => {
        try {
            const result = await Category.findOne({ categoryName: req.body.categoryName });
            if (result) {
                return res.status(400).json({ status: 200, message: 'Category already exist', succes: false, });
            }
            const createBrand = await Category.create(req.body)
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
            return res.status(200).json({ status: 200, data: newdata, message: ' Category create successfully', succes: true, });
        } catch (error) {
            console.log(error)
            return res.status(400).json({ status: 400, message: error.message, succes: false, });
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
            const result = await Category.find({ $or: [{ "categoryName": regex }, { "description": regex }, { "price": regex }] }, newFilter).limit(limit * 1).skip((page - 1) * limit).sort({ createAt: 1 })
            res.status(200).json({ status: 200, message: "All Category", totalCategory: result.length, data: result, success: true });
        } catch (error) {
            res.status(400).json({ status: 400, message: error.message, success: false });
        }
    },

    show_one_category: async (req, res) => {
        try {
            const result = await Category.findById({ _id: req.params.id })
            if (result) {
                res.status(200).json({ status: 200, message: result, success: true })
            }
            else {
                res.status(400).json({ status: 400, message: "Category not found", success: false })
            }
        } catch (error) {
            res.status(400).json({ status: 400, message: error.message, success: false })
        }
    },

    delete_category: async (req, res) => {
        try {
            const result = await Category.findByIdAndDelete({ _id: req.params.id })
            res.status(200).json({ status: 200, message: "Category deleted successfully" })
        } catch (error) {
            res.status(400).json({ status: 400, message: error.message, success: false });
        }
    },

    update_category: async (req, res) => {
        try {
            console.log(req.body)
            const data = await Category.findById({ _id: req.params.id })
            if (data) {
                const result = await Category.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true })
                res.status(200).json({ status: 200, message: "Category update successfully", success: true });
            }
            else {
                res.status(400).json({ status: 400, message: "Category not found", success: true });
            }
        } catch (error) {
            res.status(400).json({ status: 400, message: error.message, success: false });
        }
    },
}

