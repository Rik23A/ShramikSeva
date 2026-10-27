const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { Admin } = require('../models/User');

// Load env vars
dotenv.config();

const createAdmin = async () => {
  const adminData = {
    name: process.argv[2] || 'Admin User',
    email: process.argv[3],
    password: process.argv[4],
    mobile: process.argv[5],
    department: 'Management',
    permissions: ['manage_users', 'manage_jobs', 'manage_payments', 'view_analytics', 'manage_disputes', 'send_notifications']
  };

  if (!adminData.email || !adminData.password || !adminData.mobile) {
    console.error('Usage: node scripts/createAdmin.js "Name" "email" "password" "mobile"');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB...');

    const existingAdmin = await Admin.findOne({ 
      $or: [
        { email: adminData.email },
        { mobile: adminData.mobile }
      ] 
    });

    if (existingAdmin) {
      console.error('An admin or user with this email or mobile already exists.');
      process.exit(1);
    }

    const admin = await Admin.create(adminData);
    console.log(`Successfully created admin: ${admin.name} (${admin.email})`);
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error.message);
    process.exit(1);
  }
};

createAdmin();
