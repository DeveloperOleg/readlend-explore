
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BookCover } from '@/components/BookCover';
import { Book, Users, Heart } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const Home: React.FC = () => {
  const { user } = useAuth();
  
  // Организуем книги по категориям
  const newBooks = [
    { 
      id: 'new1', 
      title: 'Интрига', 
      author: 'Анна Петрова', 
      coverUrl: '/lovable-uploads/01c01930-5bfb-48ae-869d-a4e4d30a45ea.png',
      description: 'Захватывающий детектив',
      rating: 8.5,
      totalRatings: 234
    },
    { 
      id: 'new2', 
      title: 'Фея лето', 
      author: 'Сергей Смирнов', 
      coverUrl: '/lovable-uploads/62d8f5f3-1bdd-40d2-bb32-c17c28ace726.png',
      description: 'Волшебная история',
      rating: 9.1,
      totalRatings: 567
    },
    { 
      id: 'new3', 
      title: 'Духи лета', 
      author: 'Мария Сидорова', 
      coverUrl: '/lovable-uploads/c07f8bce-3d6d-44bb-bf4e-86bfc7c10a21.png',
      description: 'Мистическая драма',
      rating: 8.8,
      totalRatings: 789
    },
  ];
  
  const recommendedBooks = [
    { 
      id: 'rec1', 
      title: 'Тайны старого города', 
      author: 'Александр Петров', 
      coverUrl: null,
      description: 'Исторический роман',
      rating: 8.3,
      totalRatings: 156
    },
    { 
      id: 'rec2', 
      title: 'Дорога домой', 
      author: 'Екатерина Волкова', 
      coverUrl: null,
      description: 'Семейная сага',
      rating: 9.0,
      totalRatings: 342
    },
    { 
      id: 'rec3', 
      title: 'Весенний дождь', 
      author: 'Мария Павлова', 
      coverUrl: null,
      description: 'Любовный роман',
      rating: 8.7,
      totalRatings: 234
    },
    { 
      id: 'rec4', 
      title: 'Северное сияние', 
      author: 'Дмитрий Северов', 
      coverUrl: null,
      description: 'Приключенческий роман',
      rating: 8.9,
      totalRatings: 445
    },
    { 
      id: 'rec5', 
      title: 'Письма зайца', 
      author: 'Елена Кобзева',
      coverUrl: null,
      description: 'Детская литература',
      rating: 9.2,
      totalRatings: 123
    },
    { 
      id: 'rec6', 
      title: 'Последний месяц', 
      author: 'Владимир Марко', 
      coverUrl: null,
      description: 'Фантастика',
      rating: 8.4,
      totalRatings: 678
    },
  ];

  return (
    <ScrollArea className="h-full w-full">
      <div className="pb-20 px-4">
        {/* Header Section */}
        <div className="pt-16 pb-6">
          <h1 className="text-2xl font-medium text-foreground mb-2">
            Доброе утро, {user?.username || 'tester111'}
          </h1>
          <p className="text-sm text-muted-foreground">
            ReadNest - ваша уютная библиотека
          </p>
        </div>

        {/* Stats Section */}
        <div className="flex items-center justify-center gap-8 mb-8">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 mb-1">
              <Book className="h-4 w-4 text-blue-500" />
              <span className="text-lg font-medium">0</span>
            </div>
            <span className="text-xs text-muted-foreground">Книги</span>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 mb-1">
              <Users className="h-4 w-4 text-green-500" />
              <span className="text-lg font-medium">0</span>
            </div>
            <span className="text-xs text-muted-foreground">Подписчики</span>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 mb-1">
              <Heart className="h-4 w-4 text-red-500" />
              <span className="text-lg font-medium">0</span>
            </div>
            <span className="text-xs text-muted-foreground">Подписки</span>
          </div>
        </div>

        {/* Books Sections */}
        <div className="space-y-8">
          {/* Новинки */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Новинки</h2>
              <span className="text-sm text-blue-500">Все</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {newBooks.map((book) => (
                <BookCover
                  key={book.id}
                  id={book.id}
                  title={book.title}
                  author={book.author}
                  coverUrl={book.coverUrl}
                  linkPrefix="/book"
                />
              ))}
            </div>
          </section>

          {/* Вам может понравиться */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Вам может понравиться</h2>
              <span className="text-sm text-blue-500">Все</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {recommendedBooks.slice(0, 6).map((book) => (
                <BookCover
                  key={book.id}
                  id={book.id}
                  title={book.title}
                  author={book.author}
                  coverUrl={book.coverUrl}
                  linkPrefix="/book"
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </ScrollArea>
  );
};

export default Home;
