
import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';

const searchTerms = {
  ru: [
    'Поиск книг',
    'Поиск автора',
    'Поиск фанфиков',
    'Поиск манги',
    'Поиск комиксов'
  ],
  en: [
    'Book Search',
    'Author Search',
    'Fanfiction Search',
    'Manga Search',
    'Comics Search'
  ]
};

export const useTypingEffect = () => {
  const { language } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    const terms = searchTerms[language];
    const currentTerm = terms[currentIndex];
    
    let timeout: NodeJS.Timeout;

    if (isTyping) {
      // Typing phase
      if (currentText.length < currentTerm.length) {
        timeout = setTimeout(() => {
          setCurrentText(currentTerm.slice(0, currentText.length + 1));
        }, 100);
      } else {
        // Wait before starting to erase
        timeout = setTimeout(() => {
          setIsTyping(false);
        }, 2000);
      }
    } else {
      // Erasing phase
      if (currentText.length > 0) {
        timeout = setTimeout(() => {
          setCurrentText(currentText.slice(0, -1));
        }, 50);
      } else {
        // Move to next term and start typing
        setCurrentIndex((prev) => (prev + 1) % terms.length);
        setIsTyping(true);
      }
    }

    return () => clearTimeout(timeout);
  }, [currentText, isTyping, currentIndex, language]);

  return currentText;
};
