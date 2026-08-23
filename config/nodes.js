const mongoose = require("mongoose");
const { GridFSBucket } = require("mongodb");

let buckets = {};
let nodeIds = [];

// 🔥 Initialize buckets for multiple nodes
function initBuckets() {
  const db = mongoose.connection.db;

  if (!db) {
    throw new Error("MongoDB not connected");
  }

  // Example: 3 nodes (you can scale later)
  nodeIds = ["node1", "node2", "node3"];

  nodeIds.forEach((node) => {
    buckets[node] = new GridFSBucket(db, {
      bucketName: node,
    });

    console.log(`✅ Connected to ${node}`);
  });
}

// 🔥 Get bucket for a node
function getBucket(nodeId) {
  return buckets[nodeId];
}

// 🔥 Get all node IDs
function getAllNodeIds() {
  return nodeIds;
}

module.exports = {
  initBuckets,
  getBucket,
  getAllNodeIds,
};