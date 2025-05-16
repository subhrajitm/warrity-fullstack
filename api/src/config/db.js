const mongoose = require('mongoose');

// Database configuration
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/warrity';

// Connection options
const connectionOptions = {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  bufferCommands: false,
};

// Connect to database function
async function connectToDatabase() {
  try {
    await mongoose.connect(MONGODB_URI, connectionOptions);
    console.log('MongoDB connected successfully');
    console.log(`Using database: ${MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//****:****@')}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

// Disconnect from database function
async function disconnectFromDatabase() {
  try {
    await mongoose.disconnect();
    console.log('MongoDB disconnected successfully');
  } catch (error) {
    console.error('MongoDB disconnection error:', error);
    throw error;
  }
}

module.exports = {
  connectToDatabase,
  disconnectFromDatabase,
  mongoose
}; 