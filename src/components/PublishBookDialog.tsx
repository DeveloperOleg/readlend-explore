
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
      <DialogContent className="sm:max-w-[520px] max-h-[90vh] flex flex-col">
        <DialogHeader className="pb-4 shrink-0">
          <DialogTitle className="text-lg font-semibold">{t('publish.title')}</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 flex flex-col min-h-0">
          <Tabs defaultValue="info" className="flex flex-col h-full">
            <TabsList className="grid grid-cols-3 mb-4 bg-muted rounded-lg p-1 shrink-0">
              <TabsTrigger value="info" className="rounded-md">{t('publish.bookInfo')}</TabsTrigger>
              <TabsTrigger value="content" className="rounded-md">{t('publish.bookContent')}</TabsTrigger>
              <TabsTrigger value="cover" className="rounded-md">{t('publish.cover')}</TabsTrigger>
            </TabsList>
            
            <div className="flex-1 overflow-y-auto px-1">
              <TabsContent value="info" className="mt-0 pb-4">
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
              
              <TabsContent value="content" className="mt-0 pb-4">
                <BookContentTab 
                  content={content}
                  setContent={setContent}
                />
              </TabsContent>
              
              <TabsContent value="cover" className="mt-0 pb-4">
                <div className="flex flex-col items-center justify-center min-h-[300px] border-2 border-dashed border-muted-foreground/20 rounded-xl bg-muted/10 p-6">
                  {coverImage ? (
                    <div className="space-y-4 text-center">
                      <img 
                        src={coverImage} 
                        alt={t('publish.cover')} 
                        className="max-h-[200px] mx-auto object-contain rounded-lg shadow-md" 
                      />
                      <Button variant="outline" onClick={() => setCoverImage(null)} className="rounded-lg">
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
                        className="rounded-lg"
                      >
                        {t('publish.selectImage')}
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
        
        <div className="pt-4 space-y-3 border-t bg-background shrink-0">
          <Button 
            onClick={handlePublish} 
            disabled={!title || !authors || !content}
            className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-xl transition-colors autumn-theme:bg-autumn-button autumn-theme:text-white autumn-theme:hover:bg-autumn-accent"
          >
            {t('publish.publish')}
          </Button>
          <Button 
            variant="outline"
            onClick={handleSaveDraft}
            className="w-full h-12 border-2 hover:bg-muted/50 font-medium rounded-xl transition-colors autumn-theme:border-autumn-button autumn-theme:bg-white/90 autumn-theme:text-autumn-button autumn-theme:hover:bg-autumn-button autumn-theme:hover:text-white"
          >
            {t('publish.saveDraft')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PublishBookDialog;
