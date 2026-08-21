const express = require('express');
const { getBucket } = require('../config/nodes');
const { mergeChunks } = require('../services/chunkService');
const FileManifest = require('../models/FileManifest');

const router = express.Router();

router.get('/download/:fileId', async (req, res) => {
  try {
    const file = await FileManifest.findById(req.params.fileId);

    const chunkBuffers = [];

    for (let chunk of file.chunks.sort((a,b)=>a.order-b.order)) {
      let buffer = null;

      for (let node of chunk.nodes) {
        try {
          const bucket = getBucket(node);
          const stream = bucket.openDownloadStreamByName(chunk.chunkId);

          buffer = await new Promise((resolve, reject) => {
            const data = [];
            stream.on('data', d => data.push(d));
            stream.on('end', () => resolve(Buffer.concat(data)));
            stream.on('error', reject);
          });

          break;
        } catch {}
      }

      chunkBuffers.push(buffer);
    }

    const fileData = mergeChunks(chunkBuffers);

    res.set({
      'Content-Disposition': `attachment; filename=${file.filename}`
    });

    res.send(fileData);

  } catch (err) {
    console.error(err);
    res.status(500).send("Download failed");
  }
});

module.exports = router;