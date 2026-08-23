const express = require("express");
const FileManifest = require("../models/FileManifest");
const { getBucket } = require("../config/nodes");

const router = express.Router();

// ✅ GET all files
router.get("/files", async (req, res) => {
  try {
    const files = await FileManifest.find().sort({ createdAt: -1 });
    res.json(files);
  } catch (err) {
    console.error("FILES ERROR:", err);
    res.status(500).send("Error fetching files");
  }
});

// ✅ DELETE file
router.delete("/delete/:id", async (req, res) => {
  try {
    const file = await FileManifest.findById(req.params.id);

    if (!file) {
      return res.status(404).send("File not found");
    }

    // 🔥 Delete chunks from GridFS
    for (let chunk of file.chunks) {
      for (let node of chunk.nodes) {
        const bucket = getBucket(node);

        const files = await bucket.find({ filename: chunk.chunkId }).toArray();

        if (files.length > 0) {
          await bucket.delete(files[0]._id);
        }
      }
    }

    // 🔥 Delete metadata
    await FileManifest.findByIdAndDelete(req.params.id);

    res.send("File deleted successfully");

  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).send("Delete failed");
  }
});

module.exports = router;