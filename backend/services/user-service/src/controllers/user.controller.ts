import { Request, Response } from 'express';
import {
  getUserProfile,
  updateUserProfile,
  getUserById,
  deleteUser,
  getAllUsers,
  UserProfileUpdateData
} from '../services/user.service';

/**
 * Get current user profile
 */
export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get user ID from JWT middleware
    const userId = (req as any).user?.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'User not authenticated'
        }
      });
      return;
    }

    const result = await getUserProfile(userId);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    console.error('Get profile controller error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred'
      }
    });
  }
};

/**
 * Update current user profile
 */
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get user ID from JWT middleware
    const userId = (req as any).user?.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'User not authenticated'
        }
      });
      return;
    }

    const updateData: UserProfileUpdateData = req.body;

    const result = await updateUserProfile(userId, updateData);

    if (result.success) {
      res.status(200).json(result);
    } else {
      const statusCode = result.error?.code === 'USER_NOT_FOUND' ? 404 :
                        result.error?.code === 'VALIDATION_ERROR' ? 400 : 500;
      res.status(statusCode).json(result);
    }
  } catch (error) {
    console.error('Update profile controller error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred'
      }
    });
  }
};

/**
 * Get user by ID (admin only)
 */
export const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get current user from JWT middleware
    const currentUser = (req as any).user;

    if (!currentUser || currentUser.role !== 'admin') {
      res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Admin access required'
        }
      });
      return;
    }

    const userId = parseInt(req.params.id || '0');

    if (isNaN(userId)) {
      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid user ID'
        }
      });
      return;
    }

    const result = await getUserById(userId);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    console.error('Get user controller error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred'
      }
    });
  }
};

/**
 * Delete user (admin only)
 */
export const removeUser = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get current user from JWT middleware
    const currentUser = (req as any).user;

    if (!currentUser || currentUser.role !== 'admin') {
      res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Admin access required'
        }
      });
      return;
    }

    const userId = parseInt(req.params.id || '0');

    if (isNaN(userId)) {
      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid user ID'
        }
      });
      return;
    }

    // Prevent admin from deleting themselves
    if (currentUser.userId === userId) {
      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Cannot delete your own account'
        }
      });
      return;
    }

    const result = await deleteUser(userId);

    if (result.success) {
      res.status(200).json(result);
    } else {
      const statusCode = result.error?.code === 'USER_NOT_FOUND' ? 404 : 500;
      res.status(statusCode).json(result);
    }
  } catch (error) {
    console.error('Delete user controller error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred'
      }
    });
  }
};

/**
 * Get all users (admin only, with pagination)
 */
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get current user from JWT middleware
    const currentUser = (req as any).user;

    if (!currentUser || currentUser.role !== 'admin') {
      res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Admin access required'
        }
      });
      return;
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const role = req.query.role as string;

    // Validate pagination parameters
    if (page < 1 || limit < 1 || limit > 100) {
      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid pagination parameters'
        }
      });
      return;
    }

    const result = await getAllUsers(page, limit, role);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    console.error('Get users controller error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred'
      }
    });
  }
};