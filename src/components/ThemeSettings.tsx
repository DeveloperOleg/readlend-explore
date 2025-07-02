
import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

const ThemeSettings: React.FC = () => {
  const { baseTheme, setBaseTheme } = useTheme();
  const { t } = useLanguage();

  const themes = [
    {
      id: 'light',
      name: t('settings.theme.light'),
      description: t('settings.theme.lightDesc'),
      preview: (
        <div className="w-full h-20 bg-white border-2 border-gray-200 rounded-lg shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-4 bg-gray-100"></div>
          <div className="absolute top-4 left-2 w-16 h-3 bg-gray-200 rounded"></div>
          <div className="absolute top-8 left-2 w-12 h-2 bg-gray-300 rounded"></div>
          <div className="absolute top-11 left-2 w-20 h-2 bg-gray-300 rounded"></div>
        </div>
      )
    },
    {
      id: 'dark',
      name: t('settings.theme.dark'),
      description: t('settings.theme.darkDesc'),
      preview: (
        <div className="w-full h-20 bg-gray-800 border-2 border-gray-600 rounded-lg shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-4 bg-gray-700"></div>
          <div className="absolute top-4 left-2 w-16 h-3 bg-gray-600 rounded"></div>
          <div className="absolute top-8 left-2 w-12 h-2 bg-gray-500 rounded"></div>
          <div className="absolute top-11 left-2 w-20 h-2 bg-gray-500 rounded"></div>
        </div>
      )
    },
    {
      id: 'dark-night',
      name: t('settings.theme.darkNight'),
      description: t('settings.theme.darkNightDesc'),
      preview: (
        <div className="w-full h-20 bg-black border-2 border-gray-800 rounded-lg shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-4 bg-gray-900"></div>
          <div className="absolute top-4 left-2 w-16 h-3 bg-gray-700 rounded"></div>
          <div className="absolute top-8 left-2 w-12 h-2 bg-gray-600 rounded"></div>
          <div className="absolute top-11 left-2 w-20 h-2 bg-gray-600 rounded"></div>
        </div>
      )
    },
    {
      id: 'system',
      name: t('settings.systemTheme'),
      description: t('settings.systemThemeEnabled'),
      preview: (
        <div className="w-full h-20 bg-gradient-to-br from-white to-gray-800 border-2 border-gray-400 rounded-lg shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-r from-gray-100 to-gray-700"></div>
          <div className="absolute top-4 left-2 w-16 h-3 bg-gradient-to-r from-gray-200 to-gray-600 rounded"></div>
          <div className="absolute top-8 left-2 w-12 h-2 bg-gradient-to-r from-gray-300 to-gray-500 rounded"></div>
          <div className="absolute top-11 left-2 w-20 h-2 bg-gradient-to-r from-gray-300 to-gray-500 rounded"></div>
        </div>
      )
    }
  ];

  const handleThemeSelect = (themeId: string) => {
    setBaseTheme(themeId as 'light' | 'dark' | 'dark-night' | 'system');
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-1">{t('settings.theme')}</h3>
        <p className="text-sm text-muted-foreground">
          {t('settings.themeDescription')}
        </p>
      </div>

      <div className="relative px-12">
        <Carousel className="w-full">
          <CarouselContent>
            {themes.map((theme) => (
              <CarouselItem key={theme.id} className="basis-1/2 md:basis-1/3">
                <div 
                  className={`cursor-pointer p-4 rounded-lg border-2 transition-all ${
                    baseTheme === theme.id 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => handleThemeSelect(theme.id)}
                >
                  <div className="space-y-3">
                    {theme.preview}
                    <div className="text-center">
                      <p className="font-medium text-sm">{theme.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {theme.description}
                      </p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
};

export default ThemeSettings;
