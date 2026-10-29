require('dotenv').config();
const mongoose = require('mongoose');

console.log('Testing MongoDB connection...');
console.log('MONGO_URI:', process.env.MONGO_URI ? 'Set' : 'Not set');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'Not set');

const connect = () => {
  mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB successfully!');
    process.exit(0);
  })
  .catch(err => {
    console.log('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });
}

connect(); 