
import React from 'react';
import { BookX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';

interface EmptyStateProps {
  onClose: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onClose }) => {
  const { t } = useLanguage();
  
  return (
    <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto px-4 animate-slide-in">
      <div className="w-20 h-20 rounded-full bg-muted/30 flex items-center justify-center mb-6">
        <BookX className="h-10 w-10 text-muted-foreground" />
      </div>
      
      <h3 className="text-xl font-semibold mb-4">
        {t('search.notFound')}
      </h3>
      
      <Button 
        onClick={onClose}
        className="mt-6"
      >
        Вернуться
      </Button>
    </div>
  );
};

export default EmptyState;
