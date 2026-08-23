const mongoose = require("mongoose");
const { GridFSBucket } = require("mongodb");

let buckets = {};

// Initialize buckets after DB connects
const initBuckets = () => {
  const db = mongoose.connection.db;

  buckets["node1"] = new GridFSBucket(db, { bucketName: "node1" });
  buckets["node2"] = new GridFSBucket(db, { bucketName: "node2" });
  buckets["node3"] = new GridFSBucket(db, { bucketName: "node3" });

  console.log("✅ Connected to node1");
  console.log("✅ Connected to node2");
  console.log("✅ Connected to node3");
};

const getBucket = (nodeId) => buckets[nodeId];

const getAllNodeIds = () => Object.keys(buckets);

module.exports = { initBuckets, getBucket, getAllNodeIds };