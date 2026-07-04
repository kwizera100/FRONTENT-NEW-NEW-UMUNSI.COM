const { Client } = require('ssh2');
const conn = new Client();

conn.on('ready', () => {
  conn.exec(`PGPASSWORD='KWIZERA783450859@k' psql -U umunsi_app -h 127.0.0.1 -d umunsi_db -c "SELECT email, username, role FROM users WHERE role IN ('ADMIN','EDITOR') ORDER BY role, \\"createdAt\\";"`, (err, stream) => {
    if (err) { console.error(err.message); conn.end(); return; }
    let out = '';
    stream.on('data', d => out += d);
    stream.stderr.on('data', d => out += d);
    stream.on('close', () => {
      console.log(out);
      conn.end();
    });
  });
});

conn.connect({
  host: '93.127.186.217', port: 22, username: 'root',
  password: 'MISSMICHOU783450859@kwizera', readyTimeout: 15000,
});
