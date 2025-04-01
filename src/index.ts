import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import path from 'path';
import { connectDB } from './config/db';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import config from './config';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5001;

// Security middleware123
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdn.jsdelivr.net"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", 'http://localhost:5173/']
    }
  }
}));

app.use(express.json());
app.use(compression());
app.use(morgan('dev'));

// Serve static files from the frontend build directory!
app.use(express.static(path.join(__dirname, '../public')));

// Логирование всех входящих запросов
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});

// Root endpoint13
app.get('/', (req, res) => {
  console.log('Root endpoint hit');
  res.json({ 
    message: 'API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

// API Routes
// app.use('/api/auth', authRoutes);
app.use('/', authRoutes);
app.use('/api/users', userRoutes);

// Serve frontend for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
  console.log(req.url);
});

// // Настройка CORS
app.use(cors({
  origin: 'http://localhost:5173/',  // Разрешаем запросы только с этого источника
  credentials: true,                // Разрешаем использование cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


// // Обрабатываем preflight-запросы (OPTIONS)
app.options('*', (req, res) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173/");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.sendStatus(204);  // No Content
});

// Добавляем заголовки вручную (если нужно)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173/");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true"); // Важно, если передаешь куки
  next();
});

// 404 handler
app.use((req, res) => {
  console.log(`404 Not Found: ${req.method} ${req.url}`);
  res.status(404).json({ 
    error: 'Not Found',
    path: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    timestamp: new Date().toISOString()
  });
});



// Подключаемся к базе данных
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`API URL: http://localhost:${PORT}`);
  });
}); 



// import express from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import helmet from 'helmet';
// import compression from 'compression';
// import morgan from 'morgan';
// import path from 'path';
// import { connectDB } from './config/db';
// import authRoutes from './routes/auth';
// import userRoutes from './routes/users';
// import config from './config';
// import { url } from 'inspector';

// dotenv.config();

// const app = express();
// const PORT = Number(process.env.PORT) || 5001;

// // Security middleware123
// app.use(helmet({
//   contentSecurityPolicy: {
//     directives: {
//       defaultSrc: ["'self'"],
//       scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
//       styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdn.jsdelivr.net"],
//       fontSrc: ["'self'", "https://fonts.gstatic.com"],
//       imgSrc: ["'self'", "data:", "https:"],
//       connectSrc: ["'self'", "https://userss.vercel.app"]
//     }
//   }
// }));
// // Set cors before the routes and other middleware.
// app.use(cors({
//   // origin: 'https://usersfront.vercel.app/',  // Разрешенный фронтенд
//   origin: 'http://localhost:5001/register',
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));

// // Обрабатываем preflight-запросы (OPTIONS)
// app.options('*', (req, res) => {
//   res.sendStatus(204);  // No Content
// });

// app.use(express.json());
// app.use(compression());
// app.use(morgan('dev'));

// // Serve static files from the frontend build directory!
// app.use(express.static(path.join(__dirname, '../public')));

// // Логирование всех входящих запросов
// app.use((req, res, next) => {
//   console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
//   console.log('Headers:', req.headers);
//   console.log('Body:', req.body);
//   next();
// });

// // Root endpoint13
// app.get('/', (req, res) => {
//   console.log('Root endpoint hit');
//   res.json({ 
//     message: 'API is running',
//     timestamp: new Date().toISOString(),
//     environment: process.env.NODE_ENV || 'development',
//     version: '1.0.0'
//   });
// });

// // API Routes - NO PREFIX NEEDED for /login and /register
// app.use('/', authRoutes); // This will handle /login and /register directly
// app.use('/users', userRoutes); // This will handle /users and /users/:id

// // Serve frontend for all other routes
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../public/index.html'));
//   console.log(req.url);
// });

// // 404 handler
// app.use((req, res) => {
//   console.log(`404 Not Found: ${req.method} ${req.url}`);
//   res.status(404).json({ 
//     error: 'Not Found',
//     path: req.url,
//     method: req.method,
//     timestamp: new Date().toISOString()
//   });
// });

// // Error handling
// app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
//   console.error('Error:', err);
//   res.status(500).json({ 
//     error: 'Internal Server Error',
//     message: err.message,
//     stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
//     timestamp: new Date().toISOString()
//   });
// });

// // Подключаемся к базе данных
// connectDB().then(() => {
//   app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
//     console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
//     console.log(`API URL: http://localhost:${PORT}`);
//   });
// });