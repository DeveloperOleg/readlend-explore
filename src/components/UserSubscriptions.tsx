
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { UserX, Bell, BellOff, Lock } from 'lucide-react';
import EmptyState from './EmptyState';

const mockSubscriptions = [
  { id: '1', username: 'anna_writer', avatarUrl: null, hasSubscribedBack: true },
  { id: '2', username: 'bookmaster', avatarUrl: null, hasSubscribedBack: false },
  { id: '3', username: 'sci_fi_author', avatarUrl: null, hasSubscribedBack: true },
];

interface UserSubscriptionsProps {
  userId?: string; // Optional, if provided will show another user's subscriptions
}

const UserSubscriptions: React.FC<UserSubscriptionsProps> = ({ userId }) => {
  const { t } = useLanguage();
  const { user, unsubscribeFromUser, blockUser, canViewSubscriptions } = useAuth();
  const { toast } = useToast();
  
  const [subscriptions, setSubscriptions] = React.useState(mockSubscriptions);
  const isOwnProfile = !userId || (user && userId === user.id);
  const canView = isOwnProfile || (userId && canViewSubscriptions(userId));
  
  const handleUnsubscribe = (userId: string) => {
    // In a real app, this would make an API call
    setSubscriptions(subscriptions.filter(sub => sub.id !== userId));
    
    if (unsubscribeFromUser) {
      unsubscribeFromUser(userId);
    }
    
    toast({
      title: t('subscriptions.unsubscribed') || 'Отписка выполнена',
      description: t('subscriptions.unsubscribedMessage') || 'Вы отписались от этого пользователя',
    });
  };
  
  const handleBlock = (userId: string) => {
    // In a real app, this would make an API call
    setSubscriptions(subscriptions.filter(sub => sub.id !== userId));
    
    if (blockUser) {
      blockUser(userId);
    }
    
    toast({
      title: t('subscriptions.blocked') || 'Пользователь заблокирован',
      description: t('subscriptions.blockedMessage') || 'Этот пользователь был добавлен в ваш черный список',
    });
  };
  
  if (!canView) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Lock className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-xl font-medium mb-2">
          {t('subscriptions.hidden') || 'Подписки скрыты'}
        </h3>
        <p className="text-muted-foreground text-center max-w-md">
          {t('subscriptions.hiddenDescription') || 'Пользователь скрыл список своих подписок в настройках конфиденциальности'}
        </p>
      </div>
    );
  }
  
  if (subscriptions.length === 0) {
    return (
      <EmptyState
        title={t('subscriptions.noSubscriptions') || 'Нет подписок'}
        description={t('subscriptions.noSubscriptionsDescription') || 'Вы еще не подписаны ни на одного автора'}
        icon="user"
      />
    );
  }
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">
        {isOwnProfile 
          ? (t('subscriptions.title') || 'Мои подписки')
          : (t('subscriptions.userTitle') || 'Подписки пользователя')}
      </h2>
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {subscriptions.map((sub) => (
          <Card key={sub.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={sub.avatarUrl || ''} alt={sub.username} />
                  <AvatarFallback>
                    {sub.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{sub.username}</p>
                  <div className="flex items-center mt-1">
                    {sub.hasSubscribedBack ? (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                        {t('subscriptions.mutualSubscription') || 'Взаимная подписка'}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        {t('subscriptions.notSubscribedBack') || 'Не подписан на вас'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              {isOwnProfile && (
                <div className="flex justify-between gap-2 mt-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1" 
                    onClick={() => handleUnsubscribe(sub.id)}
                  >
                    <BellOff className="h-4 w-4 mr-2" />
                    {t('subscriptions.unsubscribe') || 'Отписаться'}
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    className="flex-1" 
                    onClick={() => handleBlock(sub.id)}
                  >
                    <UserX className="h-4 w-4 mr-2" />
                    {t('subscriptions.block') || 'Заблокировать'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default UserSubscriptions;
