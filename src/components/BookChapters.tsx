import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Clock, Eye } from 'lucide-react';

interface Chapter {
  id: string;
  title: string;
  duration: string;
  views: string;
  isRead: boolean;
}

interface BookChaptersProps {
  bookId: string;
}

const mockChapters: Chapter[] = [
  {
    id: '1',
    title: 'Встреча во дворце',
    duration: '15 мин',
    views: '37K',
    isRead: true
  },
  {
    id: '2',
    title: 'Тайны веера',
    duration: '18 мин',
    views: '25K',
    isRead: true
  },
  {
    id: '3',
    title: 'Первый урок магии',
    duration: '22 мин',
    views: '20K',
    isRead: true
  },
  {
    id: '4',
    title: 'Придворные интриги',
    duration: '16 мин',
    views: '23K',
    isRead: false
  },
  {
    id: '5',
    title: 'Испытание силы',
    duration: '20 мин',
    views: '20K',
    isRead: false
  },
  {
    id: '6',
    title: 'Раскрытие прошлого',
    duration: '25 мин',
    views: '20K',
    isRead: false
  },
  {
    id: '7',
    title: 'Союз или предательство',
    duration: '19 мин',
    views: '37K',
    isRead: false
  },
  {
    id: '8',
    title: 'Новые враги',
    duration: '21 мин',
    views: '39K',
    isRead: false
  }
];

export const BookChapters: React.FC<BookChaptersProps> = ({ bookId }) => {
  const { t } = useLanguage();

  const handleReadChapter = (chapterId: string) => {
    console.log('Reading chapter:', chapterId);
  };

  const handleRereadChapter = (chapterId: string) => {
    console.log('Re-reading chapter:', chapterId);
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      {mockChapters.map((chapter) => (
        <div key={chapter.id} className="flex flex-col gap-3 p-4 border rounded-lg">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0 mr-4">
              <h3 className="font-medium text-sm mb-2 leading-tight">
                Глава {chapter.id}: {chapter.title}
              </h3>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 flex-shrink-0" />
                  <span>{chapter.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-3 h-3 flex-shrink-0" />
                  <span>{chapter.views} просмотров</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            {chapter.isRead ? (
              <>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-emerald-600 border-emerald-600 hover:bg-emerald-600/10 dark:text-emerald-400 dark:border-emerald-400 dark:hover:bg-emerald-400/10"
                  onClick={() => handleReadChapter(chapter.id)}
                >
                  Прочитано
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-primary border-primary hover:bg-primary/10"
                  onClick={() => handleRereadChapter(chapter.id)}
                >
                  Перечитать
                </Button>
              </>
            ) : (
              <Button 
                variant="outline" 
                size="sm"
                className="text-primary border-primary hover:bg-primary/10"
                onClick={() => handleReadChapter(chapter.id)}
              >
                Читать
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};