const CHUNK_SIZE = 1024 * 1024;

function splitFile(buffer) {
  const chunks = [];
  let start = 0;

  while (start < buffer.length) {
    chunks.push(buffer.slice(start, start + CHUNK_SIZE));
    start += CHUNK_SIZE;
  }

  return chunks;
}

function mergeChunks(chunks) {
  return Buffer.concat(chunks);
}

module.exports = { splitFile, mergeChunks };