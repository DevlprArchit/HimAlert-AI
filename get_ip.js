const os = require('os');
const fs = require('fs');
const nets = os.networkInterfaces();
const results = [];
for (const name of Object.keys(nets)) {
  for (const net of nets[name]) {
    if (net.family === 'IPv4' && !net.internal) {
      results.push({ name, ip: net.address });
    }
  }
}
fs.writeFileSync('C:\\Users\\archi\\ip_info.json', JSON.stringify(results, null, 2));
console.log('IP written to C:\\Users\\archi\\ip_info.json');
