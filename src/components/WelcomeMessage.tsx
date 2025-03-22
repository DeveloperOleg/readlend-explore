
import React from 'react';
import { X } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';

interface WelcomeMessageProps {
  onClose: () => void;
}

const WelcomeMessage: React.FC<WelcomeMessageProps> = ({ onClose }) => {
  const { t } = useLanguage();

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 glass p-4 rounded-lg animate-slide-in">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-lg">
          {t('welcome.title') || 'Привет, дорогие пользователи!'}
        </h3>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6 -mt-1 -mr-1">
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <p className="text-sm text-muted-foreground mb-3">
        {t('welcome.message') || 'Мы рады представить вам прототип нашей новой версии приложения! Это ранняя версия, и мы хотим, чтобы вы стали частью нашего пути к улучшению. Ваши отзывы и предложения помогут нам сделать приложение еще лучше.'}
      </p>
      
      <a 
        href="https://t.me/+LeR5l4MeHVE4NjBi" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="text-sm text-primary hover:underline"
      >
        {t('welcome.telegram') || 'Наш закрытый телеграм чат для тестирования'}
      </a>
      
      <p className="text-xs text-muted-foreground mt-3">
        {t('welcome.notice') || 'Обратите внимание, что некоторые функции могут работать нестабильно, а интерфейс может измениться. Мы ценим ваше терпение и поддержку в этом процессе!'}
      </p>
    </div>
  );
};

export default WelcomeMessage;
