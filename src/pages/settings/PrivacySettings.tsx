
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Eye, EyeOff } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

const PrivacySettings: React.FC = () => {
  const { t } = useLanguage();
  const { user, toggleHideSubscriptions, toggleGlobalComments, togglePreventCopying } = useAuth();
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

  const handleToggleCopyPrevention = async (value: boolean) => {
    if (togglePreventCopying) {
      togglePreventCopying(value);
    }
  };

  // Apply copy prevention styles when enabled
  useEffect(() => {
    const body = document.body;
    
    if (user?.privacy?.preventCopying) {
      // Prevent text selection
      body.style.userSelect = 'none';
      body.style.webkitUserSelect = 'none';
      // Use type assertion for non-standard properties
      (body.style as any).mozUserSelect = 'none';
      (body.style as any).msUserSelect = 'none';
      
      // Prevent context menu
      const preventContextMenu = (e: MouseEvent) => e.preventDefault();
      document.addEventListener('contextmenu', preventContextMenu);
      
      // Prevent common keyboard shortcuts for copying
      const preventKeyboardShortcuts = (e: KeyboardEvent) => {
        if (
          (e.ctrlKey || e.metaKey) && 
          (e.key === 'c' || e.key === 'a' || e.key === 's' || e.key === 'p')
        ) {
          e.preventDefault();
        }
        // Prevent F12, Ctrl+Shift+I, Ctrl+U
        if (
          e.key === 'F12' || 
          ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'I') ||
          ((e.ctrlKey || e.metaKey) && e.key === 'u')
        ) {
          e.preventDefault();
        }
      };
      document.addEventListener('keydown', preventKeyboardShortcuts);
      
      // Prevent drag and drop
      const preventDragStart = (e: DragEvent) => e.preventDefault();
      document.addEventListener('dragstart', preventDragStart);
      
      return () => {
        body.style.userSelect = '';
        body.style.webkitUserSelect = '';
        (body.style as any).mozUserSelect = '';
        (body.style as any).msUserSelect = '';
        document.removeEventListener('contextmenu', preventContextMenu);
        document.removeEventListener('keydown', preventKeyboardShortcuts);
        document.removeEventListener('dragstart', preventDragStart);
      };
    }
  }, [user?.privacy?.preventCopying]);

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

        <div className="rounded-lg border p-3">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-sm font-medium">{t('profile.preventCopying')}</h3>
              <p className="text-xs text-muted-foreground">
                {t('profile.preventCopyingDescription')}
              </p>
            </div>
            <Switch
              checked={user?.privacy?.preventCopying}
              onCheckedChange={handleToggleCopyPrevention}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacySettings;
