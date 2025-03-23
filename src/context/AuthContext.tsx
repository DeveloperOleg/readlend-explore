
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";

// User type definition
interface User {
  id: string;
  username: string;
  avatarUrl?: string;
  subscriptions?: string[]; // IDs of users this user is subscribed to
  subscribers?: string[]; // IDs of users subscribed to this user
  blockedUsers?: string[]; // IDs of users this user has blocked
  publishedBooks?: string[]; // IDs of books published by this user
}

interface ProfileUpdateData {
  username: string;
  avatarUrl?: string;
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
}

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
        subscriptions: [],
        subscribers: [],
        blockedUsers: [],
        publishedBooks: []
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
        ...data
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
      unblockUser
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
