
import React from 'react';
import { Settings } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ThemeSettings from './ThemeSettings';
import { Switch } from '@/components/ui/switch';

const SettingsDialog: React.FC = () => {
  const { t } = useLanguage();
  const { user, toggleHideSubscriptions, toggleGlobalComments } = useAuth();

  const handleTogglePrivacy = async (value: boolean) => {
    if (toggleHideSubscriptions) {
      toggleHideSubscriptions(value);
    }
  };

  const handleToggleComments = async (value: boolean) => {
    if (toggleGlobalComments) {
      toggleGlobalComments(value);
    }
  };

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
          <DialogDescription>
            {t('settings.description') || 'Настройте приложение под свои предпочтения'}
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="appearance" className="mt-4">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="appearance">{t('settings.appearance') || 'Внешний вид'}</TabsTrigger>
            <TabsTrigger value="privacy">{t('profile.privacy') || 'Конфиденциальность'}</TabsTrigger>
            <TabsTrigger value="about">{t('settings.about') || 'О приложении'}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="appearance" className="space-y-6">
            <ThemeSettings />
          </TabsContent>
          
          <TabsContent value="privacy" className="space-y-6">
            {user ? (
              <>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h3 className="text-sm font-medium">{t('profile.hideSubscriptions') || 'Скрыть мои подписки'}</h3>
                    <p className="text-xs text-muted-foreground">
                      {t('profile.hideSubscriptionsDescription') || 'Другие пользователи не смогут видеть, на кого вы подписаны'}
                    </p>
                  </div>
                  <Switch 
                    checked={user?.privacy?.hideSubscriptions || false}
                    onCheckedChange={handleTogglePrivacy}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h3 className="text-sm font-medium">{t('profile.allowComments') || 'Разрешить комментарии к книгам'}</h3>
                    <p className="text-xs text-muted-foreground">
                      {t('profile.allowCommentsDescription') || 'Пользователи смогут оставлять комментарии к вашим книгам'}
                    </p>
                  </div>
                  <Switch 
                    checked={user?.privacy?.commentSettings?.global || false}
                    onCheckedChange={handleToggleComments}
                  />
                </div>
              </>
            ) : (
              <p className="text-center text-muted-foreground py-4">
                {t('settings.loginRequired') || 'Войдите, чтобы настроить параметры конфиденциальности'}
              </p>
            )}
          </TabsContent>
          
          <TabsContent value="about" className="space-y-4">
            <div>
              <h3 className="font-medium text-lg mb-2">
                {t('settings.version') || 'Версия'}
              </h3>
              <div className="text-sm text-muted-foreground">
                <p className="font-medium">1.0.0</p>
                <p className="italic mt-1">{t('settings.earlyVersion') || 'Это ранняя версия приложения'}</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
