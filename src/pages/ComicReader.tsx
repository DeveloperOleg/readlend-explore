
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Book, Link, Flag, BookOpen, Bookmark, Heart } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import ComicAbout from '@/components/ComicAbout';
import ComicComments from '@/components/ComicComments';

type TabType = 'about' | 'issues' | 'comments';

// Mock comics data (similar to testBooks but for comics)
const testComics = [
  {
    id: 'comic1',
    title: 'Русь: Правление',
    author: 'Павел Брятев',
    coverUrl: '/lovable-uploads/0fac89ed-334a-49b5-a9ab-7f0ee0a4be4d.png',
    description: 'Эпическая история о правлении древней Руси, полная интриг и героических подвигов',
    content: 'Комикс о великих князьях и их борьбе за власть...',
    rating: 4.7,
    totalRatings: 1543,
    issues: 24
  },
  {
    id: 'comic2',
    title: 'Майор Гром',
    author: 'Сергей Железяка',
    coverUrl: '/lovable-uploads/7bf984f5-094b-4cf4-b63c-0a3cfa1b81e4.png',
    description: 'Приключения бескомпромиссного полицейского в современном городе',
    content: 'Майор Гром сражается с преступностью...',
    rating: 4.5,
    totalRatings: 2187,
    issues: 18
  },
  {
    id: 'comic3',
    title: 'Метро 2033: Часть 1.2',
    author: 'ChatGPT',
    coverUrl: null,
    description: 'Графическая адаптация популярного постапокалиптического романа',
    content: 'Жизнь в московском метро после ядерной катастрофы...',
    rating: 4.3,
    totalRatings: 876,
    issues: 12
  }
];

const ComicReader: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { comicId } = useParams<{ comicId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('about');
  const [isSaved, setIsSaved] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  
  const comic = testComics.find(c => c.id === comicId) || 
    { 
      id: comicId || 'unknown', 
      title: 'Comic not found', 
      author: 'Unknown',
      coverUrl: null,
      description: 'This comic is not available',
      content: 'The requested comic could not be found',
      rating: 0,
      totalRatings: 0,
      issues: 0
    };

  const handleBack = () => {
    navigate(-1);
  };

  const handleCopyLink = async () => {
    const comicUrl = window.location.href;
    try {
      await navigator.clipboard.writeText(comicUrl);
      toast({
        title: t('comic.linkCopied') || 'Link copied',
        description: t('comic.linkCopiedDescription') || 'Comic link has been copied to clipboard',
      });
    } catch (error) {
      console.error('Failed to copy link:', error);
      toast({
        title: t('comic.copyFailed') || 'Copy failed',
        description: t('comic.copyFailedDescription') || 'Failed to copy link to clipboard',
        variant: 'destructive',
      });
    }
  };

  const handleReportIssue = () => {
    toast({
      title: t('comic.reportSubmitted') || 'Report submitted',
      description: t('comic.reportSubmittedDescription') || 'Thank you for reporting this issue. We will review it shortly.',
    });
  };

  const handleRead = () => {
    setActiveTab('issues');
    toast({
      title: t('comic.startReading') || 'Started reading',
      description: t('comic.startReadingDescription') || 'You can now read this comic',
    });
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    toast({
      title: isSaved ? (t('comic.removedFromSaved') || 'Removed from saved') : (t('comic.addedToSaved') || 'Added to saved'),
      description: isSaved ? (t('comic.removedFromSavedDescription') || 'Comic removed from your saved list') : (t('comic.addedToSavedDescription') || 'Comic added to your saved list'),
    });
  };

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
    toast({
      title: isFavorited ? (t('comic.removedFromFavorites') || 'Removed from favorites') : (t('comic.addedToFavorites') || 'Added to favorites'),
      description: isFavorited ? (t('comic.removedFromFavoritesDescription') || 'Comic removed from your favorites') : (t('comic.addedToFavoritesDescription') || 'Comic added to your favorites'),
    });
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'about':
        return <ComicAbout comic={comic} />;
      case 'issues':
        return (
          <ScrollArea className="flex-1 px-2 md:px-4">
            <div className="max-w-prose mx-auto py-6">
              {comic.content || 'Comic content will be here...'}
            </div>
          </ScrollArea>
        );
      case 'comments':
        return <ComicComments comicId={comic.id} authorId="author1" />;
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
          <h1 className="text-lg md:text-xl font-semibold line-clamp-1 max-w-[60%]">{comic.title}</h1>
          <ContextMenu>
            <ContextMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <span className="sr-only">{t('comic.options')}</span>
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
                {t('comic.copyLink') || 'Copy Link'}
              </ContextMenuItem>
              <ContextMenuItem onClick={handleReportIssue}>
                <Flag className="h-4 w-4 mr-2" />
                {t('comic.reportIssue') || 'Report Issue'}
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        </div>
      </div>
      
      {/* Comic cover and info section */}
      <div className="flex flex-col items-center p-4 md:p-6 mb-4 border-b">
        <div className="w-56 h-72 md:w-64 md:h-80 relative mb-4">
          {comic.coverUrl ? (
            <img 
              src={comic.coverUrl} 
              alt={comic.title} 
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
            <span className="ml-1">{comic.rating.toFixed(1)}</span>
            <span className="ml-2 text-gray-300 text-xs">{comic.totalRatings}</span>
          </div>
        </div>
        
        <h2 className="text-xl md:text-2xl font-bold mt-3 md:mt-4 text-center px-2">{comic.title}</h2>
        <p className="text-muted-foreground">{comic.author}</p>
        
        {/* Action buttons */}
        <div className="w-full mt-5 md:mt-6 flex flex-col gap-3 px-2">
          <Button 
            onClick={handleRead}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
            size="lg"
          >
            <BookOpen className="h-5 w-5 mr-2" />
            {t('comic.read') || 'Read'}
          </Button>
          
          <div className="flex gap-3">
            <Button 
              onClick={handleSave}
              variant={isSaved ? "default" : "outline"}
              className="flex-1"
            >
              <Bookmark className={`h-4 w-4 mr-2 ${isSaved ? 'fill-current' : ''}`} />
              {t('comic.save') || 'Save'}
            </Button>
            
            <Button 
              onClick={handleFavorite}
              variant={isFavorited ? "default" : "outline"}
              className="flex-1"
            >
              <Heart className={`h-4 w-4 mr-2 ${isFavorited ? 'fill-current text-red-500' : ''}`} />
              {t('comic.addToFavorites') || 'Favorites'}
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
            {t('comic.aboutComic') || 'About the Comic'}
          </button>
          <button 
            className={`flex-1 py-3 ${activeTab === 'issues' ? 'font-medium border-b-2 border-primary' : ''}`}
            onClick={() => handleTabChange('issues')}
          >
            <span className="whitespace-nowrap">{t('comic.issues')} {comic.issues}</span>
          </button>
          <button 
            className={`flex-1 py-3 ${activeTab === 'comments' ? 'font-medium border-b-2 border-primary' : ''}`}
            onClick={() => handleTabChange('comments')}
          >
            {t('comic.comments')}
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

export default ComicReader;
