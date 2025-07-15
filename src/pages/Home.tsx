
import React from 'react';
import Welcome from '@/components/Welcome';
import { BookCategory } from '@/components/BookCategory';
import { ScrollArea } from '@/components/ui/scroll-area';
import { testBooks } from '@/utils/testData';

const Home: React.FC = () => {
  // Организуем книги по категориям
  const newBooks = testBooks.slice(0, 3);
  const recommendedBooks = [...testBooks].reverse().slice(0, 3);
  const comics = [
    { 
      id: 'comic1', 
      title: 'Русь: Правление', 
      author: 'Павел Брятев', 
      coverUrl: '/lovable-uploads/0fac89ed-334a-49b5-a9ab-7f0ee0a4be4d.png',
      description: 'Эпическая история о становлении великой державы',
      rating: 9.2,
      totalRatings: 1547
    },
    { 
      id: 'comic2', 
      title: 'Майор Гром', 
      author: 'Сергей Железяка', 
      coverUrl: '/lovable-uploads/7bf984f5-094b-4cf4-b63c-0a3cfa1b81e4.png',
      description: 'Супергеройский комикс о майоре полиции',
      rating: 8.7,
      totalRatings: 892
    },
    { 
      id: 'comic3', 
      title: 'Метро 2033: Часть 1.2', 
      author: 'ChatGPT', 
      coverUrl: null,
      description: 'Постапокалиптическая история выживания',
      rating: 8.1,
      totalRatings: 456
    },
  ];
  const mayBooks = testBooks.slice(0, 3);

  return (
    <ScrollArea className="h-full w-full">
      <div className="pb-20 px-2">
        <Welcome />
        
        <div className="space-y-6">
          <BookCategory 
            title="Новинки" 
            books={newBooks}
            viewAllLink="/top-reads" 
          />
          
          <BookCategory 
            title="Вам может понравиться" 
            books={recommendedBooks}
            viewAllLink="/recommendations" 
          />
          
          <BookCategory 
            title="Комиксы: с чего начать" 
            books={comics}
            viewAllLink="/comics"
            isComics={true}
          />
          
          <BookCategory 
            title="Давайте уже почитаем" 
            books={mayBooks}
            viewAllLink="/featured" 
          />
        </div>
      </div>
    </ScrollArea>
  );
};

export default Home;
