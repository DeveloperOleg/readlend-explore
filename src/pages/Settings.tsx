
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Palette, Shield, Info, Bell, Ban, Database, Globe } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ThemeSettings from '@/components/ThemeSettings';
import LanguageSettings from '@/components/LanguageSettings';
import UserBlocked from '@/components/UserBlocked';
import StorageSettings from '@/components/StorageSettings';

const SettingsPage: React.FC = () => {
  const { t } = useLanguage();
  const { user, toggleHideSubscriptions, toggleGlobalComments } = useAuth();
  const navigate = useNavigate();

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

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="container px-2 pb-14">
      <div className="flex items-center gap-2 my-4">
        <Button variant="ghost" size="icon" onClick={goBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">{t('settings.title') || 'Настройки'}</h1>
      </div>

      <ScrollArea className="h-[calc(100vh-130px)]">
        <div className="pb-4">
          <Tabs defaultValue="appearance" className="w-full">
            <TabsList className="mb-4 overflow-x-auto pb-1 justify-start h-auto flex-wrap gap-2">
              <TabsTrigger value="appearance" className="flex items-center gap-2 p-3 rounded-lg border w-full">
                <Palette className="h-5 w-5 text-primary" />
                <div className="flex-1 text-left">
                  <h3 className="font-medium">{t('settings.appearance') || 'Внешний вид'}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('settings.appearanceDesc') || 'Настройки темы и отображения'}
                  </p>
                </div>
              </TabsTrigger>
              
              <TabsTrigger value="language" className="flex items-center gap-2 p-3 rounded-lg border w-full">
                <Globe className="h-5 w-5 text-primary" />
                <div className="flex-1 text-left">
                  <h3 className="font-medium">Язык</h3>
                  <p className="text-sm text-muted-foreground">
                    Настройки языка приложения
                  </p>
                </div>
              </TabsTrigger>

              <TabsTrigger value="storage" className="flex items-center gap-2 p-3 rounded-lg border w-full">
                <Database className="h-5 w-5 text-primary" />
                <div className="flex-1 text-left">
                  <h3 className="font-medium">{t('settings.storage') || 'Данные и память'}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('settings.storageDesc') || 'Управление кэшем и хранилищем'}
                  </p>
                </div>
              </TabsTrigger>

              {user && (
                <TabsTrigger value="privacy" className="flex items-center gap-2 p-3 rounded-lg border w-full">
                  <Shield className="h-5 w-5 text-primary" />
                  <div className="flex-1 text-left">
                    <h3 className="font-medium">{t('profile.privacy') || 'Конфиденциальность'}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t('profile.privacyDesc') || 'Настройки приватности и видимости'}
                    </p>
                  </div>
                </TabsTrigger>
              )}

              <TabsTrigger value="blocked" className="flex items-center gap-2 p-3 rounded-lg border w-full">
                <Ban className="h-5 w-5 text-primary" />
                <div className="flex-1 text-left">
                  <h3 className="font-medium">{t('blocked.title') || 'Черный список'}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('blocked.desc') || 'Управление заблокированными пользователями'}
                  </p>
                </div>
              </TabsTrigger>

              <TabsTrigger value="notifications" className="flex items-center gap-2 p-3 rounded-lg border w-full">
                <Bell className="h-5 w-5 text-primary" />
                <div className="flex-1 text-left">
                  <h3 className="font-medium">{t('settings.notifications') || 'Уведомления'}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('settings.notificationsDesc') || 'Настройка уведомлений приложения'}
                  </p>
                </div>
              </TabsTrigger>

              <TabsTrigger value="about" className="flex items-center gap-2 p-3 rounded-lg border w-full">
                <Info className="h-5 w-5 text-primary" />
                <div className="flex-1 text-left">
                  <h3 className="font-medium">{t('settings.about') || 'О приложении'}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('settings.aboutDesc') || 'Информация о версии и разработчиках'}
                  </p>
                </div>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="appearance">
              <ThemeSettings />
            </TabsContent>
            
            <TabsContent value="language">
              <LanguageSettings />
            </TabsContent>

            <TabsContent value="storage">
              <StorageSettings />
            </TabsContent>

            {user && (
              <TabsContent value="privacy">
                <div className="space-y-2">
                  <div className="rounded-lg border p-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h3 className="text-sm font-medium">{t('profile.hideSubscriptions') || 'Скрыть мои подписки'}</h3>
                        <p className="text-xs text-muted-foreground">
                          {t('profile.hideSubscriptionsDescription') || 'Другие пользователи не смогут видеть, на кого вы подписаны'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="rounded-lg border p-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h3 className="text-sm font-medium">{t('profile.allowComments') || 'Разрешить комментарии к книгам'}</h3>
                        <p className="text-xs text-muted-foreground">
                          {t('profile.allowCommentsDescription') || 'Пользователи смогут оставлять комментарии к вашим книгам'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            )}

            <TabsContent value="blocked">
              <UserBlocked />
            </TabsContent>

            <TabsContent value="notifications">
              <div className="rounded-lg border p-3">
                <p className="text-sm text-muted-foreground">
                  {t('settings.notificationsFeature') || 'Функция настройки уведомлений появится в будущих обновлениях'}
                </p>
              </div>
            </TabsContent>

            <TabsContent value="about">
              <div className="rounded-lg border p-3">
                <h3 className="font-medium text-base mb-2">
                  {t('settings.version') || 'Версия'}
                </h3>
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium">1.0.0</p>
                  <p className="italic mt-1">{t('settings.earlyVersion') || 'Это ранняя версия приложения'}</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  );
};

export default SettingsPage;
