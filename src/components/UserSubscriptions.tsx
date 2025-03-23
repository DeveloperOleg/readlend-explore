import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { UserX, Bell, BellOff } from 'lucide-react';
import EmptyState from './EmptyState';

const mockSubscriptions = [
  { id: '1', username: 'anna_writer', avatarUrl: null, hasSubscribedBack: true },
  { id: '2', username: 'bookmaster', avatarUrl: null, hasSubscribedBack: false },
  { id: '3', username: 'sci_fi_author', avatarUrl: null, hasSubscribedBack: true },
];

const UserSubscriptions: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [subscriptions, setSubscriptions] = React.useState(mockSubscriptions);
  
  const handleUnsubscribe = (userId: string) => {
    // In a real app, this would make an API call
    setSubscriptions(subscriptions.filter(sub => sub.id !== userId));
    
    toast({
      title: t('subscriptions.unsubscribed'),
      description: t('subscriptions.unsubscribedMessage'),
    });
  };
  
  const handleBlock = (userId: string) => {
    // In a real app, this would make an API call
    setSubscriptions(subscriptions.filter(sub => sub.id !== userId));
    
    toast({
      title: t('subscriptions.blocked'),
      description: t('subscriptions.blockedMessage'),
    });
  };
  
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
        {t('subscriptions.title') || 'Мои подписки'}
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
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default UserSubscriptions;
