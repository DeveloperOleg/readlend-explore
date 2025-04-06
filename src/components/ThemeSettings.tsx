
import React from 'react';
import { Moon, Sun, SmartphoneCharging } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

const ThemeSettings: React.FC = () => {
  const { baseTheme, toggleBaseTheme, themeMode, toggleThemeMode } = useTheme();
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <SmartphoneCharging className="h-5 w-5" />
            <span>{t('settings.systemTheme') || 'Системная тема'}</span>
          </div>
          <Switch 
            id="system-theme"
            checked={themeMode === 'system'}
            onCheckedChange={toggleThemeMode}
          />
        </div>
        
        <div className="text-xs text-muted-foreground">
          {themeMode === 'system' 
            ? 'Тема будет автоматически меняться в соответствии с настройками вашего устройства.' 
            : 'Включите, чтобы тема автоматически менялась в зависимости от настроек вашего устройства.'}
        </div>
      </div>
      
      <Separator />
      
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {baseTheme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            <span>{t('settings.darkMode') || 'Темная тема'}</span>
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
            Ручное переключение темы недоступно при включенной системной теме.
          </div>
        )}
      </div>
    </div>
  );
};

export default ThemeSettings;
