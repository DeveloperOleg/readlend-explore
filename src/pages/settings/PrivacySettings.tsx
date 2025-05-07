
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

const PrivacySettings: React.FC = () => {
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
        <h1 className="text-xl font-bold">{t('profile.privacy')}</h1>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">{t('profile.privacy')}</h2>
        </div>

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
    </div>
  );
};

export default PrivacySettings;
