
import React from 'react';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Link } from 'react-router-dom';
import { BookCover } from '@/components/BookCover';

interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl?: string | null;
}

interface BookCategoryProps {
  title: string;
  books: Book[];
  viewAllLink: string;
  linkPrefix?: string;
}

export const BookCategory: React.FC<BookCategoryProps> = ({
  title,
  books,
  viewAllLink,
  linkPrefix = '/book/',
}) => {
  return (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        <Link to={viewAllLink} className="text-blue-500 font-medium">
          Все
        </Link>
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        {books.map((book) => (
          <div key={book.id} className="min-w-0">
            <Link to={`${linkPrefix}${book.id}`}>
              <BookCover
                id={book.id}
                title={book.title}
                author={book.author}
                coverUrl={book.coverUrl}
              />
            </Link>
          </div>
        ))}
      </div>
      
      <Separator className="mt-6 mb-2" />
    </section>
  );
};
