const express = require('express');
const { getBucket } = require('../config/nodes');
const { mergeChunks } = require('../services/chunkService');
const FileManifest = require('../models/FileManifest');
const { validateObjectId } = require('../middleware/validationMiddleware');
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Helper middleware to handle auth via header OR query param ?token=
const authOrQueryToken = async (req, res, next) => {
  let token = req.query.token;

  if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (token) {
    try {
      const secret = process.env.JWT_SECRET || "dfs_super_secret_jwt_key_2026_secure";
      const decoded = jwt.verify(token, secret);
      req.user = await User.findById(decoded.id).select("-password");
    } catch (e) {
      // ignore expired/invalid token for download/viewing if public allowed
    }
  }

  next();
};

// Helper function to assemble chunks from GridFS buckets
const getFileDataFromChunks = async (file) => {
  const chunkBuffers = [];

  for (let chunk of file.chunks.sort((a, b) => a.order - b.order)) {
    let buffer = null;

    for (let node of chunk.nodes) {
      try {
        const bucket = getBucket(node);
        if (!bucket) continue;

        const stream = bucket.openDownloadStreamByName(chunk.chunkId);

        buffer = await new Promise((resolve, reject) => {
          const data = [];
          stream.on('data', d => data.push(d));
          stream.on('end', () => resolve(Buffer.concat(data)));
          stream.on('error', reject);
        });

        if (buffer) break;
      } catch (err) {
        // Try next node replica if primary fails
      }
    }

    if (buffer) {
      chunkBuffers.push(buffer);
    }
  }

  return mergeChunks(chunkBuffers);
};

// ⬇️ DOWNLOAD file (Attachment)
router.get('/download/:fileId', validateObjectId('fileId'), authOrQueryToken, async (req, res) => {
  try {
    const file = await FileManifest.findById(req.params.fileId);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    const fileData = await getFileDataFromChunks(file);

    res.set({
      'Content-Type': file.mimeType || 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${encodeURIComponent(file.filename)}"`
    });

    res.send(fileData);

  } catch (err) {
    console.error("Download error:", err);
    res.status(500).send("Download failed");
  }
});

// 👁️ VIEW file inline (In-Browser Preview Modal support)
router.get('/view/:fileId', validateObjectId('fileId'), authOrQueryToken, async (req, res) => {
  try {
    const file = await FileManifest.findById(req.params.fileId);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    const fileData = await getFileDataFromChunks(file);

    res.set({
      'Content-Type': file.mimeType || 'application/octet-stream',
      'Content-Disposition': `inline; filename="${encodeURIComponent(file.filename)}"`
    });

    res.send(fileData);

  } catch (err) {
    console.error("View file error:", err);
    res.status(500).send("Failed to load file preview");
  }
});

module.exports = router;