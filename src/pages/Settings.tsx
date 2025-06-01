
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  User,
  Shield,
  Palette, 
  Info, 
  Bell, 
  Ban, 
  Database, 
  Globe, 
  ChevronRight 
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

const SettingsPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  const navigateTo = (path: string) => {
    navigate(path);
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
        <div className="pb-4 space-y-2">
          <Button 
            variant="ghost" 
            className="flex items-center justify-between w-full p-3 h-auto rounded-lg border" 
            onClick={() => navigateTo('/settings/account')}
          >
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              <div className="flex-1 text-left">
                <h3 className="font-medium">{t('settings.account')}</h3>
                <p className="text-xs text-muted-foreground">
                  {t('settings.accountDesc')}
                </p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Button>

          <Button 
            variant="ghost" 
            className="flex items-center justify-between w-full p-3 h-auto rounded-lg border" 
            onClick={() => navigateTo('/settings/appearance')}
          >
            <div className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-primary" />
              <div className="flex-1 text-left">
                <h3 className="font-medium">{t('settings.appearance')}</h3>
                <p className="text-xs text-muted-foreground">
                  {t('settings.appearanceDesc')}
                </p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Button>

          <Button 
            variant="ghost" 
            className="flex items-center justify-between w-full p-3 h-auto rounded-lg border" 
            onClick={() => navigateTo('/settings/security')}
          >
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <div className="flex-1 text-left">
                <h3 className="font-medium">{t('settings.security')}</h3>
                <p className="text-xs text-muted-foreground">
                  {t('settings.securityDesc')}
                </p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Button>

          <Button 
            variant="ghost" 
            className="flex items-center justify-between w-full p-3 h-auto rounded-lg border" 
            onClick={() => navigateTo('/settings/language')}
          >
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              <div className="flex-1 text-left">
                <h3 className="font-medium">{t('sidebar.language')}</h3>
                <p className="text-xs text-muted-foreground">
                  {t('settings.appearanceDesc')}
                </p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Button>

          <Button 
            variant="ghost" 
            className="flex items-center justify-between w-full p-3 h-auto rounded-lg border" 
            onClick={() => navigateTo('/settings/storage')}
          >
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              <div className="flex-1 text-left">
                <h3 className="font-medium">{t('settings.storage')}</h3>
                <p className="text-xs text-muted-foreground">
                  {t('settings.storageDesc')}
                </p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Button>

          <Button 
            variant="ghost" 
            className="flex items-center justify-between w-full p-3 h-auto rounded-lg border" 
            onClick={() => navigateTo('/settings/privacy')}
          >
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <div className="flex-1 text-left">
                <h3 className="font-medium">{t('profile.privacy')}</h3>
                <p className="text-xs text-muted-foreground">
                  {t('profile.privacyDesc')}
                </p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Button>

          <Button 
            variant="ghost" 
            className="flex items-center justify-between w-full p-3 h-auto rounded-lg border" 
            onClick={() => navigateTo('/settings/blocked')}
          >
            <div className="flex items-center gap-2">
              <Ban className="h-5 w-5 text-primary" />
              <div className="flex-1 text-left">
                <h3 className="font-medium">{t('blocked.title')}</h3>
                <p className="text-xs text-muted-foreground">
                  {t('blocked.desc')}
                </p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Button>

          <Button 
            variant="ghost" 
            className="flex items-center justify-between w-full p-3 h-auto rounded-lg border" 
            onClick={() => navigateTo('/settings/notifications')}
          >
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              <div className="flex-1 text-left">
                <h3 className="font-medium">{t('settings.notifications')}</h3>
                <p className="text-xs text-muted-foreground">
                  {t('settings.notificationsDesc')}
                </p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Button>

          <Button 
            variant="ghost" 
            className="flex items-center justify-between w-full p-3 h-auto rounded-lg border" 
            onClick={() => navigateTo('/settings/about')}
          >
            <div className="flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              <div className="flex-1 text-left">
                <h3 className="font-medium">{t('settings.about')}</h3>
                <p className="text-xs text-muted-foreground">
                  {t('settings.aboutDesc')}
                </p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
      </ScrollArea>
    </div>
  );
};

export default SettingsPage;
