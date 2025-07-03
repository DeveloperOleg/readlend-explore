
import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { 
  ThumbsUp, 
  ThumbsDown, 
  Heart, 
  Flame, 
  Bell, 
  BellOff, 
  UserPlus, 
  UserX
} from 'lucide-react';

type ReactionType = 'like' | 'dislike' | 'heart' | 'fire';

interface ReactionCount {
  type: ReactionType;
  count: number;
}

interface ComicReactionsProps {
  comicId: string;
  authorId: string;
  authorName: string;
}

const ComicReactions: React.FC<ComicReactionsProps> = ({ comicId, authorId, authorName }) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Initial reaction counts
  const [reactions, setReactions] = useState<ReactionCount[]>([
    { type: 'like', count: 67 },
    { type: 'dislike', count: 3 },
    { type: 'heart', count: 29 },
    { type: 'fire', count: 14 },
  ]);
  
  // User's current reaction
  const [userReaction, setUserReaction] = useState<ReactionType | null>(null);
  
  // Subscription state
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isAuthorSubscribed, setIsAuthorSubscribed] = useState(false);
  
  // Blocked state
  const [isBlocked, setIsBlocked] = useState(false);
  
  const handleReaction = (type: ReactionType) => {
    if (!user) {
      toast({
        title: t('reactions.loginRequired'),
        description: t('reactions.loginRequiredMessage'),
        variant: 'destructive',
      });
      return;
    }
    
    // If user clicks the same reaction, remove it
    if (userReaction === type) {
      setUserReaction(null);
      
      // Update counts
      setReactions(reactions.map(r => 
        r.type === type ? { ...r, count: Math.max(0, r.count - 1) } : r
      ));
      
      return;
    }
    
    // If user had a previous reaction, decrement it
    if (userReaction) {
      setReactions(reactions.map(r => 
        r.type === userReaction ? { ...r, count: Math.max(0, r.count - 1) } : r
      ));
    }
    
    // Set new reaction
    setUserReaction(type);
    
    // Update counts
    setReactions(reactions.map(r => 
      r.type === type ? { ...r, count: r.count + 1 } : r
    ));
    
    // Show toast
    toast({
      title: t('reactions.added'),
      description: t('reactions.addedMessage'),
    });
  };
  
  const handleSubscribe = () => {
    if (!user) return;
    
    setIsSubscribed(!isSubscribed);
    
    // Simulate author subscribing back (50% chance)
    if (!isSubscribed && !isAuthorSubscribed && Math.random() > 0.5) {
      setIsAuthorSubscribed(true);
      
      toast({
        title: t('subscriptions.authorSubscribed'),
        description: t('subscriptions.authorSubscribedMessage'),
      });
    } else {
      toast({
        title: isSubscribed 
          ? t('subscriptions.unsubscribed')
          : t('subscriptions.subscribed'),
        description: isSubscribed
          ? t('subscriptions.unsubscribedMessage')
          : t('subscriptions.subscribedMessage'),
      });
    }
  };
  
  const handleBlock = () => {
    if (!user) return;
    
    setIsBlocked(!isBlocked);
    
    // If we block, also unsubscribe
    if (!isBlocked && isSubscribed) {
      setIsSubscribed(false);
    }
    
    toast({
      title: isBlocked
        ? t('blocked.unblocked')
        : t('blocked.blocked'),
      description: isBlocked
        ? t('blocked.unblockedMessage')
        : t('blocked.blockedMessage'),
    });
  };
  
  const getReactionIcon = (type: ReactionType) => {
    switch (type) {
      case 'like': return <ThumbsUp className="w-4 h-4" />;
      case 'dislike': return <ThumbsDown className="w-4 h-4" />;
      case 'heart': return <Heart className="w-4 h-4" />;
      case 'fire': return <Flame className="w-4 h-4" />;
    }
  };
  
  const getReactionLabel = (type: ReactionType) => {
    switch (type) {
      case 'like': return t('reactions.like');
      case 'dislike': return t('reactions.dislike');
      case 'heart': return t('reactions.heart');
      case 'fire': return t('reactions.fire');
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Reactions */}
      <div className="flex flex-wrap gap-2">
        {reactions.map((reaction) => (
          <Button
            key={reaction.type}
            variant={userReaction === reaction.type ? "default" : "outline"}
            size="sm"
            onClick={() => handleReaction(reaction.type)}
            className="flex items-center gap-1"
          >
            {getReactionIcon(reaction.type)}
            <span>{getReactionLabel(reaction.type)}</span>
            <span className="ml-1 text-xs">{reaction.count}</span>
          </Button>
        ))}
      </div>
      
      {/* Author actions */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={isSubscribed ? "default" : "outline"}
          size="sm"
          onClick={handleSubscribe}
          disabled={isBlocked}
          className="flex items-center gap-1"
        >
          {isSubscribed ? (
            <>
              <BellOff className="w-4 h-4" />
              <span>{t('subscriptions.unsubscribe')}</span>
            </>
          ) : (
            <>
              <Bell className="w-4 h-4" />
              <span>{t('subscriptions.subscribe')}</span>
            </>
          )}
        </Button>
        
        <Button
          variant={isBlocked ? "destructive" : "outline"}
          size="sm"
          onClick={handleBlock}
          className="flex items-center gap-1"
        >
          {isBlocked ? (
            <>
              <UserPlus className="w-4 h-4" />
              <span>{t('blocked.unblock')}</span>
            </>
          ) : (
            <>
              <UserX className="w-4 h-4" />
              <span>{t('blocked.block')}</span>
            </>
          )}
        </Button>
      </div>
      
      {isAuthorSubscribed && (
        <div className="text-sm bg-primary/10 text-primary px-3 py-2 rounded-md">
          {t('subscriptions.mutualSubscriptionMessage')}
        </div>
      )}
      
      {isBlocked && (
        <div className="text-sm bg-destructive/10 text-destructive px-3 py-2 rounded-md">
          {t('blocked.activeMessage')}
        </div>
      )}
    </div>
  );
};

export default ComicReactions;
