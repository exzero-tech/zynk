import { Request, Response } from 'express';
import {
  createReview,
  getReviewsForCharger,
  getReviewsByDriver,
  getReviewById,
  updateReview,
  deleteReview,
  getAllReviews
} from '../services/review.service';

/**
 * Create a new review
 */
export const createUserReview = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get driver ID from JWT middleware
    const driverId = (req as any).user?.userId;

    if (!driverId) {
      res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'User not authenticated'
        }
      });
      return;
    }

    const { chargerId, sessionId, rating, comment } = req.body;

    // Validate required fields
    if (!chargerId || !sessionId || !rating) {
      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Charger ID, session ID, and rating are required'
        }
      });
      return;
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Rating must be between 1 and 5'
        }
      });
      return;
    }

    const result = await createReview(driverId, chargerId, sessionId, rating, comment);

    if (result.success) {
      res.status(201).json(result);
    } else {
      const statusCode = result.error?.code === 'USER_NOT_FOUND' ? 404 :
                        result.error?.code === 'CHARGER_NOT_FOUND' ? 404 :
                        result.error?.code === 'SESSION_NOT_FOUND' ? 404 :
                        result.error?.code === 'SESSION_NOT_COMPLETED' ? 400 :
                        result.error?.code === 'REVIEW_EXISTS' ? 409 :
                        result.error?.code === 'VALIDATION_ERROR' ? 400 : 500;
      res.status(statusCode).json(result);
    }
  } catch (error) {
    console.error('Create review controller error:', error);
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
 * Get reviews by a specific driver
 */
export const getDriverReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const driverId = parseInt(req.params.id || '0');

    if (isNaN(driverId)) {
      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid driver ID'
        }
      });
      return;
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

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

    const result = await getReviewsByDriver(driverId, page, limit);

    if (result.success) {
      res.status(200).json(result);
    } else {
      const statusCode = result.error?.code === 'USER_NOT_FOUND' ? 404 : 500;
      res.status(statusCode).json(result);
    }
  } catch (error) {
    console.error('Get driver reviews controller error:', error);
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
 * Get reviews for a specific charger
 */
export const getUserReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const chargerId = parseInt(req.params.id || '0');

    if (isNaN(chargerId)) {
      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid charger ID'
        }
      });
      return;
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

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

    const result = await getReviewsForCharger(chargerId, page, limit);

    if (result.success) {
      res.status(200).json(result);
    } else {
      const statusCode = result.error?.code === 'CHARGER_NOT_FOUND' ? 404 : 500;
      res.status(statusCode).json(result);
    }
  } catch (error) {
    console.error('Get charger reviews controller error:', error);
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
 * Get review by ID
 */
export const getReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const reviewId = parseInt(req.params.id || '0');

    if (isNaN(reviewId)) {
      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid review ID'
        }
      });
      return;
    }

    const result = await getReviewById(reviewId);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    console.error('Get review controller error:', error);
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
 * Update review (only by reviewer)
 */
export const updateUserReview = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get driver ID from JWT middleware
    const driverId = (req as any).user?.userId;

    if (!driverId) {
      res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'User not authenticated'
        }
      });
      return;
    }

    const reviewId = parseInt(req.params.id || '0');

    if (isNaN(reviewId)) {
      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid review ID'
        }
      });
      return;
    }

    const { rating, comment } = req.body;

    // Validate rating if provided
    if (rating !== undefined && (rating < 1 || rating > 5)) {
      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Rating must be between 1 and 5'
        }
      });
      return;
    }

    const result = await updateReview(reviewId, driverId, rating, comment);

    if (result.success) {
      res.status(200).json(result);
    } else {
      const statusCode = result.error?.code === 'REVIEW_NOT_FOUND' ? 404 :
                        result.error?.code === 'FORBIDDEN' ? 403 :
                        result.error?.code === 'VALIDATION_ERROR' ? 400 : 500;
      res.status(statusCode).json(result);
    }
  } catch (error) {
    console.error('Update review controller error:', error);
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
 * Delete review (by reviewer or admin)
 */
export const removeReview = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get current user from JWT middleware
    const currentUser = (req as any).user;

    if (!currentUser) {
      res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'User not authenticated'
        }
      });
      return;
    }

    const reviewId = parseInt(req.params.id || '0');

    if (isNaN(reviewId)) {
      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid review ID'
        }
      });
      return;
    }

    const result = await deleteReview(reviewId, currentUser.userId, currentUser.role === 'admin');

    if (result.success) {
      res.status(200).json(result);
    } else {
      const statusCode = result.error?.code === 'REVIEW_NOT_FOUND' ? 404 :
                        result.error?.code === 'FORBIDDEN' ? 403 : 500;
      res.status(statusCode).json(result);
    }
  } catch (error) {
    console.error('Delete review controller error:', error);
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
 * Get all reviews (admin only, with pagination)
 */
export const getReviews = async (req: Request, res: Response): Promise<void> => {
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

    const result = await getAllReviews(page, limit);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    console.error('Get reviews controller error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred'
      }
    });
  }
};