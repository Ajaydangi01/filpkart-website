const { SellerProfile } = require('../models/sellerProfileSchema');
const { User } = require('./../models/schema');

module.exports = {
    create_profile: async (req, res) => {
        try {
            const result = await User.findById({ _id: req.id })
            if (result) {
                const data = await SellerProfile.findOne({ sellerId: req.id })
                if (!data) {
                    if (req.body.GSTIN) {
                        req.body.sellerId = result.id
                        req.body.isKYC = true
                        const finalResult = new SellerProfile(req.body)
                        finalResult.save()
                        res.status(200).json({ status: 200, message: 'Profile update successfully', data: finalResult });
                    }
                }
                else {
                    res.status(400).json({ status: 400, message: 'Profile already updated' });
                }
            }
            else {
                res.status(400).json({ status: 400, message: 'Seller not register' });
            }
        } catch (error) {
            res.status(400).json({ status: 400, message: error.message });
        }
    }
}

    // show_profile: async (req, res) => {
    //     try {
    //         const user = await SellerProfile.findOne({ sellerId: req.params.id });
    //         res.status(200).json({ status: 200, message: user, success: true });
    //     } catch (error) {
    //         res.status(400).json({ status: 400, message: error.message, success: false });
    //     }
    // },

    // update_profile: async (req, res) => {
    //     try {
    //         const result = await SellerProfile.findOneAndUpdate({ sellerId: req.params.id }, req.body, { new: true })
    //         console.log(result);
    //         res.status(200).json({ status: 200, message: result, success: true });
    //     } catch (error) {
    //         res.status(400).json({ status: 400, message: error.message, success: false });
    //     }
    // }