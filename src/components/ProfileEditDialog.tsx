
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useLanguage } from '@/context/LanguageContext';
import ProfileEditor from '@/components/ProfileEditor';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ProfileEditDialogProps {
  children: React.ReactNode;
}

const ProfileEditDialog: React.FC<ProfileEditDialogProps> = ({ children }) => {
  const { t } = useLanguage();

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{t('profile.editProfile') || 'Редактировать профиль'}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[calc(90vh-100px)] pr-4">
          <div className="p-1">
            <ProfileEditor />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileEditDialog;
