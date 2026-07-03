const { Client } = require('ssh2');
const fs = require('fs');
const conn = new Client();

conn.on('ready', () => {
  console.log('Connected, downloading files...');
  
  const filesToDownload = [
    { remote: '/home/umunsi/frontend-app/public/images/logo.png', local: 'd:/NEW ONE UMUNSI.COM SITE/public/images/logo.png' },
    { remote: '/home/umunsi/frontend-app/public/images/umunsi-logo.jpg', local: 'd:/NEW ONE UMUNSI.COM SITE/public/images/umunsi-logo.jpg' },
    { remote: '/home/umunsi/frontend-app/public/images/umunsimedia-logo.jpg', local: 'd:/NEW ONE UMUNSI.COM SITE/public/images/umunsimedia-logo.jpg' },
    { remote: '/home/umunsi/frontend-app/public/favicon.svg', local: 'd:/NEW ONE UMUNSI.COM SITE/public/favicon.svg' },
  ];
  
  let idx = 0;
  function downloadNext() {
    if (idx >= filesToDownload.length) {
      conn.end();
      console.log('All files downloaded!');
      return;
    }
    const { remote, local } = filesToDownload[idx++];
    const localDir = local.substring(0, local.lastIndexOf('/'));
    fs.mkdirSync(localDir, { recursive: true });
    
    conn.sftp((err, sftp) => {
      if (err) {
        console.log(`SFTP error: ${err.message}`);
        downloadNext();
        return;
      }
      const stream = sftp.createReadStream(remote);
      const writeStream = fs.createWriteStream(local);
      stream.pipe(writeStream);
      writeStream.on('close', () => {
        console.log(`Downloaded: ${remote} -> ${local}`);
        if (idx === filesToDownload.length) {
          conn.end();
          console.log('All files downloaded!');
        } else {
          downloadNext();
        }
      });
      writeStream.on('error', (e) => {
        console.log(`Write error for ${local}: ${e.message}`);
        downloadNext();
      });
      stream.on('error', (e) => {
        console.log(`Read error for ${remote}: ${e.message}`);
        downloadNext();
      });
    });
  }
  downloadNext();
});

conn.on('error', (err) => {
  console.log(`CONNECTION_ERROR: ${err.message}`);
  process.exit(1);
});

conn.connect({
  host: '93.127.186.217',
  port: 22,
  username: 'root',
  password: 'MISSMICHOU783450859@kwizera',
  readyTimeout: 15000
});
