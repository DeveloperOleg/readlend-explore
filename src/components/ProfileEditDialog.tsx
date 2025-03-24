
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useLanguage } from '@/context/LanguageContext';
import ProfileEditor from '@/components/ProfileEditor';

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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t('profile.editProfile') || 'Редактировать профиль'}</DialogTitle>
        </DialogHeader>
        <ProfileEditor />
      </DialogContent>
    </Dialog>
  );
};

export default ProfileEditDialog;
