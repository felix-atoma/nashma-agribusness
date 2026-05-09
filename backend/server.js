const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');
const { createServer } = require('http');
const { Server } = require('socket.io');

// ============================================
// 🚨 ENVIRONMENT CONFIGURATION
// ============================================
dotenv.config({ path: path.resolve(__dirname, '.env') });

const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET', 'PORT', 'CLIENT_URLS'];
requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) throw new Error(`Missing ${envVar} in .env`);
});

// ============================================
// 🛢️ DATABASE CONNECTION
// ============================================
const connectDB = async () => {
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 30000,
    maxPoolSize: 50,
    minPoolSize: 5,
    retryWrites: true,
    w: 'majority'
  };

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, options);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    conn.connection.on('error', err => {
      console.error('MongoDB connection error:', err);
      if (err.message.includes('buffering timed out')) {
        mongoose.disconnect();
      }
    });
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    process.exit(1);
  }
};
connectDB();

// ============================================
// 🚀 EXPRESS SERVER CONFIGURATION
// ============================================
const app = express();
const httpServer = createServer(app);

// ============================================
// 🔒 ENHANCED CORS CONFIGURATION - FIXED
// ============================================
const allowedOrigins = process.env.CLIENT_URLS.split(',');

console.log('🔄 Allowed CORS origins:', allowedOrigins);

// Enhanced CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('🚫 CORS blocked for origin:', origin);
      console.log('📋 Allowed origins:', allowedOrigins);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With',
    'Accept',
    'Origin',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers',
    'Cookie'
  ]
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle preflight requests globally
app.options('*', cors(corsOptions));

// Add Socket.io support with CORS
const io = new Server(httpServer, {
  pingTimeout: 60000,
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// ============================================
// 🔒 SECURITY MIDDLEWARE
// ============================================
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginEmbedderPolicy: false,
  crossOriginOpenerPolicy: false,
}));

app.use(cookieParser());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  skip: req => req.ip === '::1' // Skip for localhost
});

// Request slowing
const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000,
  delayAfter: 50,
  delayMs: () => 500,
  maxDelayMs: 20000,
  validate: { delayMs: false }
});

app.use(limiter);
app.use(speedLimiter);

// Body parsing
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ============================================
// ⏱️ REQUEST TIMEOUT HANDLING
// ============================================
app.use((req, res, next) => {
  const timeoutMs = req.path.startsWith('/api/orders') ? 45000 : 15000;
  res.setTimeout(timeoutMs, () => {
    if (!res.headersSent) {
      res.status(504).json({ error: 'Request timeout' });
    }
  });
  next();
});

// ============================================
// 📊 LOGGING MIDDLEWARE
// ============================================
app.use((req, res, next) => {
  console.log('🌐 Incoming request:', {
    method: req.method,
    url: req.url,
    origin: req.headers.origin,
    'user-agent': req.headers['user-agent']?.substring(0, 50) + '...'
  });
  next();
});

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', {
    skip: (req, res) => req.path === '/healthcheck'
  }));
}

// ============================================
// 🛠️ ROUTES SETUP
// ============================================
// Health check
app.get('/healthcheck', (req, res) => {
  res.json({
    status: 'ok',
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    memory: process.memoryUsage(),
    uptime: process.uptime(),
    allowedOrigins: allowedOrigins
  });
});

app.get('/', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    message: 'Nashma backend running',
    cors: {
      allowedOrigins: allowedOrigins,
      credentials: true
    }
  });
});

// ============================================
// 📍 API ROUTES - PROPERLY CONFIGURED
// ============================================

// Import middleware
const { protect, restrictTo } = require('./middleware/authMiddleware');

// Define routes with proper error handling
const routeConfigs = [
  { path: '/api/auth', file: './routes/authRoutes' },
  { path: '/api/products', file: './routes/productRoutes' },
  { path: '/api/cart', file: './routes/cartRoutes' },
  { path: '/api/contact', file: './routes/contactRoutes' },
  { path: '/api/newsletter', file: './routes/newsletterRoutes' },
  { path: '/api/orders', file: './routes/orderRoutes' },
  {
    path: '/api/admin',
    file: './routes/adminRoutes',
    middleware: [protect, restrictTo('admin')],
  },
];

// Load routes with detailed logging
routeConfigs.forEach(({ path, file, middleware = [] }) => {
  try {
    const routeHandler = require(file);
    console.log(`📍 Loading route: ${path} from ${file}`);
    
    if (middleware.length > 0) {
      app.use(path, ...middleware, routeHandler);
    } else {
      app.use(path, routeHandler);
    }
    
    console.log(`✅ Successfully loaded route: ${path}`);
  } catch (error) {
    console.error(`❌ Failed to load route ${path} from ${file}:`, error.message);
    console.error('Stack trace:', error.stack);
  }
});

// ============================================
// 🛑 ERROR HANDLING
// ============================================

// Catch-all for undefined routes
app.all('*', (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Can't find ${req.originalUrl} on this server!`,
    availableRoutes: routeConfigs.map(route => route.path)
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  
  // CORS error
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      success: false,
      message: 'CORS Error: Origin not allowed',
      allowedOrigins: allowedOrigins,
      yourOrigin: req.headers.origin
    });
  }
  
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors
    });
  }
  
  // Mongoose cast error
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format'
    });
  }
  
  // Duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      message: `${field} already exists`
    });
  }
  
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
  
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired'
    });
  }
  
  // Default error
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Process error handlers
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  httpServer.close(() => {
    process.exit(1);
  });
});

process.on('uncaughtException', err => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

// ============================================
// 🚦 SERVER STARTUP
// ============================================
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📍 Allowed CORS origins:`, allowedOrigins);
  console.log(`📍 Available routes:`);
  routeConfigs.forEach(route => {
    console.log(`   - ${route.path}`);
  });
  
  // Memory monitoring
  setInterval(() => {
    const memory = process.memoryUsage();
    console.log(`💾 Memory usage: ${Math.round(memory.heapUsed / 1024 / 1024)}MB`);
  }, 60000);
});

// Graceful shutdown
['SIGINT', 'SIGTERM'].forEach(signal => {
  process.on(signal, () => {
    console.log(`Received ${signal}, shutting down gracefully...`);
    httpServer.close(() => {
      console.log('Process terminated');
      mongoose.disconnect();
      process.exit(0);
    });
  });
});

module.exports = { app, io };