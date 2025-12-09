// backend/services/indexer.js
const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');
const chokidar = require('chokidar');

const { MEDIA_ROOT, ALLOWED_EXTENSIONS } = require('../config');

let cachedIndex = null;
let stamp = 0;

function isAllowed(file) {
  return ALLOWED_EXTENSIONS.includes(path.extname(file).toLowerCase());
}


async function buildIndexArray(dir, root) {
  const entries = await fsp.readdir(dir, { withFileTypes: true });
  const out = [];

  for (const e of entries) {
    if (e.name.startsWith('.')) continue;
    const full = path.join(dir, e.name);
    const rel = path.relative(root, full).replace(/\\/g, '/');

    if (e.isDirectory()) {
      out.push({
        type: 'folder',
        name: e.name,
        path: rel,
        children: await buildIndexArray(full, root)
      });
    } else if (e.isFile()) {
      if (isAllowed(full)) {
        out.push({
          type: 'file',
          name: e.name,
          path: rel
        });
      }
    }
  }
  return out;
}

async function buildIndex() {
  
  return buildIndexArray(MEDIA_ROOT, MEDIA_ROOT);
}

async function getIndex() {
  if (!cachedIndex || Date.now() - stamp > 3000) {
    cachedIndex = await buildIndex();
    stamp = Date.now();
  }
  return cachedIndex;
}


const watcher = chokidar.watch(MEDIA_ROOT, { ignoreInitial: true, ignored: /(^|[\/\\])\../ });
watcher.on('all', () => { cachedIndex = null; });

module.exports = { getIndex };
