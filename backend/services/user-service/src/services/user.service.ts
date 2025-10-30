import { PrismaClient } from '@prisma/client';
import { validateUserProfileUpdate, UserProfileUpdateData } from '../utils/validation';

const prisma = new PrismaClient();

export interface UserProfile {
  id: number;
  email: string;
  name: string;
  role: string;
  phone?: string;
  profileImageUrl?: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
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
 * Get user profile by user ID
 */
export const getUserProfile = async (userId: number): Promise<ServiceResponse<UserProfile>> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        profileImageUrl: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true
      }
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

    return {
      success: true,
      data: user
    };
  } catch (error) {
    console.error('Get user profile error:', error);
    return {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred while fetching user profile'
      }
    };
  }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (
  userId: number,
  updateData: UserProfileUpdateData
): Promise<ServiceResponse<UserProfile>> => {
  try {
    // Validate input data
    const validation = validateUserProfileUpdate(updateData);
    if (!validation.isValid) {
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: validation.errors.join(', ')
        }
      };
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!existingUser) {
      return {
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        }
      };
    }

    // Prepare update data
    const data: any = {};
    if (updateData.name !== undefined) data.name = updateData.name;
    if (updateData.phone !== undefined) data.phone = updateData.phone;
    if (updateData.profileImageUrl !== undefined) data.profileImageUrl = updateData.profileImageUrl;

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        profileImageUrl: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return {
      success: true,
      data: updatedUser
    };
  } catch (error) {
    console.error('Update user profile error:', error);
    return {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred while updating user profile'
      }
    };
  }
};

/**
 * Get user by ID (admin only)
 */
export const getUserById = async (userId: number): Promise<ServiceResponse<UserProfile>> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        profileImageUrl: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true
      }
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

    return {
      success: true,
      data: user
    };
  } catch (error) {
    console.error('Get user by ID error:', error);
    return {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred while fetching user'
      }
    };
  }
};

/**
 * Delete user (admin only)
 */
export const deleteUser = async (userId: number): Promise<ServiceResponse<{ message: string }>> => {
  try {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!existingUser) {
      return {
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        }
      };
    }

    // Delete user (cascade will handle related records)
    await prisma.user.delete({
      where: { id: userId }
    });

    return {
      success: true,
      data: {
        message: 'User deleted successfully'
      }
    };
  } catch (error) {
    console.error('Delete user error:', error);
    return {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred while deleting user'
      }
    };
  }
};

/**
 * Get all users (admin only, with pagination)
 */
export const getAllUsers = async (
  page: number = 1,
  limit: number = 10,
  role?: string
): Promise<ServiceResponse<{ users: UserProfile[]; total: number; page: number; totalPages: number }>> => {
  try {
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    if (role && ['driver', 'host', 'admin'].includes(role)) {
      where.role = role;
    }

    // Get users
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          phone: true,
          profileImageUrl: true,
          isVerified: true,
          createdAt: true,
          updatedAt: true
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.user.count({ where })
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      data: {
        users,
        total,
        page,
        totalPages
      }
    };
  } catch (error) {
    console.error('Get all users error:', error);
    return {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred while fetching users'
      }
    };
  }
};