/**
 * T-RAYO Central Database Sync Epoch Tracker
 * Persists the current epoch version in MongoDB Atlas for multi-device sync
 */
const mongoose = require('mongoose');

const syncVersionSchema = new mongoose.Schema(
  {
    scope: { type: String, required: true, unique: true, default: 'global' },
    version: { type: Number, required: true, default: 1 },
    entityVersions: {
      products: { type: Number, default: 1 },
      inventory: { type: Number, default: 1 },
      categories: { type: Number, default: 1 },
      settings: { type: Number, default: 1 }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('SyncVersion', syncVersionSchema);
