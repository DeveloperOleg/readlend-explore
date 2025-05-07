
import React from 'react';
import { Bell } from 'lucide-react';
import EmptyState from '@/components/EmptyState';
import { useLanguage } from '@/context/LanguageContext';

const Notifications: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <Bell className="h-5 w-5" />
        <h1 className="text-2xl font-bold">{t('pages.notifications')}</h1>
      </div>
      
      <div className="flex justify-center">
        <EmptyState 
          title={t('pages.noNotifications')}
          description={t('pages.noNotificationsDescription')}
          icon="book"
        />
      </div>
    </div>
  );
};

export default Notifications;
