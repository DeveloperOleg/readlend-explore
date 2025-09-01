
import React, { useMemo } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';

const Welcome: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    let key = '';
    
    if (hour >= 5 && hour < 12) {
      key = 'greeting.morning';
    } else if (hour >= 12 && hour < 18) {
      key = 'greeting.afternoon';
    } else if (hour >= 18 && hour < 22) {
      key = 'greeting.evening';
    } else {
      key = 'greeting.night';
    }
    
    return t(key);
  }, []); // Remove dependency on t to force re-render based on time

  return (
    <div className="py-4 mb-6 animate-slide-in pl-10 pr-6 md:px-4">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight truncate">
        {greeting}, {user?.username || ''}
      </h1>
      <p className="mt-2 text-muted-foreground text-sm md:text-base">
        {t('home.readingNest')}
      </p>
    </div>
  );
};

export default Welcome;
