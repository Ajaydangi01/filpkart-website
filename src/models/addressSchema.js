const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const addressSchema = new mongoose.Schema({
  userId: String,
  fullName: String,
  number: String,
  houseNo: String,
  street: String,
  landmark: String,
  city: String,
  pincode: Number,
  state: String,
  country: String,
  addressType: String,
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
});


const Address = mongoose.model('Address', addressSchema);
module.exports = { Address };
