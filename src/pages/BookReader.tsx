
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ChevronLeft, Book } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { testBooks } from '@/utils/testData';
import BookAbout from '@/components/BookAbout';
import BookComments from '@/components/BookComments';

type TabType = 'about' | 'chapters' | 'comments';

const BookReader: React.FC = () => {
  const { t } = useLanguage();
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('chapters');
  
  const book = testBooks.find(b => b.id === bookId) || 
    { 
      id: bookId || 'unknown', 
      title: 'Book not found', 
      author: 'Unknown',
      coverUrl: null,
      description: 'This book is not available',
      content: 'The requested book could not be found',
      rating: 0,
      totalRatings: 0
    };

  // Function to go back
  const handleBack = () => {
    navigate(-1);
  };

  // Total number of pages (conditionally 118, as in the screenshot)
  const totalPages = 118;

  // Function to switch tabs
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  // Rendering content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'about':
        return <BookAbout book={book} />;
      case 'chapters':
        return (
          <ScrollArea className="flex-1 px-4">
            <div className="max-w-prose mx-auto py-6">
              {book.content || 'Book content will be here...'}
            </div>
          </ScrollArea>
        );
      case 'comments':
        return <BookComments bookId={book.id} authorId="author1" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full pb-20 animate-fade-in">
      {/* Top panel */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold line-clamp-1">{book.title}</h1>
          <Button variant="ghost" size="icon">
            <span className="sr-only">{t('book.options')}</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
              <circle cx="12" cy="12" r="1" />
              <circle cx="12" cy="5" r="1" />
              <circle cx="12" cy="19" r="1" />
            </svg>
          </Button>
        </div>
      </div>
      
      {/* Preface with book cover - show only if chapters are selected */}
      {activeTab === 'chapters' && (
        <div className="flex flex-col items-center p-6 mb-4 border-b">
          <div className="w-64 h-80 relative mb-4">
            {book.coverUrl ? (
              <img 
                src={book.coverUrl} 
                alt={book.title} 
                className="object-cover w-full h-full rounded-lg shadow-lg" 
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted rounded-lg">
                <Book className="h-16 w-16 text-muted-foreground" />
              </div>
            )}
            <div className="absolute bottom-4 right-4 flex items-center bg-black/80 text-amber-400 rounded-full px-2 py-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <span className="ml-1">9.6</span>
              <span className="ml-2 text-gray-300 text-xs">2.7K</span>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold mt-4">{book.title}</h2>
          <p className="text-muted-foreground">{book.author}</p>
          
          <div className="w-full mt-6 flex justify-between">
            <Button variant="outline" className="flex-1 mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                <polyline points="17 21 17 13 7 13 7 21" />
                <polyline points="7 3 7 8 15 8" />
              </svg>
              {t('book.addToLibrary')}
            </Button>
            <Button className="flex-1 ml-2 bg-orange-500 hover:bg-orange-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2">
                <path d="M12 20V10" />
                <path d="M18 20V4" />
                <path d="M6 20v-6" />
              </svg>
              {t('book.read')} 0/{totalPages}
            </Button>
          </div>
        </div>
      )}
      
      {/* Navigation tabs */}
      <div className="border-b">
        <div className="w-full flex justify-between text-sm text-center">
          <button 
            className={`flex-1 py-3 ${activeTab === 'about' ? 'font-medium border-b-2 border-primary' : ''}`}
            onClick={() => handleTabChange('about')}
          >
            {t('book.aboutTitle')}
          </button>
          <button 
            className={`flex-1 py-3 ${activeTab === 'chapters' ? 'font-medium border-b-2 border-primary' : ''}`}
            onClick={() => handleTabChange('chapters')}
          >
            {t('book.chapters')} {totalPages}
          </button>
          <button 
            className={`flex-1 py-3 ${activeTab === 'comments' ? 'font-medium border-b-2 border-primary' : ''}`}
            onClick={() => handleTabChange('comments')}
          >
            {t('book.comments')}
          </button>
        </div>
      </div>
      
      {/* Content depending on the selected tab */}
      <div className="flex-1 overflow-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default BookReader;
