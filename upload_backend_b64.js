const { Client } = require('ssh2');
const fs = require('fs');

const localFile = process.argv[2];
const remoteFile = process.argv[3];

if (!localFile || !remoteFile) {
  console.error('Usage: node upload_backend_b64.js <localFile> <remoteFile>');
  process.exit(1);
}

const b64 = fs.readFileSync(localFile).toString('base64');
const conn = new Client();
conn.on('ready', () => {
  conn.exec(`base64 -d > ${remoteFile}`, (err, stream) => {
    if (err) { console.error('Exec error:', err.message); conn.end(); return; }
    let out = '';
    stream.on('data', d => out += d);
    stream.stderr.on('data', d => out += d);
    stream.on('close', (code) => {
      console.log(`exit=${code} ${out}`.trim() || `exit=${code}`);
      if (code === 0) console.log('Uploaded', localFile, '->', remoteFile, `(${b64.length} b64 chars)`);
      conn.end();
    });
    stream.stdin.write(b64);
    stream.stdin.end();
  });
});
conn.on('error', (err) => console.error('SSH error:', err.message));
conn.connect({ host: '93.127.186.217', port: 22, username: 'root', password: 'MISSMICHOU783450859@kwizera', readyTimeout: 15000 });
