const express = require("express");
const FileManifest = require("../models/FileManifest");
const { getBucket } = require("../config/nodes");
const { protect } = require("../middleware/authMiddleware");
const { validateObjectId } = require("../middleware/validationMiddleware");

const router = express.Router();

// ✅ GET files (Supports ?scope=my [default] or ?scope=all)
router.get("/files", protect, async (req, res) => {
  try {
    const scope = req.query.scope || "my";
    let query = {};

    if (scope === "my") {
      // Return files owned by current logged in user
      query = { owner: req.user._id };
    }
    // If scope === "all", query stays {} to fetch all files in system

    const files = await FileManifest.find(query)
      .populate("owner", "name email")
      .sort({ createdAt: -1 });

    res.json(files);
  } catch (err) {
    console.error("FILES FETCH ERROR:", err);
    res.status(500).json({ message: "Error fetching files" });
  }
});

// ✅ DELETE file (Enforces User-specific ownership authorization)
router.delete("/delete/:id", protect, validateObjectId("id"), async (req, res) => {
  try {
    const file = await FileManifest.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    // 🔒 STRICT AUTHORIZATION CHECK
    // If file does not have an owner or owner doesn't match logged-in user ID, block deletion!
    if (!file.owner || !file.owner.equals(req.user._id)) {
      return res.status(403).json({
        message: "Unauthorized: You can only delete files that you own!",
      });
    }

    // 🔥 Delete file chunks from GridFS buckets
    for (let chunk of file.chunks) {
      for (let node of chunk.nodes) {
        try {
          const bucket = getBucket(node);
          if (!bucket) continue;

          const gridFiles = await bucket.find({ filename: chunk.chunkId }).toArray();

          for (let gFile of gridFiles) {
            await bucket.delete(gFile._id);
          }
        } catch (bucketErr) {
          console.warn(`Warning deleting chunk ${chunk.chunkId} from ${node}:`, bucketErr.message);
        }
      }
    }

    // 🔥 Delete metadata from MongoDB
    await FileManifest.findByIdAndDelete(req.params.id);

    res.json({ message: "File deleted successfully", deletedId: req.params.id });

  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ message: "Delete failed: " + err.message });
  }
});

module.exports = router;