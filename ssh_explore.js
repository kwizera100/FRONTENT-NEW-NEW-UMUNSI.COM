const { Client } = require('ssh2');

const conn = new Client();

const commands = [
  'uname -a',
  'ls /var/www/ 2>/dev/null',
  'ls /home/ 2>/dev/null',
  'find /var/www -maxdepth 3 -type d 2>/dev/null | head -30',
  'find /var/www -name ".env" 2>/dev/null | head -10',
  'find /var/www -name "wp-config.php" 2>/dev/null | head -5',
  'find /var/www -name "docker-compose.yml" 2>/dev/null | head -5',
  'find / -maxdepth 4 -name ".env" 2>/dev/null | head -10',
  'find / -maxdepth 4 -name "docker-compose.yml" 2>/dev/null | head -5',
  'docker ps --format "{{.Names}} {{.Image}}" 2>/dev/null',
  'ls -la /var/www/html/ 2>/dev/null | head -20',
  'cat /var/www/html/.env 2>/dev/null',
  'cat /var/www/umunsi/.env 2>/dev/null',
  'ls -la /var/www/umunsi/ 2>/dev/null | head -20',
  'ls -la /etc/nginx/sites-enabled/ 2>/dev/null',
  'cat /etc/nginx/sites-enabled/* 2>/dev/null | head -80',
  'psql -l 2>/dev/null',
  'mysql -e "SHOW DATABASES;" 2>/dev/null',
  'docker exec $(docker ps -q --filter ancestor=postgres 2>/dev/null | head -1) psql -U postgres -l 2>/dev/null',
  'docker exec $(docker ps -q --filter ancestor=mysql 2>/dev/null | head -1) mysql -e "SHOW DATABASES;" 2>/dev/null',
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
