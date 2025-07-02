
import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Book, User, Clock, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import EmptyState from './EmptyState';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { searchTestAuthors, searchTestBooks } from '@/utils/testData';
import { toast } from 'sonner';

type SearchType = 'books' | 'authors';

interface SearchBarProps {
  defaultExpanded?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ defaultExpanded = false }) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [showEmpty, setShowEmpty] = useState(false);
  const [searchType, setSearchType] = useState<SearchType>('books');
  const [authorResults, setAuthorResults] = useState<any[]>([]);
  const [bookResults, setBookResults] = useState<any[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();

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
  }, [expanded, defaultExpanded]);

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
  }, [expanded, query, searchHistory]);

  const isTestAccount = user?.username === 'tester111';

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) return;
    
    addToHistory(query.trim());
    setSearching(true);
    setShowHistory(false);
    
    setTimeout(() => {
      setSearching(false);
      
      if (isTestAccount) {
        if (searchType === 'authors') {
          const results = searchTestAuthors(query);
          setAuthorResults(results);
          setShowEmpty(results.length === 0);
        } else {
          const results = searchTestBooks(query);
          setBookResults(results);
          setShowEmpty(results.length === 0);
        }
      } else {
        setShowEmpty(true);
      }
    }, 800);
  };

  const handleHistoryItemClick = (historyItem: string) => {
    setQuery(historyItem);
    setShowHistory(false);
    // Trigger search with the history item
    const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
    setTimeout(() => handleSearch(fakeEvent), 100);
  };

  const handleToggle = () => {
    if (defaultExpanded) return; // Don't allow collapse when defaultExpanded is true
    
    setExpanded(prev => !prev);
    if (!expanded) {
      setQuery('');
      setShowEmpty(false);
      setAuthorResults([]);
      setBookResults([]);
      setShowHistory(false);
    }
  };

  const handleClearInput = () => {
    setQuery('');
    setShowEmpty(false);
    setAuthorResults([]);
    setBookResults([]);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleTypeChange = (value: string) => {
    setSearchType(value as SearchType);
    setShowEmpty(false);
    setAuthorResults([]);
    setBookResults([]);
  };

  const handleAuthorClick = (authorId: string) => {
    navigate(`/profile/${authorId}`);
    setAuthorResults([]);
    if (!defaultExpanded) {
      setExpanded(false);
    }
  };

  const handleBookClick = (bookId: string) => {
    console.log(`Navigate to book ${bookId}`);
    setBookResults([]);
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
              
              <form onSubmit={handleSearch} className="flex w-full items-center px-2 pb-2">
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
        <div className="fixed inset-0 z-40 flex items-start justify-center bg-background/95 px-4 py-16 animate-fade-in">
          <div className="w-full max-w-md bg-card rounded-lg shadow-lg overflow-hidden">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{t('search.searchHistory')}</h3>
                {searchHistory.length > 0 && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={clearHistory}
                    className="flex items-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    {t('search.clear')}
                  </Button>
                )}
              </div>
              
              {searchHistory.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">{t('search.noHistory')}</p>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {searchHistory.map((item, index) => (
                    <div 
                      key={index} 
                      className="flex items-center gap-3 p-2 hover:bg-muted rounded-md cursor-pointer"
                      onClick={() => handleHistoryItemClick(item)}
                    >
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="flex-1">{item}</span>
                    </div>
                  ))}
                </div>
              )}
              
              <Button 
                variant="outline" 
                className="mt-4 w-full" 
                onClick={() => setShowHistory(false)}
              >
                Закрыть
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Author Results */}
      {authorResults.length > 0 && (
        <div className="fixed inset-0 z-40 flex items-start justify-center bg-background/95 px-4 py-16 animate-fade-in">
          <div className="w-full max-w-md bg-card rounded-lg shadow-lg overflow-hidden">
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">Найденные авторы</h3>
              <div className="space-y-2">
                {authorResults.map(author => (
                  <div 
                    key={author.id} 
                    className="flex items-center gap-3 p-2 hover:bg-muted rounded-md cursor-pointer"
                    onClick={() => handleAuthorClick(author.id)}
                  >
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">@{author.username}</p>
                      <p className="text-sm text-muted-foreground">{author.displayName}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button 
                variant="outline" 
                className="mt-4 w-full" 
                onClick={() => {
                  setAuthorResults([]);
                  setShowEmpty(false);
                  setExpanded(false);
                }}
              >
                Закрыть
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Book Results */}
      {bookResults.length > 0 && (
        <div className="fixed inset-0 z-40 flex items-start justify-center bg-background/95 px-4 py-16 animate-fade-in">
          <div className="w-full max-w-md bg-card rounded-lg shadow-lg overflow-hidden">
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">Книги</h3>
              <div className="space-y-2">
                {bookResults.map(book => (
                  <div 
                    key={book.id} 
                    className="flex items-center gap-3 p-2 hover:bg-muted rounded-md cursor-pointer"
                    onClick={() => handleBookClick(book.id)}
                  >
                    <div className="h-16 w-12 bg-primary/10 flex items-center justify-center rounded-md">
                      <Book className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{book.title}</p>
                      <p className="text-sm text-muted-foreground">{book.author}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button 
                variant="outline" 
                className="mt-4 w-full" 
                onClick={() => {
                  setBookResults([]);
                  setShowEmpty(false);
                  setExpanded(false);
                }}
              >
                Закрыть
              </Button>
            </div>
          </div>
        </div>
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
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-background/95 animate-fade-in">
          <div className="flex flex-col items-center">
            <div className="h-10 w-10 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
            <p className="mt-4 text-muted-foreground">
              {searchType === 'books' 
                ? "Ищем книги..."
                : "Ищем авторов..."}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default SearchBar;
