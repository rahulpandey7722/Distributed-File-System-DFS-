const express = require("express");
const multer = require("multer");

const { splitFile } = require("../services/chunkService");
const FileManifest = require("../models/FileManifest");
const { getBucket, getAllNodeIds } = require("../config/nodes");
const ConsistentHashRing = require("../services/hashRing");

const router = express.Router(); // ✅ THIS WAS MISSING
const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    console.log("FILE RECEIVED:", req.file);

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const nodes = getAllNodeIds();
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

        // 🚨 SAFETY CHECK (prevents your earlier crash)
        if (!bucket) {
          throw new Error(`Bucket not found for node: ${node}`);
        }

        const stream = bucket.openUploadStream(key);

        stream.end(chunk);
        await new Promise((res) => stream.on("finish", res));
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

    res.json({ fileId: file._id });

  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; // ✅ THIS WAS ALSO REQUIRED