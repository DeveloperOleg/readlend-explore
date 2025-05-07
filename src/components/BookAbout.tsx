
import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Star } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface BookAboutProps {
  book: {
    id: string;
    title: string;
    author: string;
    coverUrl: string | null;
    description: string;
    content?: string;
    rating?: number;
    totalRatings?: number;
  };
}

const BookAbout: React.FC<BookAboutProps> = ({ book }) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [userRating, setUserRating] = useState<number | null>(null);
  
  // Default values if not provided in the book object
  const rating = book.rating || 0;
  const totalRatings = book.totalRatings || 0;
  
  const handleRating = (value: number) => {
    if (!user) {
      toast({
        title: t('auth.loginRequired') || 'Login Required',
        description: t('auth.loginToRate') || 'Please login to rate this book',
        variant: 'destructive',
      });
      return;
    }
    
    setUserRating(value);
    toast({
      title: t('book.rateBook'),
      description: `${t('book.yourRating')}: ${value}/5`,
    });
    
    // Here you would typically save the rating to a database
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-2">{t('book.aboutTitle')}</h3>
        <p className="text-sm text-muted-foreground">{book.description}</p>
      </div>
      
      <Separator />
      
      <div>
        <h3 className="text-lg font-medium mb-2">{t('book.rating')}</h3>
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            <span className="ml-1 font-medium">{rating.toFixed(1)}</span>
          </div>
          <span className="text-sm text-muted-foreground">
            ({totalRatings} {totalRatings === 1 ? 'rating' : 'ratings'})
          </span>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-2">{t('book.yourRating')}</h3>
        <div className="flex flex-col-reverse items-center gap-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              onClick={() => handleRating(value)}
              className={`flex items-center justify-center h-10 w-10 rounded-full transition-all ${
                userRating && userRating >= value 
                  ? 'bg-yellow-100 dark:bg-yellow-900' 
                  : 'hover:bg-muted'
              }`}
            >
              <Star 
                className={`h-6 w-6 ${
                  userRating && userRating >= value 
                    ? 'fill-yellow-400 text-yellow-400' 
                    : 'text-muted-foreground'
                }`}
              />
              <span className="sr-only">{value} stars</span>
            </button>
          ))}
        </div>
        <p className="text-center text-sm text-muted-foreground mt-2">
          {userRating ? `${t('book.yourRating')}: ${userRating}/5` : t('book.rateBook')}
        </p>
      </div>
    </div>
  );
};

export default BookAbout;
