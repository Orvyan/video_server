const express = require('express');
const session = require('express-session');
const path = require('path');

const { PORT, MEDIA_ROOT } = require('./config');
const { getLocalIPv4s, pickPrimaryIP } = require('./services/ip');

const authRouter = require('./routes/auth');
const mediaRouter = require('./routes/media');

const app = express();
app.disable('x-powered-by');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'YOUR_SUPER_SECRET',   
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, sameSite: 'lax', httpOnly: true }
}));

app.use('/arcturus', express.static(path.join(__dirname, '../public/arcturus')));

app.use(authRouter);
app.use(mediaRouter);

app.get('/health', (_req, res) => res.json({ ok: true, mediaRoot: MEDIA_ROOT }));

app.listen(PORT, '0.0.0.0', () => {
  const ips = getLocalIPv4s();
  const primary = pickPrimaryIP(ips);

  console.log('✅ Server runing:');
  if (ips.length === 0) {
    console.log(`  → http://localhost:${PORT}/arcturus/`);
  } else {
    for (const ip of ips) console.log(`  → http://${ip.address}:${PORT}/arcturus/ (${ip.name})`);
    console.log(`\n⭐ Primary: http://${primary.address}:${PORT}/arcturus/`);
  }
});
