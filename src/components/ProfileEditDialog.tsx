
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useLanguage } from '@/context/LanguageContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { useInternet } from '@/context/InternetContext';
import ProfileEditor from '@/components/ProfileEditor';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { WifiOff } from 'lucide-react';

interface ProfileEditDialogProps {
  children: React.ReactNode;
}

const ProfileEditDialog: React.FC<ProfileEditDialogProps> = ({ children }) => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const { isOnline } = useInternet();

  const handleDialogOpen = (open: boolean) => {
    if (open && !isOnline) {
      toast.error("Редактирование профиля недоступно", {
        description: "Для редактирования профиля требуется подключение к интернету",
        icon: <WifiOff className="h-4 w-4" />,
      });
      return false;
    }
    return true;
  };

  return (
    <Dialog onOpenChange={handleDialogOpen}>
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
