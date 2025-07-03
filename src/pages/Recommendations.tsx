
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BookCategory } from '@/components/BookCategory';
import { testBooks } from '@/utils/testData';

const Recommendations: React.FC = () => {
  const { t } = useLanguage();
  
  const recommendedBooks = [...testBooks].reverse();

  return (
    <ScrollArea className="h-full w-full">
      <div className="pb-20 px-2">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            {t('recommendations.title') || 'Recommendations'}
          </h1>
          <p className="text-muted-foreground">
            {t('recommendations.subtitle') || 'Books we think you\'ll love'}
          </p>
        </div>
        
        <BookCategory 
          title={t('recommendations.forYou') || 'For You'} 
          books={recommendedBooks}
          viewAllLink="/search" 
        />
      </div>
    </ScrollArea>
  );
};

export default Recommendations;
