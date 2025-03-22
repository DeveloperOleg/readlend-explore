
import React from 'react';
import Welcome from '@/components/Welcome';

const Home: React.FC = () => {
  // Mock book content for demonstration
  const recentBooks = [
    { id: 1, title: 'Мастер и Маргарита', author: 'Михаил Булгаков' },
    { id: 2, title: 'Война и мир', author: 'Лев Толстой' },
    { id: 3, title: '1984', author: 'Джордж Оруэлл' },
    { id: 4, title: 'Преступление и наказание', author: 'Фёдор Достоевский' },
  ];

  return (
    <div>
      <Welcome />
      
      <section className="space-y-4 mb-8">
        <h2 className="text-xl font-semibold">Недавние книги</h2>
        <div className="grid grid-cols-2 gap-4">
          {recentBooks.map((book) => (
            <div 
              key={book.id} 
              className="relative glass overflow-hidden rounded-lg p-4 h-40 flex flex-col justify-between transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="space-y-1">
                <h3 className="font-medium line-clamp-2">{book.title}</h3>
                <p className="text-sm text-muted-foreground">{book.author}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Рекомендации</h2>
        <div className="grid grid-cols-2 gap-4">
          {[...recentBooks].reverse().map((book) => (
            <div 
              key={book.id} 
              className="relative glass overflow-hidden rounded-lg p-4 h-40 flex flex-col justify-between transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="space-y-1">
                <h3 className="font-medium line-clamp-2">{book.title}</h3>
                <p className="text-sm text-muted-foreground">{book.author}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
