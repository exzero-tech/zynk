/**
 * Validation utilities for user management
 */

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Password requirements
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;

// Phone validation (Sri Lankan format)
const PHONE_REGEX = /^(\+94|0)[0-9]{9}$/;

/**
 * Validate email format
 */
export const validateEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') return false;
  return EMAIL_REGEX.test(email.trim());
};

/**
 * Validate password strength
 * Requirements: min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
 */
export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!password || typeof password !== 'string') {
    errors.push('Password is required');
    return { isValid: false, errors };
  }

  if (password.length < PASSWORD_MIN_LENGTH) {
    errors.push(`Password must be at least ${PASSWORD_MIN_LENGTH} characters long`);
  }

  if (!PASSWORD_REGEX.test(password)) {
    errors.push('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character');
  }

  return { isValid: errors.length === 0, errors };
};

/**
 * Validate phone number (Sri Lankan format)
 */
export const validatePhone = (phone: string): boolean => {
  if (!phone) return true; // Phone is optional
  if (typeof phone !== 'string') return false;
  return PHONE_REGEX.test(phone.trim());
};

/**
 * Validate user role
 */
export const validateRole = (role: string): boolean => {
  return ['driver', 'host', 'admin'].includes(role);
};

/**
 * Validate user name
 */
export const validateName = (name: string): boolean => {
  if (!name || typeof name !== 'string') return false;
  const trimmed = name.trim();
  return trimmed.length >= 2 && trimmed.length <= 255;
};

/**
 * Sanitize string input (basic sanitization)
 */
export const sanitizeString = (input: string): string => {
  if (!input || typeof input !== 'string') return '';
  return input.trim().replace(/[<>]/g, ''); // Basic XSS prevention
};

/**
 * Validate user registration data
 */
export interface UserRegistrationData {
  email: string;
  password: string;
  name: string;
  phone?: string;
  role: 'driver' | 'host';
}

export const validateUserRegistration = (data: UserRegistrationData): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Email validation
  if (!validateEmail(data.email)) {
    errors.push('Invalid email format');
  }

  // Password validation
  const passwordValidation = validatePassword(data.password);
  if (!passwordValidation.isValid) {
    errors.push(...passwordValidation.errors);
  }

  // Name validation
  if (!validateName(data.name)) {
    errors.push('Name must be between 2 and 255 characters');
  }

  // Phone validation (optional)
  if (data.phone && !validatePhone(data.phone)) {
    errors.push('Invalid phone number format (use Sri Lankan format)');
  }

  // Role validation
  if (!validateRole(data.role)) {
    errors.push('Invalid role. Must be driver or host');
  }

  return { isValid: errors.length === 0, errors };
};

/**
 * Validate user login data
 */
export interface UserLoginData {
  email: string;
  password: string;
}

export const validateUserLogin = (data: UserLoginData): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!validateEmail(data.email)) {
    errors.push('Invalid email format');
  }

  if (!data.password || typeof data.password !== 'string' || data.password.length === 0) {
    errors.push('Password is required');
  }

  return { isValid: errors.length === 0, errors };
};

/**
 * Validate review data
 */
export interface ReviewData {
  chargerId: number;
  sessionId: number;
  rating: number;
  comment?: string;
}

export const validateReview = (data: ReviewData): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!data.chargerId || typeof data.chargerId !== 'number' || data.chargerId <= 0) {
    errors.push('Valid charger ID is required');
  }

  if (!data.sessionId || typeof data.sessionId !== 'number' || data.sessionId <= 0) {
    errors.push('Valid session ID is required');
  }

  if (!data.rating || typeof data.rating !== 'number' || data.rating < 1 || data.rating > 5) {
    errors.push('Rating must be between 1 and 5');
  }

  if (data.comment && typeof data.comment === 'string' && data.comment.length > 1000) {
    errors.push('Comment must be less than 1000 characters');
  }

  return { isValid: errors.length === 0, errors };
};

/**
 * Validate user profile update data
 */
export interface UserProfileUpdateData {
  name?: string;
  phone?: string;
  profileImageUrl?: string;
}

export const validateUserProfileUpdate = (data: UserProfileUpdateData): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (data.name !== undefined && !validateName(data.name)) {
    errors.push('Name must be between 2 and 255 characters');
  }

  if (data.phone !== undefined && data.phone !== null && !validatePhone(data.phone)) {
    errors.push('Invalid phone number format');
  }

  if (data.profileImageUrl && typeof data.profileImageUrl !== 'string') {
    errors.push('Profile image URL must be a string');
  }

  return { isValid: errors.length === 0, errors };
};