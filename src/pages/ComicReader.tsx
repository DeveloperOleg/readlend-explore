
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
import BookComments from '@/components/BookComments';
import { ComicChapters } from '@/components/ComicChapters';
import { Badge } from '@/components/ui/badge';
import { Star, Eye } from 'lucide-react';

type TabType = 'about' | 'issues' | 'comments';

// Mock comics data
const mockComics = [
  {
    id: 'comic1',
    title: 'Русь: Правление',
    author: 'Павел Брятев',
    coverUrl: '/lovable-uploads/0fac89ed-334a-49b5-a9ab-7f0ee0a4be4d.png',
    description: 'Эпическая история о становлении великой державы и правителях, которые формировали судьбу народа.',
    rating: 9.2,
    totalRatings: 1547,
    totalIssues: 24,
    genre: 'Historical Fantasy',
    status: 'ongoing'
  },
  {
    id: 'comic2',
    title: 'Майор Гром',
    author: 'Сергей Железяка',
    coverUrl: '/lovable-uploads/7bf984f5-094b-4cf4-b63c-0a3cfa1b81e4.png',
    description: 'Супергеройский комикс о майоре полиции, который борется с преступностью в современном городе.',
    rating: 8.7,
    totalRatings: 892,
    totalIssues: 18,
    genre: 'Superhero',
    status: 'ongoing'
  },
  {
    id: 'comic3',
    title: 'Метро 2033: Часть 1.2',
    author: 'ChatGPT',
    coverUrl: null,
    description: 'Постапокалиптическая история выживания в московском метро после ядерной катастрофы.',
    rating: 8.1,
    totalRatings: 456,
    totalIssues: 12,
    genre: 'Post-Apocalyptic',
    status: 'completed'
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
  
  const comic = mockComics.find(c => c.id === comicId) || {
    id: comicId || 'unknown',
    title: 'Comic not found',
    author: 'Unknown',
    coverUrl: null,
    description: 'This comic is not available',
    rating: 0,
    totalRatings: 0,
    totalIssues: 0,
    genre: 'Unknown',
    status: 'unknown' as const
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
        return <ComicChapters comicId={comic.id} totalIssues={comic.totalIssues} />;
      case 'comments':
        return <BookComments bookId={comic.id} authorId="author1" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Comic cover section */}
      <div className="flex flex-col items-center pt-8 pb-6 px-4">
        <div className="relative w-48 h-72 mb-4">
          {comic.coverUrl ? (
            <img 
              src={comic.coverUrl} 
              alt={comic.title} 
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
            <span>{comic.rating}</span>
            <span className="text-xs text-gray-300 ml-1">{comic.totalRatings}</span>
          </div>
          
          {/* Genre badge */}
          <div className="absolute bottom-3 left-3 right-3">
            <Badge className="bg-orange-500 text-white hover:bg-orange-600 w-full justify-center">
              {comic.genre}
            </Badge>
          </div>
          
          {/* Status badge */}
          <div className="absolute bottom-3 right-3">
            <Badge variant="secondary" className="text-xs">
              {comic.status === 'ongoing' ? 'Продолжается' : 'Завершен'}
            </Badge>
          </div>
        </div>
        
        {/* Comic title and author */}
        <h1 className="text-xl font-bold text-center mb-1">{comic.title}</h1>
        <p className="text-muted-foreground text-center mb-6">{comic.author}</p>
        
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
            О комиксе
          </button>
          <button 
            className={`flex-1 py-3 px-4 text-sm font-medium ${
              activeTab === 'issues' 
                ? 'text-foreground border-b-2 border-orange-500' 
                : 'text-muted-foreground'
            }`}
            onClick={() => handleTabChange('issues')}
          >
            Выпуски {comic.totalIssues}
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

export default ComicReader;
