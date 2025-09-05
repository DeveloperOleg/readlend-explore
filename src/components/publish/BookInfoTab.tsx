
import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, X, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BookGenre, BookStatus } from '@/types/auth';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import TextEditor from '../TextEditor';

interface BookInfoTabProps {
  title: string;
  setTitle: (value: string) => void;
  authors: string;
  setAuthors: (value: string) => void;
  coverImage: string | null;
  setCoverImage: (value: string | null) => void;
  description: string;
  setDescription: (value: string) => void;
  releaseDate: Date | undefined;
  setReleaseDate: (value: Date | undefined) => void;
  genre: BookGenre | '';
  setGenre: (value: BookGenre | '') => void;
  status: BookStatus;
  setStatus: (value: BookStatus) => void;
  tags: string[];
  setTags: (value: string[]) => void;
}

const BookInfoTab: React.FC<BookInfoTabProps> = ({
  title,
  setTitle,
  authors,
  setAuthors,
  coverImage,
  setCoverImage,
  description,
  setDescription,
  releaseDate,
  setReleaseDate,
  genre,
  setGenre,
  status,
  setStatus,
  tags,
  setTags
}) => {
  const { t } = useLanguage();
  const [tagInput, setTagInput] = useState('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCoverImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const setTodayAsReleaseDate = () => {
    setReleaseDate(new Date());
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="bg-card p-4 rounded-lg border space-y-3">
          <Label htmlFor="title" className="text-sm font-medium">{t('publish.bookTitle')}</Label>
          <Input 
            id="title" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder={t('publish.titlePlaceholder')}
            className="h-12 rounded-lg border-2 focus:border-primary"
          />
        </div>
        
        <div className="bg-card p-4 rounded-lg border space-y-3">
          <Label htmlFor="authors" className="text-sm font-medium">{t('publish.author')}</Label>
          <Input 
            id="authors" 
            value={authors} 
            onChange={(e) => setAuthors(e.target.value)} 
            placeholder={t('publish.authorPlaceholder')}
            className="h-12 rounded-lg border-2 focus:border-primary"
          />
          <p className="text-xs text-muted-foreground">
            {t('publish.multipleAuthorsHint')}
          </p>
        </div>

        <div className="bg-card p-4 rounded-lg border space-y-3">
          <Label htmlFor="genre" className="text-sm font-medium">Жанр</Label>
          <Select value={genre} onValueChange={(value) => setGenre(value as BookGenre)}>
            <SelectTrigger id="genre" className="h-12 rounded-lg border-2 focus:border-primary">
              <SelectValue placeholder="Выберите жанр" />
            </SelectTrigger>
            <SelectContent className="rounded-lg">
              <SelectItem value="fiction">Художественная литература</SelectItem>
              <SelectItem value="non-fiction">Нон-фикшн</SelectItem>
              <SelectItem value="fantasy">Фэнтези</SelectItem>
              <SelectItem value="sci-fi">Научная фантастика</SelectItem>
              <SelectItem value="fan-fiction">Фанфик</SelectItem>
              <SelectItem value="manga">Манга</SelectItem>
              <SelectItem value="comic-book">Комикс</SelectItem>
              <SelectItem value="romance">Романтика</SelectItem>
              <SelectItem value="thriller">Триллер</SelectItem>
              <SelectItem value="mystery">Детектив</SelectItem>
              <SelectItem value="horror">Хоррор</SelectItem>
              <SelectItem value="biography">Биография</SelectItem>
              <SelectItem value="history">История</SelectItem>
              <SelectItem value="poetry">Поэзия</SelectItem>
              <SelectItem value="children">Детская литература</SelectItem>
              <SelectItem value="young-adult">Подростковая литература</SelectItem>
              <SelectItem value="educational">Образовательная литература</SelectItem>
              <SelectItem value="other">Другое</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="bg-card p-4 rounded-lg border space-y-3">
          <Label htmlFor="status" className="text-sm font-medium">Статус книги</Label>
          <Select value={status} onValueChange={(value) => setStatus(value as BookStatus)}>
            <SelectTrigger id="status" className="h-12 rounded-lg border-2 focus:border-primary">
              <SelectValue placeholder="Выберите статус" />
            </SelectTrigger>
            <SelectContent className="rounded-lg">
              <SelectItem value="published">Опубликована</SelectItem>
              <SelectItem value="draft">Черновик</SelectItem>
              <SelectItem value="in-progress">В процессе написания</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="bg-card p-4 rounded-lg border space-y-3">
          <Label className="text-sm font-medium">{t('publish.releaseDate')}</Label>
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "flex-1 h-12 justify-start text-left font-normal rounded-lg border-2",
                    !releaseDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {releaseDate ? format(releaseDate, 'PPP') : t('publish.selectDate')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={releaseDate}
                  onSelect={setReleaseDate}
                  initialFocus
                  className="p-3 pointer-events-auto"
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
            <Button 
              variant="secondary" 
              onClick={setTodayAsReleaseDate} 
              className="h-12 px-4 whitespace-nowrap rounded-lg border-2"
            >
              Сегодня
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookInfoTab;
