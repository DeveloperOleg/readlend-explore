
import React from 'react';
import { Moon, Sun, SmartphoneCharging } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

const ThemeSettings: React.FC = () => {
  const { baseTheme, toggleBaseTheme, themeMode, toggleThemeMode } = useTheme();
  const { t } = useLanguage();

  return (
    <div className="space-y-2">
      <div className="rounded-lg border p-3">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <SmartphoneCharging className="h-5 w-5" />
            <span>{t('settings.systemTheme')}</span>
          </div>
          <Switch 
            id="system-theme"
            checked={themeMode === 'system'}
            onCheckedChange={toggleThemeMode}
          />
        </div>
        
        <div className="text-xs text-muted-foreground">
          {themeMode === 'system' 
            ? t('settings.systemThemeEnabled')
            : t('settings.systemThemeDisabled')}
        </div>
      </div>
      
      <div className="rounded-lg border p-3">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            {baseTheme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            <span>{t('settings.darkMode')}</span>
          </div>
          <Switch 
            id="theme-mode"
            checked={baseTheme === 'dark'}
            onCheckedChange={toggleBaseTheme}
            disabled={themeMode === 'system'}
          />
        </div>
        
        {themeMode === 'system' && (
          <div className="text-xs text-muted-foreground italic">
            {t('Manual theme switching is not available when system theme is enabled.')}
          </div>
        )}
      </div>
    </div>
  );
};

export default ThemeSettings;
