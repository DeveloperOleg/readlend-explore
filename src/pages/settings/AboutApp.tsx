
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Info } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';

const AboutAppPage: React.FC = () => {
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
        <h1 className="text-xl font-bold">{t('settings.about')}</h1>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Info className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">{t('settings.about')}</h2>
      </div>

      <div className="rounded-lg border p-3">
        <h3 className="font-medium text-base mb-2">
          {t('settings.version')}
        </h3>
        <div className="text-sm text-muted-foreground">
          <p className="font-medium">1.0.0</p>
          <p className="italic mt-1">{t('settings.earlyVersion')}</p>
        </div>
      </div>
    </div>
  );
};

export default AboutAppPage;
