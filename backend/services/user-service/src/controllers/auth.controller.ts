import { Request, Response } from 'express';
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  AuthResponse,
  LoginResponse,
  RefreshTokenResponse
} from '../services/auth.service';
import { UserRegistrationData, UserLoginData } from '../utils/validation';

/**
 * Register a new user
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name, phone, role } = req.body;

    const result: AuthResponse = await registerUser({
      email,
      password,
      name,
      phone,
      role
    });

    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Register controller error:', error);
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
 * Login user
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password }: UserLoginData = req.body;

    const result: LoginResponse = await loginUser({
      email,
      password
    });

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(401).json(result);
    }
  } catch (error) {
    console.error('Login controller error:', error);
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
 * Logout user
 */
export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get user ID from JWT middleware (assuming it's set)
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

    const result = await logoutUser(userId);

    if (result.success) {
      res.status(200).json({
        success: true,
        message: result.message
      });
    } else {
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: result.message
        }
      });
    }
  } catch (error) {
    console.error('Logout controller error:', error);
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
 * Refresh access token
 */
export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Refresh token is required'
        }
      });
      return;
    }

    const result: RefreshTokenResponse = await refreshAccessToken(refreshToken);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(401).json(result);
    }
  } catch (error) {
    console.error('Refresh token controller error:', error);
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
 * Get current user profile (from token)
 */
export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
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

    // Import user service here to avoid circular imports
    const { getUserProfile } = await import('../services/user.service');

    const result = await getUserProfile(userId);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    console.error('Get current user controller error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred'
      }
    });
  }
};