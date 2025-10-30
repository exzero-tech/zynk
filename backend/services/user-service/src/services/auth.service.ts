import { PrismaClient } from '@prisma/client';
import { hashPassword, comparePassword } from '../utils/bcrypt.util';
import { generateTokens, verifyRefreshToken, JWTPayload } from '../utils/jwt.util';
import { validateUserRegistration, validateUserLogin, UserRegistrationData, UserLoginData } from '../utils/validation';

const prisma = new PrismaClient();

export interface AuthResponse {
  success: boolean;
  data?: {
    user: {
      id: number;
      email: string;
      name: string;
      role: string;
      phone?: string;
      profileImageUrl?: string;
      isVerified: boolean;
    };
    token: string;
    refreshToken: string;
  };
  error?: {
    code: string;
    message: string;
  };
}

export interface LoginResponse {
  success: boolean;
  data?: {
    user: {
      id: number;
      email: string;
      name: string;
      role: string;
      phone?: string;
      profileImageUrl?: string;
      isVerified: boolean;
    };
    token: string;
    refreshToken: string;
  };
  error?: {
    code: string;
    message: string;
  };
}

export interface RefreshTokenResponse {
  success: boolean;
  data?: {
    token: string;
  };
  error?: {
    code: string;
    message: string;
  };
}

/**
 * Register a new user
 */
export const registerUser = async (userData: UserRegistrationData): Promise<AuthResponse> => {
  try {
    // Validate input data
    const validation = validateUserRegistration(userData);
    if (!validation.isValid) {
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: validation.errors.join(', ')
        }
      };
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email.toLowerCase() }
    });

    if (existingUser) {
      return {
        success: false,
        error: {
          code: 'USER_EXISTS',
          message: 'User with this email already exists'
        }
      };
    }

    // Hash password
    const hashedPassword = await hashPassword(userData.password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: userData.email.toLowerCase(),
        password: hashedPassword,
        name: userData.name,
        phone: userData.phone,
        role: userData.role
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        profileImageUrl: true,
        isVerified: true
      }
    });

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role as 'driver' | 'host' | 'admin'
    });

    return {
      success: true,
      data: {
        user,
        token: accessToken,
        refreshToken
      }
    };
  } catch (error) {
    console.error('Registration error:', error);
    return {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred during registration'
      }
    };
  }
};

/**
 * Login user
 */
export const loginUser = async (loginData: UserLoginData): Promise<LoginResponse> => {
  try {
    // Validate input data
    const validation = validateUserLogin(loginData);
    if (!validation.isValid) {
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: validation.errors.join(', ')
        }
      };
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: loginData.email.toLowerCase() }
    });

    if (!user) {
      return {
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password'
        }
      };
    }

    // Compare password
    const isPasswordValid = await comparePassword(loginData.password, user.password);
    if (!isPasswordValid) {
      return {
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password'
        }
      };
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role as 'driver' | 'host' | 'admin'
    });

    return {
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          phone: user.phone,
          profileImageUrl: user.profileImageUrl,
          isVerified: user.isVerified
        },
        token: accessToken,
        refreshToken
      }
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred during login'
      }
    };
  }
};

/**
 * Logout user (for JWT, this is mainly client-side, but we can log the event)
 */
export const logoutUser = async (userId: number): Promise<{ success: boolean; message: string }> => {
  try {
    // In a JWT system, logout is mainly handled client-side by removing tokens
    // We could implement token blacklisting here if needed in the future
    console.log(`User ${userId} logged out`);
    return {
      success: true,
      message: 'Logged out successfully'
    };
  } catch (error) {
    console.error('Logout error:', error);
    return {
      success: false,
      message: 'An error occurred during logout'
    };
  }
};

/**
 * Refresh access token using refresh token
 */
export const refreshAccessToken = async (refreshToken: string): Promise<RefreshTokenResponse> => {
  try {
    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      return {
        success: false,
        error: {
          code: 'INVALID_TOKEN',
          message: 'Invalid or expired refresh token'
        }
      };
    }

    // Check if user still exists
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, role: true }
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

    // Generate new access token
    const { accessToken } = generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role as 'driver' | 'host' | 'admin'
    });

    return {
      success: true,
      data: {
        token: accessToken
      }
    };
  } catch (error) {
    console.error('Token refresh error:', error);
    return {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred during token refresh'
      }
    };
  }
};

/**
 * Get user by ID (for token verification)
 */
export const getUserById = async (userId: number) => {
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
        isVerified: true
      }
    });
    return user;
  } catch (error) {
    console.error('Get user by ID error:', error);
    return null;
  }
};