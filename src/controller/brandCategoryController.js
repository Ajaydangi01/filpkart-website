const Brand = require("./../models/brandSchema")
const Category = require("./../models/categorySchema")
const { port, host, secretKey } = require('./../config/index');

module.exports = {
    createBrand: async (req, res) => {
        try {
            console.log(req.body)
            const result = await Brand.findOne({ brandName: req.body.brandName });
            if (result) {
                return res.status(400).json({ status: 200, message: 'Brand already exist', succes: false, });
            }
            const createBrand = await Brand.create(req.body)
            return res.status(200).json({ createBrand: createBrand, message: ' brand create successfully', succes: true, });
        } catch (error) {
            console.log(error)
            return res.status(400).json({ status: 400, message: error.message, succes: false, });
        }
    },

    showBrand: async (req, res) => {
        try {
            const user = await Brand.find({});
            res.status(200).json({ status: 200, message: user, success: true });
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
            const result = await Brand.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true })
            res.status(200).json({ status: 200, message: "Brand update successfully", success: true });
        } catch (error) {
            res.status(400).json({ status: 400, message: error.message, success: false });
        }
    },


    create_category: async (req, res) => {
        try {
            const result = await Category.findOne({ categoryName: req.body.categoryName });
            if (result) {
                return res.status(400).json({ message: 'category already exist', succes: false, });
            }
            const createCategory = await Category.create(req.body)
            return res.status(200).json({ createCategory: createCategory, message: 'create category successfully', succes: true, });
        } catch (error) {
            return res.status(400).json({ status: 400, message: error.message, succes: false, });
        }

    },

    show_category: async (req, res) => {
        try {
            const user = await Category.find({});
            res.status(200).json({ status: 200, message: user, success: true });
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
            const result = await Category.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true })
            res.status(200).json({ status: 200, message: "Category update successfully", success: true });
        } catch (error) {
            res.status(400).json({ status: 400, message: error.message, success: false });
        }
    },
}

