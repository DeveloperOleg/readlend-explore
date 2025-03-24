
import React from 'react';
import { Moon, Sun, Palette } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { Switch } from '@/components/ui/switch';

const ThemeSettings: React.FC = () => {
  const { baseTheme, uiStyle, toggleBaseTheme, toggleUIStyle } = useTheme();
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {baseTheme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          <span>{t('settings.darkMode') || 'Темная тема'}</span>
        </div>
        <Switch 
          id="theme-mode"
          checked={baseTheme === 'dark'}
          onCheckedChange={toggleBaseTheme}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          <span>{t('settings.gradientUI') || 'Градиентный дизайн'}</span>
        </div>
        <Switch 
          id="gradient-ui"
          checked={uiStyle === 'gradient'}
          onCheckedChange={toggleUIStyle}
        />
      </div>
    </div>
  );
};

export default ThemeSettings;
