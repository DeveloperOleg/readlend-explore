
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
  const token = crypto.getRandomValues(new Uint8Array(32)).reduce((acc, byte) => 
    acc + byte.toString(16).padStart(2, '0'), '');
  
  const session: SessionData = {
    userId,
    username,
    expiresAt: Date.now() + SESSION_DURATION,
    token
  };
  
  // Store session securely
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
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
