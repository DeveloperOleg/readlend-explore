
import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookGenre, BookStatus } from '@/types/auth';
import BookInfoTab from './publish/BookInfoTab';
import BookContentTab from './publish/BookContentTab';

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
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="info">{t('publish.bookInfo')}</TabsTrigger>
            <TabsTrigger value="content">{t('publish.bookContent')}</TabsTrigger>
            <TabsTrigger value="cover">{t('publish.cover')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="info" className="space-y-4 py-4">
            <BookInfoTab 
              title={title}
              setTitle={setTitle}
              authors={authors}
              setAuthors={setAuthors}
              coverImage={coverImage}
              setCoverImage={setCoverImage}
              description={description}
              setDescription={setDescription}
              releaseDate={releaseDate}
              setReleaseDate={setReleaseDate}
              genre={genre}
              setGenre={setGenre}
              status={status}
              setStatus={setStatus}
              tags={tags}
              setTags={setTags}
            />
          </TabsContent>
          
          <TabsContent value="content" className="space-y-4 py-4">
            <BookContentTab 
              content={content}
              setContent={setContent}
            />
          </TabsContent>
          
          <TabsContent value="cover" className="space-y-4 py-4">
            <div className="flex flex-col items-center justify-center min-h-[300px] border-2 border-dashed border-muted-foreground/20 rounded-lg">
              {coverImage ? (
                <div className="space-y-4 text-center">
                  <img 
                    src={coverImage} 
                    alt={t('publish.cover')} 
                    className="max-h-[200px] mx-auto object-contain rounded" 
                  />
                  <Button variant="outline" onClick={() => setCoverImage(null)}>
                    {t('publish.changeCover')}
                  </Button>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <p className="text-muted-foreground">{t('publish.dropImage')}</p>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (e) => setCoverImage(e.target?.result as string);
                        reader.readAsDataURL(file);
                      }
                    }} 
                    className="hidden" 
                    id="cover-upload"
                  />
                  <Button 
                    variant="secondary" 
                    onClick={() => document.getElementById('cover-upload')?.click()}
                  >
                    {t('publish.selectImage')}
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="pt-4 space-y-3">
          <Button 
            onClick={handlePublish} 
            disabled={!title || !authors || !content}
            className="w-full"
          >
            {t('publish.publish')}
          </Button>
          <Button 
            variant="ghost"
            onClick={handleSaveDraft}
            className="w-full text-muted-foreground"
          >
            {t('publish.saveDraft')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PublishBookDialog;
