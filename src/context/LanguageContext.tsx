
import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'ru' | 'en';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

// Translation dictionary
const translations: Record<Language, Record<string, string>> = {
  en: {
    'greeting.morning': 'Good morning',
    'greeting.afternoon': 'Good afternoon',
    'greeting.evening': 'Good evening',
    'greeting.night': 'Good night',
    'search.placeholder': 'What are you looking for?',
    'search.notFound': 'Oops, your book has escaped from us! 😭 The search fell into a book time hole. Maybe it\'s hiding behind the pages of other stories? Let\'s search together again! 📚✨',
    'nav.home': 'Home',
    'nav.favorites': 'Favorites',
    'nav.saved': 'Saved',
    'sidebar.theme': 'Theme',
    'sidebar.language': 'Language',
    'sidebar.logout': 'Logout',
    'login.username': 'Username',
    'login.password': 'Password',
    'login.submit': 'Login',
    'login.welcome': 'Welcome to ReadNest',
  },
  ru: {
    'greeting.morning': 'Доброе утро',
    'greeting.afternoon': 'Добрый день',
    'greeting.evening': 'Добрый вечер',
    'greeting.night': 'Доброй ночи',
    'search.placeholder': 'Что ищем?',
    'search.notFound': 'Увы, твоя книжечка ускользнула от нас! 😭 Поиск попал в книжную яму времени. Может, она прячется за страницами других историй? Давай поищем вместе ещё раз! 📚✨',
    'nav.home': 'Главная',
    'nav.favorites': 'Избранное',
    'nav.saved': 'Сохраненные',
    'sidebar.theme': 'Тема',
    'sidebar.language': 'Язык',
    'sidebar.logout': 'Выйти',
    'login.username': 'Имя пользователя',
    'login.password': 'Пароль',
    'login.submit': 'Войти',
    'login.welcome': 'Добро пожаловать в ReadNest',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    // Initialize from localStorage or browser language
    const savedLang = localStorage.getItem('readnest-language') as Language | null;
    if (savedLang) return savedLang;
    
    // Default to Russian per requirements
    return 'ru';
  });

  useEffect(() => {
    // Update localStorage when language changes
    localStorage.setItem('readnest-language', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prevLang => (prevLang === 'en' ? 'ru' : 'en'));
  };

  // Translation function
  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
