const express = require('express');
const FileManifest = require('../models/FileManifest');

const router = express.Router();

router.get('/files', async (req, res) => {
  const files = await FileManifest.find();
  res.json(files);
});

router.delete('/delete/:id', async (req, res) => {
  await FileManifest.findByIdAndDelete(req.params.id);
  res.send("Deleted");
});

module.exports = router;