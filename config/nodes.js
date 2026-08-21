const { MongoClient, GridFSBucket } = require('mongodb');

const nodes = {};

const nodeUrls = {
  node1: process.env.MONGO_URI,
  node2: process.env.MONGO_URI,
  node3: process.env.MONGO_URI
};

async function initNodes() {
  for (let nodeId in nodeUrls) {
    const client = new MongoClient(nodeUrls[nodeId]);
    await client.connect();

    const db = client.db('dfs_' + nodeId);
    nodes[nodeId] = new GridFSBucket(db);

    console.log(`Connected to ${nodeId}`);
  }
}

function getBucket(nodeId) {
  return nodes[nodeId];
}

function getAllNodeIds() {
  return Object.keys(nodes);
}

module.exports = { initNodes, getBucket, getAllNodeIds };