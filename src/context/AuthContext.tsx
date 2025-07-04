
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { toast } from 'sonner';
import { User, ProfileUpdateData, AuthContextType } from '@/types/auth';
import { generateDisplayId } from '@/utils/authUtils';
import useAuthFunctions from '@/hooks/useAuthFunctions';
import { useInternet } from '@/context/InternetContext';
import { WifiOff } from 'lucide-react';
import { hashPassword, verifyPassword, isPasswordStrong } from '@/utils/passwordUtils';
import { createSession, getSession, clearSession } from '@/utils/sessionUtils';
import { validateUsername, checkRateLimit, resetRateLimit, sanitizeHtml } from '@/utils/validationUtils';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast: uiToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { isOnline } = useInternet();

  useEffect(() => {
    // Check for existing secure session
    const session = getSession();
    if (session) {
      // Try to restore user from session
      const storedUser = localStorage.getItem('readnest-user');
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          if (userData.id === session.userId) {
            setUser(userData);
            setIsAuthenticated(true);
          } else {
            // Session mismatch, clear everything
            clearSession();
            localStorage.removeItem('readnest-user');
          }
        } catch {
          clearSession();
          localStorage.removeItem('readnest-user');
        }
      }
    } else {
      // Clear any old localStorage data if no valid session
      const storedUser = localStorage.getItem('readnest-user');
      if (storedUser) {
        localStorage.removeItem('readnest-user');
      }
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

    // Rate limiting for login attempts
    const rateLimitKey = `login_${username}`;
    if (!checkRateLimit(rateLimitKey, 5, 15 * 60 * 1000)) {
      uiToast({
        title: "Слишком много попыток входа",
        description: "Попробуйте снова через 15 минут",
        variant: "destructive",
      });
      return false;
    }

    // Validate input
    const usernameValidation = validateUsername(username);
    if (!usernameValidation.isValid) {
      uiToast({
        title: "Ошибка входа",
        description: usernameValidation.message,
        variant: "destructive",
      });
      return false;
    }

    // Sanitize username
    const cleanUsername = sanitizeHtml(username.trim());

    // For demo, check against hardcoded test account first
    if (cleanUsername === 'tester111' && password === 'tester111') {
      const testDisplayId = '123456';
      
      const userData: User = { 
        id: 'user-1234-5678-9012',
        username: cleanUsername,
        displayId: testDisplayId,
        subscriptions: [],
        subscribers: [],
        blockedUsers: [],
        publishedBooks: [],
        isTestAccount: true,
        banStatus: undefined,
        privacy: {
          hideSubscriptions: false,
          preventCopying: false,
          commentSettings: {
            global: true,
            perBook: {}
          }
        }
      };
      
      setUser(userData);
      setIsAuthenticated(true);
      
      // Create secure session
      createSession(userData.id, userData.username);
      localStorage.setItem('readnest-user', JSON.stringify(userData));
      
      // Reset rate limit on successful login
      resetRateLimit(rateLimitKey);
      
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

    // Check for stored real accounts with hashed passwords
    const storedAccounts = localStorage.getItem('readnest-accounts') || '{}';
    const accounts = JSON.parse(storedAccounts);
    
    if (accounts[cleanUsername]) {
      const storedAccount = accounts[cleanUsername];
      
      // Check if password is already hashed (new format) or plain text (old format)
      let passwordMatches = false;
      
      if (storedAccount.isHashed) {
        // New secure format
        passwordMatches = await verifyPassword(password, storedAccount.password);
      } else {
        // Old plain text format - check and migrate
        if (storedAccount.password === password) {
          passwordMatches = true;
          // Migrate to hashed password
          const hashedPwd = await hashPassword(password);
          accounts[cleanUsername] = {
            ...storedAccount,
            password: hashedPwd,
            isHashed: true
          };
          localStorage.setItem('readnest-accounts', JSON.stringify(accounts));
        }
      }
      
      if (passwordMatches) {
        const userData = storedAccount.userData;
        setUser(userData);
        setIsAuthenticated(true);
        
        // Create secure session
        createSession(userData.id, userData.username);
        localStorage.setItem('readnest-user', JSON.stringify(userData));
        
        // Reset rate limit on successful login
        resetRateLimit(rateLimitKey);
        
        uiToast({
          title: "Успешный вход",
          description: "Вы успешно вошли в свой аккаунт.",
        });
        
        navigate('/home');
        return true;
      }
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

    // Validate username
    const usernameValidation = validateUsername(username);
    if (!usernameValidation.isValid) {
      uiToast({
        title: "Ошибка регистрации",
        description: usernameValidation.message,
        variant: "destructive",
      });
      return false;
    }

    // Validate password strength
    const passwordValidation = isPasswordStrong(password);
    if (!passwordValidation.isStrong) {
      uiToast({
        title: "Ошибка регистрации",
        description: passwordValidation.message,
        variant: "destructive",
      });
      return false;
    }

    // Sanitize username
    const cleanUsername = sanitizeHtml(username.trim());
    
    // Check if username already exists
    const storedAccounts = localStorage.getItem('readnest-accounts') || '{}';
    const accounts = JSON.parse(storedAccounts);
    
    if (accounts[cleanUsername] || cleanUsername === 'tester111') {
      uiToast({
        title: "Ошибка регистрации",
        description: "Пользователь с таким именем уже существует.",
        variant: "destructive",
      });
      return false;
    }
    
    // Create new user with hashed password
    const userId = `user-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const displayId = generateDisplayId();
    const hashedPwd = await hashPassword(password);
    
    const userData: User = {
      id: userId,
      username: cleanUsername,
      displayId,
      subscriptions: [],
      subscribers: [],
      blockedUsers: [],
      publishedBooks: [],
      isTestAccount: false,
      privacy: {
        hideSubscriptions: false,
        preventCopying: false,
        commentSettings: {
          global: true,
          perBook: {}
        }
      }
    };
    
    // Store account with hashed password
    accounts[cleanUsername] = {
      password: hashedPwd,
      isHashed: true,
      userData
    };
    
    localStorage.setItem('readnest-accounts', JSON.stringify(accounts));
    
    // Auto login with secure session
    setUser(userData);
    setIsAuthenticated(true);
    createSession(userData.id, userData.username);
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
    
    // Clear secure session
    clearSession();
    
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
