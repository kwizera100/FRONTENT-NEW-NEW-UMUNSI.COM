const { Client } = require('ssh2');
const fs = require('fs');
const conn = new Client();

const commands = [
  'cat /home/umunsi/backend-api/.env',
  'cat /home/umunsi/backend-api/prisma/schema.prisma',
  'cat /home/umunsi/frontend-app/src/index.css 2>/dev/null | head -60',
  'cat /home/umunsi/frontend-app/src/App.tsx 2>/dev/null | head -40',
  'ls /home/umunsi/backend-api/uploads/ 2>/dev/null | head -20',
  'find /home/umunsi/backend-api/uploads -type d 2>/dev/null | head -10',
  'cat /home/umunsi/frontend-app/package.json 2>/dev/null',
  'cat /home/umunsi/backend-api/package.json 2>/dev/null | head -40',
  'cat /home/umunsi/frontend-app/.env.production 2>/dev/null',
  'cat /home/umunsi/backend-api/.env.production 2>/dev/null',
  'ls /home/umunsi/backups/ 2>/dev/null',
];

conn.on('ready', () => {
  console.log('CONNECTED_OK');
  let idx = 0;
  let allOutput = '';
  
  function runNext() {
    if (idx >= commands.length) {
      conn.end();
      // Write full output to file
      fs.writeFileSync('d:/NEW ONE UMUNSI.COM SITE/server_info.txt', allOutput);
      console.log(allOutput);
      console.log('\n=== DONE - Saved to server_info.txt ===');
      return;
    }
    const cmd = commands[idx++];
    allOutput += `\n=== CMD: ${cmd} ===\n`;
    conn.exec(cmd, (err, stream) => {
      if (err) {
        allOutput += `ERROR: ${err.message}\n`;
        runNext();
        return;
      }
      let output = '';
      stream.on('data', (data) => { output += data.toString(); });
      stream.stderr.on('data', (data) => { output += data.toString(); });
      stream.on('close', () => {
        allOutput += output;
        runNext();
      });
    });
  }
  runNext();
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
