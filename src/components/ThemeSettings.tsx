
import React from 'react';
import { Moon, Sun, Smartphone } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

const ThemeSettings: React.FC = () => {
  const { baseTheme, uiStyle, themeMode, toggleUIStyle, toggleThemeMode, setBaseTheme } = useTheme();
  const { t } = useLanguage();

  const handleThemeChange = (value: string) => {
    setBaseTheme(value as 'light' | 'dark' | 'dark-night');
  };

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

      {/* Visual Theme Selection */}
      <div className="space-y-4">
        <div>
          <h3 className="font-medium mb-1">{t('settings.theme')}</h3>
          <p className="text-sm text-muted-foreground mb-4">
            This will change the theme across all your devices.
          </p>
        </div>

        <RadioGroup 
          value={baseTheme} 
          onValueChange={handleThemeChange}
          disabled={themeMode === 'system'}
          className="space-y-3"
        >
          {/* Light Theme */}
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="light" id="light" className="mt-1" />
            <Label htmlFor="light" className="flex-1 cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-16 h-12 bg-white border-2 border-gray-200 rounded-lg shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-3 bg-gray-100"></div>
                  <div className="absolute top-3 left-1 w-10 h-2 bg-gray-200 rounded"></div>
                  <div className="absolute top-6 left-1 w-8 h-1 bg-gray-300 rounded"></div>
                  <div className="absolute top-8 left-1 w-12 h-1 bg-gray-300 rounded"></div>
                </div>
                <div>
                  <p className="font-medium">Light</p>
                  <p className="text-sm text-muted-foreground">Clean and bright interface</p>
                </div>
              </div>
            </Label>
          </div>

          {/* Dark Theme */}
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="dark" id="dark" className="mt-1" />
            <Label htmlFor="dark" className="flex-1 cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-16 h-12 bg-gray-800 border-2 border-gray-600 rounded-lg shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-3 bg-gray-700"></div>
                  <div className="absolute top-3 left-1 w-10 h-2 bg-gray-600 rounded"></div>
                  <div className="absolute top-6 left-1 w-8 h-1 bg-gray-500 rounded"></div>
                  <div className="absolute top-8 left-1 w-12 h-1 bg-gray-500 rounded"></div>
                </div>
                <div>
                  <p className="font-medium">Dark</p>
                  <p className="text-sm text-muted-foreground">Easy on the eyes in low light</p>
                </div>
              </div>
            </Label>
          </div>

          {/* Dark Night Theme */}
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="dark-night" id="dark-night" className="mt-1" />
            <Label htmlFor="dark-night" className="flex-1 cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-16 h-12 bg-black border-2 border-gray-800 rounded-lg shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-3 bg-gray-900"></div>
                  <div className="absolute top-3 left-1 w-10 h-2 bg-gray-700 rounded"></div>
                  <div className="absolute top-6 left-1 w-8 h-1 bg-gray-600 rounded"></div>
                  <div className="absolute top-8 left-1 w-12 h-1 bg-gray-600 rounded"></div>
                </div>
                <div>
                  <p className="font-medium">Dark Night</p>
                  <p className="text-sm text-muted-foreground">Maximum darkness for night reading</p>
                </div>
              </div>
            </Label>
          </div>
        </RadioGroup>

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
            <div className="h-5 w-5 bg-gradient-to-r from-blue-500 to-purple-500 rounded text-blue-500 flex items-center justify-center">
              <div className="h-3 w-3 bg-white rounded-sm"></div>
            </div>
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
