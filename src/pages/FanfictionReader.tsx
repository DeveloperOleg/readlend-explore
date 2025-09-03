import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Bookmark, Share2, MoreVertical } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const FanfictionReader: React.FC = () => {
  const { fanfictionId } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Sample fanfiction data - replace with actual API call
  const fanfiction = {
    id: fanfictionId,
    title: 'Sample Fanfiction Title',
    author: 'Fanfiction Author',
    chapter: 'Chapter 1',
    description: 'This is a sample fanfiction description. In a real app, this would come from your API.',
    coverUrl: null,
    totalChapters: 15,
    currentChapter: 1,
    wordCount: 2500
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
            <h1 className="text-lg font-semibold truncate">{fanfiction.title}</h1>
            <p className="text-sm text-muted-foreground">{fanfiction.chapter}</p>
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
            <h2>{fanfiction.title}</h2>
            <p className="text-muted-foreground mb-4">
              {t('fanfiction.chapter')} {fanfiction.currentChapter} / {fanfiction.totalChapters} • {fanfiction.wordCount} {t('fanfiction.words')} • {fanfiction.author}
            </p>
            
            <div className="bg-muted/30 rounded-lg p-6 mb-6">
              <p>{fanfiction.description}</p>
            </div>
            
            <div className="space-y-4">
              <p>This is where the fanfiction content would be displayed. In a real application, you would:</p>
              <ul>
                <li>Load fanfiction text from your API</li>
                <li>Implement chapter navigation</li>
                <li>Add reading progress tracking</li>
                <li>Include bookmarking functionality</li>
                <li>Add reading settings (font size, theme, etc.)</li>
                <li>Show author notes and comments</li>
              </ul>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default FanfictionReader;