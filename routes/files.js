const express = require("express");
const FileManifest = require("../models/FileManifest");

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

module.exports = router;