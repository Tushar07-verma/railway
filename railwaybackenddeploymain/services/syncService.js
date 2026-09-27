/**
 * T-RAYO Synchronization Service
 */
const versionManager = (() => {
  try { return require('../sync/version/versionManager'); }
  catch(e) { return require('../../sync/version/versionManager'); }
})();

class SyncService {
  getCurrentVersion() {
    return versionManager.getGlobalVersion();
  }

  isModifiedSince(clientVersion) {
    return !versionManager.isClientCurrent(clientVersion);
  }
}

module.exports = new SyncService();
