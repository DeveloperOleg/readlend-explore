
import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Book, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';
import EmptyState from './EmptyState';
import SearchHistory from './SearchHistory';
import SearchResults from './SearchResults';
import SearchLoadingState from './SearchLoadingState';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSearch } from '@/hooks/useSearch';

interface SearchBarProps {
  defaultExpanded?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ defaultExpanded = false }) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();

  const {
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
  } = useSearch();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node) && expanded && !defaultExpanded) {
        setExpanded(false);
        setQuery('');
        setShowEmpty(false);
        setShowHistory(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [expanded, defaultExpanded, setQuery, setShowEmpty, setShowHistory]);

  useEffect(() => {
    if (expanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [expanded]);

  useEffect(() => {
    // Show history when input is focused and empty
    if (expanded && !query && searchHistory.length > 0) {
      setShowHistory(true);
    } else {
      setShowHistory(false);
    }
  }, [expanded, query, searchHistory, setShowHistory]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    handleSearch(query);
  };

  const handleHistoryItemClick = (historyItem: string) => {
    setQuery(historyItem);
    setShowHistory(false);
    // Trigger search with the history item
    setTimeout(() => handleSearch(historyItem), 100);
  };

  const handleToggle = () => {
    if (defaultExpanded) return; // Don't allow collapse when defaultExpanded is true
    
    setExpanded(prev => !prev);
    if (!expanded) {
      setQuery('');
      clearResults();
      setShowHistory(false);
    }
  };

  const handleClearInput = () => {
    setQuery('');
    clearResults();
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleTypeChange = (value: string) => {
    setSearchType(value as 'books' | 'authors');
    clearResults();
  };

  const handleResultsClose = () => {
    setAuthorResults([]);
    setBookResults([]);
    setShowEmpty(false);
    if (!defaultExpanded) {
      setExpanded(false);
    }
  };

  return (
    <>
      <div 
        ref={searchRef}
        className={`search-bar glass transition-all duration-300 ${
          expanded ? 'search-bar-expanded' : 'search-bar-collapsed'
        }`}
      >
        {expanded ? (
          <div className="w-full">
            <Tabs defaultValue="books" onValueChange={handleTypeChange} className="w-full">
              <div className="flex items-center p-1">
                <TabsList className="h-8">
                  <TabsTrigger value="books" className="text-xs px-3 py-1 h-6">
                    <Book className="h-3 w-3 mr-1" />
                    Книги
                  </TabsTrigger>
                  <TabsTrigger value="authors" className="text-xs px-3 py-1 h-6">
                    <User className="h-3 w-3 mr-1" />
                    Авторы
                  </TabsTrigger>
                </TabsList>
                
                {!defaultExpanded && (
                  <div className="flex gap-1 ml-auto">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={handleToggle}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              
              <form onSubmit={handleFormSubmit} className="flex w-full items-center px-2 pb-2">
                <div className="relative flex-1">
                  <Input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={
                      searchType === 'books' 
                        ? "Поиск книг..."
                        : "Поиск авторов..."
                    }
                    className="border-0 bg-transparent focus-visible:ring-0 h-10 pr-8"
                  />
                  {query && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-10 w-8"
                      onClick={handleClearInput}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <Button type="submit" variant="ghost" size="sm">
                  <Search className="h-4 w-4" />
                </Button>
              </form>
            </Tabs>
          </div>
        ) : (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-10 w-10"
            onClick={handleToggle}
          >
            <Search className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Search History */}
      {showHistory && (
        <SearchHistory
          searchHistory={searchHistory}
          onHistoryItemClick={handleHistoryItemClick}
          onClearHistory={clearHistory}
          onClose={() => setShowHistory(false)}
        />
      )}
      
      {/* Author Results */}
      {authorResults.length > 0 && (
        <SearchResults
          type="authors"
          results={authorResults}
          onClose={handleResultsClose}
          defaultExpanded={defaultExpanded}
        />
      )}
      
      {/* Book Results */}
      {bookResults.length > 0 && (
        <SearchResults
          type="books"
          results={bookResults}
          onClose={handleResultsClose}
          defaultExpanded={defaultExpanded}
        />
      )}
      
      {/* Empty State */}
      {showEmpty && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-background/95 px-4 py-16 animate-fade-in">
          <EmptyState 
            title={
              searchType === 'books'
                ? t('search.notFound')
                : t('search.authorNotFound')
            }
            description={
              searchType === 'books'
                ? t('search.tryAgain')
                : t('search.authorNotFoundDescription')
            }
            icon={searchType === 'books' ? 'book' : 'user'}
            onClose={() => setShowEmpty(false)} 
          />
        </div>
      )}
      
      {/* Loading State */}
      {searching && (
        <SearchLoadingState searchType={searchType} />
      )}
    </>
  );
};

export default SearchBar;
