
import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { Check } from 'lucide-react';

const ThemeSettings: React.FC = () => {
  const { baseTheme, setBaseTheme } = useTheme();
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
    }
  ];

  const handleThemeSelect = (themeId: string) => {
    setBaseTheme(themeId as 'light' | 'dark' | 'dark-night' | 'system');
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
    </div>
  );
};

export default ThemeSettings;
