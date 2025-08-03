
import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Star, ThumbsUp, ThumbsDown, Calendar, BookOpen, Users, Eye, Heart, MessageCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
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
    <div className="px-4 py-6 space-y-6">
      {/* Statistics section - similar to screenshot */}
      <div className="flex justify-around text-center py-4">
        <div className="flex flex-col items-center">
          <Eye className="w-5 h-5 text-blue-500 mb-1" />
          <div className="font-semibold text-lg">127K</div>
          <div className="text-sm text-muted-foreground">Просмотров</div>
        </div>
        <div className="flex flex-col items-center">
          <Heart className="w-5 h-5 text-red-500 mb-1" />
          <div className="font-semibold text-lg">8.2K</div>
          <div className="text-sm text-muted-foreground">Лайков</div>
        </div>
        <div className="flex flex-col items-center">
          <MessageCircle className="w-5 h-5 text-green-500 mb-1" />
          <div className="font-semibold text-lg">2.7K</div>
          <div className="text-sm text-muted-foreground">Отзывов</div>
        </div>
      </div>

      {/* Genre tags */}
      <div>
        <h3 className="font-semibold mb-3">Жанры</h3>
        <div className="flex flex-wrap gap-2">
          <Badge className="bg-pink-100 text-pink-700 hover:bg-pink-200">Фэнтези</Badge>
          <Badge className="bg-green-100 text-green-700 hover:bg-green-200">Романтика</Badge>
          <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200">Приключения</Badge>
          <Badge className="bg-red-100 text-red-700 hover:bg-red-200">Исторический</Badge>
        </div>
      </div>

      {/* Book Description */}
      <div>
        <h3 className="font-semibold mb-3">Описание</h3>
        <p className="text-muted-foreground leading-relaxed text-sm">
          В мире, где магия переплетается с придворными интригами, молодой наследник императорского престола должен научиться управлять не только своими силами, но и сложными отношениями при дворе. Веер Императора - не просто аксессуар, а ключ к древним тайнам, которые могут изменить судьбу всей империи. Каждая глава дворца открывает новые секреты, а каждый урок магии приближает к разгадке предательства, которое угрожает всему, что дорого нашему герою.
        </p>
      </div>

      {/* Reading Progress */}
      <div className="bg-muted/50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold">Прогресс чтения</h3>
        
        </div>
        <div className="mb-2">
          <div className="flex justify-between text-sm text-muted-foreground mb-1">
            <span>Глава 4 из 8</span>
            <span>34%</span>
          </div>
          <Progress value={34} className="h-2" />
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
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Отзывы читателей</h3>
          <span className="text-sm text-orange-600">2.7K отзывов</span>
        </div>
        
        <div className="space-y-4">
          {/* Example reviews like in screenshot */}
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <Avatar className="h-8 w-8 bg-orange-500 text-white">
              <AvatarFallback>Е</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-sm">Елена М.</span>
                <div className="flex text-yellow-400">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 fill-current" />)}
                </div>
                <span className="text-xs text-muted-foreground">3 дня назад</span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Невероятный мир! Очень хорошо описана система мира и персонажей. Каждая глава держит в напряжении до последней страницы.
              </p>
              <div className="flex items-center gap-4 text-xs">
                <button className="flex items-center gap-1 text-muted-foreground">
                  <ThumbsUp className="w-3 h-3" />
                  <span>9</span>
                </button>
                <button className="text-muted-foreground">Ответить</button>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <Avatar className="h-8 w-8 bg-blue-500 text-white">
              <AvatarFallback>Д</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-sm">Дмитрий К.</span>
                <div className="flex text-yellow-400">
                  {[1,2,3,4].map(i => <Star key={i} className="w-3 h-3 fill-current" />)}
                  <Star className="w-3 h-3 text-gray-300" />
                </div>
                <span className="text-xs text-muted-foreground">1 неделю назад</span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Очень красивое описание мира и персонажей!
              </p>
              <div className="flex items-center gap-4 text-xs">
                <button className="flex items-center gap-1 text-muted-foreground">
                  <ThumbsUp className="w-3 h-3" />
                  <span>11</span>
                </button>
                <button className="text-muted-foreground">Ответить</button>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <Avatar className="h-8 w-8 bg-green-500 text-white">
              <AvatarFallback>А</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-sm">Анна П.</span>
                <div className="flex text-yellow-400">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 fill-current" />)}
                </div>
                <span className="text-xs text-muted-foreground">2 недели назад</span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Потрясающая романтическая линия! Химия между главными героями ощущается с первых страниц. Автор умеет создать эмоциональное напряжение и не разочаровывает в развитии отношений.
              </p>
              <div className="flex items-center gap-4 text-xs">
                <button className="flex items-center gap-1 text-muted-foreground">
                  <ThumbsUp className="w-3 h-3" />
                  <span>12</span>
                </button>
                <button className="text-muted-foreground">Ответить</button>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <Avatar className="h-8 w-8 bg-purple-500 text-white">
              <AvatarFallback>М</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-sm">Максим В.</span>
                <div className="flex text-yellow-400">
                  {[1,2,3,4].map(i => <Star key={i} className="w-3 h-3 fill-current" />)}
                  <Star className="w-3 h-3 text-gray-300" />
                </div>
                <span className="text-xs text-muted-foreground">3 недели назад</span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Интересная магическая система и хорошо продуманный мир. Некоторые повороты сюжета предсказуемы, но общее впечатление очень положительное. Жду продолжения!
              </p>
              <div className="flex items-center gap-4 text-xs">
                <button className="flex items-center gap-1 text-muted-foreground">
                  <ThumbsUp className="w-3 h-3" />
                  <span>15</span>
                </button>
                <button className="text-muted-foreground">Ответить</button>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <Avatar className="h-8 w-8 bg-pink-500 text-white">
              <AvatarFallback>Д</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-sm">Дима С.</span>
                <div className="flex text-yellow-400">
                  {[1,2,3,4].map(i => <Star key={i} className="w-3 h-3 fill-current" />)}
                  <Star className="w-3 h-3 text-gray-300" />
                </div>
                <span className="text-xs text-muted-foreground">4 дня назад</span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Магическая система продумана до мелочей.
              </p>
              <div className="flex items-center gap-4 text-xs">
                <button className="flex items-center gap-1 text-muted-foreground">
                  <ThumbsUp className="w-3 h-3" />
                  <span>6</span>
                </button>
                <button className="text-muted-foreground">Ответить</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookAbout;
