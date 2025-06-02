
import React from 'react';
import EmptyState from '@/components/EmptyState';
import { useLanguage } from '@/context/LanguageContext';
import { Trophy, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Achievements: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  return (
    <div className="container py-8">
      <div className="flex items-center gap-3 mb-6">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate(-1)}
          className="h-8 w-8"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">{t('pages.achievements')}</h1>
      </div>
      
      <div className="flex items-center justify-center py-12">
        <EmptyState 
          icon="trophy"
          title={t('pages.achievementEmpty')}
          description={t('pages.achievementEmptyDescription')}
          size="lg"
        />
      </div>
    </div>
  );
};

export default Achievements;
