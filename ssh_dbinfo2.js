const { Client } = require('ssh2');
const conn = new Client();

const sql = `PGPASSWORD='KWIZERA783450859@k' psql -h 127.0.0.1 -U umunsi_app -d umunsi_db -t -c "
SELECT 'TOTAL_POSTS: ' || COUNT(*) FROM posts;
SELECT 'PUBLISHED_POSTS: ' || COUNT(*) FROM posts WHERE status = 'PUBLISHED';
SELECT 'FEATURED_POSTS: ' || COUNT(*) FROM posts WHERE \\"isFeatured\\" = true;
SELECT 'TOTAL_NEWS: ' || COUNT(*) FROM news;
SELECT 'PUBLISHED_NEWS: ' || COUNT(*) FROM news WHERE status = 'PUBLISHED';
SELECT 'TOTAL_USERS: ' || COUNT(*) FROM users;
SELECT 'ADMIN_USERS: ' || COUNT(*) FROM users WHERE role = 'ADMIN';
SELECT 'PREMIUM_USERS: ' || COUNT(*) FROM users WHERE \\"isPremium\\" = true;
SELECT 'TOTAL_CATEGORIES: ' || COUNT(*) FROM categories;
SELECT 'ACTIVE_CATEGORIES: ' || COUNT(*) FROM categories WHERE \\"isActive\\" = true;
SELECT 'TOTAL_MEDIA: ' || COUNT(*) FROM media_files;
SELECT '---CATEGORIES---';
SELECT name || ' | ' || slug FROM categories ORDER BY name;
SELECT '---USERS_SAMPLE---';
SELECT email || ' | ' || username || ' | ' || role FROM users LIMIT 10;
SELECT '---RECENT_POSTS---';
SELECT title || ' | ' || status || ' | views:' || \\"viewCount\\" FROM posts ORDER BY \\"createdAt\\" DESC LIMIT 5;
SELECT '---RECENT_NEWS---';
SELECT title || ' | ' || status || ' | views:' || \\"viewCount\\" FROM news ORDER BY \\"createdAt\\" DESC LIMIT 5;
"`;

conn.on('ready', () => {
  conn.exec(sql, (err, stream) => {
    if (err) { console.log(`ERROR: ${err.message}`); conn.end(); return; }
    let output = '';
    stream.on('data', (data) => { output += data.toString(); });
    stream.stderr.on('data', (data) => { output += data.toString(); });
    stream.on('close', () => {
      console.log(output);
      conn.end();
    });
  });
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
