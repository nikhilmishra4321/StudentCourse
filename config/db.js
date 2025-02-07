
const mongoose = require('mongoose');
require('dotenv').config();
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Mongodb Connected...');
  } catch (err) {
    console.error('Mongodb connection error:', err);
    process.exit(1);
  }
};
module.exports = connectDB;
