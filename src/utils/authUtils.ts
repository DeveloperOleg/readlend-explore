
import { User } from "../types/auth";

/**
 * Generate random 6-digit ID
 */
export const generateDisplayId = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Check if a user can view another user's subscriptions
 */
export const canViewSubscriptions = (currentUser: User | null, userId: string): boolean => {
  if (!currentUser) return false;
  
  // If it's the current user, they can see their own subscriptions
  if (currentUser.id === userId) return true;
  
  // Find the user in our mock data (in a real app this would be an API call)
  // For demo, we'll simulate that the user exists and check their privacy settings
  const targetUser = {
    id: userId,
    privacy: {
      hideSubscriptions: true // This would come from a database in a real app
    }
  };
  
  return !targetUser.privacy.hideSubscriptions;
};

/**
 * Check if a user can comment on a book
 */
export const canCommentOnBook = (currentUser: User | null, bookId: string, authorId: string): boolean => {
  if (!currentUser) return false;
  
  // For demo, we'll simulate getting the author's settings
  // In a real app, this would be an API call
  const author = authorId === currentUser.id ? currentUser : {
    id: authorId,
    privacy: {
      commentSettings: {
        global: true,
        perBook: {
          [bookId]: undefined // This would come from database
        }
      }
    }
  };
  
  // Check per-book setting first, then fall back to global setting
  const perBookSetting = author.privacy.commentSettings.perBook[bookId];
  return perBookSetting !== undefined ? perBookSetting : author.privacy.commentSettings.global;
};
