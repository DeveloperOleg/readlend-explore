
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
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
      <DialogContent className={`${isMobile ? 'w-[95%] max-w-[95vw]' : 'max-w-md'} max-h-[90vh] p-0`}>
        <div className="flex items-center justify-between p-4 border-b">
          <DialogTitle className="text-lg font-medium">Редактировать профиль</DialogTitle>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <span className="text-xl">×</span>
            </Button>
          </DialogTrigger>
        </div>
        <ScrollArea className="h-[calc(90vh-120px)]">
          <div className="p-4">
            <ProfileEditor />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileEditDialog;
