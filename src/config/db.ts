import { DataSource } from 'typeorm';
import { User } from '../models/User';
import path from 'path';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'database.sqlite',
  entities: [User],
  synchronize: false, // Отключаем синхронизацию, когда используем миграции
  logging: true,
  migrations: [path.join(__dirname, 'migrations', '*.ts')], // Путь к миграциям
  subscribers: [],
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
