/**
 * T-RAYO Realtime Push / SSE Manager
 */

class RealtimeSyncManager {
  constructor() {
    this.clients = new Set();
  }

  addClient(res) {
    this.clients.add(res);
  }

  removeClient(res) {
    this.clients.delete(res);
  }

  broadcastEvent(eventType, payload) {
    const data = JSON.stringify({ type: eventType, data: payload, ts: Date.now() });
    for (const client of this.clients) {
      client.write(`event: message\ndata: ${data}\n\n`);
    }
  }

  getConnectedCount() {
    return this.clients.size;
  }
}

module.exports = new RealtimeSyncManager();
