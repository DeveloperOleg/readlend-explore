import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Book, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import EmptyState from './EmptyState';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { searchTestAuthors, searchTestBooks } from '@/utils/testData';

type SearchType = 'books' | 'authors';

const SearchBar: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [showEmpty, setShowEmpty] = useState(false);
  const [searchType, setSearchType] = useState<SearchType>('books');
  const [authorResults, setAuthorResults] = useState<any[]>([]);
  const [bookResults, setBookResults] = useState<any[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();

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

  useEffect(() => {
    if (expanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [expanded]);

  const isTestAccount = user?.username === 'tester111';

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) return;
    
    setSearching(true);
    
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

  const handleToggle = () => {
    setExpanded(prev => !prev);
    if (!expanded) {
      setQuery('');
      setShowEmpty(false);
      setAuthorResults([]);
      setBookResults([]);
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
    setExpanded(false);
  };

  const handleBookClick = (bookId: string) => {
    console.log(`Navigate to book ${bookId}`);
    setBookResults([]);
    setExpanded(false);
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
                
                <div className="flex gap-1 ml-auto">
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
              </div>
              
              <form onSubmit={handleSearch} className="flex w-full items-center px-2 pb-2">
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
                  className="border-0 bg-transparent focus-visible:ring-0 h-10"
                />
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
