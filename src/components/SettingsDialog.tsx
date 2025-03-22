
import React from 'react';
import { Settings } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import ThemeSettings from './ThemeSettings';

const SettingsDialog: React.FC = () => {
  const { t } = useLanguage();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-primary">
          <Settings className="h-5 w-5" />
          <span className="sr-only">{t('settings.open') || 'Открыть настройки'}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t('settings.title') || 'Настройки приложения'}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <h3 className="font-medium text-lg mb-4">
            {t('settings.appearance') || 'Внешний вид'}
          </h3>
          <ThemeSettings />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
