const mongoose = require('mongoose');

const chunkSchema = new mongoose.Schema({
  chunkId: String,
  nodes: [String],
  order: Number
}, { _id: false });

const fileManifestSchema = new mongoose.Schema({
  filename: String,
  chunks: [chunkSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FileManifest', fileManifestSchema);