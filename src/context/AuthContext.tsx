
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  username: string;
  avatarUrl?: string;
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
      const userData = { 
        id: 'user-1234-5678-9012',
        username 
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

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('readnest-user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateProfile, isAuthenticated }}>
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
