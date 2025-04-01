import express, { RequestHandler } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/db';
import { User } from '../models/User';
import config from '../config';

const router = express.Router();
const userRepository = AppDataSource.getRepository(User);

// Middleware для добавления CORS заголовков
const addCorsHeaders: RequestHandler = (req, res, next) => {
  console.log('Adding CORS headers. Origin:', config.corsOrigin);
  console.log('Request method:', req.method);
  console.log('Request headers:', req.headers);

  res.header('Access-Control-Allow-Origin', config.corsOrigin);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');

  // Preflight request
  if (req.method === 'OPTIONS') {
    console.log('=== OPTIONS Request ===');
    console.log('Request URL:', req.url);
    console.log('Request method:', req.method);
    console.log('Request headers:', req.headers);
    console.log('CORS Origin:', config.corsOrigin);
    console.log('Response headers:', res.getHeaders());
    return res.status(200).end();
  }

  next();
};

// Применяем CORS middleware ко всем маршрутам
router.use(addCorsHeaders);

// Временный маршрут для проверки пользователей!
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

console.log('Received POST /register request');
// Регистрация.
router.post('/register', async (req, res) => {
  console.log('=== Registration Request ===');
  console.log('Request URL:', req.url);
  console.log('Request method:', req.method);
  console.log('Request headers:', req.headers);
  console.log('Request body:', req.body);
  console.log('CORS Origin:', config.corsOrigin);
  
  try {
    const { email, password, firstName, lastName } = req.body;
    
    console.log('Received data:', { email, firstName, lastName, passwordLength: password?.length });
    
    if (!email || !password || !firstName || !lastName) {
      console.log('Missing required fields:', { email, firstName, lastName });
      return res.status(400).json({ message: 'All fields are required' });
    }

    console.log('Registration attempt for:', email);

    // Проверяем, существует ли пользователь
    const existingUser = await userRepository.findOne({ where: { email } });
    console.log('Existing user check:', existingUser ? 'Found' : 'Not found');
    
    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(400).json({ message: 'User already exists' });
    }

    // Хешируем пароль
    console.log('Hashing password...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log('Password hashed successfully');

    // Создаем нового пользователя
    console.log('Creating new user...');
    const user = new User({
      email,
      password: hashedPassword,
      firstName,
      lastName
    });

    // Сохраняем пользователя
    console.log('Saving user to database...');
    const savedUser = await userRepository.save(user);
    console.log('User saved successfully:', savedUser.id);

    // Создаем JWT токен
    console.log('Generating JWT token...');
    const token = jwt.sign(
      { userId: savedUser.id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );
    console.log('JWT token generated successfully');

    console.log('=== Sending Registration Response ===');
    console.log('Response headers:', res.getHeaders());
    
    const response = {
      token,
      user: {
        id: savedUser.id,
        email: savedUser.email,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName
      }
    };
    
    console.log('Response body:', {
      ...response,
      token: response.token.substring(0, 10) + '...'
    });

    return res.status(201).json(response);
  } catch (error: unknown) {
    console.error('=== Registration Error ===');
    console.error('Error details:', error);
    console.error('Stack trace:', (error as Error).stack);
    return res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
});

// Вход
router.post('/login', async (req, res) => {
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
});

export default router; 