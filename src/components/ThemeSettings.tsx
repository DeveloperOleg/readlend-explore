
import React from 'react';
import { Palette, Sparkles } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const ThemeSettings: React.FC = () => {
  const { 
    currentTheme, 
    customColors, 
    setPredefinedTheme, 
    setCustomColor 
  } = useTheme();
  const { t } = useLanguage();

  const themeOptions = [
    { id: 'default', name: t('themes.default') || 'По умолчанию' },
    { id: 'ocean', name: t('themes.ocean') || 'Океан' },
    { id: 'halloween', name: t('themes.halloween') || 'Хеллоуин' },
    { id: 'winter', name: t('themes.winter') || 'Зима' },
    { id: 'spring', name: t('themes.spring') || 'Весна' },
    { id: 'summer', name: t('themes.summer') || 'Лето' },
    { id: 'autumn', name: t('themes.autumn') || 'Осень' }
  ];

  return (
    <Tabs defaultValue="predefined" className="w-full">
      <TabsList className="grid grid-cols-2 mb-4">
        <TabsTrigger value="predefined" className="flex items-center gap-2">
          <Palette className="h-4 w-4" />
          <span>{t('settings.predefinedThemes') || 'Готовые темы'}</span>
        </TabsTrigger>
        <TabsTrigger value="custom" className="flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          <span>{t('settings.customTheme') || 'Свой дизайн'}</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="predefined" className="space-y-4">
        <ToggleGroup 
          type="single" 
          value={currentTheme}
          onValueChange={(value) => value && setPredefinedTheme(value as any)}
          className="flex flex-wrap justify-start gap-2"
        >
          {themeOptions.map(theme => (
            <ToggleGroupItem 
              key={theme.id} 
              value={theme.id}
              className={`flex items-center justify-center px-4 py-2 rounded-full ${
                theme.id === currentTheme 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-secondary text-secondary-foreground'
              }`}
            >
              {theme.name}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </TabsContent>
      
      <TabsContent value="custom" className="space-y-4">
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="primary-color">{t('settings.primaryColor') || 'Основной цвет'}</Label>
            <Input
              id="primary-color"
              type="color"
              value={customColors.primary}
              onChange={(e) => setCustomColor('primary', e.target.value)}
              className="h-10 p-1 w-full"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="background-color">{t('settings.backgroundColor') || 'Цвет фона'}</Label>
            <Input
              id="background-color"
              type="color"
              value={customColors.background}
              onChange={(e) => setCustomColor('background', e.target.value)}
              className="h-10 p-1 w-full"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="text-color">{t('settings.textColor') || 'Цвет текста'}</Label>
            <Input
              id="text-color"
              type="color"
              value={customColors.text}
              onChange={(e) => setCustomColor('text', e.target.value)}
              className="h-10 p-1 w-full"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="accent-color">{t('settings.accentColor') || 'Акцентный цвет'}</Label>
            <Input
              id="accent-color"
              type="color"
              value={customColors.accent}
              onChange={(e) => setCustomColor('accent', e.target.value)}
              className="h-10 p-1 w-full"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="neon-color">{t('settings.neonColor') || 'Неоновый цвет'}</Label>
            <Input
              id="neon-color"
              type="color"
              value={customColors.neon}
              onChange={(e) => setCustomColor('neon', e.target.value)}
              className="h-10 p-1 w-full"
            />
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default ThemeSettings;
