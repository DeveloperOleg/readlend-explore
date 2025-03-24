
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Ban, Shield, Info } from 'lucide-react';
import EmptyState from './EmptyState';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Mock data for blocked users
const mockBlockedUsers = [
  { id: '1', username: 'trolluser', avatarUrl: null },
  { id: '2', username: 'spam_account', avatarUrl: null },
];

/**
 * Defiance System (Система Неповиновения) - Ban levels specification
 * В будущем будет интегрирована система бана по уровням в полноценной версии приложения.
 * 
 * - Уровень 1: Caution (Осторожность)
 * - Уровень 2: 24-Hour Restriction (Ограничение на 24 часа)
 * - Уровень 3: Week of Silence (Неделя молчания)
 * - Уровень 4: 30-Day Isolation (30-дневная изоляция)
 * - Уровень 5: Ultimate Ban (Окончательный бан - блокировка аккаунта до уровня устройства)
 */
const banLevels = [
  { level: 1, name: 'Caution', nameLoc: 'Осторожность', description: 'Warning issued to the user' },
  { level: 2, name: '24-Hour Restriction', nameLoc: 'Ограничение на 24 часа', description: 'User restricted for 24 hours' },
  { level: 3, name: 'Week of Silence', nameLoc: 'Неделя молчания', description: 'User cannot post for 7 days' },
  { level: 4, name: '30-Day Isolation', nameLoc: '30-дневная изоляция', description: 'User cannot interact for 30 days' },
  { level: 5, name: 'Ultimate Ban', nameLoc: 'Окончательный бан', description: 'Account blocked at device level' }
];

const UserBlocked: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [blockedUsers, setBlockedUsers] = React.useState(mockBlockedUsers);
  const [showBanLevels, setShowBanLevels] = React.useState(false);
  
  const handleUnblock = (userId: string) => {
    // In a real app, this would make an API call
    setBlockedUsers(blockedUsers.filter(user => user.id !== userId));
    
    toast({
      title: t('blocked.unblocked'),
      description: t('blocked.unblockedMessage'),
    });
  };
  
  if (blockedUsers.length === 0) {
    return (
      <EmptyState
        title={t('blocked.noBlocked') || 'Нет заблокированных пользователей'}
        description={t('blocked.noBlockedDescription') || 'Вы не заблокировали ни одного пользователя'}
        icon="ban"
      />
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          {t('blocked.title') || 'Черный список'}
        </h2>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex items-center gap-1" 
                onClick={() => setShowBanLevels(prev => !prev)}
              >
                <Info className="h-4 w-4" />
                <span>{t('blocked.banInfo') || 'Система бана'}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p className="text-sm">Defiance System (Система Неповиновения)</p>
              <p className="text-xs text-muted-foreground mb-2">В будущем будет интегрирована система бана по уровням в полноценной версии приложения.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      {showBanLevels && (
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="flex items-center mb-2">
              <Shield className="h-5 w-5 mr-2 text-primary" />
              <h3 className="font-medium">Defiance System (Система Неповиновения)</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-3">В будущем будет интегрирована система бана по уровням в полноценной версии приложения.</p>
            <div className="space-y-2">
              {banLevels.map((level) => (
                <div key={level.level} className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-medium">
                    {level.level}
                  </span>
                  <div>
                    <p className="text-sm font-medium">{level.name} ({level.nameLoc})</p>
                    <p className="text-xs text-muted-foreground">{level.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {blockedUsers.map((user) => (
          <Card key={user.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={user.avatarUrl || ''} alt={user.username} />
                  <AvatarFallback>
                    {user.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{user.username}</p>
                  <p className="text-xs text-muted-foreground">
                    {t('blocked.blockedUser') || 'Заблокированный пользователь'}
                  </p>
                </div>
              </div>
              
              <div className="mt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full" 
                  onClick={() => handleUnblock(user.id)}
                >
                  <Ban className="h-4 w-4 mr-2" />
                  {t('blocked.unblock') || 'Разблокировать'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default UserBlocked;
