
import React from 'react';
import EmptyState from '@/components/EmptyState';
import { useLanguage } from '@/context/LanguageContext';
import { Trophy } from 'lucide-react';

const Achievements: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">{t('pages.achievements')}</h1>
      
      <div className="flex items-center justify-center py-12">
        <EmptyState 
          icon="book"
          title={t('pages.achievementEmpty')}
          description={t('pages.achievementEmptyDescription')}
          size="lg"
        />
      </div>
    </div>
  );
};

export default Achievements;
