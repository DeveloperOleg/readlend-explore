
import React from 'react';
import { Moon, Sun, Smartphone, Palette } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

const ThemeSettings: React.FC = () => {
  const { baseTheme, themeMode, toggleThemeMode, setBaseTheme } = useTheme();
  const { t } = useLanguage();

  const themeOptions = [
    {
      id: 'light',
      name: t('settings.theme.light'),
      description: 'Светлый режим',
      icon: Sun,
      colors: {
        primary: '#ffffff',
        secondary: '#f8f9fa',
        accent: '#e9ecef'
      }
    },
    {
      id: 'dark',
      name: t('settings.theme.dark'),
      description: 'Тёмный режим',
      icon: Moon,
      colors: {
        primary: '#1a1a1a',
        secondary: '#2d2d2d',
        accent: '#404040'
      }
    },
    {
      id: 'dark-night',
      name: t('settings.theme.darkNight'),
      description: 'Максимально тёмный режим',
      icon: Moon,
      colors: {
        primary: '#000000',
        secondary: '#0d1117',
        accent: '#161b22'
      }
    }
  ];

  const handleThemeSelect = (themeId: string) => {
    if (themeMode === 'system') {
      toggleThemeMode(); // Switch to manual mode first
    }
    setBaseTheme(themeId as any);
  };

  return (
    <div className="space-y-6">
      {/* System Theme Toggle */}
      <div className="rounded-lg border p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Smartphone className="h-5 w-5 text-primary" />
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

      {/* Theme Selection */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Palette className="h-5 w-5 text-primary" />
          <h3 className="font-medium">Выбор темы</h3>
        </div>
        
        <div className="grid gap-3">
          {themeOptions.map((theme) => {
            const Icon = theme.icon;
            const isSelected = baseTheme === theme.id;
            const isDisabled = themeMode === 'system';
            
            return (
              <button
                key={theme.id}
                onClick={() => handleThemeSelect(theme.id)}
                disabled={isDisabled}
                className={`
                  relative p-4 rounded-lg border-2 transition-all text-left
                  ${isSelected && !isDisabled
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                  }
                  ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                <div className="flex items-center gap-3 mb-3">
                  <Icon className="h-5 w-5" />
                  <div>
                    <h4 className="font-medium">{theme.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {theme.description}
                    </p>
                  </div>
                  {isSelected && !isDisabled && (
                    <div className="ml-auto">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                    </div>
                  )}
                </div>
                
                {/* Theme preview */}
                <div className="flex gap-2">
                  <div 
                    className="h-6 w-8 rounded border"
                    style={{ backgroundColor: theme.colors.primary }}
                  ></div>
                  <div 
                    className="h-6 w-8 rounded border"
                    style={{ backgroundColor: theme.colors.secondary }}
                  ></div>
                  <div 
                    className="h-6 w-8 rounded border"
                    style={{ backgroundColor: theme.colors.accent }}
                  ></div>
                </div>
              </button>
            );
          })}
        </div>
        
        {themeMode === 'system' && (
          <p className="text-xs text-muted-foreground mt-3 italic">
            {t('settings.manualThemeSwitchingDisabled')}
          </p>
        )}
      </div>
    </div>
  );
};

export default ThemeSettings;
