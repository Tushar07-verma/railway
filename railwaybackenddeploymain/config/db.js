/**
 * T-RAYO Centralized MongoDB Atlas Cloud Database Connection
 * Resilient, non-blocking connection handler for Railway deployment
 */
const mongoose = require('mongoose');
const config = require('./env');

const connectDatabase = async () => {
  // If no cloud URI provided, log guidance without crashing the process
  if (!config.mongoUri || config.mongoUri.includes('localhost')) {
    console.warn('[T-RAYO Central DB] MONGODB_URI not yet configured on Railway. Please add MONGODB_URI in Railway Variables.');
    return;
  }

  try {
    const options = {
      maxPoolSize: 20,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 30000,
      family: 4
    };

    await mongoose.connect(config.mongoUri, options);
    console.log('[T-RAYO Central DB] Connected successfully to MongoDB Atlas');
  } catch (error) {
    console.warn('[T-RAYO Central DB] MongoDB Atlas connection pending/retryable:', error.message);
  }
};

module.exports = connectDatabase;
