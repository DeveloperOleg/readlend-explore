import { useState } from 'react';
import { User, ProfileUpdateData } from '@/types/auth';
import { canViewSubscriptions, canCommentOnBook } from '@/utils/authUtils';
import { getTestUserById, searchTestAuthors, searchTestBooks } from '@/utils/testData';

export const useAuthFunctions = (user: User | null, setUser: React.Dispatch<React.SetStateAction<User | null>>) => {

  const updateProfile = async (data: ProfileUpdateData): Promise<boolean> => {
    if (!user) return false;

    try {
      // In a real app, you would make an API call here
      // For demo, we'll just update the local state
      const updatedUser = {
        ...user,
        ...(data.username && { username: data.username }),
        ...(data.firstName !== undefined && { firstName: data.firstName }),
        ...(data.lastName !== undefined && { lastName: data.lastName }),
        ...(data.avatarUrl !== undefined && { avatarUrl: data.avatarUrl }),
        ...(data.coverImageUrl !== undefined && { coverImageUrl: data.coverImageUrl }), // Update cover image
        ...(data.bio !== undefined && { bio: data.bio }), // Make sure bio is updated
        privacy: {
          ...user.privacy,
          ...(data.privacy?.hideSubscriptions !== undefined && {
            hideSubscriptions: data.privacy.hideSubscriptions
          }),
          ...(data.privacy?.preventCopying !== undefined && {
            preventCopying: data.privacy.preventCopying
          }),
          commentSettings: {
            ...user.privacy.commentSettings,
            ...(data.privacy?.commentSettings?.global !== undefined && {
              global: data.privacy.commentSettings.global
            }),
            ...(data.privacy?.commentSettings?.perBook && {
              perBook: {
                ...user.privacy.commentSettings.perBook,
                ...data.privacy.commentSettings.perBook
              }
            })
          }
        }
      };
      
      setUser(updatedUser);
      
      // Если это не тестовый аккаунт, обновляем данные пользователя в хранилище аккаунтов
      if (!user.isTestAccount) {
        const storedAccounts = localStorage.getItem('readnest-accounts') || '{}';
        const accounts = JSON.parse(storedAccounts);
        
        if (accounts[user.username]) {
          accounts[user.username].userData = updatedUser;
          localStorage.setItem('readnest-accounts', JSON.stringify(accounts));
        }
      }
      
      localStorage.setItem('readnest-user', JSON.stringify(updatedUser));
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      return false;
    }
  };

  const subscribeToUser = async (userId: string): Promise<boolean> => {
    if (!user) return false;
    
    try {
      // Check if already subscribed
      if (user.subscriptions?.includes(userId)) {
        return true;
      }
      
      // In a real app, you would make an API call here
      const updatedUser = {
        ...user,
        subscriptions: [...(user.subscriptions || []), userId]
      };
      
      setUser(updatedUser);
      
      // Если это не тестовый аккаунт, обновляем данные пользователя в хранилище аккаунтов
      if (!user.isTestAccount) {
        const storedAccounts = localStorage.getItem('readnest-accounts') || '{}';
        const accounts = JSON.parse(storedAccounts);
        
        if (accounts[user.username]) {
          accounts[user.username].userData = updatedUser;
          localStorage.setItem('readnest-accounts', JSON.stringify(accounts));
        }
      }
      
      localStorage.setItem('readnest-user', JSON.stringify(updatedUser));
      return true;
    } catch (error) {
      console.error('Error subscribing to user:', error);
      return false;
    }
  };
  
  const unsubscribeFromUser = async (userId: string): Promise<boolean> => {
    if (!user || !user.subscriptions) return false;
    
    try {
      const updatedUser = {
        ...user,
        subscriptions: user.subscriptions.filter(id => id !== userId)
      };
      
      setUser(updatedUser);
      
      // Если это не тестовый аккаунт, обновляем данные пользователя в хранилище аккаунтов
      if (!user.isTestAccount) {
        const storedAccounts = localStorage.getItem('readnest-accounts') || '{}';
        const accounts = JSON.parse(storedAccounts);
        
        if (accounts[user.username]) {
          accounts[user.username].userData = updatedUser;
          localStorage.setItem('readnest-accounts', JSON.stringify(accounts));
        }
      }
      
      localStorage.setItem('readnest-user', JSON.stringify(updatedUser));
      return true;
    } catch (error) {
      console.error('Error unsubscribing from user:', error);
      return false;
    }
  };
  
  const blockUser = async (userId: string): Promise<boolean> => {
    if (!user) return false;
    
    try {
      // Check if already blocked
      if (user.blockedUsers?.includes(userId)) {
        return true;
      }
      
      // If we block someone, we should unsubscribe from them
      let updatedSubscriptions = user.subscriptions || [];
      if (updatedSubscriptions.includes(userId)) {
        updatedSubscriptions = updatedSubscriptions.filter(id => id !== userId);
      }
      
      const updatedUser = {
        ...user,
        subscriptions: updatedSubscriptions,
        blockedUsers: [...(user.blockedUsers || []), userId]
      };
      
      setUser(updatedUser);
      
      // Если это не тестовый аккаунт, обновляем данные пользователя в хранилище аккаунтов
      if (!user.isTestAccount) {
        const storedAccounts = localStorage.getItem('readnest-accounts') || '{}';
        const accounts = JSON.parse(storedAccounts);
        
        if (accounts[user.username]) {
          accounts[user.username].userData = updatedUser;
          localStorage.setItem('readnest-accounts', JSON.stringify(accounts));
        }
      }
      
      localStorage.setItem('readnest-user', JSON.stringify(updatedUser));
      return true;
    } catch (error) {
      console.error('Error blocking user:', error);
      return false;
    }
  };
  
  const unblockUser = async (userId: string): Promise<boolean> => {
    if (!user || !user.blockedUsers) return false;
    
    try {
      const updatedUser = {
        ...user,
        blockedUsers: user.blockedUsers.filter(id => id !== userId)
      };
      
      setUser(updatedUser);
      
      // Если это не тестовый аккаунт, обновляем данные пользователя в хранилище аккаунтов
      if (!user.isTestAccount) {
        const storedAccounts = localStorage.getItem('readnest-accounts') || '{}';
        const accounts = JSON.parse(storedAccounts);
        
        if (accounts[user.username]) {
          accounts[user.username].userData = updatedUser;
          localStorage.setItem('readnest-accounts', JSON.stringify(accounts));
        }
      }
      
      localStorage.setItem('readnest-user', JSON.stringify(updatedUser));
      return true;
    } catch (error) {
      console.error('Error unblocking user:', error);
      return false;
    }
  };

  // Privacy and comment settings methods
  const toggleHideSubscriptions = async (hide: boolean): Promise<boolean> => {
    return updateProfile({
      privacy: {
        hideSubscriptions: hide
      }
    });
  };

  const toggleGlobalComments = async (enabled: boolean): Promise<boolean> => {
    return updateProfile({
      privacy: {
        commentSettings: {
          global: enabled
        }
      }
    });
  };

  const togglePreventCopying = async (prevent: boolean): Promise<boolean> => {
    return updateProfile({
      privacy: {
        preventCopying: prevent
      }
    });
  };

  const setBookCommentSetting = async (bookId: string, enabled: boolean): Promise<boolean> => {
    if (!user) return false;

    const perBook = {
      ...user.privacy.commentSettings.perBook,
      [bookId]: enabled
    };

    return updateProfile({
      privacy: {
        commentSettings: {
          perBook
        }
      }
    });
  };

  const getUserById = (userId: string): User | null => {
    // Если пользователь не авторизован, возвращаем null
    if (!user) return null;
    
    // Для тестового аккаунта или когда запрашиваем тестовый аккаунт
    if (user.isTestAccount || userId.startsWith('author')) {
      const testUser = getTestUserById(userId);
      // Ensure test users have complete privacy structure
      if (testUser) {
        return {
          ...testUser,
          privacy: {
            hideSubscriptions: testUser.privacy?.hideSubscriptions || false,
            preventCopying: false, // Default value for test users
            commentSettings: {
              global: testUser.privacy?.commentSettings?.global || true,
              perBook: testUser.privacy?.commentSettings?.perBook || {}
            }
          }
        };
      }
      return null;
    }
    
    // Для реальных аккаунтов
    const storedAccounts = localStorage.getItem('readnest-accounts') || '{}';
    const accounts = JSON.parse(storedAccounts);
    
    // Ищем по ID среди всех аккаунтов
    for (const username in accounts) {
      if (accounts[username].userData.id === userId) {
        const userData = accounts[username].userData;
        // Ensure preventCopying exists for backward compatibility
        if (!userData.privacy.hasOwnProperty('preventCopying')) {
          userData.privacy.preventCopying = false;
        }
        return userData;
      }
    }
    
    return null;
  };

  return {
    updateProfile,
    subscribeToUser,
    unsubscribeFromUser,
    blockUser,
    unblockUser,
    toggleHideSubscriptions,
    toggleGlobalComments,
    togglePreventCopying,
    setBookCommentSetting,
    getUserById,
    canViewSubscriptions: (userId: string) => canViewSubscriptions(user, userId),
    canCommentOnBook: (bookId: string, authorId: string) => canCommentOnBook(user, bookId, authorId)
  };
};

export default useAuthFunctions;
