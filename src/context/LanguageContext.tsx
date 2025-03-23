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
    'search.tryAgain': 'Try different keywords or browse our categories',
    'nav.home': 'Home',
    'nav.favorites': 'Favorites',
    'nav.saved': 'Saved',
    'sidebar.theme': 'Theme',
    'sidebar.language': 'Language',
    'sidebar.logout': 'Logout',
    'sidebar.settings': 'Settings',
    'login.username': 'Username',
    'login.password': 'Password',
    'login.submit': 'Login',
    'login.welcome': 'Welcome to ReadNest',
    'settings.title': 'App Settings',
    'settings.appearance': 'Appearance',
    'settings.darkMode': 'Dark Mode',
    'settings.open': 'Open Settings',
    'settings.version': 'App Version',
    'settings.versionNumber': '1.0.0',
    'settings.earlyVersion': 'This is an early version',
    'editor.bold': 'Bold',
    'editor.italic': 'Italic',
    'editor.underline': 'Underline',
    'editor.strikethrough': 'Strikethrough',
    'editor.color': 'Color',
    'editor.applyColor': 'Apply color',
    'editor.writeSomething': 'Write something here...',
    'editor.formatting': 'Supported formatting',
    'publish.title': 'Publish a book',
    'publish.description': 'Fill in the information about your book and edit the content before publishing.',
    'publish.bookInfo': 'Book Information',
    'publish.bookContent': 'Book Content',
    'publish.bookTitle': 'Book Title',
    'publish.titlePlaceholder': 'Enter book title',
    'publish.author': 'Author',
    'publish.authorPlaceholder': 'Enter author name',
    'publish.coverImage': 'Book Cover',
    'publish.cover': 'Cover',
    'publish.changeCover': 'Change cover',
    'publish.dropImage': 'Drop image here or click to select',
    'publish.selectImage': 'Select image',
    'publish.recommendedSize': 'Recommended size: 800×1200 pixels',
    'publish.content': 'Book Content',
    'publish.cancel': 'Cancel',
    'publish.publish': 'Publish'
  },
  ru: {
    'greeting.morning': 'Доброе утро',
    'greeting.afternoon': 'Добрый день',
    'greeting.evening': 'Добрый вечер',
    'greeting.night': 'Доброй ночи',
    'search.placeholder': 'Что ищем?',
    'search.notFound': 'Увы, твоя книжечка ускользнула от нас! 😭 Поиск попал в книжную яму времени. Может, она прячется за страницами других историй? Давай поищем вместе ещё раз! 📚✨',
    'search.tryAgain': 'Попробуйте другие ключевые слова или просмотрите наши категории',
    'nav.home': 'Главная',
    'nav.favorites': 'Избранное',
    'nav.saved': 'Сохраненные',
    'sidebar.theme': 'Тема',
    'sidebar.language': 'Язык',
    'sidebar.logout': 'Выйти',
    'sidebar.settings': 'Настройки',
    'login.username': 'Имя пользователя',
    'login.password': 'Пароль',
    'login.submit': 'Войти',
    'login.welcome': 'Добро пожаловать в ReadNest',
    'settings.title': 'Настройки приложения',
    'settings.appearance': 'Внешний вид',
    'settings.darkMode': 'Темная тема',
    'settings.open': 'Открыть настройки',
    'settings.version': 'Версия приложения',
    'settings.versionNumber': '1.0.0',
    'settings.earlyVersion': 'Это ранняя версия',
    'editor.bold': 'Жирный',
    'editor.italic': 'Курсив',
    'editor.underline': 'Подчеркнутый',
    'editor.strikethrough': 'Зачеркнутый',
    'editor.color': 'Цвет',
    'editor.applyColor': 'Применить цвет',
    'editor.writeSomething': 'Напишите что-нибудь здесь...',
    'editor.formatting': 'Поддерживаемое форматирование',
    'publish.title': 'Опубликовать книгу',
    'publish.description': 'Заполните информацию о вашей книге и отредактируйте содержимое перед публикацией.',
    'publish.bookInfo': 'Информация о книге',
    'publish.bookContent': 'Содержание книги',
    'publish.bookTitle': 'Название книги',
    'publish.titlePlaceholder': 'Введите название книги',
    'publish.author': 'Автор',
    'publish.authorPlaceholder': 'Введите имя автора',
    'publish.coverImage': 'Обложка книги',
    'publish.cover': 'Обложка',
    'publish.changeCover': 'Изменить обложку',
    'publish.dropImage': 'Перетащите изображение сюда или нажмите для выбора',
    'publish.selectImage': 'Выбрать изображение',
    'publish.recommendedSize': 'Рекомендуемый размер: 800×1200 пикселей',
    'publish.content': 'Содержание книги',
    'publish.cancel': 'Отмена',
    'publish.publish': 'Опубликовать'
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
