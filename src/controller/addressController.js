const { Address } = require('./../models/addressSchema');
const axios = require('axios').default;
const { User } = require('./../models/schema');
const SendError = require("../config/apierror")

module.exports = {
    create_address: async (req, res) => {
        try {
            const user = await User.findOne({ _id: req.id });
            if (user === null) {
                return next(new SendError(400, 'user not register'))
            }
            const findUser = await Address.findOne({ number: req.body.number });
            if (!findUser) {
                req.body.isDefault = true;
                req.body.userId = user.id;
                const{fullName, number,houseNo,street,landmark,addressType, city,pincode,state,country} = req.body
                const result = new Address({fullName, number,houseNo,street,landmark,addressType, city,pincode,state,country , isDefault : true , userId : user.id});
                const data = await result.save();
                res.status(200).json({ statusCode: 200, message: 'Address added successfully', data: result });
            } else {
                req.body.userId = user.id;
                const result = new Address(req.body);
                result.save();
                res.status(200).json({ statusCode: 200, message: 'Address added successfully', data: result });
            }
        } catch (error) {
            res.status(400).json({ statusCode: 400, message: error.message });
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
            res.status(200).json({ statusCode: 200, message: "Address find successfully", data: user });
        } catch (error) {
            res.status(400).json({ statusCode: 400, message: error.message });
        }
    },

    update_address: async (req, res , next) => {
        try {
            const result = await Address.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true });
            if (!result) {
                return next(new SendError(400, 'Address not found'))

            }
            res.status(200).json({ statusCode: 200, message: 'Address update Successfully', data: result });
        } catch (error) {
            res.status(400).json({ statusCode: 400, message: error.message });
        }
    },

    delete_address: async (req, res , next) => {
        try {
            const data = await Address.findOne({ _id: req.params.id });
            if (!data) {
                return next(new SendError(400, 'Address not found'))
            }
            else {
                if (data.isDefault === true) {
                    const result = await Address.findByIdAndDelete({ _id: req.params.id });
                    const data1 = await Address.findOne({ userId: data.userId }).sort({ createdAt: -1 });
                    await Address.updateOne({ _id: data1.id }, { isDefault: true });
                    res.status(200).json({ statusCode: 200, message: "Address deleted successfully", data: data1 });
                } else {
                    await Address.findByIdAndDelete({ _id: req.params.id });
                    res.status(200).json({ statusCode: 200, message: 'Address deleted successfully', success: true, });
                }
            }
        } catch (error) {
            console.log(error)
            res.status(400).json({ statusCode: 400, message: error.message });
        }
    },

    get_Data: (req, res) =>
        axios
            .get('https://countriesnow.space/api/v0.1/countries/states')
            .then((response) => {
                res.status(200).json({ statusCode: 200, message: response.data });
            })
            .catch((error) => {
                console.log('error', error);
            }),
};
