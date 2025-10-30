import { PrismaClient } from '@prisma/client';
import { validateReview, ReviewData } from '../utils/validation';

const prisma = new PrismaClient();

export interface Review {
  id: number;
  driverId: number;
  chargerId: number;
  sessionId?: number;
  rating: number;
  comment?: string;
  createdAt: Date;
  driver: {
    id: number;
    name: string;
  };
}

export interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

/**
 * Create a new review
 */
export const createReview = async (
  driverId: number,
  reviewData: ReviewData
): Promise<ServiceResponse<Review>> => {
  try {
    // Validate input data
    const validation = validateReview(reviewData);
    if (!validation.isValid) {
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: validation.errors.join(', ')
        }
      };
    }

    // Check if charger exists
    const charger = await prisma.charger.findUnique({
      where: { id: reviewData.chargerId }
    });

    if (!charger) {
      return {
        success: false,
        error: {
          code: 'CHARGER_NOT_FOUND',
          message: 'Charger not found'
        }
      };
    }

    // Check if user has already reviewed this charger (optional - allow multiple reviews)
    // For now, we'll allow multiple reviews per driver-charger pair

    // Create review
    const review = await prisma.review.create({
      data: {
        driverId,
        chargerId: reviewData.chargerId,
        sessionId: reviewData.sessionId,
        rating: reviewData.rating,
        comment: reviewData.comment
      },
      select: {
        id: true,
        driverId: true,
        chargerId: true,
        sessionId: true,
        rating: true,
        comment: true,
        createdAt: true,
        driver: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    return {
      success: true,
      data: review as Review
    };
  } catch (error) {
    console.error('Create review error:', error);
    return {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred while creating review'
      }
    };
  }
};

/**
 * Get reviews for a specific charger
 */
export const getReviewsForCharger = async (
  chargerId: number,
  page: number = 1,
  limit: number = 10
): Promise<ServiceResponse<{ reviews: Review[]; total: number; averageRating: number; page: number; totalPages: number }>> => {
  try {
    const skip = (page - 1) * limit;

    // Check if charger exists
    const charger = await prisma.charger.findUnique({
      where: { id: chargerId }
    });

    if (!charger) {
      return {
        success: false,
        error: {
          code: 'CHARGER_NOT_FOUND',
          message: 'Charger not found'
        }
      };
    }

    // Get reviews with pagination
    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { chargerId },
        select: {
          id: true,
          driverId: true,
          chargerId: true,
          sessionId: true,
          rating: true,
          comment: true,
          createdAt: true,
          driver: {
            select: {
              id: true,
              name: true
            }
          }
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.review.count({ where: { chargerId } })
    ]);

    // Calculate average rating
    const ratingSum = reviews.reduce((sum: number, review: { rating: number }) => sum + review.rating, 0);
    const averageRating = total > 0 ? Number((ratingSum / total).toFixed(1)) : 0;

    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      data: {
        reviews: reviews as Review[],
        total,
        averageRating,
        page,
        totalPages
      }
    };
  } catch (error) {
    console.error('Get reviews for charger error:', error);
    return {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred while fetching reviews'
      }
    };
  }
};

/**
 * Get reviews by a specific driver
 */
export const getReviewsByDriver = async (
  driverId: number,
  page: number = 1,
  limit: number = 10
): Promise<ServiceResponse<{ reviews: Review[]; total: number; page: number; totalPages: number }>> => {
  try {
    const skip = (page - 1) * limit;

    // Get reviews with pagination
    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { driverId },
        select: {
          id: true,
          driverId: true,
          chargerId: true,
          sessionId: true,
          rating: true,
          comment: true,
          createdAt: true,
          driver: {
            select: {
              id: true,
              name: true
            }
          }
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.review.count({ where: { driverId } })
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      data: {
        reviews: reviews as Review[],
        total,
        page,
        totalPages
      }
    };
  } catch (error) {
    console.error('Get reviews by driver error:', error);
    return {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred while fetching reviews'
      }
    };
  }
};

/**
 * Update a review
 */
export const updateReview = async (
  reviewId: number,
  driverId: number,
  updateData: Partial<ReviewData>
): Promise<ServiceResponse<Review>> => {
  try {
    // Check if review exists and belongs to the driver
    const existingReview = await prisma.review.findFirst({
      where: {
        id: reviewId,
        driverId
      }
    });

    if (!existingReview) {
      return {
        success: false,
        error: {
          code: 'REVIEW_NOT_FOUND',
          message: 'Review not found or you do not have permission to update it'
        }
      };
    }

    // Validate update data (only rating and comment can be updated)
    const validationData: ReviewData = {
      chargerId: existingReview.chargerId,
      rating: updateData.rating ?? existingReview.rating,
      comment: updateData.comment
    };

    const validation = validateReview(validationData);
    if (!validation.isValid) {
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: validation.errors.join(', ')
        }
      };
    }

    // Prepare update data
    const data: any = {};
    if (updateData.rating !== undefined) data.rating = updateData.rating;
    if (updateData.comment !== undefined) data.comment = updateData.comment;

    // Update review
    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data,
      select: {
        id: true,
        driverId: true,
        chargerId: true,
        sessionId: true,
        rating: true,
        comment: true,
        createdAt: true,
        driver: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    return {
      success: true,
      data: updatedReview as Review
    };
  } catch (error) {
    console.error('Update review error:', error);
    return {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred while updating review'
      }
    };
  }
};

/**
 * Delete a review
 */
export const deleteReview = async (
  reviewId: number,
  driverId: number
): Promise<ServiceResponse<{ message: string }>> => {
  try {
    // Check if review exists and belongs to the driver
    const existingReview = await prisma.review.findFirst({
      where: {
        id: reviewId,
        driverId
      }
    });

    if (!existingReview) {
      return {
        success: false,
        error: {
          code: 'REVIEW_NOT_FOUND',
          message: 'Review not found or you do not have permission to delete it'
        }
      };
    }

    // Delete review
    await prisma.review.delete({
      where: { id: reviewId }
    });

    return {
      success: true,
      data: {
        message: 'Review deleted successfully'
      }
    };
  } catch (error) {
    console.error('Delete review error:', error);
    return {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred while deleting review'
      }
    };
  }
};

/**
 * Get review statistics for a charger
 */
export const getChargerReviewStats = async (chargerId: number): Promise<ServiceResponse<{
  totalReviews: number;
  averageRating: number;
  ratingDistribution: { [key: number]: number };
}>> => {
  try {
    // Check if charger exists
    const charger = await prisma.charger.findUnique({
      where: { id: chargerId }
    });

    if (!charger) {
      return {
        success: false,
        error: {
          code: 'CHARGER_NOT_FOUND',
          message: 'Charger not found'
        }
      };
    }

    // Get all reviews for the charger
    const reviews = await prisma.review.findMany({
      where: { chargerId },
      select: { rating: true }
    });

    const totalReviews = reviews.length;
    const ratingSum = reviews.reduce((sum: number, review: { rating: number }) => sum + review.rating, 0);
    const averageRating = totalReviews > 0 ? Number((ratingSum / totalReviews).toFixed(1)) : 0;

    // Calculate rating distribution
    const ratingDistribution: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach((review: { rating: number }) => {
      ratingDistribution[review.rating] = (ratingDistribution[review.rating] || 0) + 1;
    });

    return {
      success: true,
      data: {
        totalReviews,
        averageRating,
        ratingDistribution
      }
    };
  } catch (error) {
    console.error('Get charger review stats error:', error);
    return {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred while fetching review statistics'
      }
    };
  }
};