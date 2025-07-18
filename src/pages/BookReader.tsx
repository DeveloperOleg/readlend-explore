
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ChevronLeft, Book, Link, Flag, BookOpen, Bookmark, Heart } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { testBooks } from '@/utils/testData';
import BookAbout from '@/components/BookAbout';
import BookComments from '@/components/BookComments';

type TabType = 'about' | 'chapters' | 'comments';

const BookReader: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('about');
  const [isSaved, setIsSaved] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  
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

  // Function to copy book link
  const handleCopyLink = async () => {
    const bookUrl = window.location.href;
    try {
      await navigator.clipboard.writeText(bookUrl);
      toast({
        title: t('book.linkCopied') || 'Link copied',
        description: t('book.linkCopiedDescription') || 'Book link has been copied to clipboard',
      });
    } catch (error) {
      console.error('Failed to copy link:', error);
      toast({
        title: t('book.copyFailed') || 'Copy failed',
        description: t('book.copyFailedDescription') || 'Failed to copy link to clipboard',
        variant: 'destructive',
      });
    }
  };

  // Function to report issue
  const handleReportIssue = () => {
    toast({
      title: t('book.reportSubmitted') || 'Report submitted',
      description: t('book.reportSubmittedDescription') || 'Thank you for reporting this issue. We will review it shortly.',
    });
  };

  // Function to handle read action
  const handleRead = () => {
    setActiveTab('chapters');
    toast({
      title: t('book.startReading') || 'Started reading',
      description: t('book.startReadingDescription') || 'You can now read this book',
    });
  };

  // Function to handle save action
  const handleSave = () => {
    setIsSaved(!isSaved);
    toast({
      title: isSaved ? (t('book.removedFromSaved') || 'Removed from saved') : (t('book.addedToSaved') || 'Added to saved'),
      description: isSaved ? (t('book.removedFromSavedDescription') || 'Book removed from your saved list') : (t('book.addedToSavedDescription') || 'Book added to your saved list'),
    });
  };

  // Function to handle favorite action
  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
    toast({
      title: isFavorited ? (t('book.removedFromFavorites') || 'Removed from favorites') : (t('book.addedToFavorites') || 'Added to favorites'),
      description: isFavorited ? (t('book.removedFromFavoritesDescription') || 'Book removed from your favorites') : (t('book.addedToFavoritesDescription') || 'Book added to your favorites'),
    });
  };

  // Total number of parts/chapters
  const totalParts = 118;

  // Function to switch tabs
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  // Rendering content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'about':
        return <BookAbout book={book} totalParts={totalParts} />;
      case 'chapters':
        return (
          <ScrollArea className="flex-1 px-2 md:px-4">
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
        <div className="flex items-center justify-between p-3 md:p-4">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg md:text-xl font-semibold line-clamp-1 max-w-[60%]">{book.title}</h1>
          <ContextMenu>
            <ContextMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <span className="sr-only">{t('book.options')}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <circle cx="12" cy="12" r="1" />
                  <circle cx="12" cy="5" r="1" />
                  <circle cx="12" cy="19" r="1" />
                </svg>
              </Button>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem onClick={handleCopyLink}>
                <Link className="h-4 w-4 mr-2" />
                {t('book.copyLink') || 'Copy Link'}
              </ContextMenuItem>
              <ContextMenuItem onClick={handleReportIssue}>
                <Flag className="h-4 w-4 mr-2" />
                {t('book.reportIssue') || 'Report Issue'}
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        </div>
      </div>
      
      {/* Book cover and info section */}
      <div className="flex flex-col items-center p-4 md:p-6 mb-4 border-b">
        <div className="w-56 h-72 md:w-64 md:h-80 relative mb-4">
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
        
        <h2 className="text-xl md:text-2xl font-bold mt-3 md:mt-4 text-center px-2">{book.title}</h2>
        <p className="text-muted-foreground">{book.author}</p>
        
        {/* Action buttons */}
        <div className="w-full mt-5 md:mt-6 flex flex-col gap-3 px-2">
          <Button 
            onClick={handleRead}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
            size="lg"
          >
            <BookOpen className="h-5 w-5 mr-2" />
            {t('book.read') || 'Read'}
          </Button>
          
          <div className="flex gap-3">
            <Button 
              onClick={handleSave}
              variant={isSaved ? "default" : "outline"}
              className="flex-1"
            >
              <Bookmark className={`h-4 w-4 mr-2 ${isSaved ? 'fill-current' : ''}`} />
              {t('book.save') || 'Save'}
            </Button>
            
            <Button 
              onClick={handleFavorite}
              variant={isFavorited ? "default" : "outline"}
              className="flex-1"
            >
              <Heart className={`h-4 w-4 mr-2 ${isFavorited ? 'fill-current text-red-500' : ''}`} />
              {t('book.addToFavorites') || 'Favorites'}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Navigation tabs */}
      <div className="border-b">
        <div className="w-full flex justify-between text-xs md:text-sm text-center">
          <button 
            className={`flex-1 py-3 ${activeTab === 'about' ? 'font-medium border-b-2 border-primary' : ''}`}
            onClick={() => handleTabChange('about')}
          >
            {t('book.aboutWork') || 'About the Work'}
          </button>
          <button 
            className={`flex-1 py-3 ${activeTab === 'chapters' ? 'font-medium border-b-2 border-primary' : ''}`}
            onClick={() => handleTabChange('chapters')}
          >
            <span className="whitespace-nowrap">{t('book.chapters')} {totalParts}</span>
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
      <div className="flex-1 overflow-auto px-2 md:px-0">
        {renderContent()}
      </div>
    </div>
  );
};

export default BookReader;
