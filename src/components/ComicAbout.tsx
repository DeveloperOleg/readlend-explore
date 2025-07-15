
import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Star, ThumbsUp, ThumbsDown, Calendar, BookOpen, Users, Zap, Heart, MessageCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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
    username: 'ComicFan123',
    avatarUrl: null,
    rating: 5,
    comment: 'Потрясающая графика и захватывающий сюжет! Каждый выпуск становится только лучше.',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    likes: 15,
    dislikes: 0,
  },
  {
    id: '2',
    userId: 'user2',
    username: 'ArtLover',
    avatarUrl: null,
    rating: 4,
    comment: 'Отличное художественное исполнение, но хотелось бы больше экшена в некоторых выпусках.',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    likes: 8,
    dislikes: 1,
  },
  {
    id: '3',
    userId: 'user3',
    username: 'SuperheroReader',
    avatarUrl: null,
    rating: 5,
    comment: 'Лучший российский комикс! Персонажи проработаны до мелочей.',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    likes: 22,
    dislikes: 2,
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
    totalIssues: number;
    genre?: string;
    status?: string;
  };
}

const ComicAbout: React.FC<ComicAboutProps> = ({ comic }) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>(mockComicReviews);
  const [userRating, setUserRating] = useState<number>(0);
  const [userReaction, setUserReaction] = useState<'like' | 'dislike' | null>(null);
  const [reactionCounts, setReactionCounts] = useState({
    likes: 156,
    dislikes: 8
  });

  const handleRating = (rating: number) => {
    if (!user) {
      toast({
        title: 'Требуется авторизация',
        description: 'Пожалуйста, войдите в систему, чтобы оценить этот комикс',
        variant: 'destructive',
      });
      return;
    }
    
    setUserRating(rating);
    toast({
      title: 'Оценка отправлена',
      description: 'Спасибо за оценку этого комикса!',
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

  const handleComicReaction = (reactionType: 'like' | 'dislike') => {
    if (!user) {
      toast({
        title: 'Требуется авторизация',
        description: 'Пожалуйста, войдите в систему, чтобы оценить комикс',
        variant: 'destructive',
      });
      return;
    }

    if (userReaction === reactionType) {
      // Remove reaction
      setUserReaction(null);
      setReactionCounts(prev => ({
        ...prev,
        [reactionType === 'like' ? 'likes' : 'dislikes']: Math.max(0, prev[reactionType === 'like' ? 'likes' : 'dislikes'] - 1)
      }));
    } else {
      // Remove previous reaction if exists
      if (userReaction) {
        setReactionCounts(prev => ({
          ...prev,
          [userReaction === 'like' ? 'likes' : 'dislikes']: Math.max(0, prev[userReaction === 'like' ? 'likes' : 'dislikes'] - 1)
        }));
      }
      
      // Add new reaction
      setUserReaction(reactionType);
      setReactionCounts(prev => ({
        ...prev,
        [reactionType === 'like' ? 'likes' : 'dislikes']: prev[reactionType === 'like' ? 'likes' : 'dislikes'] + 1
      }));
      
      toast({
        title: reactionType === 'like' ? 'Комикс понравился!' : 'Реакция отправлена',
        description: reactionType === 'like' ? 'Вы поставили лайк этому комиксу' : 'Вы поставили дизлайк этому комиксу',
      });
    }
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
            <div className="text-sm text-muted-foreground">Рейтинг</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Users className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-2xl font-bold">{reviews.length + comic.totalRatings}</div>
            <div className="text-sm text-muted-foreground">Отзывы</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <BookOpen className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-2xl font-bold">{comic.totalIssues}</div>
            <div className="text-sm text-muted-foreground">Выпуски</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Zap className="w-5 h-5 text-purple-500" />
            </div>
            <div className="text-2xl font-bold capitalize">{comic.status || 'ongoing'}</div>
            <div className="text-sm text-muted-foreground">Статус</div>
          </CardContent>
        </Card>
      </div>

      {/* Comic Description */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Описание</h3>
        <p className="text-muted-foreground leading-relaxed">{comic.description}</p>
      </div>

      {/* Genre Tags */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Жанр</h3>
        <div className="flex flex-wrap gap-2">
          {comic.genre && <Badge variant="secondary">{comic.genre}</Badge>}
          <Badge variant="secondary">Комикс</Badge>
          <Badge variant="secondary">Графический роман</Badge>
        </div>
      </div>

      <Separator />

      {/* User Rating */}
      {user && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Ваша оценка</h3>
          <div className="flex items-center gap-4">
            {renderStars(userRating, true, handleRating)}
            {userRating > 0 && (
              <span className="text-sm text-muted-foreground">
                Ваша оценка: {userRating}/5
              </span>
            )}
          </div>
        </div>
      )}

      <Separator />

      {/* Comic Reactions */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Реакции на комикс</h3>
        <div className="flex items-center gap-4">
          <button
            onClick={() => handleComicReaction('like')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
              userReaction === 'like' 
                ? 'bg-blue-50 border-blue-200 text-blue-600' 
                : 'hover:bg-gray-50'
            }`}
          >
            <ThumbsUp className={`w-4 h-4 ${userReaction === 'like' ? 'fill-current' : ''}`} />
            <span>{reactionCounts.likes}</span>
          </button>
          
          <button
            onClick={() => handleComicReaction('dislike')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
              userReaction === 'dislike' 
                ? 'bg-red-50 border-red-200 text-red-600' 
                : 'hover:bg-gray-50'
            }`}
          >
            <ThumbsDown className={`w-4 h-4 ${userReaction === 'dislike' ? 'fill-current' : ''}`} />
            <span>{reactionCounts.dislikes}</span>
          </button>
        </div>
      </div>

      <Separator />

      {/* Reviews */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Отзывы читателей ({reviews.length})</h3>
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
