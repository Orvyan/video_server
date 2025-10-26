const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

const { requireLogin } = require('../middleware/auth');
const { MEDIA_ROOT, ALLOWED_EXTENSIONS } = require('../config');
const { getIndex } = require('../services/indexer');
const { safeResolve } = require('../utils/path');
const { contentTypeFor } = require('../utils/mime');

router.get('/api/index', requireLogin, async (_req, res) => {
  try {
    const index = await getIndex();
    res.json(index);
  } catch {
    res.status(500).json({ error: 'index_error' });
  }
});

router.get('/video', requireLogin, (req, res) => {
  const rel = req.query.path;
  if (!rel) return res.status(400).send('No path');

  const abs = safeResolve(MEDIA_ROOT, rel);
  if (!abs) return res.status(403).send('Forbidden');

  let stat;
  try { stat = fs.statSync(abs); } catch { return res.status(404).send('Not found'); }
  if (!stat.isFile()) return res.status(404).send('Not a file');

  const ext = path.extname(abs).toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext)) return res.status(415).send('Unsupported media type');

  const fileSize = stat.size;
  const range = req.headers.range;
  const ct = contentTypeFor(ext);

  if (range) {
    const [s, e] = range.replace(/bytes=/, '').split('-');
    const start = parseInt(s, 10);
    const end = e ? parseInt(e, 10) : fileSize - 1;
    const chunk = end - start + 1;
    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunk,
      'Content-Type': ct
    });
    fs.createReadStream(abs, { start, end }).pipe(res);
  } else {
    res.writeHead(200, { 'Content-Length': fileSize, 'Content-Type': ct, 'Accept-Ranges': 'bytes' });
    fs.createReadStream(abs).pipe(res);
  }
});

module.exports = router;
