import { Router } from 'express';
import {
  getProfile,
  updateProfile,
  getUser,
  removeUser,
  getUsers
} from '../controllers/user.controller';
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

/**
 * @route GET /users/profile
 * @desc Get current user profile
 * @access Private
 */
router.get('/profile', authenticateToken, getProfile);

/**
 * @route PUT /users/profile
 * @desc Update current user profile
 * @access Private
 */
router.put('/profile', authenticateToken, updateProfile);

/**
 * @route GET /users/:id
 * @desc Get user by ID (admin only)
 * @access Private (Admin)
 */
router.get('/:id', authenticateToken, requireAdmin, getUser);

/**
 * @route DELETE /users/:id
 * @desc Delete user by ID (admin only)
 * @access Private (Admin)
 */
router.delete('/:id', authenticateToken, requireAdmin, removeUser);

/**
 * @route GET /users
 * @desc Get all users with pagination (admin only)
 * @access Private (Admin)
 */
router.get('/', authenticateToken, requireAdmin, getUsers);

export default router;