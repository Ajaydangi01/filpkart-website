const { Address } = require('./../models/addressSchema');
const axios = require('axios').default;
const { User } = require('./../models/schema');

module.exports = {
    create_address: async (req, res) => {
        try {
            const user = await User.findOne({ number: req.body.number });
            if (user === null) {
                return res.status(400).json({ status: 400, message: 'enter register number', success: false });
            }
            const findUser = await Address.findOne({ number: req.body.number });
            if (!findUser) {
                req.body.isDefault = true;
                req.body.userId = user.id;
                const result = new Address(req.body);
                const data = await result.save();
                res.status(200).json({ status: 200, message: 'Address added successfully', success: true });
            } else {
                req.body.userId = user.id;
                const result = new Address(req.body);
                result.save();
                res.status(200).json({ status: 200, message: 'Address added successfully', success: true });
            }
        } catch (error) {
            res.status(400).json({ status: 400, message: error.message, success: false });
        }
    },

    show_address: async (req, res) => {
        try {
            const { page = 1, limit = 5 } = req.query;
            const filter = { productId: req.id, isActive: true }
            let newFilter;
            if (req.query.filter) {
                newFilter = Object.assign(filter, JSON.parse(req.query.filter))
            } else {
                newFilter = filter
            }
            const user = await Address.find({}).limit(limit * 1).skip((page - 1) * limit).sort({ createAt: 1 });
            res.status(200).json({ status: 200, data: user, success: true });
        } catch (error) {
            res.status(400).json({ status: 400, message: error.message, success: false });
        }
    },

    update_address: async (req, res) => {
        try {
            const result = await Address.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true });
            res.status(200).json({ status: 200, message: 'Address update Successfully', success: true });
        } catch (error) {
            res.status(400).json({ status: 400, message: error.message, success: false });
        }
    },

    delete_address: async (req, res) => {
        try {
            const data = await Address.findOne({ _id: req.params.id });
            if (!data) {
                res.status(400).json({ status: 400, message: 'Address already deleted', success: false });
            }
            else {
                if (data.isDefault === true) {
                    const result = await Address.findByIdAndDelete({ _id: req.params.id });
                    const data1 = await Address.findOne({ userId: data.userId }).sort({ createdAt: -1 });
                    await Address.updateOne({ _id: data1.id }, { isDefault: true });
                    res.status(200).json({ status: 200, message: "Address deleted successfully", success: true });
                } else {
                    await Address.findByIdAndDelete({ _id: req.params.id });
                    res.status(200).json({ status: 200, message: 'Address deleted successfully', success: true, });
                }
            }
        } catch (error) {
            res.status(400).json({ status: 400, message: error.message, success: false, });
        }
    },

    get_Data: (req, res) =>
        axios
            .get('https://countriesnow.space/api/v0.1/countries/states')
            .then((response) => {
                console.log('>>>><<<<<', response.data);
                res.status(200).json({ status: 200, message: response.data });
            })
            .catch((error) => {
                console.log('error', error);
            }),
};
