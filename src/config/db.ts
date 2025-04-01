import { DataSource } from 'typeorm';
import { User } from '../models/User';
import config from './index';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: config.database.url,
  ssl: {
    rejectUnauthorized: false
  },
  entities: [User],
  synchronize: true, // В продакшене лучше использовать миграции
  logging: true,
  extra: {
    max: 20, // Maximum number of connections in the pool
    connectionTimeoutMillis: 5000, // Connection timeout in milliseconds
    ssl: {
      rejectUnauthorized: false
    }
  }
});

export const connectDB = async () => {
  try {
    console.log('Attempting to connect to database...');
    await AppDataSource.initialize();
    console.log('Database connected successfully');
    
    // Создаем таблицы если их нет
    await AppDataSource.synchronize();
    console.log('Database schema synchronized');
  } catch (error) {
    console.error('Error connecting to database:', error);
    throw error;
  }
};
