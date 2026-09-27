/**
 * T-RAYO Backend API Server Entry Point
 * 
 * Optimized for Railway cloud deployment, MongoDB Atlas connectivity,
 * and high-concurrency low-latency performance.
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const mongoose = require('mongoose');

const config = require('./config/env');
const connectDatabase = require('./config/db');
const logger = require('./utils/logger');
const errorHandler = require('./middleware/errorMiddleware');
const rateLimiter = require('./middleware/rateLimiter');

// Import Route Handlers
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const orderRoutes = require('./routes/orderRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const userRoutes = require('./routes/userRoutes');
const syncRoutes = require('./routes/syncRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Security & Optimization Middleware
app.use(cors({
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'If-None-Match', 'X-T-RAYO-Version'],
  credentials: true
}));

app.use(helmet({
  crossOriginResourcePolicy: false
}));
app.use(compression());

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// Global Rate Limiting
app.use(rateLimiter);

// Root route - Guaranteed 200 OK for Railway healthcheck and instant verification
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'online',
    service: 'T-RAYO Production Backend API',
    uptime: `${Math.floor(process.uptime())}s`,
    database: mongoose.connection.readyState === 1 ? 'connected_to_atlas' : 'connecting_or_standalone',
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint for container liveness probes
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// API Routes Mounting - Mounted on both /api/... and /...
// Ensures frontend requests never fail with 404 whether the URL includes /api or not
const mountRoutes = (prefix = '') => {
  app.use(`${prefix}/products`, productRoutes);
  app.use(`${prefix}/categories`, categoryRoutes);
  app.use(`${prefix}/orders`, orderRoutes);
  app.use(`${prefix}/inventory`, inventoryRoutes);
  app.use(`${prefix}/users`, userRoutes);
  app.use(`${prefix}/sync`, syncRoutes);
  app.use(`${prefix}/admin`, adminRoutes);
};

mountRoutes('/api');
mountRoutes('');

// 404 Catch-All JSON Handler (prevents HTML 404 responses from breaking JSON clients)
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    status: 404,
    message: `API endpoint not found: ${req.method} ${req.originalUrl}. Check your endpoint path.`,
    availableEndpoints: [
      '/api/products',
      '/api/categories',
      '/api/orders',
      '/api/inventory',
      '/api/users',
      '/api/sync/version',
      '/api/admin/dashboard-stats',
      '/health'
    ]
  });
});

// Centralized Error Handling
app.use(errorHandler);

// Start Server Instantly on 0.0.0.0 (Mandatory for Railway and Docker)
const PORT = process.env.PORT || config.port || 5000;
const HOST = '0.0.0.0';

const server = app.listen(PORT, HOST, () => {
  logger.info(`T-RAYO API is ONLINE and listening on ${HOST}:${PORT}`);
  // Asynchronously connect database in background without blocking server availability
  connectDatabase().catch(err => {
    logger.warn(`Initial database connection attempt: ${err.message}`);
  });
});

// Graceful shutdown
const shutdown = () => {
  logger.info('Received termination signal. Shutting down gracefully...');
  server.close(() => {
    logger.info('HTTP server closed.');
    process.exit(0);
  });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

module.exports = app;
