
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useInternet } from '@/context/InternetContext';
import { Flame, Book } from 'lucide-react';
import { testBooks } from '@/utils/testData';
import InternetRequired from '@/components/InternetRequired';
import { Button } from '@/components/ui/button';
import EmptyState from '@/components/EmptyState';
import { Link } from 'react-router-dom';

const TopReads: React.FC = () => {
  const { t } = useLanguage();
  const { isOnline, checkConnection } = useInternet();
  
  // For demo purposes, we'll use the test books as "top reads"
  const topBooks = testBooks;
  
  return (
    <div className="space-y-4 pb-6 animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <Flame className="h-5 w-5 text-neon" />
        <h1 className="text-2xl font-bold">{t('pages.topReads') || 'Топ читаемых'}</h1>
      </div>
      
      <p className="text-muted-foreground mb-6">
        {t('pages.topReadsDescription') || 'Книги, которые пользователи читают чаще всего'}
      </p>
      
      <InternetRequired 
        fallback={
          <EmptyState
            title={t('internet.noConnection') || "Нет подключения к интернету"}
            description={t('internet.topReadsNeedsInternet') || "Для просмотра топ читаемых книг необходимо подключение к интернету"}
            icon="ban"
            onClose={() => checkConnection()}
          />
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {topBooks.map((book) => (
            <Link to={`/book/${book.id}`} key={book.id}>
              <div 
                className="border border-border rounded-lg p-4 hover:border-primary transition-colors cursor-pointer"
              >
                <div className="aspect-[2/3] bg-muted rounded-md mb-2 flex items-center justify-center">
                  {book.coverUrl ? (
                    <img 
                      src={book.coverUrl} 
                      alt={book.title} 
                      className="w-full h-full object-cover rounded-md" 
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full w-full">
                      <Book className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <h3 className="font-medium line-clamp-2 mt-2">{book.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{book.author}</p>
              </div>
            </Link>
          ))}
        </div>
      </InternetRequired>
    </div>
  );
};

export default TopReads;
