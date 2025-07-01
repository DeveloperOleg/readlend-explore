
/**
 * Input validation and sanitization utilities
 */

// Basic XSS prevention - sanitize HTML content
export const sanitizeHtml = (input: string): string => {
  // Remove script tags and javascript: protocols
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/<iframe/gi, '&lt;iframe')
    .replace(/<object/gi, '&lt;object')
    .replace(/<embed/gi, '&lt;embed');
};

// Validate username format
export const validateUsername = (username: string): { isValid: boolean; message: string } => {
  if (!username || username.trim().length === 0) {
    return { isValid: false, message: 'Имя пользователя не может быть пустым' };
  }
  
  if (username.length < 3) {
    return { isValid: false, message: 'Имя пользователя должно содержать не менее 3 символов' };
  }
  
  if (username.length > 20) {
    return { isValid: false, message: 'Имя пользователя должно содержать не более 20 символов' };
  }
  
  if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(username)) {
    return { isValid: false, message: 'Имя пользователя должно начинаться с буквы и содержать только латинские буквы, цифры и подчеркивания' };
  }
  
  return { isValid: true, message: '' };
};

// Validate and sanitize bio content
export const validateBio = (bio: string): { isValid: boolean; sanitized: string; message: string } => {
  if (bio.length > 500) {
    return { isValid: false, sanitized: bio, message: 'Биография не может содержать более 500 символов' };
  }
  
  const sanitized = sanitizeHtml(bio);
  return { isValid: true, sanitized, message: '' };
};

// Rate limiting utility
const rateLimits = new Map<string, { count: number; resetTime: number }>();

export const checkRateLimit = (key: string, maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000): boolean => {
  const now = Date.now();
  const limit = rateLimits.get(key);
  
  if (!limit || now > limit.resetTime) {
    rateLimits.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (limit.count >= maxAttempts) {
    return false;
  }
  
  limit.count++;
  return true;
};

export const resetRateLimit = (key: string): void => {
  rateLimits.delete(key);
};
