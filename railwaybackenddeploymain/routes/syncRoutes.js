/**
 * T-RAYO Synchronization Routes
 */
const express = require('express');
const router = express.Router();
const syncController = require('../controllers/syncController');

// Fast conditional polling endpoint
router.get('/version', syncController.getSyncVersion);

// Server-Sent Events stream for instant realtime push
router.get('/stream', syncController.getEventStream);

module.exports = router;
