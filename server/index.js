const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

// Final WebSocket-only Socket.IO config
const io = new Server(server, {
  transports: ['websocket'],
  cors: {
    origin: "http://127.0.0.1:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Test route (optional)
app.get('/api/metrics', (req, res) => {
  res.json({ message: "Server is running" });
});

// WebSocket connection handler
io.on('connection', (socket) => {
  console.log('🔥 Client connected:', socket.id);

  socket.on('disconnect', (reason) => {
    console.log('❌ Client disconnected:', reason);
  });

  // Emit fake data every 2 seconds
  setInterval(() => {
    const fakeData = {
      cpu: parseFloat((Math.random() * 100).toFixed(2)),
      memory: parseFloat((Math.random() * 100).toFixed(2))
    };
    socket.emit('metrics', fakeData);
  }, 2000);
});

server.listen(5000, () => {
  console.log('🚀 Server running on port 5000');
});
