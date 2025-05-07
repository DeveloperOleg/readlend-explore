
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import LanguageSettingsComponent from '@/components/LanguageSettings';

const LanguageSettingsPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="container px-2 pb-14">
      <div className="flex items-center gap-2 my-4">
        <Button variant="ghost" size="icon" onClick={goBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">{t('sidebar.language')}</h1>
      </div>

      <div className="pt-2">
        <LanguageSettingsComponent />
      </div>
    </div>
  );
};

export default LanguageSettingsPage;
