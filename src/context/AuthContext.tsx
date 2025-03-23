
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";

// User type definition
interface User {
  id: string;
  username: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  displayId: string; // 6-digit ID
  subscriptions?: string[]; // IDs of users this user is subscribed to
  subscribers?: string[]; // IDs of users subscribed to this user
  blockedUsers?: string[]; // IDs of users this user has blocked
  publishedBooks?: string[]; // IDs of books published by this user
  privacy: {
    hideSubscriptions: boolean;
    commentSettings: {
      global: boolean; // true = enabled, false = disabled
      perBook: Record<string, boolean>; // bookId: boolean (true = enabled, false = disabled)
    };
  };
}

interface ProfileUpdateData {
  username?: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  privacy?: {
    hideSubscriptions?: boolean;
    commentSettings?: {
      global?: boolean;
      perBook?: Record<string, boolean>;
    };
  };
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: ProfileUpdateData) => Promise<boolean>;
  isAuthenticated: boolean;
  subscribeToUser: (userId: string) => Promise<boolean>;
  unsubscribeFromUser: (userId: string) => Promise<boolean>;
  blockUser: (userId: string) => Promise<boolean>;
  unblockUser: (userId: string) => Promise<boolean>;
  setBookCommentSetting: (bookId: string, enabled: boolean) => Promise<boolean>;
  toggleGlobalComments: (enabled: boolean) => Promise<boolean>;
  toggleHideSubscriptions: (hide: boolean) => Promise<boolean>;
  canViewSubscriptions: (userId: string) => boolean;
  canCommentOnBook: (bookId: string, authorId: string) => boolean;
}

