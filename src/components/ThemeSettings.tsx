
import React, { useState } from 'react';
import { Moon, Sun, Smartphone, ChevronDown } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

const ThemeSettings: React.FC = () => {
  const { baseTheme, uiStyle, themeMode, themeInterfaceStyle, toggleUIStyle, toggleThemeMode, setBaseTheme, setThemeInterfaceStyle } = useTheme();
  const { t } = useLanguage();

  const handleThemeChange = (value: string) => {
    setBaseTheme(value as 'light' | 'dark' | 'dark-night');
  };

  const handleThemeCardClick = (theme: 'light' | 'dark' | 'dark-night') => {
    if (themeMode === 'system') {
      return;
    }
    setBaseTheme(theme);
  };

  const renderRadioThemeSelection = () => (
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
              <p className="font-medium">{t('settings.theme.light')}</p>
              <p className="text-sm text-muted-foreground">{t('settings.theme.lightDesc')}</p>
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
              <p className="font-medium">{t('settings.theme.dark')}</p>
              <p className="text-sm text-muted-foreground">{t('settings.theme.darkDesc')}</p>
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
              <p className="font-medium">{t('settings.theme.darkNight')}</p>
              <p className="text-sm text-muted-foreground">{t('settings.theme.darkNightDesc')}</p>
            </div>
          </div>
        </Label>
      </div>
    </RadioGroup>
  );

  const renderCardThemeSelection = () => (
    <div className="w-full max-w-md mx-auto">
      <Carousel className="w-full">
        <CarouselContent className="-ml-2 md:-ml-4">
          {/* Light Theme Card */}
          <CarouselItem className="pl-2 md:pl-4 basis-4/5 md:basis-1/2">
            <div 
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                baseTheme === 'light' && themeMode !== 'system' 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-primary/50'
              } ${themeMode === 'system' ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => handleThemeCardClick('light')}
            >
              <div className="w-full h-20 bg-white border border-gray-200 rounded-lg shadow-sm relative overflow-hidden mb-3">
                <div className="absolute top-0 left-0 w-full h-4 bg-gray-100"></div>
                <div className="absolute top-4 left-2 w-12 h-2 bg-gray-200 rounded"></div>
                <div className="absolute top-7 left-2 w-10 h-1 bg-gray-300 rounded"></div>
                <div className="absolute top-9 left-2 w-14 h-1 bg-gray-300 rounded"></div>
              </div>
              <h3 className="font-medium text-center">{t('settings.theme.light')}</h3>
              <p className="text-xs text-muted-foreground text-center mt-1">{t('settings.theme.lightDesc')}</p>
            </div>
          </CarouselItem>

          {/* Dark Theme Card */}
          <CarouselItem className="pl-2 md:pl-4 basis-4/5 md:basis-1/2">
            <div 
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                baseTheme === 'dark' && themeMode !== 'system' 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-primary/50'
              } ${themeMode === 'system' ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => handleThemeCardClick('dark')}
            >
              <div className="w-full h-20 bg-gray-800 border border-gray-600 rounded-lg shadow-sm relative overflow-hidden mb-3">
                <div className="absolute top-0 left-0 w-full h-4 bg-gray-700"></div>
                <div className="absolute top-4 left-2 w-12 h-2 bg-gray-600 rounded"></div>
                <div className="absolute top-7 left-2 w-10 h-1 bg-gray-500 rounded"></div>
                <div className="absolute top-9 left-2 w-14 h-1 bg-gray-500 rounded"></div>
              </div>
              <h3 className="font-medium text-center">{t('settings.theme.dark')}</h3>
              <p className="text-xs text-muted-foreground text-center mt-1">{t('settings.theme.darkDesc')}</p>
            </div>
          </CarouselItem>

          {/* Dark Night Theme Card */}
          <CarouselItem className="pl-2 md:pl-4 basis-4/5 md:basis-1/2">
            <div 
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                baseTheme === 'dark-night' && themeMode !== 'system' 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-primary/50'
              } ${themeMode === 'system' ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => handleThemeCardClick('dark-night')}
            >
              <div className="w-full h-20 bg-black border border-gray-800 rounded-lg shadow-sm relative overflow-hidden mb-3">
                <div className="absolute top-0 left-0 w-full h-4 bg-gray-900"></div>
                <div className="absolute top-4 left-2 w-12 h-2 bg-gray-700 rounded"></div>
                <div className="absolute top-7 left-2 w-10 h-1 bg-gray-600 rounded"></div>
                <div className="absolute top-9 left-2 w-14 h-1 bg-gray-600 rounded"></div>
              </div>
              <h3 className="font-medium text-center">{t('settings.theme.darkNight')}</h3>
              <p className="text-xs text-muted-foreground text-center mt-1">{t('settings.theme.darkNightDesc')}</p>
            </div>
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex" />
        <CarouselNext className="hidden sm:flex" />
      </Carousel>
    </div>
  );

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
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium mb-1">{t('settings.theme')}</h3>
            <p className="text-sm text-muted-foreground">
              {t('settings.themeDescription')}
            </p>
          </div>
          
          {/* Change View Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                Change view
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem 
                onClick={() => setThemeInterfaceStyle('radio')}
                className={themeInterfaceStyle === 'radio' ? 'bg-accent' : ''}
              >
                Radio buttons
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setThemeInterfaceStyle('cards')}
                className={themeInterfaceStyle === 'cards' ? 'bg-accent' : ''}
              >
                Cards
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mt-4">
          {themeInterfaceStyle === 'radio' ? renderRadioThemeSelection() : renderCardThemeSelection()}
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
