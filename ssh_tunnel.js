const { Client } = require('ssh2');
const net = require('net');
const fs = require('fs');

const SSH_HOST = '93.127.186.217';
const SSH_USER = 'root';
const SSH_PASS = 'MISSMICHOU783450859@kwizera';
const DB_HOST = '127.0.0.1';
const DB_PORT = 5432;
const LOCAL_PORT = 5433;

const conn = new Client();

conn.on('ready', () => {
  console.log(`SSH connected, forwarding localhost:${LOCAL_PORT} -> ${DB_HOST}:${DB_PORT}`);
  
  const server = net.createServer((socket) => {
    conn.forwardOut(socket.remoteAddress, socket.remotePort, DB_HOST, DB_PORT, (err, stream) => {
      if (err) {
        console.error('Forward error:', err.message);
        socket.destroy();
        return;
      }
      socket.pipe(stream);
      stream.pipe(socket);
      socket.on('error', () => stream.end());
      stream.on('error', () => socket.destroy());
      socket.on('close', () => stream.end());
      stream.on('close', () => socket.destroy());
    });
  });
  
  server.listen(LOCAL_PORT, '127.0.0.1', () => {
    console.log(`Tunnel listening on 127.0.0.1:${LOCAL_PORT}`);
  });
  
  server.on('error', (err) => {
    console.error('Server error:', err.message);
  });
});

conn.on('error', (err) => {
  console.error('SSH connection error:', err.message);
  process.exit(1);
});

conn.on('close', () => {
  console.log('SSH connection closed');
  process.exit(0);
});

console.log('Connecting to SSH...');
conn.connect({
  host: SSH_HOST,
  port: 22,
  username: SSH_USER,
  password: SSH_PASS,
  readyTimeout: 15000,
  keepaliveInterval: 30000,
});
