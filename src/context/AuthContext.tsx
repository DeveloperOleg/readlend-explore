
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { toast } from 'sonner';
import { User, ProfileUpdateData, AuthContextType } from '@/types/auth';
import { generateDisplayId } from '@/utils/authUtils';
import useAuthFunctions from '@/hooks/useAuthFunctions';
import { useInternet } from '@/context/InternetContext';
import { WifiOff } from 'lucide-react';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast: uiToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { isOnline } = useInternet();

  useEffect(() => {
    // Check for existing user in localStorage
    const storedUser = localStorage.getItem('readnest-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    if (!isOnline) {
      toast.error("Вход невозможен", {
        description: "Для входа в аккаунт требуется подключение к интернету",
        icon: <WifiOff className="h-4 w-4" />,
      });
      return false;
    }

    // For demo, check against hardcoded credentials for test account
    if (username === 'tester111' && password === 'tester111') {
      // Ensure we have a fixed test displayId for the demo account
      const testDisplayId = '123456'; // Fixed 6-digit ID for test account
      
      const userData: User = { 
        id: 'user-1234-5678-9012',
        username,
        displayId: testDisplayId,
        subscriptions: [],
        subscribers: [],
        blockedUsers: [],
        publishedBooks: [],
        isTestAccount: true, // Mark as test account
        banStatus: undefined, // User is not banned
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
      
      uiToast({
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
      
      navigate('/home');
      return true;
    }

    // Check for stored real accounts
    const storedAccounts = localStorage.getItem('readnest-accounts') || '{}';
    const accounts = JSON.parse(storedAccounts);
    
    if (accounts[username] && accounts[username].password === password) {
      const userData = accounts[username].userData;
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('readnest-user', JSON.stringify(userData));
      
      uiToast({
        title: "Успешный вход",
        description: "Вы успешно вошли в свой аккаунт.",
      });
      
      navigate('/home');
      return true;
    }
    
    uiToast({
      title: "Ошибка входа",
      description: "Неверный логин или пароль. Попробуйте снова.",
      variant: "destructive",
    });
    return false;
  };

  const register = async (username: string, password: string): Promise<boolean> => {
    if (!isOnline) {
      toast.error("Регистрация невозможна", {
        description: "Для регистрации требуется подключение к интернету",
        icon: <WifiOff className="h-4 w-4" />,
      });
      return false;
    }

    // Validate username and password
    if (username.length < 3 || password.length < 6) {
      uiToast({
        title: "Ошибка регистрации",
        description: "Имя пользователя должно содержать не менее 3 символов, а пароль - не менее 6 символов.",
        variant: "destructive",
      });
      return false;
    }
    
    // Check if username already exists
    const storedAccounts = localStorage.getItem('readnest-accounts') || '{}';
    const accounts = JSON.parse(storedAccounts);
    
    if (accounts[username] || username === 'tester111') {
      uiToast({
        title: "Ошибка регистрации",
        description: "Пользователь с таким именем уже существует.",
        variant: "destructive",
      });
      return false;
    }
    
    // Create new user
    const userId = `user-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const displayId = generateDisplayId();
    
    const userData: User = {
      id: userId,
      username,
      displayId,
      subscriptions: [],
      subscribers: [],
      blockedUsers: [],
      publishedBooks: [],
      isTestAccount: false, // Regular account, not a test one
      privacy: {
        hideSubscriptions: false,
        commentSettings: {
          global: true,
          perBook: {}
        }
      }
    };
    
    // Store account
    accounts[username] = {
      password,
      userData
    };
    
    localStorage.setItem('readnest-accounts', JSON.stringify(accounts));
    
    // Auto login
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('readnest-user', JSON.stringify(userData));
    
    uiToast({
      title: "Регистрация успешна",
      description: "Ваш аккаунт успешно создан. Добро пожаловать!",
    });
    
    navigate('/home');
    return true;
  };

  const logout = () => {
    if (!isOnline) {
      toast.error("Выход из аккаунта невозможен", {
        description: "Для выхода из аккаунта требуется подключение к интернету",
        icon: <WifiOff className="h-4 w-4" />,
      });
      return;
    }

    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('readnest-user');
    
    // После выхода перенаправляем на страницу входа
    navigate('/', { replace: true });
  };

  const authFunctions = useAuthFunctions(user, setUser);

  return (
    <AuthContext.Provider value={{ 
      user, 
      login,
      register, 
      logout, 
      isAuthenticated,
      ...authFunctions
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
