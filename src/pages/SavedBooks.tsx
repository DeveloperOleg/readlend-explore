
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

const SavedBooks: React.FC = () => {
  const { t } = useLanguage();
  
  // Mock saved books for demonstration
  const savedBooks = [
    { id: 1, title: 'Три товарища', author: 'Эрих Мария Ремарк', progress: 72 },
    { id: 2, title: 'Тихий Дон', author: 'Михаил Шолохов', progress: 34 },
    { id: 3, title: 'Анна Каренина', author: 'Лев Толстой', progress: 89 },
  ];

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold mb-6">{t('pages.saved')}</h1>
      
      {savedBooks.length > 0 ? (
        <div className="grid gap-4">
          {savedBooks.map((book) => (
            <div 
              key={book.id} 
              className="glass rounded-lg p-4 transition-transform hover:scale-[1.01] active:scale-[0.99]"
            >
              <div className="flex flex-col gap-2">
                <div>
                  <h3 className="font-medium">{book.title}</h3>
                  <p className="text-sm text-muted-foreground">{book.author}</p>
                </div>
                <div className="w-full h-1 bg-muted/50 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-500 ease-out"
                    style={{ width: `${book.progress}%` }}
                  />
                </div>
                <p className="text-xs text-right text-muted-foreground">
                  {book.progress}%
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">{t('pages.noSaved')}</p>
        </div>
      )}
    </div>
  );
};

export default SavedBooks;
