import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BookCover } from '@/components/BookCover';

const Comics: React.FC = () => {
  const mockComics = [
    {
      id: 'comic1',
      title: 'Spider-Man',
      author: 'Marvel Comics',
      coverUrl: null,
    },
    {
      id: 'comic2',
      title: 'Batman',
      author: 'DC Comics',
      coverUrl: null,
    },
    {
      id: 'comic3',
      title: 'X-Men',
      author: 'Marvel Comics',
      coverUrl: null,
    },
  ];

  return (
    <ScrollArea className="h-full w-full">
      <div className="pb-20 px-4">
        {/* Header Section */}
        <div className="pt-16 pb-6">
          <h1 className="text-2xl font-medium text-foreground mb-2">
            Комиксы
          </h1>
          <p className="text-sm text-muted-foreground">
            Популярные комиксы и новинки
          </p>
        </div>

        {/* Comics Section */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Популярные комиксы</h2>
            <span className="text-sm text-blue-500">Все</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {mockComics.map((comic) => (
              <BookCover
                key={comic.id}
                id={comic.id}
                title={comic.title}
                author={comic.author}
                coverUrl={comic.coverUrl}
                linkPrefix="/comic"
              />
            ))}
          </div>
        </section>
      </div>
    </ScrollArea>
  );
};

export default Comics;