const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000, // 10s timeout
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.warn('⚠️  Server is running but DB is not connected.');
    console.warn('   → Go to https://cloud.mongodb.com → Network Access → Add IP: 0.0.0.0/0 (or your current IP)');
    // Do NOT exit — server stays alive for non-DB routes
  }
};

module.exports = connectDB;
