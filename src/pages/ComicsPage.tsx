
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BookCategory } from '@/components/BookCategory';

const ComicsPage: React.FC = () => {
  const { t } = useLanguage();
  
  const comics = [
    { id: 'comic1', title: 'Русь: Правление', author: 'Павел Брятев', coverUrl: '/lovable-uploads/0fac89ed-334a-49b5-a9ab-7f0ee0a4be4d.png' },
    { id: 'comic2', title: 'Майор Гром', author: 'Сергей Железяка', coverUrl: '/lovable-uploads/7bf984f5-094b-4cf4-b63c-0a3cfa1b81e4.png' },
    { id: 'comic3', title: 'Метро 2033: Часть 1.2', author: 'ChatGPT', coverUrl: null },
    { id: 'comic4', title: 'Битва Богов', author: 'Артём Воронцов', coverUrl: null },
    { id: 'comic5', title: 'Космические Рейнджеры', author: 'Мария Ковалёва', coverUrl: null },
    { id: 'comic6', title: 'Тени Прошлого', author: 'Дмитрий Петров', coverUrl: null },
  ];

  return (
    <ScrollArea className="h-full w-full">
      <div className="pb-20 px-2">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            {t('comics.title') || 'Comics'}
          </h1>
          <p className="text-muted-foreground">
            {t('comics.subtitle') || 'Explore amazing comic stories'}
          </p>
        </div>
        
        <BookCategory 
          title={t('comics.popular') || 'Popular Comics'} 
          books={comics}
          viewAllLink="/search"
          linkPrefix="/comic/"
        />
      </div>
    </ScrollArea>
  );
};

export default ComicsPage;
