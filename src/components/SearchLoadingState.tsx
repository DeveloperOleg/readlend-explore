
import React from 'react';

interface SearchLoadingStateProps {
  searchType: 'books' | 'authors';
}

const SearchLoadingState: React.FC<SearchLoadingStateProps> = ({ searchType }) => {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-background/95 animate-fade-in">
      <div className="flex flex-col items-center">
        <div className="h-10 w-10 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
        <p className="mt-4 text-muted-foreground">
          {searchType === 'books' 
            ? "Ищем книги..."
            : "Ищем авторов..."}
        </p>
      </div>
    </div>
  );
};

export default SearchLoadingState;
