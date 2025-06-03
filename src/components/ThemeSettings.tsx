
import React from 'react';
import { Moon, Sun, Smartphone, Palette } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

const ThemeSettings: React.FC = () => {
  const { baseTheme, uiStyle, themeMode, toggleBaseTheme, toggleUIStyle, toggleThemeMode } = useTheme();
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      {/* System Theme Toggle */}
      <div className="rounded-lg border p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Smartphone className="h-5 w-5 text-blue-500" />
            <div>
              <h3 className="font-medium">{t('settings.systemTheme')}</h3>
              <p className="text-sm text-muted-foreground">
                {themeMode === 'system' 
                  ? t('settings.systemThemeEnabled')
                  : t('settings.systemThemeDisabled')}
              </p>
            </div>
          </div>
          <Switch 
            checked={themeMode === 'system'}
            onCheckedChange={toggleThemeMode}
          />
        </div>
      </div>

      <Separator />

      {/* Theme Toggle */}
      <div className="rounded-lg border p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            {baseTheme === 'light' ? (
              <Sun className="h-5 w-5 text-blue-500" />
            ) : (
              <Moon className="h-5 w-5 text-blue-500" />
            )}
            <div>
              <h3 className="font-medium">{t('settings.theme')}</h3>
              <p className="text-sm text-muted-foreground">
                {baseTheme === 'light' ? t('settings.theme.light') : 
                 baseTheme === 'dark' ? t('settings.theme.dark') : 
                 t('settings.theme.darkNight')}
              </p>
            </div>
          </div>
          <Switch 
            checked={baseTheme !== 'light'}
            onCheckedChange={toggleBaseTheme}
            disabled={themeMode === 'system'}
          />
        </div>
        
        {themeMode === 'system' && (
          <p className="text-xs text-muted-foreground mt-2 italic">
            {t('settings.manualThemeSwitchingDisabled')}
          </p>
        )}
      </div>

      <Separator />

      {/* UI Style Toggle */}
      <div className="rounded-lg border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Palette className="h-5 w-5 text-blue-500" />
            <div>
              <h3 className="font-medium">{t('settings.uiStyle')}</h3>
              <p className="text-sm text-muted-foreground">
                {uiStyle === 'standard' ? t('settings.uiStyle.standard') : t('settings.uiStyle.gradient')}
              </p>
            </div>
          </div>
          <Switch 
            checked={uiStyle === 'gradient'}
            onCheckedChange={toggleUIStyle}
          />
        </div>
      </div>
    </div>
  );
};

export default ThemeSettings;
