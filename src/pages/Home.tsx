
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BookCover } from '@/components/BookCover';
import Welcome from '@/components/Welcome';
import { useLanguage } from '@/context/LanguageContext';

const Home: React.FC = () => {
  const { t } = useLanguage();
  
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
  
  const mangaBooks = [
    { 
      id: 'manga1', 
      title: 'Боевые искусства', 
      author: 'Такэси Миура', 
      coverUrl: null,
      description: 'Эпическая манга о боевых искусствах',
      rating: 9.3,
      totalRatings: 1234
    },
    { 
      id: 'manga2', 
      title: 'Звёздный путь', 
      author: 'Акира Ямамото', 
      coverUrl: null,
      description: 'Космическое приключение',
      rating: 8.9,
      totalRatings: 876
    },
    { 
      id: 'manga3', 
      title: 'Волшебная академия', 
      author: 'Юки Танака', 
      coverUrl: null,
      description: 'Магическая школа и её секреты',
      rating: 9.1,
      totalRatings: 543
    },
  ];
  
  const fanfictionBooks = [
    { 
      id: 'fanfic1', 
      title: 'Альтернативная история', 
      author: 'Анна_К', 
      coverUrl: null,
      description: 'Что было бы, если всё пошло иначе',
      rating: 8.7,
      totalRatings: 234
    },
    { 
      id: 'fanfic2', 
      title: 'Новые приключения', 
      author: 'Автор2023', 
      coverUrl: null,
      description: 'Продолжение любимой истории',
      rating: 9.0,
      totalRatings: 456
    },
    { 
      id: 'fanfic3', 
      title: 'Параллельная вселенная', 
      author: 'ФанВriter', 
      coverUrl: null,
      description: 'История в другой реальности',
      rating: 8.5,
      totalRatings: 321
    },
  ];

  return (
    <ScrollArea className="h-full w-full">
      <div className="pb-20 px-6">
        {/* Header Section - positioned after menu buttons */}
        <div className="pt-14">
          <Welcome />
        </div>

        {/* Books Sections */}
        <div className="space-y-6">
          {/* Новинки */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-foreground">{t('sections.newBooks')}</h2>
              <span className="text-sm text-primary font-medium">{t('sections.viewAll')}</span>
            </div>
            <div className="grid grid-cols-3 gap-4">
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
              <h2 className="text-xl font-semibold text-foreground">{t('sections.recommended')}</h2>
              <span className="text-sm text-primary font-medium">{t('sections.viewAll')}</span>
            </div>
            <div className="grid grid-cols-3 gap-4">
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

          {/* Манга */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-foreground">{t('sections.manga')}</h2>
              <span className="text-sm text-primary font-medium">{t('sections.viewAll')}</span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {mangaBooks.map((book) => (
                <BookCover
                  key={book.id}
                  id={book.id}
                  title={book.title}
                  author={book.author}
                  coverUrl={book.coverUrl}
                  linkPrefix="/manga"
                />
              ))}
            </div>
          </section>

          {/* Фанфикшн */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-foreground">{t('sections.fanfiction')}</h2>
              <span className="text-sm text-primary font-medium">{t('sections.viewAll')}</span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {fanfictionBooks.map((book) => (
                <BookCover
                  key={book.id}
                  id={book.id}
                  title={book.title}
                  author={book.author}
                  coverUrl={book.coverUrl}
                  linkPrefix="/fanfiction"
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
