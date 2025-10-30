import { PrismaClient } from '@prisma/client';
import { validateReview, ReviewData } from '../utils/validation';

const prisma = new PrismaClient();

export interface Review {
  id: number;
  reviewerId: number;
  reviewedUserId: number;
  rating: number;
  comment?: string;
  createdAt: Date;
  reviewer: {
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
  reviewerId: number,
  reviewedUserId: number,
  rating: number,
  comment?: string
): Promise<ServiceResponse<Review>> => {
  try {
    // Validate rating
    if (rating < 1 || rating > 5) {
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Rating must be between 1 and 5'
        }
      };
    }

    // Check if reviewer exists
    const reviewer = await prisma.user.findUnique({
      where: { id: reviewerId }
    });

    if (!reviewer) {
      return {
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'Reviewer not found'
        }
      };
    }

    // Check if reviewed user exists
    const reviewedUser = await prisma.user.findUnique({
      where: { id: reviewedUserId }
    });

    if (!reviewedUser) {
      return {
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'Reviewed user not found'
        }
      };
    }

    // Prevent self-review
    if (reviewerId === reviewedUserId) {
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Users cannot review themselves'
        }
      };
    }

    // Check if user has already reviewed this person (optional - allow multiple reviews)
    // For now, we'll allow multiple reviews per user pair

    // Create review
    const review = await prisma.review.create({
      data: {
        reviewerId,
        reviewedUserId,
        rating,
        comment
      },
      select: {
        id: true,
        reviewerId: true,
        reviewedUserId: true,
        rating: true,
        comment: true,
        createdAt: true,
        reviewer: {
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
  reviewerId: number,
  rating?: number,
  comment?: string
): Promise<ServiceResponse<Review>> => {
  try {
    // Check if review exists and belongs to the reviewer
    const existingReview = await prisma.review.findFirst({
      where: {
        id: reviewId,
        reviewerId
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

    // Validate rating if provided
    if (rating !== undefined && (rating < 1 || rating > 5)) {
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Rating must be between 1 and 5'
        }
      };
    }

    // Prepare update data
    const data: any = {};
    if (rating !== undefined) data.rating = rating;
    if (comment !== undefined) data.comment = comment;

    // Update review
    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data,
      select: {
        id: true,
        reviewerId: true,
        reviewedUserId: true,
        rating: true,
        comment: true,
        createdAt: true,
        reviewer: {
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
  userId: number,
  isAdmin: boolean = false
): Promise<ServiceResponse<{ message: string }>> => {
  try {
    // Check if review exists and user has permission to delete it
    const existingReview = await prisma.review.findUnique({
      where: { id: reviewId }
    });

    if (!existingReview) {
      return {
        success: false,
        error: {
          code: 'REVIEW_NOT_FOUND',
          message: 'Review not found'
        }
      };
    }

    // Check permissions: user must be the reviewer or an admin
    if (!isAdmin && existingReview.reviewerId !== userId) {
      return {
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'You do not have permission to delete this review'
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

/**
 * Get reviews for a specific user
 */
export const getReviewsForUser = async (
  userId: number,
  page: number = 1,
  limit: number = 10
): Promise<ServiceResponse<{ reviews: Review[]; total: number; averageRating: number; page: number; totalPages: number }>> => {
  try {
    const skip = (page - 1) * limit;

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return {
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        }
      };
    }

    // Get reviews with pagination
    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { reviewedUserId: userId },
        select: {
          id: true,
          reviewerId: true,
          reviewedUserId: true,
          rating: true,
          comment: true,
          createdAt: true,
          reviewer: {
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
      prisma.review.count({ where: { reviewedUserId: userId } })
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
    console.error('Get reviews for user error:', error);
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
 * Get review by ID
 */
export const getReviewById = async (reviewId: number): Promise<ServiceResponse<Review>> => {
  try {
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      select: {
        id: true,
        reviewerId: true,
        reviewedUserId: true,
        rating: true,
        comment: true,
        createdAt: true,
        reviewer: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    if (!review) {
      return {
        success: false,
        error: {
          code: 'REVIEW_NOT_FOUND',
          message: 'Review not found'
        }
      };
    }

    return {
      success: true,
      data: review as Review
    };
  } catch (error) {
    console.error('Get review by ID error:', error);
    return {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred while fetching review'
      }
    };
  }
};

/**
 * Get all reviews (admin only)
 */
export const getAllReviews = async (
  page: number = 1,
  limit: number = 10
): Promise<ServiceResponse<{ reviews: Review[]; total: number; page: number; totalPages: number }>> => {
  try {
    const skip = (page - 1) * limit;

    // Get reviews with pagination
    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        select: {
          id: true,
          reviewerId: true,
          reviewedUserId: true,
          rating: true,
          comment: true,
          createdAt: true,
          reviewer: {
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
      prisma.review.count()
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
    console.error('Get all reviews error:', error);
    return {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred while fetching reviews'
      }
    };
  }
};