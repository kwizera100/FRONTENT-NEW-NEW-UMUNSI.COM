const { Client } = require('ssh2');
const fs = require('fs');
const path = require('path');

const localFile = process.argv[2];
const remoteFile = process.argv[3];

if (!localFile || !remoteFile) {
  console.error('Usage: node upload_backend.js <localFile> <remoteFile>');
  process.exit(1);
}

const conn = new Client();
conn.on('ready', () => {
  conn.sftp((err, sftp) => {
    if (err) { console.error('SFTP error:', err.message); conn.end(); return; }
    sftp.fastPut(localFile, remoteFile, (err2) => {
      if (err2) console.error('Upload error:', err2.message);
      else console.log('Uploaded', localFile, '->', remoteFile);
      conn.end();
    });
  });
});
conn.on('error', (err) => console.error('SSH error:', err.message));
conn.connect({ host: '93.127.186.217', port: 22, username: 'root', password: 'MISSMICHOU783450859@kwizera', readyTimeout: 15000 });
