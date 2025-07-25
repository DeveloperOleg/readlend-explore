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
import { Grid, Book, Edit, Copy, Share2, UserPlus } from 'lucide-react';
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
    <div className="container mx-auto px-0 md:px-4 pb-16 max-w-screen-sm">
      {/* Instagram Style Profile Header */}
      <div className="flex flex-col space-y-4">
        {/* Profile Header Section */}
        <div className="flex flex-col px-3 sm:px-4">
          {/* Avatar and Stats Row */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Avatar without Story Ring and Edit Button */}
            <div className="relative">
              <Avatar className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 border-2 border-border">
                <AvatarImage src={profileUser.avatarUrl || ''} alt={displayName} />
                <AvatarFallback className="text-lg sm:text-2xl">
                  {displayName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* User Stats */}
            <div className="flex-1 grid grid-cols-3 text-center gap-1 sm:gap-2 py-1 sm:py-2">
              <div className="flex flex-col">
                <span className="font-bold text-base sm:text-lg">{booksCount}</span>
                <span className="text-[10px] sm:text-xs text-muted-foreground">{t('stats.books')}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-base sm:text-lg">{subscribersCount}</span>
                <span className="text-[10px] sm:text-xs text-muted-foreground">{t('stats.followers')}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-base sm:text-lg">{subscriptionsCount}</span>
                <span className="text-[10px] sm:text-xs text-muted-foreground">{t('stats.following')}</span>
              </div>
            </div>
          </div>
          
          {/* Username and Bio */}
          <div className="mt-2 sm:mt-4">
            <h1 className="font-semibold text-base sm:text-lg">{displayName}</h1>
            <p className="text-xs sm:text-sm text-muted-foreground">@{profileUser.username}</p>
            
            {profileUser.bio && (
              <p className="mt-1 sm:mt-2 text-xs sm:text-sm whitespace-pre-wrap">{renderBio(profileUser.bio)}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-1.5 sm:gap-2 mt-3 sm:mt-4">
            {isCurrentUser ? (
              <>
                <ProfileEditDialog>
                  <Button variant="outline" className="flex-1 text-xs sm:text-sm h-8 sm:h-10">
                    {t('profile.editProfile') || 'Редактировать профиль'}
                  </Button>
                </ProfileEditDialog>
                <Button variant="outline" size="icon" className="h-8 w-8 sm:h-10 sm:w-10">
                  <Share2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Button>
              </>
            ) : (
              <>
                <Button variant="default" className="flex-1 text-xs sm:text-sm h-8 sm:h-10">
                  <UserPlus className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  {t('profile.follow') || 'Подписаться'}
                </Button>
                <Button variant="outline" className="flex-1 text-xs sm:text-sm h-8 sm:h-10">
                  {t('profile.message') || 'Сообщение'}
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8 sm:h-10 sm:w-10">
                  <Share2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Button>
              </>
            )}
          </div>
        </div>

        <Separator className="my-1 sm:my-2" />
        
        {/* Content Tabs */}
        <Tabs defaultValue="books" className="w-full">
          <TabsList className="w-full flex justify-around border-t border-b border-border bg-transparent h-10 sm:h-12">
            <TabsTrigger value="books" className="flex-1 data-[state=active]:border-t-2 data-[state=active]:border-primary data-[state=active]:rounded-none bg-transparent">
              <Book className="h-4 w-4 sm:h-5 sm:w-5" />
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="books" className="mt-0">
            <Card className="border-0 shadow-none">
              <CardContent className="p-3 sm:p-4 text-center">
                <p className="text-muted-foreground text-xs sm:text-sm">{t('profile.noPublishedBooks') || 'У вас пока нет опубликованных книг'}</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
