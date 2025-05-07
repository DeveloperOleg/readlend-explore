
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';

const NotificationSettingsPage: React.FC = () => {
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
        <h1 className="text-xl font-bold">{t('settings.notifications')}</h1>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Bell className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">{t('settings.notifications')}</h2>
      </div>

      <div className="rounded-lg border p-3">
        <p className="text-sm text-muted-foreground">
          {t('settings.notificationsFeature')}
        </p>
      </div>
    </div>
  );
};

export default NotificationSettingsPage;
