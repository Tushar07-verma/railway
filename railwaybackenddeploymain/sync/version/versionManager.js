/**
 * T-RAYO Global Version Synchronization Manager
 * 
 * Manages atomic version counters for data consistency across:
 * Admin Panel -> Railway API -> MongoDB Atlas -> Global Devices
 */

class VersionManager {
  constructor() {
    this.currentVersion = 1;
    this.entityVersions = {
      products: 1,
      inventory: 1,
      categories: 1,
      settings: 1
    };
    this.lastUpdatedAt = new Date().toISOString();
  }

  getGlobalVersion() {
    return {
      v: this.currentVersion,
      entities: this.entityVersions,
      t: this.lastUpdatedAt
    };
  }

  bumpVersion(entity) {
    this.currentVersion += 1;
    if (this.entityVersions[entity] !== undefined) {
      this.entityVersions[entity] += 1;
    }
    this.lastUpdatedAt = new Date().toISOString();
    return this.getGlobalVersion();
  }

  isClientCurrent(clientVersion) {
    return Number(clientVersion) === this.currentVersion;
  }
}

module.exports = new VersionManager();
