import express, { RequestHandler } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/db';
import { User } from '../models/User';

const router = express.Router();
const userRepository = AppDataSource.getRepository(User);

// Временный маршрут для проверки пользователей
router.get('/check-users', (async (req, res) => {
  try {
    const users = await userRepository.find();
    console.log('All users in database:', users);
    res.json(users);
  } catch (error: unknown) {
    console.error('Error checking users:', error);
    res.status(500).json({ message: 'Server error' });
  }
}) as RequestHandler);

// Регистрация
router.post('/register', (async (req, res) => {
  try {
    console.log('Received registration request:', req.body);
    const { email, password, firstName, lastName } = req.body;
    
    if (!email || !password || !firstName || !lastName) {
      console.log('Missing required fields:', { email, firstName, lastName });
      return res.status(400).json({ message: 'All fields are required' });
    }

    console.log('Registration attempt for:', email);

    // Проверяем, существует ли пользователь
    const existingUser = await userRepository.findOne({ where: { email } });
    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(400).json({ message: 'User already exists' });
    }

    // Хешируем пароль
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log('Password hashed successfully. Hash:', hashedPassword);

    // Создаем нового пользователя
    const user = new User({
      email,
      password: hashedPassword,
      firstName,
      lastName
    });

    console.log('Attempting to save user:', {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    });

    // Сохраняем пользователя
    const savedUser = await userRepository.save(user);
    console.log('User saved successfully:', savedUser.id);

    // Создаем JWT токен
    const token = jwt.sign(
      { userId: savedUser.id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );

    res.status(201).json({
      token,
      user: {
        id: savedUser.id,
        email: savedUser.email,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName
      }
    });
  } catch (error: unknown) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}) as RequestHandler);

// Вход
router.post('/login', (async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for:', email);
    console.log('Provided password length:', password.length);

    // Ищем пользователя
    const user = await userRepository.findOne({ where: { email } });
    if (!user) {
      console.log('User not found:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log('User found:', {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    });
    console.log('Stored password hash length:', user.password.length);
    
    // Проверяем пароль
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isMatch);
    console.log('Password comparison details:', {
      providedPasswordLength: password.length,
      storedHashLength: user.password.length,
      isMatch
    });
    
    if (!isMatch) {
      console.log('Password mismatch for user:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Создаем JWT токен
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );

    console.log('Login successful, token generated for user:', email);

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });
  } catch (error: unknown) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}) as RequestHandler);

export default router; 