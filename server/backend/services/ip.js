const os = require('os');

function getLocalIPv4s() {
  const nets = os.networkInterfaces();
  const out = [];
  for (const name of Object.keys(nets)) {
    for (const net of nets[name] || []) {
      const fam = net.family || net.addressFamily || '';
      if ((fam === 'IPv4' || fam === 4) && !net.internal) out.push({ name, address: net.address });
    }
  }
  return out;
}

function pickPrimaryIP(list) {
  const prefer =
    list.find(i => i.address.startsWith('192.168.')) ||
    list.find(i => i.address.startsWith('10.')) ||
    list.find(i => {
      const a = i.address.split('.');
      const n = Number(a[1]);
      return a[0] === '172' && n >= 16 && n <= 31;
    });
  return prefer || list[0] || { name: 'localhost', address: 'localhost' };
}

module.exports = { getLocalIPv4s, pickPrimaryIP };
