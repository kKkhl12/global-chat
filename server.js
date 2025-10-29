const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static('public'));
app.use(express.json());

// Store active users
const users = new Map();

// Simple captcha verification endpoint
app.post('/verify-captcha', (req, res) => {
  const { answer, expected } = req.body;
  res.json({ success: parseInt(answer) === parseInt(expected) });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join', (username) => {
    users.set(socket.id, username);
    io.emit('user-joined', {
      username,
      userCount: users.size
    });
    io.emit('user-count', users.size);
  });

  socket.on('chat-message', (data) => {
    const username = users.get(socket.id);
    io.emit('chat-message', {
      username,
      message: data.message,
      timestamp: new Date().toLocaleTimeString()
    });
  });

  socket.on('disconnect', () => {
    const username = users.get(socket.id);
    users.delete(socket.id);
    if (username) {
      io.emit('user-left', {
        username,
        userCount: users.size
      });
      io.emit('user-count', users.size);
    }
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
