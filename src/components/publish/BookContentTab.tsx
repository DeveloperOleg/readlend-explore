
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Label } from '@/components/ui/label';
import TextEditor from '../TextEditor';

interface BookContentTabProps {
  content: string;
  setContent: (value: string) => void;
}

const BookContentTab: React.FC<BookContentTabProps> = ({ content, setContent }) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-2">
      <Label htmlFor="content">{t('publish.content')}</Label>
      <TextEditor 
        content={content} 
        onChange={setContent} 
      />
    </div>
  );
};

export default BookContentTab;
