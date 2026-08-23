const mongoose = require("mongoose");
const { GridFSBucket } = require("mongodb");

let bucket;

// Initialize bucket after DB connection
const initBucket = () => {
  const db = mongoose.connection.db;
  bucket = new GridFSBucket(db, {
    bucketName: "uploads",
  });
};

// Return same bucket (no multi-node for now)
const getBucket = () => bucket;

// Dummy nodes (for your DFS logic)
const getAllNodeIds = () => ["node1"];

module.exports = {
  initBucket,
  getBucket,
  getAllNodeIds,
};