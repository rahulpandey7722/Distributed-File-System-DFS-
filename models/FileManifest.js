const mongoose = require('mongoose');

const chunkSchema = new mongoose.Schema({
  chunkId: String,
  nodes: [String],
  order: Number
}, { _id: false });

const fileManifestSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  size: { type: Number, default: 0 },
  mimeType: { type: String, default: 'application/octet-stream' },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  chunks: [chunkSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FileManifest', fileManifestSchema);