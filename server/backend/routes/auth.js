const express = require('express');
const router = express.Router();

const { createUser, verifyUser, migratePlaintextIfNeeded } = require('../users/store');
const { isBlocked, markFail, clearFail } = require('../users/rateLimiter');

router.post('/register', async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).send('Missing credentials');

  const ok = await createUser(username, password);
  if (!ok) return res.status(409).send('User exists');

  req.session.user = username;
  res.redirect('/arcturus/');
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body || {};
  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket.remoteAddress || 'unknown';

  if (isBlocked(ip)) return res.status(429).send('Too many attempts, try later');

  const ok = await verifyUser(username, password);
  if (ok) { clearFail(ip); req.session.user = username; return res.redirect('/arcturus/'); }

  const migrated = await migratePlaintextIfNeeded(username, password);
  if (migrated) { clearFail(ip); req.session.user = username; return res.redirect('/arcturus/'); }

  markFail(ip);
  return res.status(401).send('Invalid credentials');
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/arcturus/auth.html'));
});

module.exports = router;
