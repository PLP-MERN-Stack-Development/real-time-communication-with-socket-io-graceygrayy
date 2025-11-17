// server.js - Main server file for Socket.io chat application

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Store connected users and messages
const users = {};
const messages = [];
const typingUsers = {};
const userUnreadCounts = {};
const messageReadBy = {}; // Track who read which message

// Socket.io connection handler
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Handle user joining
  socket.on('user_join', (username) => {
    users[socket.id] = { username, id: socket.id };
    userUnreadCounts[socket.id] = 0;
    io.emit('user_list', Object.values(users));
    io.emit('user_joined', { username, id: socket.id });
    console.log(`${username} joined the chat`);
  });

  // Handle chat messages
  socket.on('send_message', (messageData) => {
    const message = {
      ...messageData,
      id: Date.now(),
      sender: users[socket.id]?.username || 'Anonymous',
      senderId: socket.id,
      timestamp: new Date().toISOString(),
      reactions: {},
      readBy: {},
    };
    
    messages.push(message);
    messageReadBy[message.id] = { [socket.id]: true };
    
    // Limit stored messages to prevent memory issues
    if (messages.length > 100) {
      const oldMsg = messages.shift();
      delete messageReadBy[oldMsg.id];
    }
    
    io.emit('receive_message', message);
  });

  // Handle typing indicator
  socket.on('typing', (isTyping) => {
    if (users[socket.id]) {
      const username = users[socket.id].username;
      
      if (isTyping) {
        typingUsers[socket.id] = username;
      } else {
        delete typingUsers[socket.id];
      }
      
      io.emit('typing_users', Object.values(typingUsers));
    }
  });

  // Handle private messages
  socket.on('private_message', ({ to, message }) => {
    const messageData = {
      id: Date.now(),
      sender: users[socket.id]?.username || 'Anonymous',
      senderId: socket.id,
      message,
      timestamp: new Date().toISOString(),
      isPrivate: true,
    };
    
    socket.to(to).emit('private_message', messageData);
    socket.emit('private_message', messageData);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    if (users[socket.id]) {
      const { username } = users[socket.id];
      io.emit('user_left', { username, id: socket.id });
      console.log(`${username} left the chat`);
    }
    
    delete users[socket.id];
    delete typingUsers[socket.id];
    delete userUnreadCounts[socket.id];
    
    io.emit('user_list', Object.values(users));
    io.emit('typing_users', Object.values(typingUsers));
  });

  // Handle message read receipt
  socket.on('mark_read', (messageId) => {
    if (messageReadBy[messageId]) {
      messageReadBy[messageId][socket.id] = true;
    }
    const message = messages.find(m => m.id === messageId);
    if (message) {
      io.emit('message_read', { messageId, userId: socket.id });
    }
  });

  // Handle message reaction
  socket.on('add_reaction', ({ messageId, reaction }) => {
    const message = messages.find(m => m.id === messageId);
    if (message) {
      if (!message.reactions) message.reactions = {};
      if (!message.reactions[reaction]) message.reactions[reaction] = [];
      if (!message.reactions[reaction].includes(socket.id)) {
        message.reactions[reaction].push(socket.id);
      }
      io.emit('reaction_added', { messageId, reaction, userId: socket.id });
    }
  });

  // Handle remove reaction
  socket.on('remove_reaction', ({ messageId, reaction }) => {
    const message = messages.find(m => m.id === messageId);
    if (message && message.reactions && message.reactions[reaction]) {
      message.reactions[reaction] = message.reactions[reaction].filter(id => id !== socket.id);
      if (message.reactions[reaction].length === 0) delete message.reactions[reaction];
      io.emit('reaction_removed', { messageId, reaction, userId: socket.id });
    }
  });
});

// API routes
app.get('/api/messages', (req, res) => {
  res.json(messages);
});

app.get('/api/users', (req, res) => {
  res.json(Object.values(users));
});

// Root route
app.get('/', (req, res) => {
  res.send('Socket.io Chat Server is running');
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, server, io }; 