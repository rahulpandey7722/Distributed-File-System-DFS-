const express = require("express");
const multer = require("multer");

const {
  getBucket,
  getAllNodeIds,
} = require("../config/nodes");

const ConsistentHashRing = require("../services/hashRing");
const { splitFile } = require("../services/chunkService");
const FileManifest = require("../models/FileManifest");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Multer setup (memory + file size limit: 10MB)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// 🚀 Upload route (Protected by JWT Auth)
router.post("/upload", protect, upload.single("file"), async (req, res) => {
  try {
    console.log("📥 Protected upload request received from user:", req.user.email);

    // ✅ Check file exists
    if (!req.file) {
      return res.status(400).json({ message: "No file provided for upload" });
    }

    const originalname = req.file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    const nodes = getAllNodeIds();

    // ✅ Check storage nodes available
    if (!nodes || nodes.length === 0) {
      console.log("❌ No nodes available");
      return res.status(500).json({ message: "No storage nodes available" });
    }

    const ring = new ConsistentHashRing(nodes);

    // ✅ Split file into chunks
    const chunks = splitFile(req.file.buffer);
    const chunkMeta = [];

    let index = 0;

    for (let chunk of chunks) {
      const key = `${Date.now()}_${originalname}_chunk_${index}`;

      const primary = ring.getNode(key);
      const replica = nodes[(nodes.indexOf(primary) + 1) % nodes.length];

      const targets = [primary, replica];

      // ✅ Store in primary + replica GridFS buckets
      for (let node of targets) {
        const bucket = getBucket(node);

        if (!bucket) {
          console.log("❌ Bucket missing for:", node);
          throw new Error("Bucket not initialized");
        }

        const stream = bucket.openUploadStream(key);
        stream.end(chunk);

        await new Promise((resolve, reject) => {
          stream.on("finish", resolve);
          stream.on("error", reject);
        });
      }

      // ✅ Save chunk metadata
      chunkMeta.push({
        chunkId: key,
        nodes: targets,
        order: index++,
      });
    }

    // ✅ Save file metadata in MongoDB attached to req.user._id
    const file = await FileManifest.create({
      filename: req.file.originalname,
      size: req.file.size,
      mimeType: req.file.mimetype || "application/octet-stream",
      owner: req.user._id,
      chunks: chunkMeta,
    });

    console.log("✅ Upload success for user:", req.user.email, "File ID:", file._id);

    res.json({
      message: "File uploaded successfully",
      fileId: file._id,
      file,
    });

  } catch (err) {
    console.error("❌ UPLOAD ERROR:", err);
    res.status(500).json({ message: "Upload failed: " + err.message });
  }
});

module.exports = router;