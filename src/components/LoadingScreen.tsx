import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';

const LoadingScreen: React.FC = () => {
  const { t } = useLanguage();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= 100) {
          return 100;
        }
        // More predictable progress increment
        const diff = 5 + Math.random() * 3; // 5-8% increment
        return Math.min(oldProgress + diff, 100);
      });
    }, 150);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center z-[9999]">
      {/* App Name */}
      <div className="mb-16">
        <h1 className="text-foreground text-3xl font-semibold text-center tracking-wide">
          {t('app.name')}
        </h1>
        <p className="text-muted-foreground text-sm text-center mt-2 tracking-wider">
          READ LAND
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-64 mb-8">
        <div className="w-full bg-muted rounded-full h-1">
          <div 
            className="bg-primary h-1 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Loading Dots */}
      <div className="flex space-x-2">
        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" />
        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
      </div>

      {/* Version */}
      <div className="absolute bottom-8 text-muted-foreground text-xs">
        v1.0
      </div>
    </div>
  );
};

export default LoadingScreen;