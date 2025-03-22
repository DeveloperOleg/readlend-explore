
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
  }, [t]);

  return (
    <div className="py-4 mb-6 animate-slide-in">
      <h1 className="text-3xl font-bold tracking-tight">
        {greeting}, {user?.username || ''}
      </h1>
      <p className="mt-2 text-muted-foreground">
        ReadNest - ваша уютная библиотека
      </p>
    </div>
  );
};

export default Welcome;
