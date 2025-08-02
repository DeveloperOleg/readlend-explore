
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, Book, Link, Flag, BookOpen, Bookmark, Heart, Star, Eye } from 'lucide-react';
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
import { BookChapters } from '@/components/BookChapters';

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
        return <BookChapters bookId={book.id} />;
      case 'comments':
        return <BookComments bookId={book.id} authorId="author1" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Book cover section */}
      <div className="flex flex-col items-center pt-8 pb-6 px-4">
        <div className="relative w-48 h-72 mb-4">
          {book.coverUrl ? (
            <img 
              src={book.coverUrl} 
              alt={book.title} 
              className="object-cover w-full h-full rounded-xl shadow-lg" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted rounded-xl">
              <Book className="h-16 w-16 text-muted-foreground" />
            </div>
          )}
          
          {/* Rating badge on cover */}
          <div className="absolute top-3 left-3 flex items-center bg-black/80 text-amber-400 rounded-full px-2 py-1 text-sm">
            <Star className="w-4 h-4 fill-current mr-1" />
            <span>9.6</span>
            <span className="text-xs text-gray-300 ml-1">2.7K</span>
          </div>
          
          {/* Genre badge */}
          <div className="absolute bottom-3 left-3 right-3">
            <Badge className="bg-orange-500 text-white hover:bg-orange-600 w-full justify-center">
              Фэнтези
            </Badge>
          </div>
          
        
        {/* Book title and author */}
        <h1 className="text-xl font-bold text-center mb-1">{book.title}</h1>
        <p className="text-muted-foreground text-center mb-6">{book.author}</p>
        
        {/* Action buttons */}
        <div className="w-full max-w-sm space-y-3">
          <Button 
            onClick={handleRead}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium"
            size="lg"
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Читать
          </Button>
          
          <div className="flex gap-3">
            <Button 
              onClick={handleSave}
              variant="outline"
              className="flex-1"
            >
              <Bookmark className="h-4 w-4 mr-2" />
              Сохранить
            </Button>
            
            <Button 
              onClick={handleFavorite}
              variant="outline"
              className="flex-1"
            >
              <Heart className="h-4 w-4 mr-2" />
              В избранное
            </Button>
          </div>
        </div>
      </div>
      
      {/* Tab navigation */}
      <div className="border-b bg-background sticky top-0 z-10">
        <div className="flex">
          <button 
            className={`flex-1 py-3 px-4 text-sm font-medium ${
              activeTab === 'about' 
                ? 'text-foreground border-b-2 border-orange-500' 
                : 'text-muted-foreground'
            }`}
            onClick={() => handleTabChange('about')}
          >
            О произведении
          </button>
          <button 
            className={`flex-1 py-3 px-4 text-sm font-medium ${
              activeTab === 'chapters' 
                ? 'text-foreground border-b-2 border-orange-500' 
                : 'text-muted-foreground'
            }`}
            onClick={() => handleTabChange('chapters')}
          >
            Главы {totalParts}
          </button>
          <button 
            className={`flex-1 py-3 px-4 text-sm font-medium ${
              activeTab === 'comments' 
                ? 'text-foreground border-b-2 border-orange-500' 
                : 'text-muted-foreground'
            }`}
            onClick={() => handleTabChange('comments')}
          >
            Комментарии
          </button>
        </div>
      </div>
      
      {/* Content area */}
      <div className="flex-1 overflow-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default BookReader;
