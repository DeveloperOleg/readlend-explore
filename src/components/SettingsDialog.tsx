
import React from 'react';
import { Settings } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import ThemeSettings from './ThemeSettings';

const SettingsDialog: React.FC = () => {
  const { t } = useLanguage();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-primary">
          <Settings className="h-5 w-5" />
          <span className="sr-only">{t('settings.open')}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t('settings.title') || 'Настройки'}</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-6">
          <div>
            <h3 className="font-medium text-lg mb-4">
              {t('settings.appearance') || 'Внешний вид'}
            </h3>
            <ThemeSettings />
          </div>
          
          <Separator />
          
          <div>
            <h3 className="font-medium text-lg mb-2">
              {t('settings.version') || 'Версия'}
            </h3>
            <div className="text-sm text-muted-foreground">
              <p className="font-medium">1.0.0</p>
              <p className="italic mt-1">{t('settings.earlyVersion') || 'Это ранняя версия приложения'}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
