import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt.util';

// Extend the Request interface to include user property
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        email: string;
        role: string;
      };
    }
  }
}

/**
 * Middleware to authenticate JWT tokens
 */
export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Access token required'
        }
      });
      return;
    }

    const decoded = verifyAccessToken(token);

    if (!decoded) {
      res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Invalid or expired access token'
        }
      });
      return;
    }

    // Attach user info to request
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role
    };

    next();
  } catch (error) {
    console.error('Authentication middleware error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Authentication failed'
      }
    });
  }
};

/**
 * Middleware to check if user is admin
 */
export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({
      success: false,
      error: {
        code: 'FORBIDDEN',
          message: 'Admin access required'
        }
      });
      return;
    }

    next();
  };

/**
 * Middleware to check if user owns the resource or is admin
 */
export const requireOwnershipOrAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const resourceUserId = parseInt(req.params.userId || req.params.id || '0');

  if (!req.user) {
    res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authentication required'
      }
    });
    return;
  }

  if (req.user.role !== 'admin' && req.user.userId !== resourceUserId) {
    res.status(403).json({
      success: false,
      error: {
        code: 'FORBIDDEN',
        message: 'Access denied: insufficient permissions'
      }
    });
    return;
  }

  next();
};