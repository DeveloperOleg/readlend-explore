import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, AuthContextType, ProfileUpdateData } from '@/types/auth';
import { useAuthFunctions } from '@/hooks/useAuthFunctions';
import type { Session } from '@supabase/supabase-js';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Load user profile from database
  const loadUserProfile = async (userId: string) => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      const { data: privacySettings } = await supabase
        .from('privacy_settings')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (profile) {
        const userData: User = {
          id: profile.id,
          username: profile.username,
          firstName: profile.first_name || undefined,
          lastName: profile.last_name || undefined,
          avatarUrl: profile.avatar_url || undefined,
          coverImageUrl: profile.cover_image_url || undefined,
          bio: profile.bio || undefined,
          displayId: profile.display_id,
          privacy: {
            hideSubscriptions: privacySettings?.hide_subscriptions || false,
            preventCopying: privacySettings?.prevent_copying || false,
            commentSettings: {
              global: privacySettings?.global_comments_enabled ?? true,
              perBook: {}
            }
          }
        };
        setUser(userData);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  // Initialize auth state
  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        if (session?.user) {
          // Defer profile loading to avoid deadlock
          setTimeout(() => {
            loadUserProfile(session.user.id);
          }, 0);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        loadUserProfile(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Login with email/password
  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // Username is actually email in backend
      const email = username.includes('@') ? username : `${username}@readnest.local`;
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      
      if (data.user) {
        await loadUserProfile(data.user.id);
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Login error:', error.message);
      return false;
    }
  };

  // Register new user
  const register = async (username: string, password: string): Promise<boolean> => {
    try {
      // Create email from username
      const email = username.includes('@') ? username : `${username}@readnest.local`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username
          },
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) throw error;
      
      if (data.user) {
        await loadUserProfile(data.user.id);
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Registration error:', error.message);
      return false;
    }
  };

  // Logout
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setIsAuthenticated(false);
  };

  // Get auth functions from hook
  const authFunctions = useAuthFunctions(user, setUser);

  const contextValue: AuthContextType = {
    user,
    login,
    register,
    logout,
    updateProfile: authFunctions.updateProfile,
    isAuthenticated,
    subscribeToUser: authFunctions.subscribeToUser,
    unsubscribeFromUser: authFunctions.unsubscribeFromUser,
    blockUser: authFunctions.blockUser,
    unblockUser: authFunctions.unblockUser,
    setBookCommentSetting: authFunctions.setBookCommentSetting,
    toggleGlobalComments: authFunctions.toggleGlobalComments,
    toggleHideSubscriptions: authFunctions.toggleHideSubscriptions,
    togglePreventCopying: authFunctions.togglePreventCopying,
    canViewSubscriptions: authFunctions.canViewSubscriptions,
    canCommentOnBook: authFunctions.canCommentOnBook,
    getUserById: authFunctions.getUserById,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
