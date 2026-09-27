/**
 * T-RAYO Synchronization Controller
 * Returns minimal version payload or registers client for realtime push
 */
const syncService = require('../services/syncService');
const realtimeManager = (() => {
  try { return require('../sync/realtime/socketManager'); }
  catch(e) { return require('../../sync/realtime/socketManager'); }
})();

const getSyncVersion = (req, res) => {
  const current = syncService.getCurrentVersion();
  const clientEtag = req.headers['if-none-match'];

  if (clientEtag && clientEtag === `"${current.v}"`) {
    return res.status(304).end();
  }

  res.set('ETag', `"${current.v}"`);
  res.set('Cache-Control', 'no-cache');
  return res.status(200).json(current);
};

const getEventStream = (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  realtimeManager.addClient(res);

  req.on('close', () => {
    realtimeManager.removeClient(res);
  });
};

module.exports = {
  getSyncVersion,
  getEventStream
};
