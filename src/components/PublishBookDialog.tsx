
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
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

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
    console.log({ title, authors, coverImage, description, content, releaseDate });
    // In a real app, you'd send this to your backend
    
    // Reset form
    resetForm();
    
    // Close dialog
    onOpenChange(false);
  };

  const handleSaveDraft = () => {
    // Save as draft logic
    console.log('Saving draft:', { title, authors, coverImage, description, content, releaseDate });
    
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
                  <Label htmlFor="authors">{t('publish.authors')}</Label>
                  <Input 
                    id="authors" 
                    value={authors} 
                    onChange={(e) => setAuthors(e.target.value)} 
                    placeholder={t('publish.authorsPlaceholder')} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>{t('publish.releaseDate')}</Label>
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
