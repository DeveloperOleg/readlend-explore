
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BookCategory } from '@/components/BookCategory';
import { testBooks } from '@/utils/testData';

const Featured: React.FC = () => {
  const { t } = useLanguage();
  
  const featuredBooks = testBooks.slice(0, 6);

  return (
    <ScrollArea className="h-full w-full">
      <div className="pb-20 px-2">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            {t('featured.title') || 'Featured'}
          </h1>
          <p className="text-muted-foreground">
            {t('featured.subtitle') || 'Handpicked selections'}
          </p>
        </div>
        
        <BookCategory 
          title={t('featured.books') || 'Featured Books'} 
          books={featuredBooks}
          viewAllLink="/search" 
        />
      </div>
    </ScrollArea>
  );
};

export default Featured;
