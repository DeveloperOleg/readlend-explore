
import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { Check } from 'lucide-react';

const ThemeSettings: React.FC = () => {
  const { baseTheme, setBaseTheme, seasonalTheme, setSeasonalTheme } = useTheme();
  const { t } = useLanguage();

  const themes = [
    {
      id: 'system',
      name: t('settings.theme.auto') || 'Авто',
      description: t('settings.theme.autoDesc') || 'Автоматически переключается между светлой и темной темой'
    },
    {
      id: 'light',
      name: t('settings.theme.light') || 'Светлая',
      description: t('settings.theme.lightDesc') || 'Светлая тема для использования днем'
    },
    {
      id: 'dark',
      name: t('settings.theme.dark') || 'Темная',
      description: t('settings.theme.darkDesc') || 'Темная тема для использования вечером'
    },
    {
      id: 'dark-night',
      name: t('settings.theme.darkNight') || 'Темная ночь',
      description: t('settings.theme.darkNightDesc') || 'Глубокая темная тема с повышенным контрастом'
    }
  ];

  const handleThemeSelect = (themeId: string) => {
    setBaseTheme(themeId as 'light' | 'dark' | 'dark-night' | 'system');
  };

  const handleSeasonalToggle = () => {
    setSeasonalTheme(seasonalTheme === 'default' ? 'autumn' : 'default');
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-1">{t('settings.theme') || 'Тема'}</h3>
        <p className="text-sm text-muted-foreground">
          {t('settings.themeDescription') || 'Тема будет применена на всех ваших устройствах.'}
        </p>
      </div>

      <div className="space-y-0">
        {themes.map((theme, index) => (
          <div 
            key={`${theme.id}-${index}`}
            className="flex items-center justify-between py-4 cursor-pointer hover:bg-muted/50 rounded-lg px-2 transition-colors"
            onClick={() => handleThemeSelect(theme.id)}
          >
            <div className="flex-1">
              <p className="font-medium text-base">{theme.name}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {theme.description}
              </p>
            </div>
            {baseTheme === theme.id && (
              <div className="flex items-center justify-center w-6 h-6 bg-blue-500 rounded-full ml-4">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Seasonal Theme Toggle */}
      <div className="border-t pt-6 mt-6">
        <div className="mb-4">
          <h3 className="font-medium mb-1">{t('settings.seasonalTheme') || 'Сезонная тема'}</h3>
          <p className="text-sm text-muted-foreground">
            {t('settings.seasonalThemeDescription') || 'Добавляет декоративные элементы и анимации.'}
          </p>
        </div>

        <div 
          className="flex items-center justify-between py-4 cursor-pointer hover:bg-muted/50 rounded-lg px-2 transition-colors"
          onClick={handleSeasonalToggle}
        >
          <div className="flex items-center gap-3">
            <div className="text-2xl">
              {seasonalTheme === 'autumn' ? '🍂' : '🌿'}
            </div>
            <div className="flex-1">
              <p className="font-medium text-base">
                {seasonalTheme === 'autumn' ? 
                  (t('settings.theme.autumn') || 'Осенняя') : 
                  (t('settings.theme.default') || 'Обычная')
                }
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {seasonalTheme === 'autumn' ? 
                  (t('settings.theme.autumnDesc') || 'Уютная осенняя атмосфера с падающими листьями') :
                  (t('settings.theme.defaultDesc') || 'Стандартное оформление без декораций')
                }
              </p>
            </div>
          </div>
          {seasonalTheme === 'autumn' && (
            <div className="flex items-center justify-center w-6 h-6 bg-autumn-button rounded-full ml-4">
              <Check className="w-4 h-4 text-autumn-button-text" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ThemeSettings;
