import { DataSource } from 'typeorm';
import { User } from '../models/User';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'database.sqlite',
  entities: [User],
  synchronize: true, // В продакшене отключить
  logging: true
});

export const connectDB = async () => {
  try {
    await AppDataSource.initialize();
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Error connecting to database:', error);
    process.exit(1);
  }
}; 