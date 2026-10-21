const { Client } = require('ssh2');
const fs = require('fs');
const path = require('path');

const remoteFile = process.argv[2];
const localFile = process.argv[3];

if (!remoteFile || !localFile) {
  console.error('Usage: node download_backend.js <remoteFile> <localFile>');
  process.exit(1);
}

const conn = new Client();
conn.on('ready', () => {
  conn.sftp((err, sftp) => {
    if (err) { console.error('SFTP error:', err.message); conn.end(); return; }
    sftp.fastGet(remoteFile, localFile, (err2) => {
      if (err2) console.error('Download error:', err2.message);
      else console.log('Downloaded', remoteFile, '->', localFile);
      conn.end();
    });
  });
});
conn.on('error', (err) => console.error('SSH error:', err.message));
conn.connect({ host: '93.127.186.217', port: 22, username: 'root', password: 'MISSMICHOU783450859@kwizera', readyTimeout: 15000 });
