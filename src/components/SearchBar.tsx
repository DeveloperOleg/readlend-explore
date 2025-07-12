
import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';
import SearchHistory from './SearchHistory';
import SearchResults from './SearchResults';
import SearchLoadingState from './SearchLoadingState';
import { useSearch } from '@/hooks/useSearch';
import { useTypingEffect } from '@/hooks/useTypingEffect';

interface SearchBarProps {
  defaultExpanded?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ defaultExpanded = false }) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();
  const typingPlaceholder = useTypingEffect();

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
    // Default to books search when no type is specified
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
        className={`search-bar transition-all duration-300 ${
          expanded ? 'search-bar-expanded bg-muted/50' : 'search-bar-collapsed'
        }`}
      >
        {expanded ? (
          <div className="w-full p-3">
            <form onSubmit={handleFormSubmit} className="flex w-full items-center">
              <div className="relative flex-1">
                <Input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={query ? '' : typingPlaceholder}
                  className="border-0 bg-muted/70 focus-visible:ring-0 h-12 pr-8 text-base"
                />
                {query && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-12 w-10"
                    onClick={handleClearInput}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <Button type="submit" variant="ghost" size="sm" className="ml-2">
                <Search className="h-4 w-4" />
              </Button>
              {!defaultExpanded && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 ml-1"
                  onClick={handleToggle}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </form>
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
      
      {/* Loading State */}
      {searching && (
        <SearchLoadingState searchType={searchType} />
      )}
    </>
  );
};

export default SearchBar;
