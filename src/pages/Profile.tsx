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
import { Grid, Book, Edit, Copy, Share2, UserPlus, Users, Heart } from 'lucide-react';
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
  const displayName = profileUser.firstName || profileUser.username;
  
  // Book count and label
  const booksCount = profileUser.publishedBooks?.length || 0;
  
  // Subscriber count and label
  const subscribersCount = profileUser.subscribers?.length || 0;
  
  // Subscription count and label
  const subscriptionsCount = profileUser.subscriptions?.length || 0;

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
    <div className="bg-background min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <div className="w-6 h-6 flex items-center justify-center">←</div>
        </Button>
        <h1 className="font-semibold">Профиль</h1>
        <Button variant="ghost" size="icon">
          <div className="w-6 h-6 flex items-center justify-center">⋮</div>
        </Button>
      </div>

      <div className="p-4">
        {/* Profile Info */}
        <div className="flex items-center gap-4 mb-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={profileUser.avatarUrl || ''} alt={displayName} />
            <AvatarFallback className="text-2xl bg-purple-500 text-white">
              {displayName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <h2 className="font-semibold text-lg">{displayName}</h2>
            <p className="text-muted-foreground text-sm">@{profileUser.username}</p>
            
            {isCurrentUser && (
              <div className="flex gap-2 mt-2">
                <ProfileEditDialog>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="bg-black text-white hover:bg-gray-800 border-black"
                  >
                    Редактировать профиль
                  </Button>
                </ProfileEditDialog>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Profile Tags */}
        <div className="flex gap-2 mb-4 text-sm">
          <span>📚 Любитель книг</span>
          <span>✨ Начинающий автор</span>
          <span>🌟 Открыт для новых историй</span>
        </div>

        {/* Stats Section with Icons */}
        <div className="flex items-center justify-center gap-8 mb-8">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 mb-1">
              <Book className="h-4 w-4 text-blue-500" />
              <span className="text-lg font-medium">{booksCount}</span>
            </div>
            <span className="text-xs text-muted-foreground">Книги</span>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 mb-1">
              <Users className="h-4 w-4 text-green-500" />
              <span className="text-lg font-medium">{subscribersCount}</span>
            </div>
            <span className="text-xs text-muted-foreground">Подписчики</span>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 mb-1">
              <Heart className="h-4 w-4 text-red-500" />
              <span className="text-lg font-medium">{subscriptionsCount}</span>
            </div>
            <span className="text-xs text-muted-foreground">Подписки</span>
          </div>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="books" className="w-full">
          <TabsList className="w-full grid grid-cols-3 bg-muted/30">
            <TabsTrigger value="books" className="gap-2">
              <Book className="h-4 w-4" />
              Книги
            </TabsTrigger>
            <TabsTrigger value="reviews" className="gap-2">
              <div className="h-4 w-4 flex items-center justify-center">⭐</div>
              Отзывы
            </TabsTrigger>
            <TabsTrigger value="collections" className="gap-2">
              <div className="h-4 w-4 flex items-center justify-center">♥</div>
              Коллекции
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="books" className="mt-6">
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mx-auto mb-4">
                <Book className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold mb-2">Пока нет опубликованных книг</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Начните свое писательское путешествие! Создайте свою первую книгу и поделитесь с миром
              </p>
              {isCurrentUser && (
                <Button className="bg-black text-white hover:bg-gray-800">
                  <Edit className="h-4 w-4 mr-2" />
                  Написать книгу
                </Button>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="reviews" className="mt-6">
            <div className="text-center py-12">
              <div className="text-4xl mb-4">⭐</div>
              <p className="text-muted-foreground">Отзывы пока отсутствуют</p>
            </div>
          </TabsContent>
          
          <TabsContent value="collections" className="mt-6">
            <div className="text-center py-12">
              <div className="text-4xl mb-4">♥</div>
              <p className="text-muted-foreground">Коллекции пока отсутствуют</p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Bottom Notice */}
        {isCurrentUser && (
          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
              <div>
                <h4 className="font-medium text-blue-900 mb-1">Завершите настройку профиля</h4>
                <p className="text-sm text-blue-700 mb-2">
                  Добавьте фото профиля и расскажите о себе, чтобы другие пользователи могли узнать.
                </p>
                <Button 
                  size="sm" 
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => {/* Add action */}}
                >
                  + Добавить
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
