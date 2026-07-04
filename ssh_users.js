const { Client } = require('ssh2');
const conn = new Client();

conn.on('ready', () => {
  const cmd = `cd /home/umunsi/backend-api && source .env 2>/dev/null; PGPASSWORD='${process.env.DATABASE_URL ? "" : "KWIZERA783450859@k"}' psql -U umunsi_app -d umunsi_db -c "SELECT id, email, username, \"firstName\", \"lastName\", role, \"createdAt\" FROM users ORDER BY \"createdAt\";" 2>&1 || echo "---trying with env---" && cd /home/umunsi/backend-api && grep DATABASE_URL .env | head -1`;
  
  conn.exec(cmd, (err, stream) => {
    if (err) { console.error(err.message); conn.end(); return; }
    let out = '';
    stream.on('data', d => out += d);
    stream.stderr.on('data', d => out += d);
    stream.on('close', () => {
      console.log(out.substring(0, 8000));
      // Also get the DATABASE_URL to extract password
      conn.exec('grep DATABASE_URL /home/umunsi/backend-api/.env', (err2, stream2) => {
        if (err2) { conn.end(); return; }
        let out2 = '';
        stream2.on('data', d => out2 += d);
        stream2.stderr.on('data', d => out2 += d);
        stream2.on('close', () => {
          console.log('\n--- DB URL ---');
          console.log(out2);
          
          // Now query users with the correct password
          conn.exec(`PGPASSWORD='KWIZERA783450859@k' psql -U umunsi_app -h 127.0.0.1 -d umunsi_db -c "SELECT id, email, username, \\"firstName\\", \\"lastName\\", role FROM users ORDER BY \\"createdAt\\";"`, (err3, stream3) => {
            if (err3) { conn.end(); return; }
            let out3 = '';
            stream3.on('data', d => out3 += d);
            stream3.stderr.on('data', d => out3 += d);
            stream3.on('close', () => {
              console.log('\n--- USERS ---');
              console.log(out3);
              conn.end();
            });
          });
        });
      });
    });
  });
});

conn.connect({
  host: '93.127.186.217', port: 22, username: 'root',
  password: 'MISSMICHOU783450859@kwizera', readyTimeout: 15000,
});
