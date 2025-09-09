
const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const compression = require('compression');
const connectDB = require('./config/db');
const { perf_map_v2 } = require('./config/flags');
const mapTiming = require('./middleware/mapTiming');
const requestLogger = require('./middleware/requestLogger');
const rentalRoutes = require('./routes/rentalRoutes');
const authRoutes = require('./routes/authRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const rentalRequestRoutes = require('./routes/rentalRequestRoutes');
const serviceRequestRoutes = require('./routes/serviceRequestRoutes');
const userRoutes = require('./routes/userRoutes');
const conversationRoutes = require('./routes/conversationRoutes');
const messageRoutes = require('./routes/messageRoutes');
const meRoutes = require('./routes/meRoutes');
const { sendMessageSocket, getConversations, getMessagesSocket } = require('./controllers/messageController');

const geocodeRoutes = require('./routes/geocodeRoutes');

require('dotenv').config();

// Initialize Firebase
require('./config/firebase');

const app = express();
const server = http.createServer(app);
if (perf_map_v2) {
  app.use(compression());
}

// Define allowed origins for CORS
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://localhost', // ← חשוב ל-Capacitor!
  'capacitor://localhost',
  process.env.FRONTEND_URL || 'https://giveit-frontend.onrender.com',
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

// Health check route (must be before auth middleware)
app.get('/healthz', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Middleware
app.use(requestLogger);
const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
// Handle preflight requests
app.options('*', cors(corsOptions), (req, res) => res.sendStatus(200));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically with proper MIME types
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  maxAge: '1d',
  setHeaders: (res, path) => {
    if (path.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    } else if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  }
}));

// Routes
app.use('/api/rentals', mapTiming, rentalRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/services', mapTiming, serviceRoutes);
app.use('/api/rental_requests', rentalRequestRoutes);
app.use('/api/service_requests', serviceRequestRoutes);
app.use('/api/users', userRoutes);
app.use('/api/me', meRoutes);
app.use('/api/test', require('./routes/testRoutes'));
app.use('/api/geocode', geocodeRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/messages', messageRoutes);

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
      await getMessagesSocket(socket, data);
    } catch (err) {
      console.error('Error fetching messages:', err);
      socket.emit('loadMessages', []);
    }
  });

  socket.on('sendMessage', async (data) => {
    try {
      const message = await sendMessageSocket(data);
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
const HOST = '0.0.0.0';

if (process.env.NODE_ENV !== 'test') {
  server.listen(PORT, HOST, () => {
    console.log(`Server running on http://${HOST}:${PORT}`);
    if (process.env.NODE_ENV === 'production' && process.env.API_URL) {
      console.log(`Accessible via ${process.env.API_URL}`);
    }
  });
}

module.exports = { app, server };

