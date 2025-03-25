
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/LanguageContext';

interface UserProfileLinkProps {
  username: string;
  userId: string;
  className?: string;
  children?: React.ReactNode;
}

const UserProfileLink: React.FC<UserProfileLinkProps> = ({ 
  username, 
  userId, 
  className, 
  children 
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleUserClick = (e: React.MouseEvent) => {
    // Navigate to the user's profile
    navigate(`/profile/${userId}`);
    e.stopPropagation(); // Prevent any parent clicks
  };

  const handleCopyUsername = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation
    navigator.clipboard.writeText(username);
    toast({
      title: t('profile.usernameCopied') || 'Имя пользователя скопировано',
      description: `@${username}`,
    });
  };

  return (
    <div className={`relative group ${className || ''}`}>
      {children ? (
        <div onClick={handleUserClick} className="cursor-pointer">
          {children}
        </div>
      ) : (
        <div className="flex items-center gap-1">
          <span 
            onClick={handleUserClick} 
            className="font-medium cursor-pointer hover:underline"
          >
            @{username}
          </span>
          <button
            onClick={handleCopyUsername}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label={t('profile.copyUsername') || 'Копировать имя пользователя'}
          >
            <Copy className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
        </div>
      )}
    </div>
  );
};

export default UserProfileLink;
