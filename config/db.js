const mongoose = require('mongoose');
require('dotenv').config(); // โหลด MONGO_URI จากไฟล์ .env

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      // useNewUrlParser: true, // ตั้งแต่ Mongoose 6 เป็นต้นไป ไม่จำเป็นต้องระบุแล้ว
      // useUnifiedTopology: true,
    });
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;