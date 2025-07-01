
/**
 * Password utility functions for secure password handling
 */

// Simple hash function for demo purposes - in production use bcrypt or similar
export const hashPassword = async (password: string): Promise<string> => {
  // Using Web Crypto API for hashing (available in browsers)
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'readnest_salt_2025'); // Add salt
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  const inputHash = await hashPassword(password);
  return inputHash === hashedPassword;
};

export const generateSecureToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

export const isPasswordStrong = (password: string): { isStrong: boolean; message: string } => {
  if (password.length < 8) {
    return { isStrong: false, message: 'Пароль должен содержать не менее 8 символов' };
  }
  
  if (!/[A-Z]/.test(password)) {
    return { isStrong: false, message: 'Пароль должен содержать заглавную букву' };
  }
  
  if (!/[a-z]/.test(password)) {
    return { isStrong: false, message: 'Пароль должен содержать строчную букву' };
  }
  
  if (!/[0-9]/.test(password)) {
    return { isStrong: false, message: 'Пароль должен содержать цифру' };
  }
  
  return { isStrong: true, message: 'Пароль достаточно надежный' };
};
