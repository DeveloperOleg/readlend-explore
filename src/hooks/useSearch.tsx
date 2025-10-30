
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { searchTestAuthors, searchTestBooks } from '@/utils/testData';
import { toast } from 'sonner';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/integrations/supabase/client';

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

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    addToHistory(searchQuery.trim());
    setSearching(true);
    setShowHistory(false);
    setShowEmpty(false);
    
    try {
      // Search profiles in database
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .or(`username.ilike.%${searchQuery}%,first_name.ilike.%${searchQuery}%,last_name.ilike.%${searchQuery}%`)
        .limit(20);

      if (error) {
        console.error('Search error:', error);
        toast.error(t('search.error'));
        setShowEmpty(true);
        setSearching(false);
        return;
      }

      // Map profiles to author results format
      const mappedAuthors = profiles?.map(profile => ({
        id: profile.id,
        name: profile.username,
        displayName: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || profile.username,
        avatar: profile.avatar_url || '/placeholder.svg',
        subscriberCount: 0,
        bookCount: 0,
        bio: profile.bio
      })) || [];

      setAuthorResults(mappedAuthors);
      setBookResults([]); // Clear book results for now

      if (mappedAuthors.length === 0) {
        setShowEmpty(true);
      } else {
        setShowEmpty(false);
        setSearchType('authors');
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error(t('search.error'));
      setShowEmpty(true);
    } finally {
      setSearching(false);
    }
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
