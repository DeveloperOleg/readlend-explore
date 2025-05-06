
import React, { useRef } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Hash } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';

interface BioSectionProps {
  form: UseFormReturn<any>;
}

const BioSection: React.FC<BioSectionProps> = ({ form }) => {
  const { t } = useLanguage();
  const bioTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  const addHashtag = () => {
    const bioField = form.getValues('bio') || '';
    const textarea = bioTextareaRef.current;
    
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      
      if (start === end) {
        const newBio = `${bioField.slice(0, start)}# ${bioField.slice(end)}`;
        form.setValue('bio', newBio);
        
        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(start + 2, start + 2);
        }, 0);
      } else {
        const selectedText = bioField.slice(start, end);
        const newBio = `${bioField.slice(0, start)}#${selectedText}${bioField.slice(end)}`;
        form.setValue('bio', newBio);
        
        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(end + 1, end + 1);
        }, 0);
      }
    } else {
      form.setValue('bio', `${bioField} #`);
    }
  };

  return (
    <FormField
      control={form.control}
      name="bio"
      render={({ field }) => (
        <FormItem>
          <div className="flex items-center justify-between">
            <FormLabel>{t('profile.bio') || 'О себе'}</FormLabel>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 px-2 text-xs flex items-center gap-1"
              onClick={addHashtag}
            >
              <Hash className="h-3 w-3" style={{ color: "#3B426E" }} />
              <span>{t('editor.hashtag') || 'Хэштег'}</span>
            </Button>
          </div>
          <FormControl>
            <Textarea 
              placeholder={t('profile.bioPlaceholder') || 'Расскажите что-нибудь о себе...'}
              className="min-h-[120px]"
              {...field}
              ref={(e) => {
                field.ref(e);
                bioTextareaRef.current = e;
              }}
            />
          </FormControl>
          <div className="mt-1 text-xs text-muted-foreground">
            <span>{t('profile.bioUseTips') || 'Совет:'} </span>
            <span style={{ color: "#3B426E" }}>#хэштеги</span> 
            {t('profile.bioUseHashtags') || ' можно использовать для выделения важных тем'}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default BioSection;
