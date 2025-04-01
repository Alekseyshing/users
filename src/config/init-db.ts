import { AppDataSource } from './db';
import { User } from '../models/User';

export const initializeDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log('Database initialized successfully');

    // Проверяем, есть ли уже пользователи
    const userRepository = AppDataSource.getRepository(User);
    const userCount = await userRepository.count();

    if (userCount === 0) {
      // Создаем тестового пользователя
      const testUser = new User();
      testUser.email = 'test@example.com';
      testUser.password = 'test123'; // В реальном приложении пароль должен быть захеширован
      testUser.firstName = 'Test';
      testUser.lastName = 'User';
      testUser.isAdmin = false;

      await userRepository.save(testUser);
      console.log('Test user created successfully');
    }

    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    return false;
  }
}; 