
import React from 'react';
import { Card } from '@/components/ui/card';
import { Book } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BookCoverProps {
  title: string;
  author: string;
  coverUrl?: string | null;
  id: string;
  linkPrefix?: string;
}

export const BookCover: React.FC<BookCoverProps> = ({ 
  title, 
  author, 
  coverUrl, 
  id, 
  linkPrefix = '/book' 
}) => {
  return (
    <Link to={`${linkPrefix}/${id}`}>
      <Card className="overflow-hidden h-56 flex flex-col justify-end transition-transform hover:scale-[1.02] border-0 shadow-sm">
        <div 
          className="w-full h-full relative bg-gradient-to-b from-muted/50 to-muted rounded-lg"
          style={{
            backgroundImage: coverUrl ? `url(${coverUrl})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {!coverUrl && (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
              <Book size={36} />
            </div>
          )}
          
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3 rounded-b-lg">
            <h3 className="font-medium text-sm text-white line-clamp-2 mb-1">{title}</h3>
            <p className="text-xs text-white/80">{author}</p>
          </div>
        </div>
      </Card>
    </Link>
  );
};
