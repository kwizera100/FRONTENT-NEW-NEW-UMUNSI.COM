const { Client } = require('ssh2');
const conn = new Client();
const cmd = process.argv[2] || 'uname -a';
conn.on('ready', () => {
  conn.exec(cmd, (err, stream) => {
    if (err) { console.error(err.message); conn.end(); return; }
    let out = '';
    stream.on('data', d => out += d);
    stream.stderr.on('data', d => out += d);
    stream.on('close', () => { console.log(out); conn.end(); });
  });
});
conn.on('error', (err) => console.error('SSH error:', err.message));
conn.connect({ host: '93.127.186.217', port: 22, username: 'root', password: 'MISSMICHOU783450859@kwizera', readyTimeout: 15000 });
