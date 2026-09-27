/**
 * T-RAYO Environment Configuration & Validation
 */
const path = require('path');
require('dotenv').config();
try {
  require('dotenv').config({ path: path.resolve(__dirname, '../../deployment/environment/.env') });
} catch (e) {}

const config = {
  env: process.env.NODE_ENV || 'production',
  port: parseInt(process.env.PORT || '5000', 10),
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/t_rayo',
  jwtSecret: process.env.JWT_SECRET || 'dev_fallback_secret_change_in_production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  cacheTtl: parseInt(process.env.CACHE_TTL_SECONDS || '300', 10),
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '250', 10)
};

module.exports = config;
