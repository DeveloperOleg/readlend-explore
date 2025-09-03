import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Bookmark, Share2, MoreVertical } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const MangaReader: React.FC = () => {
  const { mangaId } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Sample manga data - replace with actual API call
  const manga = {
    id: mangaId,
    title: 'Sample Manga Title',
    author: 'Manga Author',
    chapter: 'Chapter 1',
    description: 'This is a sample manga description. In a real app, this would come from your API.',
    coverUrl: null,
    totalChapters: 25,
    currentChapter: 1
  };

  const handleBack = () => {
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="flex items-center justify-between p-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleBack}
            className="h-9 w-9"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          
          <div className="flex-1 text-center">
            <h1 className="text-lg font-semibold truncate">{manga.title}</h1>
            <p className="text-sm text-muted-foreground">{manga.chapter}</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Bookmark className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="h-[calc(100vh-80px)]">
        <div className="p-6">
          <div className="prose prose-gray max-w-none dark:prose-invert">
            <h2>{manga.title}</h2>
            <p className="text-muted-foreground mb-4">
              {t('manga.chapter')} {manga.currentChapter} / {manga.totalChapters} • {manga.author}
            </p>
            
            <div className="bg-muted/30 rounded-lg p-6 mb-6">
              <p>{manga.description}</p>
            </div>
            
            <div className="space-y-4">
              <p>This is where the manga content would be displayed. In a real application, you would:</p>
              <ul>
                <li>Load manga pages/images from your API</li>
                <li>Implement page navigation</li>
                <li>Add reading progress tracking</li>
                <li>Include chapter selection</li>
                <li>Add reading settings (zoom, reading direction, etc.)</li>
              </ul>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default MangaReader;