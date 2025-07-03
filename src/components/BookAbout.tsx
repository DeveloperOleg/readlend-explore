
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
import BookReactions from './BookReactions';

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

// Mock reviews data
const mockReviews: Review[] = [
  {
    id: '1',
    userId: 'user1',
    username: 'BookLover123',
    avatarUrl: null,
    rating: 5,
    comment: 'Потрясающая книга! Сюжет захватывает с первых страниц и не отпускает до самого конца.',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    likes: 12,
    dislikes: 1,
  },
  {
    id: '2',
    userId: 'user2',
    username: 'ReadingAddict',
    avatarUrl: null,
    rating: 4,
    comment: 'Хорошая книга, но концовка показалась немного спешной. В целом рекомендую.',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    likes: 8,
    dislikes: 2,
  },
  {
    id: '3',
    userId: 'user3',
    username: 'CriticalReader',
    avatarUrl: null,
    rating: 3,
    comment: 'Средняя книга. Есть интересные моменты, но персонажи не очень проработаны.',
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    likes: 3,
    dislikes: 5,
  },
];

interface BookAboutProps {
  book: {
    id: string;
    title: string;
    author: string;
    coverUrl: string | null;
    description: string;
    rating: number;
    totalRatings: number;
  };
  totalParts?: number;
}

const BookAbout: React.FC<BookAboutProps> = ({ book, totalParts = 118 }) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [userRating, setUserRating] = useState<number>(0);

  const handleRating = (rating: number) => {
    if (!user) {
      toast({
        title: t('auth.loginRequired') || 'Login required',
        description: t('auth.loginRequiredMessage') || 'Please log in to rate this book',
        variant: 'destructive',
      });
      return;
    }
    
    setUserRating(rating);
    toast({
      title: t('book.ratingSubmitted') || 'Rating submitted',
      description: t('book.ratingSubmittedMessage') || 'Thank you for rating this book!',
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
    : book.rating;

  return (
    <div className="space-y-6 p-4">
      {/* Book Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
            </div>
            <div className="text-2xl font-bold">{averageRating.toFixed(1)}</div>
            <div className="text-sm text-muted-foreground">{t('book.rating')}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Users className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-2xl font-bold">{reviews.length + book.totalRatings}</div>
            <div className="text-sm text-muted-foreground">{t('book.reviews')}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <BookOpen className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-2xl font-bold">{totalParts}</div>
            <div className="text-sm text-muted-foreground">{t('book.parts')}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Calendar className="w-5 h-5 text-purple-500" />
            </div>
            <div className="text-2xl font-bold">2024</div>
            <div className="text-sm text-muted-foreground">{t('book.year')}</div>
          </CardContent>
        </Card>
      </div>

      {/* Book Description */}
      <div>
        <h3 className="text-lg font-semibold mb-3">{t('book.description')}</h3>
        <p className="text-muted-foreground leading-relaxed">{book.description}</p>
      </div>

      {/* Tags */}
      <div>
        <h3 className="text-lg font-semibold mb-3">{t('book.genres')}</h3>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">Фантастика</Badge>
          <Badge variant="secondary">Приключения</Badge>
          <Badge variant="secondary">Молодежная литература</Badge>
        </div>
      </div>

      <Separator />

      {/* User Rating */}
      {user && (
        <div>
          <h3 className="text-lg font-semibold mb-3">{t('book.yourRating')}</h3>
          <div className="flex items-center gap-4">
            {renderStars(userRating, true, handleRating)}
            {userRating > 0 && (
              <span className="text-sm text-muted-foreground">
                {t('book.yourRatingText')} {userRating}/5
              </span>
            )}
          </div>
        </div>
      )}

      <Separator />

      {/* Book Reactions */}
      <div>
        <h3 className="text-lg font-semibold mb-3">{t('book.reactions')}</h3>
        <BookReactions bookId={book.id} authorId="author1" authorName={book.author} />
      </div>

      <Separator />

      {/* Reviews */}
      <div>
        <h3 className="text-lg font-semibold mb-4">{t('book.userReviews')} ({reviews.length})</h3>
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

export default BookAbout;
