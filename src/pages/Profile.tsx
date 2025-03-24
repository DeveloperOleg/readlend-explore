
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import ProfileEditor from '@/components/ProfileEditor';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import UserSubscriptions from '@/components/UserSubscriptions';
import UserBlocked from '@/components/UserBlocked';
import { Book, Users } from 'lucide-react';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  
  if (!user) {
    return null;
  }

  // Format display name
  const displayName = [user.firstName, user.lastName].filter(Boolean).join(' ') || user.username;
  
  // User statistics with proper pluralization
  const statistics = [
    {
      count: user.publishedBooks?.length || 0,
      label: getBookLabel(user.publishedBooks?.length || 0),
      icon: <Book className="h-5 w-5" />
    },
    {
      count: user.subscribers?.length || 0,
      label: getSubscribersLabel(user.subscribers?.length || 0),
      icon: <Users className="h-5 w-5" />
    },
    {
      count: user.subscriptions?.length || 0,
      label: getSubscriptionsLabel(user.subscriptions?.length || 0),
      icon: <Users className="h-5 w-5" />
    }
  ];

  // Helper functions for pluralization
  function getBookLabel(count: number): string {
    if (count === 0) return 'книг';
    if (count === 1) return 'книга';
    if (count >= 2 && count <= 4) return 'книги';
    return 'книг';
  }

  function getSubscribersLabel(count: number): string {
    if (count === 0) return 'подписчиков';
    if (count === 1) return 'подписчик';
    if (count >= 2 && count <= 4) return 'подписчика';
    return 'подписчиков';
  }

  function getSubscriptionsLabel(count: number): string {
    if (count === 0) return 'подписок';
    if (count === 1) return 'подписка';
    if (count >= 2 && count <= 4) return 'подписки';
    return 'подписок';
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{t('profile.title') || 'Профиль пользователя'}</h1>
      
      <Tabs defaultValue="info" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="info">{t('profile.information') || 'Информация'}</TabsTrigger>
          <TabsTrigger value="subscriptions">{t('profile.subscriptions') || 'Подписки'}</TabsTrigger>
          <TabsTrigger value="blocked">{t('profile.blocked') || 'Черный список'}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="info" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
            <Card className="col-span-1">
              <CardHeader className="pb-2">
                <CardTitle>{t('profile.information') || 'Информация'}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <Avatar className="h-32 w-32 mb-4">
                  <AvatarImage src={user.avatarUrl || ''} alt={user.username} />
                  <AvatarFallback className="text-3xl">
                    {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <p className="text-xl font-medium mb-1">{displayName}</p>
                  <p className="text-sm text-muted-foreground mb-1">
                    {user.username ? `@${user.username}` : 'Имя пользователя не указано'}
                  </p>
                  <p className="text-sm text-muted-foreground mb-3">ID: {user.displayId}</p>
                  
                  <div className="flex justify-center gap-6 mt-4">
                    {statistics.map((stat, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <div className="flex gap-1 items-center">
                          {stat.icon}
                          <span className="text-xl font-bold">{stat.count}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="col-span-1 lg:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle>{t('profile.editProfile') || 'Редактировать профиль'}</CardTitle>
              </CardHeader>
              <CardContent>
                <ProfileEditor />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="subscriptions">
          <UserSubscriptions />
        </TabsContent>
        
        <TabsContent value="blocked">
          <UserBlocked />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
