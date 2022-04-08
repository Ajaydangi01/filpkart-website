const mongoose = require('mongoose');
const connection = async () => {
  return await mongoose.connect('mongodb://127.0.0.1:27017/Ecommerce');
};

module.exports = { connection };
