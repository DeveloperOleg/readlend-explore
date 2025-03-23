
import React from 'react';
import { BookX, User, Ban } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: 'book' | 'user' | 'ban';
  onClose?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  title, 
  description, 
  icon = 'book',
  onClose 
}) => {
  const { t } = useLanguage();
  
  const getIcon = () => {
    switch(icon) {
      case 'user':
        return <User className="h-10 w-10 text-muted-foreground" />;
      case 'ban':
        return <Ban className="h-10 w-10 text-muted-foreground" />;
      case 'book':
      default:
        return <BookX className="h-10 w-10 text-muted-foreground" />;
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto px-4 animate-slide-in">
      <div className="w-20 h-20 rounded-full bg-muted/30 flex items-center justify-center mb-6">
        {getIcon()}
      </div>
      
      <h3 className="text-xl font-semibold mb-4">
        {title}
      </h3>
      
      <p className="text-muted-foreground">
        {description}
      </p>
      
      {onClose && (
        <Button 
          onClick={onClose}
          className="mt-6"
        >
          {t('common.back') || 'Вернуться'}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
