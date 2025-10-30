import { Router } from 'express';
import {
  register,
  login,
  logout,
  refreshToken,
  getCurrentUser
} from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

/**
 * @route POST /auth/register
 * @desc Register a new user
 * @access Public
 */
router.post('/register', register);

/**
 * @route POST /auth/login
 * @desc Login user
 * @access Public
 */
router.post('/login', login);

/**
 * @route POST /auth/logout
 * @desc Logout user
 * @access Private
 */
router.post('/logout', authenticateToken, logout);

/**
 * @route POST /auth/refresh
 * @desc Refresh access token
 * @access Private (requires refresh token)
 */
router.post('/refresh', refreshToken);

/**
 * @route GET /auth/me
 * @desc Get current user info
 * @access Private
 */
router.get('/me', authenticateToken, getCurrentUser);

export default router;