// Generate random 6-digit ID
const generateDisplayId = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check for existing user in localStorage
    const storedUser = localStorage.getItem('readnest-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // For demo, just check against hardcoded credentials
    if (username === 'tester111' && password === 'tester111') {
      const userData: User = { 
        id: 'user-1234-5678-9012',
        username,
        displayId: generateDisplayId(),
        subscriptions: [],
        subscribers: [],
        blockedUsers: [],
        publishedBooks: [],
        privacy: {
          hideSubscriptions: false,
          commentSettings: {
            global: true,
            perBook: {}
          }
        }
      };
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('readnest-user', JSON.stringify(userData));
      
      toast({
        title: "Успешный вход",
        description: (
          <div className="mt-2 leading-normal">
            <p className="mb-2">Привет, дорогие пользователи!</p>
            <p className="mb-2">Мы рады представить вам прототип нашей новой версии приложения! Это ранняя версия, и мы хотим, чтобы вы стали частью нашего пути к улучшению. Ваши отзывы и предложения помогут нам сделать приложение еще лучше.</p>
            <p className="mb-2">Наш закрытый телеграм чат для тестирования <a href="https://t.me/+LeR5l4MeHVE4NjBi" className="text-primary underline" target="_blank" rel="noopener noreferrer">https://t.me/+LeR5l4MeHVE4NjBi</a></p>
            <p>Обратите внимание, что некоторые функции могут работать нестабильно, а интерфейс может измениться. Мы ценим ваше терпение и поддержку в этом процессе!</p>
          </div>
        ),
        duration: 10000,
      });
      
      return true;
    } else {
      toast({
        title: "Ошибка входа",
        description: "Неверный логин или пароль. Попробуйте снова.",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateProfile = async (data: ProfileUpdateData): Promise<boolean> => {
    if (!user) return false;

    try {
      // In a real app, you would make an API call here
      // For demo, we'll just update the local state
      const updatedUser = {
        ...user,
        ...(data.username && { username: data.username }),
        ...(data.firstName !== undefined && { firstName: data.firstName }),
        ...(data.lastName !== undefined && { lastName: data.lastName }),
        ...(data.avatarUrl && { avatarUrl: data.avatarUrl }),
        privacy: {
          ...user.privacy,
          ...(data.privacy?.hideSubscriptions !== undefined && {
            hideSubscriptions: data.privacy.hideSubscriptions
          }),
          commentSettings: {
            ...user.privacy.commentSettings,
            ...(data.privacy?.commentSettings?.global !== undefined && {
              global: data.privacy.commentSettings.global
            }),
            ...(data.privacy?.commentSettings?.perBook && {
              perBook: {
                ...user.privacy.commentSettings.perBook,
                ...data.privacy.commentSettings.perBook
              }
            })
          }
        }
      };
      
      setUser(updatedUser);
      localStorage.setItem('readnest-user', JSON.stringify(updatedUser));
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      return false;
    }
  };

  const subscribeToUser = async (userId: string): Promise<boolean> => {
    if (!user) return false;
    
    try {
      // Check if already subscribed
      if (user.subscriptions?.includes(userId)) {
        return true;
      }
      
      // In a real app, you would make an API call here
      const updatedUser = {
        ...user,
        subscriptions: [...(user.subscriptions || []), userId]
      };
      
      setUser(updatedUser);
      localStorage.setItem('readnest-user', JSON.stringify(updatedUser));
      return true;
    } catch (error) {
      console.error('Error subscribing to user:', error);
      return false;
    }
  };
  
  const unsubscribeFromUser = async (userId: string): Promise<boolean> => {
    if (!user || !user.subscriptions) return false;
    
    try {
      const updatedUser = {
        ...user,
        subscriptions: user.subscriptions.filter(id => id !== userId)
      };
      
      setUser(updatedUser);
      localStorage.setItem('readnest-user', JSON.stringify(updatedUser));
      return true;
    } catch (error) {
      console.error('Error unsubscribing from user:', error);
      return false;
    }
  };
  
  const blockUser = async (userId: string): Promise<boolean> => {
    if (!user) return false;
    
    try {
      // Check if already blocked
      if (user.blockedUsers?.includes(userId)) {
        return true;
      }
      
      // If we block someone, we should unsubscribe from them
      let updatedSubscriptions = user.subscriptions || [];
      if (updatedSubscriptions.includes(userId)) {
        updatedSubscriptions = updatedSubscriptions.filter(id => id !== userId);
      }
      
      const updatedUser = {
        ...user,
        subscriptions: updatedSubscriptions,
        blockedUsers: [...(user.blockedUsers || []), userId]
      };
      
      setUser(updatedUser);
      localStorage.setItem('readnest-user', JSON.stringify(updatedUser));
      return true;
    } catch (error) {
      console.error('Error blocking user:', error);
      return false;
    }
  };
  
  const unblockUser = async (userId: string): Promise<boolean> => {
    if (!user || !user.blockedUsers) return false;
    
    try {
      const updatedUser = {
        ...user,
        blockedUsers: user.blockedUsers.filter(id => id !== userId)
      };
      
      setUser(updatedUser);
      localStorage.setItem('readnest-user', JSON.stringify(updatedUser));
      return true;
    } catch (error) {
      console.error('Error unblocking user:', error);
      return false;
    }
  };

  // New privacy and comment settings methods
  const toggleHideSubscriptions = async (hide: boolean): Promise<boolean> => {
    return updateProfile({
      privacy: {
        hideSubscriptions: hide
      }
    });
  };

  const toggleGlobalComments = async (enabled: boolean): Promise<boolean> => {
    return updateProfile({
      privacy: {
        commentSettings: {
          global: enabled
        }
      }
    });
  };

  const setBookCommentSetting = async (bookId: string, enabled: boolean): Promise<boolean> => {
    if (!user) return false;

    const perBook = {
      ...user.privacy.commentSettings.perBook,
      [bookId]: enabled
    };

    return updateProfile({
      privacy: {
        commentSettings: {
          perBook
        }
      }
    });
  };

  // Helper functions for checking permissions
  const canViewSubscriptions = (userId: string): boolean => {
    if (!user) return false;
    
    // If it's the current user, they can see their own subscriptions
    if (user.id === userId) return true;
    
    // Find the user in our mock data (in a real app this would be an API call)
    // For demo, we'll simulate that the user exists and check their privacy settings
    const targetUser = {
      id: userId,
      privacy: {
        hideSubscriptions: true // This would come from a database in a real app
      }
    };
    
    return !targetUser.privacy.hideSubscriptions;
  };

  const canCommentOnBook = (bookId: string, authorId: string): boolean => {
    if (!user) return false;
    
    // For demo, we'll simulate getting the author's settings
    // In a real app, this would be an API call
    const author = authorId === user.id ? user : {
      id: authorId,
      privacy: {
        commentSettings: {
          global: true,
          perBook: {
            [bookId]: undefined // This would come from database
          }
        }
      }
    };
    
    // Check per-book setting first, then fall back to global setting
    const perBookSetting = author.privacy.commentSettings.perBook[bookId];
    return perBookSetting !== undefined ? perBookSetting : author.privacy.commentSettings.global;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('readnest-user');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      updateProfile, 
      isAuthenticated,
      subscribeToUser,
      unsubscribeFromUser,
      blockUser,
      unblockUser,
      toggleHideSubscriptions,
      toggleGlobalComments,
      setBookCommentSetting,
      canViewSubscriptions,
      canCommentOnBook
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
