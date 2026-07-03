const { Client } = require('ssh2');

const conn = new Client();

const commands = [
  'cat /home/umunsi/backend-api/.env',
  'cat /home/umunsi/frontend-app/.env',
  'ls -la /home/umunsi/',
  'ls -la /home/umunsi/backend-api/',
  'ls -la /home/umunsi/frontend-app/',
  'cat /home/umunsi/backend-api/prisma/schema.prisma 2>/dev/null',
  'cat /home/umunsi/backend-api/package.json 2>/dev/null | head -30',
  'cat /home/umunsi/frontend-app/package.json 2>/dev/null | head -30',
  'cat /etc/nginx/sites-enabled/umunsi.com.conf',
  'cat /etc/nginx/sites-enabled/api.umunsi.com.conf',
  'cat /etc/nginx/sites-enabled/eng.umunsi.com.conf',
  'ls /home/umunsi/backend-api/prisma/ 2>/dev/null',
  'ls /home/umunsi/backend-api/uploads/ 2>/dev/null | head -20',
  'ls /home/umunsi/frontend-app/public/ 2>/dev/null | head -20',
  'find /home/umunsi/frontend-app/public -name "*.png" -o -name "*.svg" -o -name "*.ico" -o -name "*.jpg" 2>/dev/null | head -20',
  'find /home/umunsi -name "logo*" 2>/dev/null | head -10',
  'mysql -u root -e "SHOW DATABASES;" 2>/dev/null',
  'cat /home/umunsi/backend-api/.env | grep DATABASE',
];

conn.on('ready', () => {
  console.log('CONNECTED_OK');
  let idx = 0;
  
  function runNext() {
    if (idx >= commands.length) {
      conn.end();
      console.log('\nDONE');
      return;
    }
    const cmd = commands[idx++];
    console.log(`\n=== CMD: ${cmd} ===`);
    conn.exec(cmd, (err, stream) => {
      if (err) {
        console.log(`ERROR: ${err.message}`);
        runNext();
        return;
      }
      let output = '';
      stream.on('data', (data) => { output += data.toString(); });
      stream.stderr.on('data', (data) => { output += data.toString(); });
      stream.on('close', () => {
        if (output.trim()) console.log(output.trim());
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
