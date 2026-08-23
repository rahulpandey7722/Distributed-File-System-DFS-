const express = require("express");
const multer = require("multer");

const {
  getBucket,
  getAllNodeIds,
} = require("../config/nodes");

const ConsistentHashRing = require("../services/hashRing");
const { splitFile } = require("../services/chunkService");
const FileManifest = require("../models/FileManifest");

const router = express.Router();

// ✅ Multer setup (memory + file size limit)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// 🚀 Upload route
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    console.log("📥 Upload request received");

    // ✅ Check file exists
    if (!req.file) {
      console.log("❌ No file received");
      return res.status(400).send("No file uploaded");
    }

    // ✅ OPTIONAL: File type validation (REMOVE if you want all file types)
    /*
    const allowedTypes = ["image/", "application/pdf"];
    if (!allowedTypes.some(type => req.file.mimetype.startsWith(type))) {
      return res.status(400).send("Only images or PDFs allowed");
    }
    */

    console.log("File:", req.file.originalname);

    const nodes = getAllNodeIds();

    // ✅ Check nodes available
    if (!nodes || nodes.length === 0) {
      console.log("❌ No nodes available");
      return res.status(500).send("No storage nodes available");
    }

    const ring = new ConsistentHashRing(nodes);

    // ✅ Split file into chunks
    const chunks = splitFile(req.file.buffer);
    const chunkMeta = [];

    let index = 0;

    for (let chunk of chunks) {
      const key = req.file.originalname + index;

      const primary = ring.getNode(key);
      const replica = nodes[(nodes.indexOf(primary) + 1) % nodes.length];

      const targets = [primary, replica];

      // ✅ Store in primary + replica
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

    // ✅ Save file metadata in MongoDB
    const file = await FileManifest.create({
      filename: req.file.originalname,
      chunks: chunkMeta,
    });

    console.log("✅ Upload success:", file._id);

    res.json({ fileId: file._id });

  } catch (err) {
    console.error("❌ UPLOAD ERROR:", err);
    res.status(500).send("Upload failed");
  }
});

module.exports = router;