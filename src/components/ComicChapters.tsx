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
    const currentLang = localStorage.getItem('language') || 'ru';
    return new Intl.DateTimeFormat(currentLang === 'en' ? 'en-US' : 'ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      {mockIssues.map((issue) => (
        <div key={issue.id} className="flex flex-col gap-3 p-4 border rounded-lg">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0 mr-4">
              <h3 className="font-medium text-sm mb-2 leading-tight">
                {t('comic.issue') || 'Выпуск'} #{issue.number}
              </h3>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>{formatDate(issue.releaseDate)}</span>
                <div className="flex items-center gap-1">
                  <BookOpen className="w-3 h-3 flex-shrink-0" />
                  <span>{issue.pages} {t('comic.pages') || 'стр.'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-3 h-3 flex-shrink-0" />
                  <span>{issue.views.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            {issue.isRead ? (
              <>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-emerald-600 border-emerald-600 hover:bg-emerald-600/10 dark:text-emerald-400 dark:border-emerald-400 dark:hover:bg-emerald-400/10"
                  onClick={() => handleReadIssue(issue.id)}
                >
                  {t('comic.read') || 'Прочитано'}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-primary border-primary hover:bg-primary/10"
                  onClick={() => handleRereadIssue(issue.id)}
                >
                  {t('comic.reread') || 'Перечитать'}
                </Button>
              </>
            ) : (
              <Button 
                variant="outline" 
                size="sm"
                className="text-primary border-primary hover:bg-primary/10"
                onClick={() => handleReadIssue(issue.id)}
              >
                {t('comic.readButton') || 'Читать'}
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};