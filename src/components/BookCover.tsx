
import React from 'react';
import { Card } from '@/components/ui/card';
import { Book } from 'lucide-react';

interface BookCoverProps {
  title: string;
  author: string;
  coverUrl?: string | null;
}

export const BookCover: React.FC<BookCoverProps> = ({ title, author, coverUrl }) => {
  return (
    <Card className="overflow-hidden h-64 flex flex-col justify-end transition-transform hover:scale-[1.02]">
      <div 
        className="w-full h-full relative bg-gradient-to-b from-gray-700 to-gray-900"
        style={{
          backgroundImage: coverUrl ? `url(${coverUrl})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {!coverUrl && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-300">
            <Book size={42} />
          </div>
        )}
        
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
          <h3 className="font-medium text-sm text-white line-clamp-2">{title}</h3>
          <p className="text-xs text-gray-300 mt-1">{author}</p>
        </div>
      </div>
    </Card>
  );
};
