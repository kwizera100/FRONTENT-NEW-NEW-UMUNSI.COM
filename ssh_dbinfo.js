const { Client } = require('ssh2');
const conn = new Client();

const commands = [
  // Count articles (posts + news)
  'cd /home/umunsi/backend-api && npx prisma db execute --stdin <<EOF\nSELECT COUNT(*) as total_posts FROM posts;\nSELECT COUNT(*) as published_posts FROM posts WHERE status = \'PUBLISHED\';\nSELECT COUNT(*) as featured_posts FROM posts WHERE "isFeatured" = true;\nSELECT COUNT(*) as total_news FROM news;\nSELECT COUNT(*) as published_news FROM news WHERE status = \'PUBLISHED\';\nSELECT COUNT(*) as total_users FROM users;\nSELECT COUNT(*) as admin_users FROM users WHERE role = \'ADMIN\';\nSELECT COUNT(*) as premium_users FROM users WHERE "isPremium" = true;\nSELECT COUNT(*) as total_categories FROM categories;\nSELECT COUNT(*) as active_categories FROM categories WHERE "isActive" = true;\nSELECT COUNT(*) as total_media FROM media_files;\nSELECT name, slug FROM categories ORDER BY name;\nSELECT id, email, username, role, "isPremium" FROM users LIMIT 10;\nSELECT title, slug, status, "viewCount", "isFeatured" FROM posts ORDER BY "createdAt" DESC LIMIT 5;\nSELECT title, slug, status, "viewCount" FROM news ORDER BY "createdAt" DESC LIMIT 5;\nEOF',
];

conn.on('ready', () => {
  console.log('CONNECTED_OK');
  let idx = 0;
  
  function runNext() {
    if (idx >= commands.length) {
      conn.end();
      console.log('\n=== DONE ===');
      return;
    }
    const cmd = commands[idx++];
    console.log(`\n=== QUERYING DATABASE ===`);
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
