const path = require('path');

function safeResolve(root, rel) {
  const abs = path.resolve(root, rel || '');
  const back = path.relative(root, abs);
  if (back.startsWith('..') || path.isAbsolute(back)) return null;
  return abs;
}

module.exports = { safeResolve };
