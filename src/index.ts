import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { connectDB } from './config/db';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5001;

// CORS configuration1
const corsOptions = {
  origin: [
    'http://localhost:5001',
    'http://127.0.0.1:5001',
    'http://localhost:5173', 
    'http://127.0.0.1:5173',
    'https://users-list-rosy.vercel.app',
    'https://users-steel.vercel.app/'  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Добавляем заголовки безопасности
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (corsOptions.origin.includes(origin || '')) {
    res.header('Access-Control-Allow-Origin', origin || '');
  }
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

// Логирование всех входящих запросов
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log('Request body:', req.body);
  next();
});

// API Routes - должны быть первыми
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, '../dist')));

// Handle frontend routes - serve index.html for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Подключаемся к базе данных
connectDB().then(() => {
  app.listen(PORT, 'localhost', () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}); 