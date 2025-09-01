import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Search as SearchIcon, Clock, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSearch } from '@/hooks/useSearch';

const Search: React.FC = () => {
  const { t } = useLanguage();
  const { 
    query, 
    setQuery, 
    handleSearch, 
    searchHistory, 
    clearHistory,
    showHistory,
    setShowHistory 
  } = useSearch();

  const popularQueries = [
    'Толстой', 'Достоевский', 'Пушкин', 'Булгаков'
  ];

  const popularTags = [
    'Чехов', 'Гоголь', 'классики', 'книги', 'детские'
  ];

  const popularCategories = [
    { name: 'Классика', count: '2 341 книг', icon: '📚' },
    { name: 'Фантастика', count: '1 892 книг', icon: '🚀' },
    { name: 'Детективы', count: '1 567 книг', icon: '🔍' },
    { name: 'Романы', count: '2 015 книг', icon: '💕' },
    { name: 'Поэзия', count: '892 книг', icon: '📜' },
    { name: 'Биографии', count: '623 книг', icon: '👤' },
    { name: 'Фэнтези', count: '1 234 книг', icon: '⚔️' },
    { name: 'Комиксы', count: '387 книг', icon: '💥' }
  ];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      handleSearch(query);
    }
  };

  const handleHistoryItemClick = (item: string) => {
    setQuery(item);
    handleSearch(item);
  };

  return (
    <div className="space-y-6 animate-fade-in p-4">
      <div className="flex items-center gap-2 mb-4">
        <SearchIcon className="h-5 w-5" />
        <h1 className="text-2xl font-bold">{t('pages.search')}</h1>
      </div>
      
      {/* Search Input */}
      <form onSubmit={handleFormSubmit} className="space-y-4">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder={t('search.placeholder')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowHistory(true)}
            className="pl-10 h-12 text-base"
          />
        </div>
      </form>

      {/* Recent Searches */}
      {showHistory && searchHistory.length > 0 && (
        <div className="bg-card rounded-lg p-4 border">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-sm text-muted-foreground">{t('search.recentSearches')}</h3>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={clearHistory}
              className="text-muted-foreground hover:text-foreground"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              {t('search.clearHistory')}
            </Button>
          </div>
          <div className="space-y-2">
            {searchHistory.slice(0, 5).map((item, index) => (
              <div 
                key={index} 
                className="flex items-center gap-2 p-2 hover:bg-muted rounded-md cursor-pointer"
                onClick={() => handleHistoryItemClick(item)}
              >
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Popular Queries Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{t('search.popularQueries')}</h3>
          <Button variant="ghost" size="sm" className="text-blue-500 hover:text-blue-600">
            {t('search.showAll')}
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {popularQueries.map((query, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="rounded-full bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
              onClick={() => handleSearch(query)}
            >
              {query}
            </Button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {popularTags.map((tag, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={() => handleSearch(tag)}
            >
              {tag}
            </Button>
          ))}
        </div>
      </div>

      {/* Popular Categories */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{t('search.popularCategories')}</h3>
          <Button variant="ghost" size="sm" className="text-blue-500 hover:text-blue-600">
            {t('search.showAll')}
          </Button>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {popularCategories.map((category, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 bg-card rounded-lg border hover:bg-muted cursor-pointer transition-colors"
              onClick={() => handleSearch(category.name)}
            >
              <div className="text-2xl">{category.icon}</div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{category.name}</p>
                <p className="text-xs text-muted-foreground">{category.count}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Search;