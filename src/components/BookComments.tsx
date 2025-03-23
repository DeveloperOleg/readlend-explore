
import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

interface Comment {
  id: string;
  userId: string;
  username: string;
  avatarUrl: string | null;
  content: string;
  createdAt: Date;
}

// Mock comments data
const initialComments: Comment[] = [
  {
    id: '1',
    userId: 'user1',
    username: 'reader123',
    avatarUrl: null,
    content: 'Отличная книга! Очень понравилась история главного героя.',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
  },
  {
    id: '2',
    userId: 'user2',
    username: 'bookworm',
    avatarUrl: null,
    content: 'Интересный сюжет, но концовка могла быть лучше.',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
  },
];

interface BookCommentsProps {
  bookId: string;
}

const BookComments: React.FC<BookCommentsProps> = ({ bookId }) => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitComment = () => {
    if (!user || !newComment.trim()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const comment: Comment = {
        id: Date.now().toString(),
        userId: user.id,
        username: user.username,
        avatarUrl: user.avatarUrl || null,
        content: newComment.trim(),
        createdAt: new Date(),
      };
      
      setComments([comment, ...comments]);
      setNewComment('');
      setIsSubmitting(false);
      
      toast({
        title: t('comments.added') || 'Комментарий добавлен',
        description: t('comments.addedMessage') || 'Ваш комментарий был успешно добавлен',
      });
    }, 500);
  };

  const formatTime = (date: Date) => {
    return formatDistanceToNow(date, { 
      addSuffix: true,
      locale: language === 'ru' ? ru : undefined 
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">
        {t('comments.title') || 'Комментарии'} ({comments.length})
      </h3>
      
      {user && (
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatarUrl || ''} alt={user.username} />
              <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                placeholder={t('comments.placeholder') || 'Напишите комментарий...'}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-24"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button 
              onClick={handleSubmitComment} 
              disabled={!newComment.trim() || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  {t('comments.sending') || 'Отправка...'}
                </>
              ) : (
                t('comments.submit') || 'Отправить'
              )}
            </Button>
          </div>
        </div>
      )}
      
      <Separator />
      
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            {t('comments.noComments') || 'Нет комментариев. Будьте первым, кто оставит комментарий!'}
          </p>
        ) : (
          comments.map((comment) => (
            <Card key={comment.id}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.avatarUrl || ''} alt={comment.username} />
                    <AvatarFallback>{comment.username.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <p className="font-medium">{comment.username}</p>
                      <p className="text-xs text-muted-foreground">{formatTime(comment.createdAt)}</p>
                    </div>
                    <p className="text-sm">{comment.content}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default BookComments;
