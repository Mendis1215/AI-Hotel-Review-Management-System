const mongoose = require('mongoose');
const dotenv = require('dotenv');
const dns = require('dns');
const User = require('./models/User');

dotenv.config();
dns.setServers(['8.8.8.8', '1.1.1.1']);

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Check if admin already exists
    const adminExists = await User.findOne({ email: 'L&I@gmail.com' });
    
    if (adminExists) {
      console.log('Admin user already exists!');
      process.exit();
    }
    
    // Create admin user
    await User.create({
      name: 'L&I Villa',
      email: 'L&I@gmail.com',
      password: 'L&I@12345',
      role: 'admin',
      phone: '0777103387'
    });
    
    console.log('Admin user seeded successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error seeding admin: ${error.message}`);
    process.exit(1);
  }
};

seedAdmin();
