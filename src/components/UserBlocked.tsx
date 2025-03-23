
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Ban } from 'lucide-react';
import EmptyState from './EmptyState';

// Mock data for blocked users
const mockBlockedUsers = [
  { id: '1', username: 'trolluser', avatarUrl: null },
  { id: '2', username: 'spam_account', avatarUrl: null },
];

const UserBlocked: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [blockedUsers, setBlockedUsers] = React.useState(mockBlockedUsers);
  
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
      <h2 className="text-xl font-semibold">
        {t('blocked.title') || 'Черный список'}
      </h2>
      
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
