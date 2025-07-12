
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Search as SearchIcon } from 'lucide-react';
import SearchBar from '@/components/SearchBar';
import EmptyState from '@/components/EmptyState';
import { useSearch } from '@/hooks/useSearch';

const Search: React.FC = () => {
  const { t } = useLanguage();
  const { showEmpty, searchType, clearResults } = useSearch();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <SearchIcon className="h-5 w-5" />
        <h1 className="text-2xl font-bold">{t('pages.search')}</h1>
      </div>
      
      <div className="flex justify-center">
        <div className="w-full max-w-md">
          <SearchBar defaultExpanded={true} />
        </div>
      </div>
      
      {!showEmpty ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">{t('search.startTyping')}</p>
        </div>
      ) : (
        <div className="flex justify-center py-10">
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
            onClose={clearResults}
          />
        </div>
      )}
    </div>
  );
};

export default Search;
