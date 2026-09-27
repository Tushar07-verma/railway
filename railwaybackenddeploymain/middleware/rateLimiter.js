/**
 * T-RAYO Lightweight In-Memory Sliding Window Rate Limiter
 * Guards Railway instance against traffic spikes with minimal memory footprint
 */

const ApiResponse = require('../utils/apiResponse');
const config = require('../config/env');

const requestCounts = new Map();

// Periodic prune to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of requestCounts.entries()) {
    if (now - record.resetTime > config.rateLimitWindowMs) {
      requestCounts.delete(ip);
    }
  }
}, 60000);

const rateLimiter = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const now = Date.now();

  let record = requestCounts.get(ip);
  if (!record || now - record.startTime > config.rateLimitWindowMs) {
    record = { count: 1, startTime: now, resetTime: now + config.rateLimitWindowMs };
    requestCounts.set(ip, record);
    return next();
  }

  record.count += 1;
  if (record.count > config.rateLimitMax) {
    res.set('Retry-After', Math.ceil((record.resetTime - now) / 1000).toString());
    return ApiResponse.error(res, 'Too many requests. Please slow down.', 429);
  }

  next();
};

module.exports = rateLimiter;
