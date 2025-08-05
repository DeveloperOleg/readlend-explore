
import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Star, ThumbsUp, ThumbsDown, Calendar, BookOpen, Users, Zap, Heart, MessageCircle, Eye } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
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
    <div className="px-4 py-6 space-y-6">
      {/* Statistics section - similar to BookAbout */}
      <div className="flex justify-around text-center py-4">
        <div className="flex flex-col items-center">
          <Eye className="w-5 h-5 text-blue-500 mb-1" />
          <div className="font-semibold text-lg">94K</div>
          <div className="text-sm text-muted-foreground">Просмотров</div>
        </div>
        <div className="flex flex-col items-center">
          <Heart className="w-5 h-5 text-red-500 mb-1" />
          <div className="font-semibold text-lg">6.3K</div>
          <div className="text-sm text-muted-foreground">Лайков</div>
        </div>
        <div className="flex flex-col items-center">
          <MessageCircle className="w-5 h-5 text-green-500 mb-1" />
          <div className="font-semibold text-lg">1.8K</div>
          <div className="text-sm text-muted-foreground">Отзывов</div>
        </div>
      </div>

      {/* Genre tags */}
      <div>
        <h3 className="font-semibold mb-3">Жанры</h3>
        <div className="flex flex-wrap gap-2">
          {comic.genre && <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">{comic.genre}</Badge>}
          <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200">Комикс</Badge>
          <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200">Графический роман</Badge>
          <Badge className="bg-green-100 text-green-700 hover:bg-green-200">Боевик</Badge>
        </div>
      </div>

      {/* Comic Description */}
      <div>
        <h3 className="font-semibold mb-3">Описание</h3>
        <p className="text-muted-foreground leading-relaxed text-sm">
          {comic.description}
        </p>
      </div>

      {/* Reading Progress */}
      <div className="bg-muted/50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold">Прогресс чтения</h3>
        </div>
        <div className="mb-2">
          <div className="flex justify-between text-sm text-muted-foreground mb-1">
            <span>Выпуск 12 из {comic.totalIssues}</span>
            <span>{Math.round((12 / comic.totalIssues) * 100)}%</span>
          </div>
          <Progress value={Math.round((12 / comic.totalIssues) * 100)} className="h-2" />
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
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Отзывы читателей</h3>
          <span className="text-sm text-orange-600">1.8K отзывов</span>
        </div>
        
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <Avatar className="h-8 w-8 bg-blue-500 text-white">
                <AvatarImage src={review.avatarUrl || ''} alt={review.username} />
                <AvatarFallback>{review.username.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{review.username}</span>
                  <div className="flex text-yellow-400">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star 
                        key={i} 
                        className={`w-3 h-3 ${i <= review.rating ? 'fill-current' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(review.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{review.comment}</p>
                <div className="flex items-center gap-4 text-xs">
                  <button 
                    onClick={() => handleReviewReaction(review.id, 'like')}
                    className="flex items-center gap-1 text-muted-foreground"
                  >
                    <ThumbsUp className="w-3 h-3" />
                    <span>{review.likes}</span>
                  </button>
                  <button className="text-muted-foreground">Ответить</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComicAbout;
