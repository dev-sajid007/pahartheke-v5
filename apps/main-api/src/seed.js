import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.MONGODB_DB_NAME,
    });

    const existing = await User.findOne({ email: 'admin@pahar.com' });
    if (existing) {
      console.log('Admin user already exists.');
    } else {
      await User.create({
        name: 'Admin',
        email: 'admin@pahar.com',
        password: 'admin123',
        phone: '01531532139',
        role: 'admin',
      });
      console.log('✅ Admin user created:');
    }

    console.log('   Email: admin@pahar.com');
    console.log('   Password: admin123');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
};

seedAdmin();
