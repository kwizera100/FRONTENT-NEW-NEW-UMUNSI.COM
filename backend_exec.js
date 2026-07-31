const { Client } = require('ssh2');
const command = process.argv.slice(2).join(' ');
if (!command) {
  console.error('Usage: node backend_exec.js <command>');
  process.exit(1);
}

const conn = new Client();
conn.on('ready', () => {
  conn.exec(command, (err, stream) => {
    if (err) { console.error('Exec error:', err.message); conn.end(); return; }
    let stdout = '', stderr = '';
    stream.on('close', (code, signal) => {
      process.stdout.write(stdout);
      process.stderr.write(stderr);
      conn.end();
      process.exit(code === false ? 1 : code);
    }).on('data', (data) => { stdout += data; }).stderr.on('data', (data) => { stderr += data; });
  });
});
conn.on('error', (err) => { console.error('SSH error:', err.message); process.exit(1); });
conn.connect({ host: '93.127.186.217', port: 22, username: 'root', password: 'MISSMICHOU783450859@kwizera', readyTimeout: 15000 });
