
import React from 'react';
import { Book, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface SearchResultsProps {
  type: 'books' | 'authors';
  results: any[];
  onClose: () => void;
  defaultExpanded?: boolean;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  type,
  results,
  onClose,
  defaultExpanded = false,
}) => {
  const navigate = useNavigate();

  const handleAuthorClick = (authorId: string) => {
    navigate(`/profile/${authorId}`);
    onClose();
  };

  const handleBookClick = (bookId: string) => {
    console.log(`Navigate to book ${bookId}`);
    onClose();
  };

  const handleItemClick = type === 'authors' ? handleAuthorClick : handleBookClick;

  return (
    <div className="fixed inset-0 z-40 flex items-start justify-center bg-background/95 px-4 py-16 animate-fade-in">
      <div className="w-full max-w-md bg-card rounded-lg shadow-lg overflow-hidden">
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2">
            {type === 'authors' ? 'Найденные авторы' : 'Книги'}
          </h3>
          <div className="space-y-2">
            {results.map(item => (
              <div 
                key={item.id} 
                className="flex items-center gap-3 p-2 hover:bg-muted rounded-md cursor-pointer"
                onClick={() => handleItemClick(item.id)}
              >
                {type === 'authors' ? (
                  <>
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">@{item.username}</p>
                      <p className="text-sm text-muted-foreground">{item.displayName}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="h-16 w-12 bg-primary/10 flex items-center justify-center rounded-md">
                      <Book className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.author}</p>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
          <Button 
            variant="outline" 
            className="mt-4 w-full" 
            onClick={onClose}
          >
            Закрыть
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
