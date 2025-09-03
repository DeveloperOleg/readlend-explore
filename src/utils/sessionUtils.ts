
/**
 * Session management utilities for secure authentication
 */

interface SessionData {
  userId: string;
  username: string;
  expiresAt: number;
  token: string;
}

const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours
const SESSION_KEY = 'readnest_session';

export const createSession = (userId: string, username: string): SessionData => {
  // Validate inputs
  if (!userId?.trim() || !username?.trim()) {
    throw new Error('Invalid session data');
  }
  
  // Generate cryptographically secure token
  const tokenArray = new Uint8Array(32);
  crypto.getRandomValues(tokenArray);
  const token = Array.from(tokenArray, byte => byte.toString(16).padStart(2, '0')).join('');
  
  const session: SessionData = {
    userId: userId.trim(),
    username: username.trim(),
    expiresAt: Date.now() + SESSION_DURATION,
    token
  };
  
  try {
    // Store session securely
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
  } catch (error) {
    throw new Error('Failed to create session');
  }
};

export const getSession = (): SessionData | null => {
  try {
    const sessionStr = sessionStorage.getItem(SESSION_KEY);
    if (!sessionStr) return null;
    
    const session: SessionData = JSON.parse(sessionStr);
    
    // Check if session is expired
    if (Date.now() > session.expiresAt) {
      clearSession();
      return null;
    }
    
    return session;
  } catch {
    clearSession();
    return null;
  }
};

export const clearSession = (): void => {
  sessionStorage.removeItem(SESSION_KEY);
  localStorage.removeItem('readnest-user'); // Clear old storage too
};

export const refreshSession = (session: SessionData): SessionData => {
  const refreshedSession = {
    ...session,
    expiresAt: Date.now() + SESSION_DURATION
  };
  
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(refreshedSession));
  return refreshedSession;
};
