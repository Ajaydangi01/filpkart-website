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
                return res.status(400).json({ status: 400, message: 'Empty filled not allowed', succes: true });
            }
            const newresult = await User.findOne({ _id: req.id });
            if (!newresult) {
                return res.status(400).json({ message: 'invalid sellerId', succes: false });
            }
            else {
                req.body.createdBy = newresult.id
                const data = new Product(req.body)
                if (!isUndefined(req.files)) {
                    const imageData = []
                    for (file of req.files) {
                        const fileName = file.destination + "/" + file.filename
                        await cloudinary.uploader.upload(fileName, function (error, result) {
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
                    }
                    if (req.files && req.files.length > 0) {
                        const s = await Image.create({ productId: data._id, image: imageData })
                        data.image = s.id
                    }
                }
                const category = await Category.findById({ _id: req.body.categoryId })
                if (category) {
                    const brand = await Brand.findById({ _id: req.body.brandId })
                    if (brand) {
                        await data.save()
                        const newdata = await Product.findOne({ _id: data.id })
                            .populate("brandId", "brandName").populate("categoryId", "categoryName").populate("image", "image.photoUrl")
                        console.log(newdata)
                        return res.status(200).json({ success: true, status: 200, message: 'Product create successfully', data: newdata, });
                    }
                    else {
                        res.status(400).json({ status: 400, message: "Brand not found", success: false });
                    }
                }
                else {
                    res.status(400).json({ status: 400, message: "Category not found", success: false });
                }
            }
        } catch (error) {
            console.log(error)
            res.status(400).json({ status: 400, message: error.message, success: false });
        }
    },

    showProduct: async (req, res) => {
        try {
            const { page = 1, limit = 5 } = req.query;
            const filter = { productId: req.id, isActive: true }
            let newFilter;
            if (req.query.filter) {
                newFilter = Object.assign(filter, JSON.parse(req.query.filter))
            } else {
                newFilter = filter
            }
            const result = await Product.find(newFilter).limit(limit * 1).skip((page - 1) * limit).sort({ createAt: 1 })
                .populate("brandId", "brandName").populate("categoryId", "categoryName").populate("image", "image.photoUrl")
            res.status(200).json({ status: 200, totalProduct: result.length, data: result, success: true });

        } catch (error) {
            res.status(400).json({ status: 400, message: error.message, success: false });
        }
    },

    showOneProduct: async (req, res) => {
        try {
                if(ObjectId.isValid(req.params.id)===false){
                 return res.status(400).json({success : false , status : 400 , message : "invalid id format"})
            
                }
            const data = await Product.findById({ _id: req.params.id })
                .populate("brandId", "brandName").populate("categoryId", "categoryName").populate("image", "image.photoUrl")
            if (data) {
                res.status(200).json({ status: 200, message: data, success: true })
            }
            else {
                res.status(400).json({ status: 400, message: "Product not found", success: false })
            }
        } catch (error) {
            console.log(error)
            res.status(400).json({ status: 400, message: error.message, success: false })
        }
    },


    deleteProduct: async (req, res) => {
        try {
            const data = await Product.findById({ _id: req.params.id })
            if (data) {
                const result = await Product.findByIdAndUpdate({ _id: req.params.id }, { isActive: false })
                    .populate("brandId", "brandName").populate("categoryId", "categoryName").populate("image", "image.photoUrl")
                res.status(200).json({ status: 200, message: "Product deleted successfully", data: result, success: true })
            }
            else if (data) {
                const result = await Product.findByIdAndUpdate({ _id: req.params.id }, { isActive: false })
                    .populate("brandId", "brandName").populate("categoryId", "categoryName").populate("image", "image.photoUrl")
                res.status(200).json({ status: 200, message: "Product deleted successfully", data: result, success: true })

                let user = await Image.findOne({ productId: req.params.id });
                const newData = user.image
                await newData.map((x) => {
                    cloudinary.uploader.destroy(x.public_id);
                });
                await user.remove();
            }
            else {
                res.status(400).json({ status: 400, message: "Product Not Found", success: true });
            }
        } catch (error) {
            console.log(error)
            return res.status(400).json({ status: 400, message: error.message, success: false });
        }
    },

    updateProduct: async (req, res) => {
        try {
            if (Object.keys(req.body).length == 0 && req.files == undefined) {
                return res.status(400).json({ message: 'please add some fileds', succes: false, });
            }
            req.body.images = req.photoUrl;
            const result = await Product.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true })
            if (!result) {
                return res.status(400).json({ status: 400, message: 'Product not found', succes: false, });
            }
            const findProduct = await Image.findOne({ productId: result.id });
            if (req.files != undefined) {
                await findProduct.image.map((x) => {
                    cloudinary.uploader.destroy(x.public_id);
                });
                const product_id = result.id;
                const data = { product_id, image: req.images };
                const cloudUpdate = await Image.updateOne({ productId: product_id }, data,)
            }
            const newResult = await Product.findOne({ _id: result.id })
                .populate("brandId", "brandName").populate("categoryId", "categoryName").populate("image", "image.photoUrl")
            return res.status(200).json({ status: 200, message: 'product update successfully', data: newResult, succes: true, });
        } catch (error) {
            console.log(error)
            return res.status(400).json({ status: 400, message: error.message, succes: false, });
        }
    }

}