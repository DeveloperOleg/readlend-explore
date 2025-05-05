
import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Search as SearchIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Search: React.FC = () => {
  const { t } = useLanguage();
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Here we would implement the search functionality
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <SearchIcon className="h-5 w-5" />
        <h1 className="text-2xl font-bold">{t('pages.search')}</h1>
      </div>
      
      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('search.booksPlaceholder')}
          className="flex-1"
        />
        <Button type="submit">
          <SearchIcon className="h-4 w-4 mr-2" />
          {t('search.search')}
        </Button>
      </form>
      
      <div className="text-center py-10">
        <p className="text-muted-foreground">{t('search.startTyping')}</p>
      </div>
    </div>
  );
};

export default Search;
