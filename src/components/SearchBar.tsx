
import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Book, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';
import EmptyState from './EmptyState';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

// Mock author search results
const mockAuthors = [
  { id: 'author1', username: 'bestseller', displayName: 'Игорь Бестселлер', avatarUrl: null },
  { id: 'author2', username: 'fantasywriter', displayName: 'Анна Фэнтези', avatarUrl: null },
];

type SearchType = 'books' | 'authors';

const SearchBar: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [showEmpty, setShowEmpty] = useState(false);
  const [searchType, setSearchType] = useState<SearchType>('books');
  const [authorResults, setAuthorResults] = useState<typeof mockAuthors>([]);
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
      
      if (searchType === 'authors') {
        // Mock author search results
        const results = mockAuthors.filter(author => 
          author.username.toLowerCase().includes(query.toLowerCase()) || 
          author.displayName.toLowerCase().includes(query.toLowerCase())
        );
        
        setAuthorResults(results);
        setShowEmpty(results.length === 0);
      } else {
        // For books, always show empty state in this demo
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
    }
  };

  const handleTypeChange = (value: string) => {
    setSearchType(value as SearchType);
    setShowEmpty(false);
    setAuthorResults([]);
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
                    {t('search.books') || 'Книги'}
                  </TabsTrigger>
                  <TabsTrigger value="authors" className="text-xs px-3 py-1 h-6">
                    <User className="h-3 w-3 mr-1" />
                    {t('search.authors') || 'Авторы'}
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
                      ? (t('search.booksPlaceholder') || 'Поиск книг...') 
                      : (t('search.authorsPlaceholder') || 'Поиск авторов...')
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
              <h3 className="text-lg font-semibold mb-2">{t('search.authorsFound') || 'Найденные авторы'}</h3>
              <div className="space-y-2">
                {authorResults.map(author => (
                  <div key={author.id} className="flex items-center gap-3 p-2 hover:bg-muted rounded-md cursor-pointer">
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
                {t('search.close') || 'Закрыть'}
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
                ? (t('search.notFound') || 'Книги не найдены')
                : (t('search.authorNotFound') || 'К сожалению, мы не нашли автора с таким именем! 😔✨')
            }
            description={
              searchType === 'books'
                ? (t('search.tryAgain') || 'Пожалуйста, попробуйте другой поисковый запрос')
                : (t('search.authorNotFoundDescription') || 'Возможно, он всего лишь ждет своего звездного часа. Поищите по другим именам или посмотрите в новых категориях!')
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
                ? 'Ищем книги...' 
                : 'Ищем авторов...'}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default SearchBar;
