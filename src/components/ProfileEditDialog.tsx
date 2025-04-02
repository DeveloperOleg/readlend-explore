
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useLanguage } from '@/context/LanguageContext';
import { useIsMobile } from '@/hooks/use-mobile';
import ProfileEditor from '@/components/ProfileEditor';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ProfileEditDialogProps {
  children: React.ReactNode;
}

const ProfileEditDialog: React.FC<ProfileEditDialogProps> = ({ children }) => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className={`${isMobile ? 'w-[95%] max-w-[95vw]' : 'max-w-2xl'} max-h-[90vh]`}>
        <DialogHeader>
          <DialogTitle>{t('profile.editProfile') || 'Редактировать профиль'}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[calc(90vh-100px)] pr-2">
          <div className="p-1">
            <ProfileEditor />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileEditDialog;
