const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { adminRole, sellerRole, userRole } = require('../config/index');
const UserSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: [adminRole, sellerRole, userRole],
  },
  fullName: String,
  email: String,
  number: String,
  password: String,
  otp: {
    type: Number,
    default: null,
  },
  photoUrl: {
    type: String,
    default: null,
  },
  aboutUs: String,
  isActive: {
    type: Boolean,
    default: false,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isApprove: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  token: String,
  isDeleted: {
    type: Boolean,
    default: false,
  },
  resetTime: {
    type: Number,
    default: null,
  },
});

UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

UserSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

const User = mongoose.model('User', UserSchema);
module.exports = { User };
