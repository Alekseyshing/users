import express, { RequestHandler } from 'express';
import { AppDataSource } from '../config/db';
import { User } from '../models/User';

const router = express.Router();
const userRepository = AppDataSource.getRepository(User);

// Получить всех пользователей
router.get('/', (async (req, res) => {
  try {
    const users = await userRepository.find({
      select: ['id', 'email', 'firstName', 'lastName', 'isAdmin', 'createdAt']
    });
    res.json(users);
  } catch (error: unknown) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
}) as RequestHandler);

// Получить пользователя по ID
router.get('/:id', (async (req, res) => {
  try {
    const user = await userRepository.findOne({
      where: { id: req.params.id },
      select: ['id', 'email', 'firstName', 'lastName', 'isAdmin', 'createdAt']
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error: unknown) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error' });
  }
}) as RequestHandler);

export default router; 