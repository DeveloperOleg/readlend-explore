
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

const Favorites: React.FC = () => {
  const { t } = useLanguage();
  
  // Mock favorites for demonstration
  const favorites = [
    { id: 1, title: 'Гарри Поттер и философский камень', author: 'Дж. К. Роулинг' },
    { id: 2, title: 'Властелин колец', author: 'Дж. Р. Р. Толкин' },
  ];

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold mb-6">{t('pages.favorites') || 'Избранное'}</h1>
      
      {favorites.length > 0 ? (
        <div className="grid gap-4">
          {favorites.map((book) => (
            <div 
              key={book.id} 
              className="glass rounded-lg p-4 transition-transform hover:scale-[1.01] active:scale-[0.99]"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{book.title}</h3>
                  <p className="text-sm text-muted-foreground">{book.author}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">{t('pages.noFavorites') || 'У вас пока нет избранных книг'}</p>
        </div>
      )}
    </div>
  );
};

export default Favorites;
