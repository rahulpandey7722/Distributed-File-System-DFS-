const crypto = require('crypto');

class ConsistentHashRing {
  constructor(nodes) {
    this.nodes = nodes;
  }

  getNode(key) {
    const hash = crypto.createHash('md5').update(key).digest('hex');
    const index = parseInt(hash.substring(0, 8), 16) % this.nodes.length;
    return this.nodes[index];
  }
}

module.exports = ConsistentHashRing;