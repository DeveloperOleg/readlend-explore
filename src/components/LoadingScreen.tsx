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
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 100);
      });
    }, 200);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center z-[9999]">
      {/* App Name */}
      <div className="mb-16">
        <h1 className="text-white text-3xl font-semibold text-center tracking-wide">
          {t('app.name')}
        </h1>
        <p className="text-slate-400 text-sm text-center mt-2 tracking-wider">
          READ LAND
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-64 mb-8">
        <div className="w-full bg-slate-700/50 rounded-full h-1">
          <div 
            className="bg-white h-1 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Loading Dots */}
      <div className="flex space-x-2">
        <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" />
        <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
        <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
      </div>

      {/* Version */}
      <div className="absolute bottom-8 text-slate-500 text-xs">
        v1.0
      </div>
    </div>
  );
};

export default LoadingScreen;