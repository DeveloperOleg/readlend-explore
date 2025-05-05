
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
import { Switch } from '@/components/ui/switch';

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
        <h1 className="text-xl font-bold">{t('settings.title')}</h1>
      </div>

      <ScrollArea className="h-[calc(100vh-130px)]">
        <div className="pb-4">
          <Tabs defaultValue="appearance" className="w-full">
            <TabsList className="mb-4 overflow-x-auto pb-1 justify-start h-auto flex-wrap gap-2">
              <TabsTrigger value="appearance" className="flex items-center gap-2 p-3 rounded-lg border w-full">
                <Palette className="h-5 w-5 text-primary" />
                <div className="flex-1 text-left">
                  <h3 className="font-medium">{t('settings.appearance')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('settings.appearanceDesc')}
                  </p>
                </div>
              </TabsTrigger>
              
              <TabsTrigger value="language" className="flex items-center gap-2 p-3 rounded-lg border w-full">
                <Globe className="h-5 w-5 text-primary" />
                <div className="flex-1 text-left">
                  <h3 className="font-medium">{t('sidebar.language')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('settings.appearanceDesc')}
                  </p>
                </div>
              </TabsTrigger>

              <TabsTrigger value="storage" className="flex items-center gap-2 p-3 rounded-lg border w-full">
                <Database className="h-5 w-5 text-primary" />
                <div className="flex-1 text-left">
                  <h3 className="font-medium">{t('settings.storage')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('settings.storageDesc')}
                  </p>
                </div>
              </TabsTrigger>

              {user && (
                <TabsTrigger value="privacy" className="flex items-center gap-2 p-3 rounded-lg border w-full">
                  <Shield className="h-5 w-5 text-primary" />
                  <div className="flex-1 text-left">
                    <h3 className="font-medium">{t('profile.privacy')}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t('profile.privacyDesc')}
                    </p>
                  </div>
                </TabsTrigger>
              )}

              <TabsTrigger value="blocked" className="flex items-center gap-2 p-3 rounded-lg border w-full">
                <Ban className="h-5 w-5 text-primary" />
                <div className="flex-1 text-left">
                  <h3 className="font-medium">{t('blocked.title')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('blocked.desc')}
                  </p>
                </div>
              </TabsTrigger>

              <TabsTrigger value="notifications" className="flex items-center gap-2 p-3 rounded-lg border w-full">
                <Bell className="h-5 w-5 text-primary" />
                <div className="flex-1 text-left">
                  <h3 className="font-medium">{t('settings.notifications')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('settings.notificationsDesc')}
                  </p>
                </div>
              </TabsTrigger>

              <TabsTrigger value="about" className="flex items-center gap-2 p-3 rounded-lg border w-full">
                <Info className="h-5 w-5 text-primary" />
                <div className="flex-1 text-left">
                  <h3 className="font-medium">{t('settings.about')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('settings.aboutDesc')}
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
                        <h3 className="text-sm font-medium">{t('profile.hideSubscriptions')}</h3>
                        <p className="text-xs text-muted-foreground">
                          {t('profile.hideSubscriptionsDescription')}
                        </p>
                      </div>
                      <Switch
                        checked={user?.privacy?.hideSubscriptions}
                        onCheckedChange={handleTogglePrivacy}
                      />
                    </div>
                  </div>
                  
                  <div className="rounded-lg border p-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h3 className="text-sm font-medium">{t('profile.allowComments')}</h3>
                        <p className="text-xs text-muted-foreground">
                          {t('profile.allowCommentsDescription')}
                        </p>
                      </div>
                      <Switch
                        checked={user?.privacy?.commentSettings?.global}
                        onCheckedChange={handleToggleComments}
                      />
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
                  {t('settings.notificationsFeature')}
                </p>
              </div>
            </TabsContent>

            <TabsContent value="about">
              <div className="rounded-lg border p-3">
                <h3 className="font-medium text-base mb-2">
                  {t('settings.version')}
                </h3>
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium">1.0.0</p>
                  <p className="italic mt-1">{t('settings.earlyVersion')}</p>
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
