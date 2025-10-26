const fails = new Map(); // ip -> { count, until }

function isBlocked(ip) {
  const now = Date.now();
  const rec = fails.get(ip);
  return !!(rec && rec.until && rec.until > now);
}

function markFail(ip) {
  const now = Date.now();
  const rec = fails.get(ip) || { count: 0, until: 0 };
  rec.count += 1;
  if (rec.count >= 5) { rec.until = now + 2 * 60 * 1000; rec.count = 0; }
  fails.set(ip, rec);
}

function clearFail(ip) {
  fails.delete(ip);
}

module.exports = { isBlocked, markFail, clearFail };
