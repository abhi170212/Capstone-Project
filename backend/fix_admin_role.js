/**
 * Fix Admin User Role
 * Run this script to ensure admin user has the admin role
 */

require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');

const fixAdminRole = async () => {
  try {
    await connectDB();
    console.log('🔧 Fixing admin user role...\n');

    // Find admin user
    const adminUser = await User.findOne({ email: 'admin@bihartourism.com' });

    if (!adminUser) {
      console.log('❌ Admin user not found. Running seed instead...\n');
      console.log('Please run: npm run seed');
      process.exit(1);
    }

    console.log('Current admin user data:');
    console.log('  Name:', adminUser.name);
    console.log('  Email:', adminUser.email);
    console.log('  Role:', adminUser.role || 'NOT SET');
    console.log('');

    // Update role to admin
    if (adminUser.role !== 'admin') {
      adminUser.role = 'admin';
      await adminUser.save();
      console.log('✅ Admin role updated successfully!');
    } else {
      console.log('✅ Admin user already has admin role');
    }

    // Verify the update
    const updatedUser = await User.findOne({ email: 'admin@bihartourism.com' });
    console.log('\nVerified admin user data:');
    console.log('  Name:', updatedUser.name);
    console.log('  Email:', updatedUser.email);
    console.log('  Role:', updatedUser.role);
    console.log('');

    console.log('🎉 Fix complete! Now follow these steps:');
    console.log('');
    console.log('1. Logout from the app');
    console.log('2. Open browser console (F12) and run:');
    console.log('   localStorage.clear()');
    console.log('3. Login again with:');
    console.log('   Email: admin@bihartourism.com');
    console.log('   Password: admin123');
    console.log('4. Try adding a destination - it should work!');
    console.log('');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

fixAdminRole();
