const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const rentalRoutes = require('./routes/rentalRoutes');
const authRoutes = require('./routes/authRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const { loadMessages, sendMessage, getConversations, getMessages } = require('./controllers/messageController');

require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    methods: ['GET', 'POST'],
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  },
});

// Connect to DB
connectDB();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true, // Allow credentials for Express routes
}));
app.use(express.json());

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/rentals', rentalRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);

// Socket.IO
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join', async (userId) => {
    socket.join(userId);
    console.log(`${userId} joined their room`);
  });

  socket.on('getConversations', async (userId) => {
    try {
      console.log('Received getConversations for user:', userId);
      await getConversations(socket, userId);
    } catch (err) {
      console.error('Error fetching conversations:', err);
      socket.emit('loadConversations', []);
    }
  });

  socket.on('getMessages', async (data) => {
    try {
      await getMessages(socket, data);
    } catch (err) {
      console.error('Error fetching messages:', err);
      socket.emit('loadMessages', []);
    }
  });

  socket.on('sendMessage', async (data) => {
    try {
      const message = await sendMessage(data);
      io.to(data.receiverId).emit('receiveMessage', message);
      io.to(data.senderId).emit('receiveMessage', message);
    } catch (err) {
      console.error('Error sending message:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));