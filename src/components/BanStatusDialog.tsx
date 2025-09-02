import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Clock, VolumeX, Shield, Ban } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface BanStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const BanStatusDialog: React.FC<BanStatusDialogProps> = ({ open, onOpenChange }) => {
  const { t } = useLanguage();

  const banLevels = [
    {
      level: 1,
      icon: AlertTriangle,
      color: 'bg-yellow-100 text-yellow-700',
      iconColor: 'text-yellow-600',
      title: 'Caution (Осторожность)',
      description: 'Warning issued to the user',
    },
    {
      level: 2,
      icon: Clock,
      color: 'bg-orange-100 text-orange-700',
      iconColor: 'text-orange-600',
      title: '24-Hour Restriction (Ограничение на 24 часа)',
      description: 'User restricted for 24 hours',
    },
    {
      level: 3,
      icon: VolumeX,
      color: 'bg-red-100 text-red-700',
      iconColor: 'text-red-600',
      title: 'Week of Silence (Неделя молчания)',
      description: 'User cannot post for 7 days',
    },
    {
      level: 4,
      icon: Shield,
      color: 'bg-purple-100 text-purple-700',
      iconColor: 'text-purple-600',
      title: '30-Day Isolation (30-дневная изоляция)',
      description: 'User cannot interact for 30 days',
    },
    {
      level: 5,
      icon: Ban,
      color: 'bg-gray-100 text-gray-700',
      iconColor: 'text-gray-600',
      title: 'Ultimate Ban (Окончательный бан)',
      description: 'Account blocked at device level',
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <Shield className="h-5 w-5" />
            Аккаунт
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground mb-4">
            В будущем будет интегрирована система бана по уровням в полноценной версии приложения.
          </p>
          
          <div className="space-y-3">
            {banLevels.map((ban) => (
              <div
                key={ban.level}
                className={`flex items-center gap-3 p-3 rounded-lg ${ban.color}`}
              >
                <div className={`flex items-center justify-center w-8 h-8 rounded-full bg-white/80`}>
                  <ban.icon className={`h-4 w-4 ${ban.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">
                    {ban.level}
                  </p>
                  <p className="text-xs font-semibold">
                    {ban.title}
                  </p>
                  <p className="text-xs opacity-80">
                    {ban.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-end pt-4">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="text-sm"
          >
            Закрыть
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BanStatusDialog;