
import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Star, ThumbsUp, ThumbsDown, Calendar, BookOpen, Users } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ComicReactions from './ComicReactions';

interface Review {
  id: string;
  userId: string;
  username: string;
  avatarUrl: string | null;
  rating: number;
  comment: string;
  createdAt: Date;
  likes: number;
  dislikes: number;
  userReaction?: 'like' | 'dislike' | null;
}

// Mock reviews data for comics
const mockComicReviews: Review[] = [
  {
    id: '1',
    userId: 'user1',
    username: 'ComicFan2024',
    avatarUrl: null,
    rating: 5,
    comment: 'Потрясающая графика и увлекательный сюжет! Каждый выпуск становится лучше предыдущего.',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    likes: 15,
    dislikes: 0,
  },
  {
    id: '2',
    userId: 'user2',
    username: 'GraphicNovel_Lover',
    avatarUrl: null,
    rating: 4,
    comment: 'Отличная работа художника, но хотелось бы больше диалогов между персонажами.',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    likes: 7,
    dislikes: 1,
  },
];

interface ComicAboutProps {
  comic: {
    id: string;
    title: string;
    author: string;
    coverUrl: string | null;
    description: string;
    rating: number;
    totalRatings: number;
    issues: number;
  };
}

const ComicAbout: React.FC<ComicAboutProps> = ({ comic }) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>(mockComicReviews);
  const [userRating, setUserRating] = useState<number>(0);

  const handleRating = (rating: number) => {
    if (!user) {
      toast({
        title: t('auth.loginRequired') || 'Login required',
        description: t('auth.loginRequiredMessage') || 'Please log in to rate this comic',
        variant: 'destructive',
      });
      return;
    }
    
    setUserRating(rating);
    toast({
      title: t('comic.ratingSubmitted') || 'Rating submitted',
      description: t('comic.ratingSubmittedMessage') || 'Thank you for rating this comic!',
    });
  };

  const handleReviewReaction = (reviewId: string, reactionType: 'like' | 'dislike') => {
    if (!user) return;
    
    setReviews(currentReviews =>
      currentReviews.map(review => {
        if (review.id === reviewId) {
          if (review.userReaction === reactionType) {
            // Remove reaction
            const updatedReview = { ...review, userReaction: null };
            if (reactionType === 'like') updatedReview.likes = Math.max(0, review.likes - 1);
            if (reactionType === 'dislike') updatedReview.dislikes = Math.max(0, review.dislikes - 1);
            return updatedReview;
          }
          
          // Change or add reaction
          const updatedReview = { ...review, userReaction: reactionType };
          
          // Remove previous reaction count
          if (review.userReaction === 'like') updatedReview.likes = Math.max(0, review.likes - 1);
          if (review.userReaction === 'dislike') updatedReview.dislikes = Math.max(0, review.dislikes - 1);
          
          // Add new reaction count
          if (reactionType === 'like') updatedReview.likes += 1;
          if (reactionType === 'dislike') updatedReview.dislikes += 1;
          
          return updatedReview;
        }
        return review;
      })
    );
  };

  const renderStars = (rating: number, interactive: boolean = false, onRate?: (rating: number) => void) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => interactive && onRate && onRate(star)}
            disabled={!interactive}
            className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}`}
          >
            <Star
              className={`w-4 h-4 ${
                star <= rating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  };

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : comic.rating;

  return (
    <div className="space-y-6 p-4">
      {/* Comic Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
            </div>
            <div className="text-2xl font-bold">{averageRating.toFixed(1)}</div>
            <div className="text-sm text-muted-foreground">{t('comic.rating')}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Users className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-2xl font-bold">{reviews.length + comic.totalRatings}</div>
            <div className="text-sm text-muted-foreground">{t('comic.reviews')}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <BookOpen className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-2xl font-bold">{comic.issues}</div>
            <div className="text-sm text-muted-foreground">{t('comic.issues')}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Calendar className="w-5 h-5 text-purple-500" />
            </div>
            <div className="text-2xl font-bold">2024</div>
            <div className="text-sm text-muted-foreground">{t('comic.year')}</div>
          </CardContent>
        </Card>
      </div>

      {/* Comic Description */}
      <div>
        <h3 className="text-lg font-semibold mb-3">{t('comic.description')}</h3>
        <p className="text-muted-foreground leading-relaxed">{comic.description}</p>
      </div>

      {/* Tags */}
      <div>
        <h3 className="text-lg font-semibold mb-3">{t('comic.genres')}</h3>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">Супергерои</Badge>
          <Badge variant="secondary">Приключения</Badge>
          <Badge variant="secondary">Комикс</Badge>
          <Badge variant="secondary">Графический роман</Badge>
        </div>
      </div>

      <Separator />

      {/* User Rating */}
      {user && (
        <div>
          <h3 className="text-lg font-semibold mb-3">{t('comic.yourRating')}</h3>
          <div className="flex items-center gap-4">
            {renderStars(userRating, true, handleRating)}
            {userRating > 0 && (
              <span className="text-sm text-muted-foreground">
                {t('comic.yourRatingText')} {userRating}/5
              </span>
            )}
          </div>
        </div>
      )}

      <Separator />

      {/* Comic Reactions */}
      <div>
        <h3 className="text-lg font-semibold mb-3">{t('comic.reactions')}</h3>
        <ComicReactions comicId={comic.id} authorId="author1" authorName={comic.author} />
      </div>

      <Separator />

      {/* Reviews */}
      <div>
        <h3 className="text-lg font-semibold mb-4">{t('comic.userReviews')} ({reviews.length})</h3>
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={review.avatarUrl || ''} alt={review.username} />
                    <AvatarFallback>{review.username.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{review.username}</span>
                        {renderStars(review.rating)}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm mb-3">{review.comment}</p>
                    {user && (
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handleReviewReaction(review.id, 'like')}
                          className={`flex items-center gap-1 text-xs ${
                            review.userReaction === 'like' ? 'text-blue-500' : 'text-muted-foreground'
                          } hover:text-blue-500 transition-colors`}
                        >
                          <ThumbsUp className="w-3 h-3" />
                          {review.likes}
                        </button>
                        <button
                          onClick={() => handleReviewReaction(review.id, 'dislike')}
                          className={`flex items-center gap-1 text-xs ${
                            review.userReaction === 'dislike' ? 'text-red-500' : 'text-muted-foreground'
                          } hover:text-red-500 transition-colors`}
                        >
                          <ThumbsDown className="w-3 h-3" />
                          {review.dislikes}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComicAbout;
