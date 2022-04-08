const mongoose = require('mongoose');
const imageSchema = new mongoose.Schema({
    productId : String,
    image:[ {
        photoUrl :String,
        public_id : String
    }],
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    }
});

const Image = mongoose.model('Image', imageSchema);
module.exports = { Image };