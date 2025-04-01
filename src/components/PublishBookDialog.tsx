
import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TextEditor from './TextEditor';
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
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PublishBookDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PublishBookDialog: React.FC<PublishBookDialogProps> = ({ open, onOpenChange }) => {
  const { t } = useLanguage();
  const [title, setTitle] = useState('');
  const [authors, setAuthors] = useState('');
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [releaseDate, setReleaseDate] = useState<Date | undefined>(undefined);
  const [genre, setGenre] = useState<BookGenre | ''>('');
  const [status, setStatus] = useState<BookStatus>('published');
  const [tags, setTags] = useState<string[]>([]);
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
  
  const handlePublish = () => {
    // Here you would handle the book publication
    console.log({ 
      title, 
      authors, 
      coverImage, 
      description, 
      content, 
      releaseDate,
      genre,
      status,
      tags
    });
    // In a real app, you'd send this to your backend
    
    // Reset form
    resetForm();
    
    // Close dialog
    onOpenChange(false);
  };

  const handleSaveDraft = () => {
    // Save as draft logic
    console.log('Saving draft:', { 
      title, 
      authors, 
      coverImage, 
      description, 
      content, 
      releaseDate,
      genre,
      status,
      tags
    });
    
    // In a real app, you'd save this to local storage or backend
    
    // Don't reset the form, just close the dialog
    onOpenChange(false);
  };
  
  const resetForm = () => {
    setTitle('');
    setAuthors('');
    setCoverImage(null);
    setDescription('');
    setContent('');
    setReleaseDate(undefined);
    setGenre('');
    setStatus('published');
    setTags([]);
    setTagInput('');
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('publish.title')}</DialogTitle>
          <DialogDescription>
            {t('publish.description')}
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="info" className="mt-4">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="info">{t('publish.bookInfo')}</TabsTrigger>
            <TabsTrigger value="content">{t('publish.bookContent')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="info" className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">{t('publish.bookTitle')}</Label>
                  <Input 
                    id="title" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    placeholder={t('publish.titlePlaceholder')} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="authors">{t('publish.author')}</Label>
                  <Input 
                    id="authors" 
                    value={authors} 
                    onChange={(e) => setAuthors(e.target.value)} 
                    placeholder={t('publish.authorPlaceholder')} 
                  />
                  <p className="text-xs text-muted-foreground">
                    {t('publish.multipleAuthorsHint')}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="genre">Жанр книги</Label>
                  <Select value={genre} onValueChange={(value) => setGenre(value as BookGenre)}>
                    <SelectTrigger id="genre">
                      <SelectValue placeholder="Выберите жанр" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fiction">Художественная литература</SelectItem>
                      <SelectItem value="non-fiction">Нон-фикшн</SelectItem>
                      <SelectItem value="fantasy">Фэнтези</SelectItem>
                      <SelectItem value="sci-fi">Научная фантастика</SelectItem>
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

                <div className="space-y-2">
                  <Label htmlFor="status">Статус книги</Label>
                  <Select value={status} onValueChange={(value) => setStatus(value as BookStatus)}>
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Выберите статус" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="published">Опубликована</SelectItem>
                      <SelectItem value="draft">Черновик</SelectItem>
                      <SelectItem value="in-progress">В процессе написания</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>{t('publish.releaseDate')}</Label>
                  <div className="flex gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
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
                      className="whitespace-nowrap"
                    >
                      Сегодня
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Метки (теги)</Label>
                  <div className="flex gap-2">
                    <Input
                      id="tags"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Добавьте теги"
                    />
                    <Button 
                      type="button" 
                      onClick={addTag} 
                      variant="secondary"
                      size="icon"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <ScrollArea className="h-20 w-full">
                    <div className="flex flex-wrap gap-2 mt-2">
                      {tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {tag}
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-4 w-4 p-0" 
                            onClick={() => removeTag(tag)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">{t('publish.description')}</Label>
                  <TextEditor 
                    content={description} 
                    onChange={setDescription} 
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <Label htmlFor="cover">{t('publish.coverImage')}</Label>
                <div className="border rounded-md p-4 text-center">
                  {coverImage ? (
                    <div className="space-y-4">
                      <img 
                        src={coverImage} 
                        alt={t('publish.cover')} 
                        className="max-h-[300px] mx-auto object-contain rounded" 
                      />
                      <Button variant="outline" size="sm" onClick={() => setCoverImage(null)}>
                        {t('publish.changeCover')}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="border-2 border-dashed border-muted-foreground/20 rounded-md p-8 flex flex-col items-center justify-center">
                        <p className="text-sm text-muted-foreground mb-2">
                          {t('publish.dropImage')}
                        </p>
                        <Input 
                          id="cover" 
                          type="file" 
                          accept="image/*" 
                          onChange={handleImageUpload} 
                          className="hidden" 
                        />
                        <Button 
                          variant="secondary" 
                          onClick={() => document.getElementById('cover')?.click()}
                        >
                          {t('publish.selectImage')}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {t('publish.recommendedSize')}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="content" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="content">{t('publish.content')}</Label>
              <TextEditor 
                content={content} 
                onChange={setContent} 
              />
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="pt-4 flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('publish.cancel')}
          </Button>
          <Button 
            variant="secondary"
            onClick={handleSaveDraft}
          >
            {t('publish.saveDraft')}
          </Button>
          <Button 
            onClick={handlePublish} 
            disabled={!title || !authors || !content}
          >
            {t('publish.publish')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PublishBookDialog;
