
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

const Profile: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  
  if (!user) {
    return null;
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
                  <p className="text-xl font-medium mb-1">{user.username}</p>
                  <p className="text-sm text-muted-foreground mb-3">ID: {user.id}</p>
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
