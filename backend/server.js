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

const allowedOrigins = ['http://localhost:5173', 'http://localhost:3000'];
const apiUrl = process.env.API_URL; // For the deployed backend URL
if (apiUrl) {
  // Assuming your frontend will be served from a URL related to the API_URL
  // For example, if API_URL is https://api.example.com, frontend might be https://example.com
  // You might need to adjust this logic based on your actual Render setup.
  // For now, let's assume the frontend is served from the same base domain or a known URL.
  // If your frontend has a different URL on Render, add it here or use a separate env var.
  const frontendUrl = apiUrl.replace(/^http(s?):\/\/api\./, 'http$1://').replace(/(:[0-9]+)?$/, ''); // Basic attempt to get frontend URL
  if (frontendUrl && !allowedOrigins.includes(frontendUrl)) {
    allowedOrigins.push(frontendUrl);
  }
  // If you have a specific frontend URL for production, add it directly or via another env var
  if (process.env.FRONTEND_URL) {
    allowedOrigins.push(process.env.FRONTEND_URL);
  }
}

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  },
});

// Connect to DB
connectDB();

// Middleware
app.use(cors({
  origin: allowedOrigins,
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
const HOST = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';

server.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
  if (process.env.NODE_ENV === 'production' && apiUrl) {
    console.log(`Accessible via ${apiUrl}`);
  }
});