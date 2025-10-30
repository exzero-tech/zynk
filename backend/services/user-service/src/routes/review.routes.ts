import { Router } from 'express';
import {
  createUserReview,
  getUserReviews,
  getDriverReviews,
  getReview,
  updateUserReview,
  removeReview,
  getReviews
} from '../controllers/review.controller';
import { authenticateToken, requireAdmin, requireOwnershipOrAdmin } from '../middleware/auth.middleware';

const router = Router();

/**
 * @route POST /reviews
 * @desc Create a new review
 * @access Private
 */
router.post('/', authenticateToken, createUserReview);

/**
 * @route GET /reviews/charger/:id
 * @desc Get reviews for a charger
 * @access Public
 */
router.get('/charger/:id', getUserReviews);

/**
 * @route GET /reviews/driver/:id
 * @desc Get reviews by driver
 * @access Public
 */
router.get('/driver/:id', getDriverReviews);

/**
 * @route GET /reviews/:id
 * @desc Get review by ID
 * @access Public
 */
router.get('/:id', getReview);

/**
 * @route PUT /reviews/:id
 * @desc Update review (only by reviewer)
 * @access Private
 */
router.put('/:id', authenticateToken, updateUserReview);

/**
 * @route DELETE /reviews/:id
 * @desc Delete review (by reviewer or admin)
 * @access Private
 */
router.delete('/:id', authenticateToken, removeReview);

/**
 * @route GET /reviews
 * @desc Get all reviews with pagination (admin only)
 * @access Private (Admin)
 */
router.get('/', authenticateToken, requireAdmin, getReviews);

export default router;