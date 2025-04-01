import http from 'http';
import app from './app';
import config from './config';
import { connectDB } from './config/db';

const startServer = async () => {
  try {
    // Подключаемся к базе данных
    await connectDB();

    // Создаем HTTP сервер
    const server = http.createServer(app);

    server.listen(config.port, () => {
      console.log(`Server is running on port ${config.port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer(); 