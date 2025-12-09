const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');
const bcrypt = require('bcryptjs');

const usersFile = path.join(__dirname, 'users.json');
const ROUNDS = 12;

async function readUsers() {
  try {
    const txt = await fsp.readFile(usersFile, 'utf8');
    const data = JSON.parse(txt || '{}');
    return data && typeof data === 'object' ? data : {};
  } catch { return {}; }
}
async function writeUsers(obj) {
  await fsp.writeFile(usersFile, JSON.stringify(obj, null, 2), 'utf8');
  try { await fsp.chmod(usersFile, 0o600); } catch {}
}

function isHashed(rec) {
  return rec && typeof rec.passwordHash === 'string';
}

async function createUser(username, password) {
  const users = await readUsers();
  if (users[username]) return false;
  users[username] = { passwordHash: await bcrypt.hash(password, ROUNDS), createdAt: new Date().toISOString() };
  await writeUsers(users);
  return true;
}

async function verifyUser(username, password) {
  const users = await readUsers();
  const u = users[username];
  if (!u || !isHashed(u)) return false;
  return bcrypt.compare(password, u.passwordHash);
}


async function migratePlaintextIfNeeded(username, plain) {
  const users = await readUsers();
  const u = users[username];
  if (!u || isHashed(u)) return false;
  if (typeof u.password === 'string' && u.password === plain) {
    users[username] = {
      passwordHash: await bcrypt.hash(plain, ROUNDS),
      createdAt: u.createdAt || new Date().toISOString(),
      migratedFromPlaintext: true
    };
    await writeUsers(users);
    return true;
  }
  return false;
}

module.exports = { createUser, verifyUser, migratePlaintextIfNeeded };
