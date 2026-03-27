const express = require('express');
const path = require('path');
const db = require('./database');
const crypto = require('crypto');

const app = express();
const PORT = 3000;
const SECRET_KEY = 'blog-secret-key-2024';

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function hashPassword(password) {
  return crypto.createHash('sha256').update(password + SECRET_KEY).digest('hex');
}

app.post('/api/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: '帳號和密碼必填' });
  }
  const hashedPassword = hashPassword(password);
  try {
    const result = db.prepare('INSERT INTO users (username, password, display_name) VALUES (?, ?, ?)').run(username, hashedPassword, username);
    res.json({ id: result.lastInsertRowid, username });
  } catch (err) {
    if (err.message.includes('UNIQUE')) {
      res.status(400).json({ error: '帳號已存在' });
    } else {
      res.status(500).json({ error: '註冊失敗' });
    }
  }
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: '帳號和密碼必填' });
  }
  const hashedPassword = hashPassword(password);
  const user = db.prepare('SELECT * FROM users WHERE username = ? AND password = ?').get(username, hashedPassword);
  if (user) {
    res.json({ id: user.id, username: user.username, display_name: user.display_name, bio: user.bio, avatar: user.avatar, background: user.background });
  } else {
    res.status(401).json({ error: '帳號或密碼錯誤' });
  }
});

app.get('/api/user', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const [username, password] = Buffer.from(authHeader, 'base64').toString().split(':');
    const hashedPassword = hashPassword(password);
    const user = db.prepare('SELECT id, username, display_name, bio, avatar, background FROM users WHERE username = ? AND password = ?').get(username, hashedPassword);
    if (user) {
      return res.json(user);
    }
  }
  res.status(401).json({ error: '未登入' });
});

app.get('/api/users/:id', (req, res) => {
  const user = db.prepare('SELECT id, username, display_name, bio, avatar, background, created_at FROM users WHERE id = ?').get(req.params.id);
  if (user) {
    return res.json(user);
  }
  res.status(404).json({ error: '用戶不存在' });
});

app.get('/api/users/:id/posts', (req, res) => {
  const posts = db.prepare(`
    SELECT 
      posts.*, 
      u1.username, u1.display_name, u1.avatar,
      u2.username as repost_username, u2.display_name as repost_display_name, u2.avatar as repost_avatar
    FROM posts 
    LEFT JOIN users u1 ON posts.user_id = u1.id
    LEFT JOIN posts original ON posts.repost_from_id = original.id
    LEFT JOIN users u2 ON original.user_id = u2.id
    WHERE posts.user_id = ?
    ORDER BY posts.created_at DESC
  `).all(req.params.id);
  res.json(posts);
});

app.put('/api/user', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: '請先登入' });
  }
  const [username, password] = Buffer.from(authHeader, 'base64').toString().split(':');
  const hashedPassword = hashPassword(password);
  const user = db.prepare('SELECT id FROM users WHERE username = ? AND password = ?').get(username, hashedPassword);
  if (!user) {
    return res.status(401).json({ error: '請先登入' });
  }
  
  const { display_name, bio, avatar, background } = req.body;
  db.prepare('UPDATE users SET display_name = ?, bio = ?, avatar = ?, background = ? WHERE id = ?').run(display_name || '', bio || '', avatar || '', background || '', user.id);
  
  const updated = db.prepare('SELECT id, username, display_name, bio, avatar, background FROM users WHERE id = ?').get(user.id);
  res.json(updated);
});

app.get('/api/posts', (req, res) => {
  const posts = db.prepare(`
    SELECT 
      posts.*, 
      u1.username, u1.display_name, u1.avatar,
      u2.username as repost_username, u2.display_name as repost_display_name, u2.avatar as repost_avatar
    FROM posts 
    LEFT JOIN users u1 ON posts.user_id = u1.id
    LEFT JOIN posts original ON posts.repost_from_id = original.id
    LEFT JOIN users u2 ON original.user_id = u2.id
    ORDER BY posts.created_at DESC
  `).all();
  res.json(posts);
});

app.get('/api/posts/:id', (req, res) => {
  const post = db.prepare(`
    SELECT 
      posts.*, 
      u1.username, u1.display_name, u1.avatar,
      u2.username as repost_username, u2.display_name as repost_display_name, u2.avatar as repost_avatar
    FROM posts 
    LEFT JOIN users u1 ON posts.user_id = u1.id
    LEFT JOIN posts original ON posts.repost_from_id = original.id
    LEFT JOIN users u2 ON original.user_id = u2.id
    WHERE posts.id = ?
  `).get(req.params.id);
  if (post) {
    res.json(post);
  } else {
    res.status(404).json({ error: 'Post not found' });
  }
});

app.post('/api/posts', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: '請先登入' });
  }
  const [username, password] = Buffer.from(authHeader, 'base64').toString().split(':');
  const hashedPassword = hashPassword(password);
  const user = db.prepare('SELECT id FROM users WHERE username = ? AND password = ?').get(username, hashedPassword);
  if (!user) {
    return res.status(401).json({ error: '請先登入' });
  }
  
  const { title, content, repost_from_id } = req.body;
  
  if (repost_from_id) {
    const result = db.prepare('INSERT INTO posts (user_id, title, content, repost_from_id) VALUES (?, ?, ?, ?)').run(user.id, '轉發', '', repost_from_id);
    res.json({ id: result.lastInsertRowid, title: '轉發', content: '' });
  } else {
    if (!title || !content) {
      return res.status(400).json({ error: '標題和內容必填' });
    }
    const result = db.prepare('INSERT INTO posts (user_id, title, content) VALUES (?, ?, ?)').run(user.id, title, content);
    res.json({ id: result.lastInsertRowid, title, content });
  }
});

app.put('/api/posts/:id', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: '請先登入' });
  }
  const [username, password] = Buffer.from(authHeader, 'base64').toString().split(':');
  const hashedPassword = hashPassword(password);
  const user = db.prepare('SELECT id FROM users WHERE username = ? AND password = ?').get(username, hashedPassword);
  if (!user) {
    return res.status(401).json({ error: '請先登入' });
  }
  
  const post = db.prepare('SELECT * FROM posts WHERE id = ? AND user_id = ?').get(req.params.id, user.id);
  if (!post) {
    return res.status(403).json({ error: '無權限編輯此文章' });
  }

  const { title, content } = req.body;
  const result = db.prepare('UPDATE posts SET title = ?, content = ? WHERE id = ?').run(title, content, req.params.id);
  res.json({ id: req.params.id, title, content });
});

app.delete('/api/posts/:id', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: '請先登入' });
  }
  const [username, password] = Buffer.from(authHeader, 'base64').toString().split(':');
  const hashedPassword = hashPassword(password);
  const user = db.prepare('SELECT id FROM users WHERE username = ? AND password = ?').get(username, hashedPassword);
  if (!user) {
    return res.status(401).json({ error: '請先登入' });
  }
  
  const post = db.prepare('SELECT * FROM posts WHERE id = ? AND user_id = ?').get(req.params.id, user.id);
  if (!post) {
    return res.status(403).json({ error: '無權限刪除此文章' });
  }

  db.prepare('DELETE FROM posts WHERE id = ?').run(req.params.id);
  res.json({ message: 'Post deleted' });
});

app.listen(PORT, () => {
  console.log(`Blog server running at http://localhost:${PORT}`);
});
