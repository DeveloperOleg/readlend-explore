
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import UserSubscriptions from '@/components/UserSubscriptions';
import { Grid, Book, Users, Edit } from 'lucide-react';
import ProfileEditDialog from '@/components/ProfileEditDialog';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  
  if (!user) {
    return null;
  }

  // Format display name
  const displayName = [user.firstName, user.lastName].filter(Boolean).join(' ') || user.username;
  
  // Pluralization helpers
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
    <div className="container mx-auto px-4 py-6">
      {/* Profile Header - Instagram Style */}
      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start mb-8">
        {/* Avatar */}
        <Avatar className="h-24 w-24 md:h-36 md:w-36 border-2 border-muted">
          <AvatarImage src={user.avatarUrl || ''} alt={user.username} />
          <AvatarFallback className="text-4xl">
            {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
          </AvatarFallback>
        </Avatar>
        
        {/* Profile Info */}
        <div className="flex-1 flex flex-col items-center md:items-start">
          <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
            <h1 className="text-xl font-medium">
              {user.username ? `@${user.username}` : 'Имя пользователя не указано'}
            </h1>
            <ProfileEditDialog>
              <Button variant="outline" size="sm" className="h-8">
                <Edit className="h-4 w-4 mr-2" />
                {t('profile.editProfile') || 'Редактировать профиль'}
              </Button>
            </ProfileEditDialog>
          </div>
          
          {/* Stats */}
          <div className="flex justify-center md:justify-start gap-6 mb-4">
            <div className="flex flex-col items-center md:items-start">
              <span className="font-bold">{user.publishedBooks?.length || 0}</span>
              <span className="text-sm text-muted-foreground">{getBookLabel(user.publishedBooks?.length || 0)}</span>
            </div>
            
            <div className="flex flex-col items-center md:items-start">
              <span className="font-bold">{user.subscribers?.length || 0}</span>
              <span className="text-sm text-muted-foreground">{getSubscribersLabel(user.subscribers?.length || 0)}</span>
            </div>
            
            <div className="flex flex-col items-center md:items-start">
              <span className="font-bold">{user.subscriptions?.length || 0}</span>
              <span className="text-sm text-muted-foreground">{getSubscriptionsLabel(user.subscriptions?.length || 0)}</span>
            </div>
          </div>
          
          {/* Display Name */}
          <div className="text-center md:text-left">
            <h2 className="font-semibold">{displayName}</h2>
            <p className="text-sm text-muted-foreground">ID: {user.displayId}</p>
          </div>
        </div>
      </div>
      
      <Separator className="my-6" />
      
      {/* Content Tabs */}
      <Tabs defaultValue="grid" className="w-full">
        <TabsList className="mb-6 justify-center">
          <TabsTrigger value="grid">
            <Grid className="h-5 w-5" />
            <span className="sr-only">{t('profile.grid') || 'Сетка'}</span>
          </TabsTrigger>
          <TabsTrigger value="books">
            <Book className="h-5 w-5" />
            <span className="sr-only">{t('profile.books') || 'Книги'}</span>
          </TabsTrigger>
          <TabsTrigger value="subscriptions">
            <Users className="h-5 w-5" />
            <span className="sr-only">{t('profile.subscriptions') || 'Подписки'}</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="grid">
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">{t('profile.noPublishedBooks') || 'У вас пока нет опубликованных книг'}</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="books">
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">{t('profile.noPublishedBooks') || 'У вас пока нет опубликованных книг'}</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="subscriptions">
          <UserSubscriptions />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
