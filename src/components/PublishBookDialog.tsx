
import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TextEditor from './TextEditor';

interface PublishBookDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PublishBookDialog: React.FC<PublishBookDialogProps> = ({ open, onOpenChange }) => {
  const { t } = useLanguage();
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  
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
    console.log({ title, author, coverImage, description, content });
    // In a real app, you'd send this to your backend
    
    // Reset form
    setTitle('');
    setAuthor('');
    setCoverImage(null);
    setDescription('');
    setContent('');
    
    // Close dialog
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('publish.title') || 'Опубликовать книгу'}</DialogTitle>
          <DialogDescription>
            {t('publish.description') || 'Заполните информацию о вашей книге и отредактируйте содержимое перед публикацией.'}
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="info" className="mt-4">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="info">{t('publish.bookInfo') || 'Информация о книге'}</TabsTrigger>
            <TabsTrigger value="content">{t('publish.bookContent') || 'Содержание книги'}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="info" className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">{t('publish.bookTitle') || 'Название книги'}</Label>
                  <Input 
                    id="title" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    placeholder={t('publish.titlePlaceholder') || 'Введите название книги'} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="author">{t('publish.author') || 'Автор'}</Label>
                  <Input 
                    id="author" 
                    value={author} 
                    onChange={(e) => setAuthor(e.target.value)} 
                    placeholder={t('publish.authorPlaceholder') || 'Введите имя автора'} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">{t('publish.description') || 'Описание книги'}</Label>
                  <TextEditor 
                    content={description} 
                    onChange={setDescription} 
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <Label htmlFor="cover">{t('publish.coverImage') || 'Обложка книги'}</Label>
                <div className="border rounded-md p-4 text-center">
                  {coverImage ? (
                    <div className="space-y-4">
                      <img 
                        src={coverImage} 
                        alt={t('publish.cover') || 'Обложка'} 
                        className="max-h-[300px] mx-auto object-contain rounded" 
                      />
                      <Button variant="outline" size="sm" onClick={() => setCoverImage(null)}>
                        {t('publish.changeCover') || 'Изменить обложку'}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="border-2 border-dashed border-muted-foreground/20 rounded-md p-8 flex flex-col items-center justify-center">
                        <p className="text-sm text-muted-foreground mb-2">
                          {t('publish.dropImage') || 'Перетащите изображение сюда или нажмите для выбора'}
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
                          {t('publish.selectImage') || 'Выбрать изображение'}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {t('publish.recommendedSize') || 'Рекомендуемый размер: 800×1200 пикселей'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="content" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="content">{t('publish.content') || 'Содержание книги'}</Label>
              <TextEditor 
                content={content} 
                onChange={setContent} 
              />
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('publish.cancel') || 'Отмена'}
          </Button>
          <Button onClick={handlePublish} disabled={!title || !author || !content}>
            {t('publish.publish') || 'Опубликовать'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PublishBookDialog;
