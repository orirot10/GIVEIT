const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const rentalRoutes = require('./routes/rentalRoutes');
const authRoutes = require('./routes/authRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const rentalRequestRoutes = require('./routes/rentalRequestRoutes');
const serviceRequestRoutes = require('./routes/serviceRequestRoutes');
const { loadMessages, sendMessage, getConversations, getMessages } = require('./controllers/messageController');

require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Define allowed origins for CORS
const allowedOrigins = [
  'http://localhost:5173', // Vite dev server (local)
  'http://localhost:3000', // Local frontend (if applicable)
  process.env.FRONTEND_URL || 'https://giveit-frontend.onrender.com', // Replace with your actual frontend URL
];

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Connect to DB
connectDB();

// Middleware
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(express.json());

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/rentals', rentalRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/rental_requests', rentalRequestRoutes);
app.use('/api/service_requests', serviceRequestRoutes);

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
const HOST = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';

server.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
  if (process.env.NODE_ENV === 'production' && process.env.API_URL) {
    console.log(`Accessible via ${process.env.API_URL}`);
  }
});