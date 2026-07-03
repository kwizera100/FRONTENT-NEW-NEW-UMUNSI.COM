const { Client } = require('ssh2');
const conn = new Client();

const commands = [
  'cat /home/umunsi/backend-api/.env',
  'cat /home/umunsi/backend-api/prisma/schema.prisma',
  'find /home/umunsi/frontend-app/public -name "logo*" -o -name "*.svg" -o -name "*.ico" 2>/dev/null | head -20',
  'find /home/umunsi/frontend-app -maxdepth 3 -name "logo*" 2>/dev/null | head -10',
  'find /home/umunsi/frontend-app/public -type f 2>/dev/null | head -30',
  'ls -la /home/umunsi/frontend-app/public/ 2>/dev/null',
  'find /home/umunsi -name "*.env*" 2>/dev/null | head -10',
  'cat /home/umunsi/frontend-app/.env',
  'cat /home/umunsi/frontend-app/next.config.js 2>/dev/null | head -30',
  'cat /home/umunsi/frontend-app/next.config.mjs 2>/dev/null | head -30',
  'cat /home/umunsi/frontend-app/tailwind.config.js 2>/dev/null | head -40',
  'cat /home/umunsi/frontend-app/tailwind.config.ts 2>/dev/null | head -40',
];

conn.on('ready', () => {
  console.log('CONNECTED_OK');
  let idx = 0;
  let allOutput = '';
  
  function runNext() {
    if (idx >= commands.length) {
      conn.end();
      console.log(allOutput);
      console.log('\n=== DONE ===');
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
