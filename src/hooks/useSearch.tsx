
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { searchTestAuthors, searchTestBooks } from '@/utils/testData';
import { toast } from 'sonner';
import { useLanguage } from '@/context/LanguageContext';

type SearchType = 'books' | 'authors';

export const useSearch = () => {
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [showEmpty, setShowEmpty] = useState(false);
  const [searchType, setSearchType] = useState<SearchType>('books');
  const [authorResults, setAuthorResults] = useState<any[]>([]);
  const [bookResults, setBookResults] = useState<any[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  
  const { user } = useAuth();
  const { t } = useLanguage();
  const isTestAccount = user?.username === 'tester111';

  // Load search history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save search history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  }, [searchHistory]);

  const addToHistory = (searchTerm: string) => {
    if (!searchTerm.trim()) return;
    
    const newHistory = [searchTerm, ...searchHistory.filter(item => item !== searchTerm)].slice(0, 10);
    setSearchHistory(newHistory);
  };

  const clearHistory = () => {
    setSearchHistory([]);
    setShowHistory(false);
    toast.success(t('search.historyCleared'));
  };

  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    addToHistory(searchQuery.trim());
    setSearching(true);
    setShowHistory(false);
    
    setTimeout(() => {
      setSearching(false);
      
      if (isTestAccount) {
        // Search both books and authors simultaneously
        const bookResults = searchTestBooks(searchQuery);
        const authorResults = searchTestAuthors(searchQuery);
        
        setBookResults(bookResults);
        setAuthorResults(authorResults);
        
        // Show empty state only if no results found in either category
        setShowEmpty(bookResults.length === 0 && authorResults.length === 0);
        
        // Set search type based on which has more results, defaulting to books
        if (authorResults.length > bookResults.length) {
          setSearchType('authors');
        } else {
          setSearchType('books');
        }
      } else {
        setShowEmpty(true);
      }
    }, 800);
  };

  const clearResults = () => {
    setShowEmpty(false);
    setAuthorResults([]);
    setBookResults([]);
  };

  return {
    query,
    setQuery,
    searching,
    showEmpty,
    setShowEmpty,
    searchType,
    setSearchType,
    authorResults,
    setAuthorResults,
    bookResults,
    setBookResults,
    searchHistory,
    showHistory,
    setShowHistory,
    handleSearch,
    clearHistory,
    clearResults,
    isTestAccount,
  };
};
