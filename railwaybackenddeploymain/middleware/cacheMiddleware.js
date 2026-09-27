/**
 * T-RAYO Cache Control & Conditional Response Middleware
 * Prevents redundant database queries and reduces latency for global users
 */

const versionManager = (() => {
  try { return require('../sync/version/versionManager'); }
  catch(e) { return require('../../sync/version/versionManager'); }
})();

const cacheControl = (durationSeconds = 60) => {
  return (req, res, next) => {
    // Only apply cache headers to idempotent read requests
    if (req.method === 'GET') {
      res.set('Cache-Control', `public, max-age=${durationSeconds}, stale-while-revalidate=300`);
      
      const syncInfo = versionManager.getGlobalVersion();
      res.set('X-T-RAYO-Version', syncInfo.v.toString());
      res.set('ETag', `W/"v${syncInfo.v}"`);

      // Check conditional request header
      const clientETag = req.headers['if-none-match'];
      if (clientETag && clientETag === `W/"v${syncInfo.v}"`) {
        return res.status(304).end(); // Not Modified: fast roundtrip, 0 payload!
      }
    }
    next();
  };
};

module.exports = cacheControl;
