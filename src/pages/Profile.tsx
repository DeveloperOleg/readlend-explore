
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import UserSubscriptions from '@/components/UserSubscriptions';
import { Grid, Book, Users, Edit, Copy } from 'lucide-react';
import ProfileEditDialog from '@/components/ProfileEditDialog';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/types/auth';

const Profile: React.FC = () => {
  const { user, getUserById } = useAuth();
  const { t } = useLanguage();
  const { userId } = useParams<{ userId?: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    // If userId is provided, try to fetch that user's data
    if (userId && userId !== user?.id) {
      const foundUser = getUserById(userId);
      if (foundUser) {
        setProfileUser(foundUser);
      } else {
        // If user not found, redirect to current user's profile
        navigate('/profile');
      }
    } else {
      // Show current user's profile
      setProfileUser(user);
    }
  }, [userId, user, getUserById, navigate]);
  
  if (!profileUser) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="h-10 w-10 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }

  // Determine if this is the current user's profile
  const isCurrentUser = user?.id === profileUser.id;

  // Format display name
  const displayName = [profileUser.firstName, profileUser.lastName].filter(Boolean).join(' ') || profileUser.username;
  
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

  const handleCopyUsername = () => {
    navigator.clipboard.writeText(profileUser.username);
    toast({
      title: t('profile.usernameCopied') || 'Имя пользователя скопировано',
      description: `@${profileUser.username}`,
    });
  };

  // Make hashtag clickable
  const renderBio = (bio: string | undefined) => {
    if (!bio) return null;
    
    // Replace hashtags with clickable links
    const parts = [];
    let lastIndex = 0;
    const hashtagRegex = /#\w+/g;
    let match;
    
    while ((match = hashtagRegex.exec(bio)) !== null) {
      // Add text before hashtag
      if (match.index > lastIndex) {
        parts.push(bio.slice(lastIndex, match.index));
      }
      
      // Add clickable hashtag
      const hashtag = match[0];
      parts.push(
        <a 
          key={`hashtag-${match.index}`}
          href={`/tag/${hashtag.substring(1)}`}
          className="text-primary hover:underline"
          onClick={(e) => {
            e.preventDefault();
            toast({
              title: t('common.comingSoon') || 'Скоро будет доступно',
              description: `${hashtag}`,
            });
          }}
        >
          {hashtag}
        </a>
      );
      
      lastIndex = match.index + hashtag.length;
    }
    
    // Add remaining text
    if (lastIndex < bio.length) {
      parts.push(bio.slice(lastIndex));
    }
    
    return parts;
  };

  return (
    <div className="container mx-auto px-2">
      {/* Profile Header - Instagram Style */}
      <div className="flex flex-col md:flex-row gap-4 items-center md:items-start mb-6 mt-4">
        {/* Avatar */}
        <Avatar className="h-20 w-20 md:h-36 md:w-36 border-2 border-muted">
          <AvatarImage src={profileUser.avatarUrl || ''} alt={profileUser.username} />
          <AvatarFallback className="text-2xl md:text-4xl">
            {profileUser.username ? profileUser.username.charAt(0).toUpperCase() : 'U'}
          </AvatarFallback>
        </Avatar>
        
        {/* Profile Info */}
        <div className="flex-1 flex flex-col items-center md:items-start">
          <div className="flex flex-col md:flex-row md:items-center gap-2 mb-3">
            <div className="flex items-center gap-2">
              <h1 
                className="text-lg font-medium cursor-pointer" 
                onClick={handleCopyUsername}
              >
                {profileUser.username ? `@${profileUser.username}` : 'Имя пользователя не указано'}
              </h1>
              <button
                onClick={handleCopyUsername}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label={t('profile.copyUsername') || 'Копировать имя пользователя'}
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
            
            {isCurrentUser && (
              <ProfileEditDialog>
                <Button variant="outline" size="sm" className="h-8 mt-1 md:mt-0">
                  <Edit className="h-3 w-3 mr-1" />
                  {t('profile.editProfile') || 'Редактировать'}
                </Button>
              </ProfileEditDialog>
            )}
          </div>
          
          {/* Stats */}
          <div className="flex justify-center md:justify-start gap-4 md:gap-6 mb-3">
            <div className="flex flex-col items-center md:items-start">
              <span className="font-bold">{profileUser.publishedBooks?.length || 0}</span>
              <span className="text-xs md:text-sm text-muted-foreground">{getBookLabel(profileUser.publishedBooks?.length || 0)}</span>
            </div>
            
            <div className="flex flex-col items-center md:items-start">
              <span className="font-bold">{profileUser.subscribers?.length || 0}</span>
              <span className="text-xs md:text-sm text-muted-foreground">{getSubscribersLabel(profileUser.subscribers?.length || 0)}</span>
            </div>
            
            <div className="flex flex-col items-center md:items-start">
              <span className="font-bold">{profileUser.subscriptions?.length || 0}</span>
              <span className="text-xs md:text-sm text-muted-foreground">{getSubscriptionsLabel(profileUser.subscriptions?.length || 0)}</span>
            </div>
          </div>
          
          {/* Display Name and Bio */}
          <div className="text-center md:text-left">
            <h2 className="font-semibold">{displayName}</h2>
            <p className="text-xs md:text-sm text-muted-foreground">ID: {profileUser.displayId}</p>
            
            {/* Display bio with clickable hashtags if it exists */}
            {profileUser.bio && (
              <p className="mt-2 text-sm max-w-md whitespace-pre-wrap">{renderBio(profileUser.bio)}</p>
            )}
          </div>
        </div>
      </div>
      
      <Separator className="my-4" />
      
      {/* Content Tabs */}
      <Tabs defaultValue="grid" className="w-full">
        <TabsList className="mb-4 justify-center w-full">
          <TabsTrigger value="grid" className="flex-1">
            <Grid className="h-4 w-4 md:h-5 md:w-5 mx-auto" />
            <span className="sr-only">{t('profile.grid') || 'Сетка'}</span>
          </TabsTrigger>
          <TabsTrigger value="books" className="flex-1">
            <Book className="h-4 w-4 md:h-5 md:w-5 mx-auto" />
            <span className="sr-only">{t('profile.books') || 'Книги'}</span>
          </TabsTrigger>
          <TabsTrigger value="subscriptions" className="flex-1">
            <Users className="h-4 w-4 md:h-5 md:w-5 mx-auto" />
            <span className="sr-only">{t('profile.subscriptions') || 'Подписки'}</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="grid">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-muted-foreground text-sm">{t('profile.noPublishedBooks') || 'У вас пока нет опубликованных книг'}</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="books">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-muted-foreground text-sm">{t('profile.noPublishedBooks') || 'У вас пока нет опубликованных книг'}</p>
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
