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

// ✅ IMPORTANT FIX
const upload = multer({
  storage: multer.memoryStorage(),
});

// 🚀 Upload route
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    console.log("📥 Upload request received");

    if (!req.file) {
      console.log("❌ No file received");
      return res.status(400).send("No file uploaded");
    }

    console.log("File:", req.file.originalname);

    const nodes = getAllNodeIds();

    if (!nodes || nodes.length === 0) {
      console.log("❌ No nodes available");
      return res.status(500).send("No storage nodes available");
    }

    const ring = new ConsistentHashRing(nodes);

    const chunks = splitFile(req.file.buffer);
    const chunkMeta = [];

    let index = 0;

    for (let chunk of chunks) {
      const key = req.file.originalname + index;

      const primary = ring.getNode(key);
      const replica = nodes[(nodes.indexOf(primary) + 1) % nodes.length];

      const targets = [primary, replica];

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

      chunkMeta.push({
        chunkId: key,
        nodes: targets,
        order: index++,
      });
    }

    const file = await FileManifest.create({
      filename: req.file.originalname,
      chunks: chunkMeta,
    });

    console.log("✅ Upload success");

    res.json({ fileId: file._id });

  } catch (err) {
    console.error("❌ UPLOAD ERROR:", err);
    res.status(500).send("Upload failed");
  }
});

module.exports = router;