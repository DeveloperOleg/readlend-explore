import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Eye, BookOpen } from 'lucide-react';

interface ComicIssue {
  id: string;
  number: number;
  title: string;
  releaseDate: Date;
  pages: number;
  views: number;
  isRead: boolean;
}

interface ComicChaptersProps {
  comicId: string;
  totalIssues: number;
}

export const ComicChapters: React.FC<ComicChaptersProps> = ({ comicId, totalIssues }) => {
  const { t } = useLanguage();

  // Mock issues data
  const mockIssues: ComicIssue[] = Array.from({ length: totalIssues }, (_, i) => ({
    id: `${comicId}-issue-${i + 1}`,
    number: i + 1,
    title: `Issue #${i + 1}`,
    releaseDate: new Date(Date.now() - (totalIssues - i) * 7 * 24 * 60 * 60 * 1000),
    pages: Math.floor(Math.random() * 20) + 15,
    views: Math.floor(Math.random() * 10000) + 1000,
    isRead: Math.random() > 0.7,
  }));

  const handleReadIssue = (issueId: string) => {
    console.log('Reading issue:', issueId);
  };

  const handleRereadIssue = (issueId: string) => {
    console.log('Re-reading issue:', issueId);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="space-y-4 p-4">
      {mockIssues.map((issue) => (
        <div 
          key={issue.id} 
          className="border rounded-lg p-4 space-y-3 hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-medium text-lg">{issue.title}</h3>
              <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                <span>{formatDate(issue.releaseDate)}</span>
                <span className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  {issue.pages} стр.
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {issue.views.toLocaleString()}
                </span>
              </div>
            </div>
            
            <div className="ml-4">
              {issue.isRead ? (
                <div className="flex flex-col gap-2">
                  <span className="text-xs text-green-600 font-medium">Прочитано</span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleRereadIssue(issue.id)}
                  >
                    Перечитать
                  </Button>
                </div>
              ) : (
                <Button 
                  onClick={() => handleReadIssue(issue.id)}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  Читать
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};