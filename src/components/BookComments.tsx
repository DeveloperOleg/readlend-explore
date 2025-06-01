import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { MessageSquareOff, ThumbsUp, ThumbsDown, Heart, Edit, Trash2, Flag, MoreHorizontal } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Toggle } from '@/components/ui/toggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface Comment {
  id: string;
  userId: string;
  username: string;
  avatarUrl: string | null;
  content: string;
  createdAt: Date;
  likes: number;
  dislikes: number;
  hearts: number;
  userReaction?: 'like' | 'dislike' | 'heart' | null;
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
    likes: 5,
    dislikes: 1,
    hearts: 0,
  },
  {
    id: '2',
    userId: 'user2',
    username: 'bookworm',
    avatarUrl: null,
    content: 'Интересный сюжет, но концовка могла быть лучше.',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    likes: 2,
    dislikes: 0,
    hearts: 1,
  },
];

interface BookCommentsProps {
  bookId: string;
  authorId: string;
}

const BookComments: React.FC<BookCommentsProps> = ({ bookId, authorId }) => {
  const { t, language } = useLanguage();
  const { user, canCommentOnBook } = useAuth();
  const { toast } = useToast();
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commentsEnabled, setCommentsEnabled] = useState(true);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const isBookAuthor = user?.id === authorId;

  useEffect(() => {
    // Check if comments are enabled for this book
    if (user) {
      const enabled = canCommentOnBook(bookId, authorId);
      setCommentsEnabled(enabled);
    }
  }, [bookId, authorId, user, canCommentOnBook]);

  const handleSubmitComment = () => {
    if (!user || !newComment.trim() || !commentsEnabled) return;
    
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
        likes: 0,
        dislikes: 0,
        hearts: 0,
      };
      
      setComments([comment, ...comments]);
      setNewComment('');
      setIsSubmitting(false);
      
      toast({
        title: t('comments.added'),
        description: t('comments.addedMessage'),
      });
    }, 500);
  };

  const handleReaction = (commentId: string, reactionType: 'like' | 'dislike' | 'heart') => {
    if (!user) return;
    
    setComments(currentComments => 
      currentComments.map(comment => {
        if (comment.id === commentId) {
          // If already reacted the same way, remove reaction
          if (comment.userReaction === reactionType) {
            const updatedComment = { 
              ...comment, 
              userReaction: null 
            };
            
            if (reactionType === 'like') updatedComment.likes = Math.max(0, comment.likes - 1);
            if (reactionType === 'dislike') updatedComment.dislikes = Math.max(0, comment.dislikes - 1);
            if (reactionType === 'heart') updatedComment.hearts = Math.max(0, comment.hearts - 1);
            
            return updatedComment;
          }
          
          // If changing reaction, update accordingly
          const updatedComment = { 
            ...comment, 
            userReaction: reactionType 
          };
          
          // Remove previous reaction count
          if (comment.userReaction === 'like') updatedComment.likes = Math.max(0, comment.likes - 1);
          if (comment.userReaction === 'dislike') updatedComment.dislikes = Math.max(0, comment.dislikes - 1);
          if (comment.userReaction === 'heart') updatedComment.hearts = Math.max(0, comment.hearts - 1);
          
          // Add new reaction count
          if (reactionType === 'like') updatedComment.likes += 1;
          if (reactionType === 'dislike') updatedComment.dislikes += 1;
          if (reactionType === 'heart') updatedComment.hearts += 1;
          
          return updatedComment;
        }
        return comment;
      })
    );
    
    // Could add toast notification if needed
  };

  const handleEditComment = (commentId: string) => {
    const comment = comments.find(c => c.id === commentId);
    if (comment) {
      setEditingCommentId(commentId);
      setEditingContent(comment.content);
    }
  };

  const handleSaveEdit = () => {
    if (!editingContent.trim()) return;
    
    setComments(currentComments =>
      currentComments.map(comment =>
        comment.id === editingCommentId
          ? { ...comment, content: editingContent.trim() }
          : comment
      )
    );
    
    setEditingCommentId(null);
    setEditingContent('');
    
    toast({
      title: t('comments.edited'),
      description: t('comments.editedMessage'),
    });
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditingContent('');
  };

  const handleDeleteComment = (commentId: string) => {
    setComments(currentComments =>
      currentComments.filter(comment => comment.id !== commentId)
    );
    
    toast({
      title: t('comments.deleted'),
      description: t('comments.deletedMessage'),
    });
  };

  const handleReportComment = (commentId: string) => {
    // Simulate reporting
    toast({
      title: t('comments.reported'),
      description: t('comments.reportedMessage'),
    });
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
        {t('comments.title')} ({comments.length})
      </h3>
      
      {user && commentsEnabled ? (
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatarUrl || ''} alt={user.username} />
              <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                placeholder={t('comments.placeholder')}
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
                  {t('comments.sending')}
                </>
              ) : (
                t('comments.submit')
              )}
            </Button>
          </div>
        </div>
      ) : !commentsEnabled && (
        <div className="bg-muted p-4 rounded-md flex items-center gap-3">
          <MessageSquareOff className="h-5 w-5 text-muted-foreground" />
          <p className="text-muted-foreground">
            {t('comments.disabled')}
          </p>
        </div>
      )}
      
      <Separator />
      
      {!commentsEnabled ? (
        <div className="text-center py-8">
          <MessageSquareOff className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-muted-foreground">
            {t('comments.disabledMessage')}
          </p>
        </div>
      ) : comments.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">
          {t('comments.noComments')}
        </p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
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
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-muted-foreground">{formatTime(comment.createdAt)}</p>
                        
                        {/* Comment options menu */}
                        {user && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {/* Edit and delete for own comments */}
                              {user.id === comment.userId && (
                                <>
                                  <DropdownMenuItem onClick={() => handleEditComment(comment.id)}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    {t('comments.edit')}
                                  </DropdownMenuItem>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        {t('comments.delete')}
                                      </DropdownMenuItem>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>{t('comments.deleteConfirm')}</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          {t('comments.deleteConfirmMessage')}
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDeleteComment(comment.id)}>
                                          {t('comments.delete')}
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </>
                              )}
                              
                              {/* Report for other users' comments */}
                              {user.id !== comment.userId && (
                                <DropdownMenuItem onClick={() => handleReportComment(comment.id)}>
                                  <Flag className="h-4 w-4 mr-2" />
                                  {t('comments.report')}
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    </div>
                    
                    {/* Comment content or edit form */}
                    {editingCommentId === comment.id ? (
                      <div className="space-y-3">
                        <Textarea
                          value={editingContent}
                          onChange={(e) => setEditingContent(e.target.value)}
                          className="min-h-20"
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={handleSaveEdit}>
                            {t('comments.save')}
                          </Button>
                          <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                            {t('common.cancel')}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm mb-3">{comment.content}</p>
                    )}
                    
                    {/* Comment reactions - only show when not editing */}
                    {user && editingCommentId !== comment.id && (
                      <div className="flex items-center gap-2 mt-2">
                        {/* Like button */}
                        <div className="flex items-center">
                          <Toggle
                            size="sm"
                            pressed={comment.userReaction === 'like'}
                            onPressedChange={() => handleReaction(comment.id, 'like')}
                            aria-label={t('comments.like')}
                          >
                            <ThumbsUp className={`h-4 w-4 ${comment.userReaction === 'like' ? 'text-blue-500' : ''}`} />
                          </Toggle>
                          {comment.likes > 0 && (
                            <span className="text-xs text-muted-foreground ml-1">{comment.likes}</span>
                          )}
                        </div>
                        
                        {/* Dislike button */}
                        <div className="flex items-center">
                          <Toggle
                            size="sm"
                            pressed={comment.userReaction === 'dislike'}
                            onPressedChange={() => handleReaction(comment.id, 'dislike')}
                            aria-label={t('comments.dislike')}
                          >
                            <ThumbsDown className={`h-4 w-4 ${comment.userReaction === 'dislike' ? 'text-red-500' : ''}`} />
                          </Toggle>
                          {comment.dislikes > 0 && (
                            <span className="text-xs text-muted-foreground ml-1">{comment.dislikes}</span>
                          )}
                        </div>
                        
                        {/* Heart button (only for book author) */}
                        {isBookAuthor && (
                          <div className="flex items-center">
                            <Toggle
                              size="sm"
                              pressed={comment.userReaction === 'heart'}
                              onPressedChange={() => handleReaction(comment.id, 'heart')}
                              aria-label={t('comments.heart')}
                            >
                              <Heart className={`h-4 w-4 ${comment.userReaction === 'heart' ? 'text-rose-500' : ''}`} />
                            </Toggle>
                            {comment.hearts > 0 && (
                              <span className="text-xs text-muted-foreground ml-1">{comment.hearts}</span>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookComments;
