import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { initializeDatabase } from './config/init-db';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import config from './config';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5001;

// CORS configuration
app.use(cors({
  origin: config.corsOrigin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}));

// Handle preflight requests
app.options('*', cors());

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdn.jsdelivr.net"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", config.corsOrigin, config.apiUrl]
    }
  }
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Custom body parser for handling escaped JSON strings
app.use((req, res, next) => {
  if (req.method === 'POST' && req.body && typeof req.body === 'string') {
    try {
      req.body = JSON.parse(req.body);
    } catch (error) {
      console.error('Error parsing JSON:', error);
      return res.status(400).json({ error: 'Invalid JSON format' });
    }
  }
  next();
});

app.use(compression());
app.use(morgan('dev'));

// Логирование всех входящих запросов
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  if (req.method !== 'OPTIONS') {
    console.log('Headers:', req.headers);
    if (req.body && Object.keys(req.body).length > 0) {
      console.log('Body:', req.body);
    }
  }
  next();
});

// Root endpoint
app.get('/', (req, res) => {
  console.log('Root endpoint hit');
  res.json({ 
    status: 'success',
    message: 'API is running',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Error handling middleware
app.use(errorHandler);

// Initialize database and start server
const startServer = async () => {
  try {
    await initializeDatabase();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();