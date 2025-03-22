
import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';
import EmptyState from './EmptyState';

const SearchBar: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [showEmpty, setShowEmpty] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();

  // Handle clicks outside the search bar to collapse it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node) && expanded) {
        setExpanded(false);
        setQuery('');
        setShowEmpty(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [expanded]);

  // Focus input when expanded
  useEffect(() => {
    if (expanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [expanded]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) return;
    
    setSearching(true);
    
    // Simulate search delay
    setTimeout(() => {
      setSearching(false);
      setShowEmpty(true);
    }, 800);
  };

  const handleToggle = () => {
    setExpanded(prev => !prev);
    if (!expanded) {
      setQuery('');
      setShowEmpty(false);
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
          <form onSubmit={handleSearch} className="flex w-full items-center">
            <Input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('search.placeholder')}
              className="border-0 bg-transparent focus-visible:ring-0 h-10"
            />
            <div className="flex gap-1 pr-2">
              {query && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setQuery('')}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
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
          </form>
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
      
      {showEmpty && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-background/95 px-4 py-16 animate-fade-in">
          <EmptyState onClose={() => setShowEmpty(false)} />
        </div>
      )}
      
      {searching && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-background/95 animate-fade-in">
          <div className="flex flex-col items-center">
            <div className="h-10 w-10 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
            <p className="mt-4 text-muted-foreground">Ищем книги...</p>
          </div>
        </div>
      )}
    </>
  );
};

export default SearchBar;
