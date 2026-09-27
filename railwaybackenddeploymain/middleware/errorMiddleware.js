/**
 * T-RAYO Central Error Handler Middleware
 * Intercepts uncaught exceptions, avoids leaking server stack traces in production
 */

const ApiResponse = require('../utils/apiResponse');
const logger = require('../utils/logger');
const config = require('../config/env');

const errorHandler = (err, req, res, next) => {
  logger.error(err.message, { stack: config.env === 'development' ? err.stack : undefined });

  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : 'Internal Server Error';

  return ApiResponse.error(res, message, statusCode);
};

module.exports = errorHandler;
