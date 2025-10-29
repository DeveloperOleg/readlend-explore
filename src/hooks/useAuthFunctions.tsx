import { User, ProfileUpdateData } from '@/types/auth';
import { canViewSubscriptions as checkViewSubscriptions, canCommentOnBook as checkCommentOnBook } from '@/utils/authUtils';
import { validateBio, validateUsername } from '@/utils/validationUtils';
import { supabase } from '@/integrations/supabase/client';

export const useAuthFunctions = (user: User | null, setUser: React.Dispatch<React.SetStateAction<User | null>>) => {

  const updateProfile = async (data: ProfileUpdateData): Promise<boolean> => {
    if (!user) return false;

    try {
      // Validate inputs
      if (data.username) {
        const usernameValidation = validateUsername(data.username);
        if (!usernameValidation.isValid) {
          throw new Error(usernameValidation.message);
        }
      }

      if (data.bio) {
        const bioValidation = validateBio(data.bio);
        if (!bioValidation.isValid) {
          throw new Error(bioValidation.message);
        }
      }

      // Update profile in database
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          username: data.username,
          first_name: data.firstName,
          last_name: data.lastName,
          avatar_url: data.avatarUrl,
          cover_image_url: data.coverImageUrl,
          bio: data.bio
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Update privacy settings if provided
      if (data.privacy) {
        const { error: privacyError } = await supabase
          .from('privacy_settings')
          .update({
            hide_subscriptions: data.privacy.hideSubscriptions,
            prevent_copying: data.privacy.preventCopying,
            global_comments_enabled: data.privacy.commentSettings?.global
          })
          .eq('user_id', user.id);

        if (privacyError) throw privacyError;
      }

      // Update local state
      const updatedUser: User = {
        ...user,
        ...data,
        privacy: data.privacy ? {
          hideSubscriptions: data.privacy.hideSubscriptions ?? user.privacy.hideSubscriptions,
          preventCopying: data.privacy.preventCopying ?? user.privacy.preventCopying,
          commentSettings: {
            global: data.privacy.commentSettings?.global ?? user.privacy.commentSettings.global,
            perBook: { ...user.privacy.commentSettings.perBook, ...(data.privacy.commentSettings?.perBook || {}) }
          }
        } : user.privacy
      };

      setUser(updatedUser);
      return true;
    } catch (error) {
      console.error('Profile update error:', error);
      return false;
    }
  };

  const subscribeToUser = async (userId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('subscriptions')
        .insert({
          follower_id: user.id,
          following_id: userId
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Subscribe error:', error);
      return false;
    }
  };
  
  const unsubscribeFromUser = async (userId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('subscriptions')
        .delete()
        .eq('follower_id', user.id)
        .eq('following_id', userId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Unsubscribe error:', error);
      return false;
    }
  };
  
  const blockUser = async (userId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      // First, unsubscribe from the user
      await unsubscribeFromUser(userId);

      // Block the user
      const { error } = await supabase
        .from('blocked_users')
        .insert({
          blocker_id: user.id,
          blocked_id: userId
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Block user error:', error);
      return false;
    }
  };
  
  const unblockUser = async (userId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('blocked_users')
        .delete()
        .eq('blocker_id', user.id)
        .eq('blocked_id', userId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Unblock user error:', error);
      return false;
    }
  };

  const toggleHideSubscriptions = async (hide: boolean): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('privacy_settings')
        .update({ hide_subscriptions: hide })
        .eq('user_id', user.id);

      if (error) throw error;

      const updatedUser = {
        ...user,
        privacy: {
          ...user.privacy,
          hideSubscriptions: hide
        }
      };
      setUser(updatedUser);

      return true;
    } catch (error) {
      console.error('Toggle hide subscriptions error:', error);
      return false;
    }
  };

  const toggleGlobalComments = async (enabled: boolean): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('privacy_settings')
        .update({ global_comments_enabled: enabled })
        .eq('user_id', user.id);

      if (error) throw error;

      const updatedUser = {
        ...user,
        privacy: {
          ...user.privacy,
          commentSettings: {
            ...user.privacy.commentSettings,
            global: enabled
          }
        }
      };
      setUser(updatedUser);

      return true;
    } catch (error) {
      console.error('Toggle global comments error:', error);
      return false;
    }
  };

  const togglePreventCopying = async (prevent: boolean): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('privacy_settings')
        .update({ prevent_copying: prevent })
        .eq('user_id', user.id);

      if (error) throw error;

      const updatedUser = {
        ...user,
        privacy: {
          ...user.privacy,
          preventCopying: prevent
        }
      };
      setUser(updatedUser);

      return true;
    } catch (error) {
      console.error('Toggle prevent copying error:', error);
      return false;
    }
  };

  const setBookCommentSetting = async (bookId: string, enabled: boolean): Promise<boolean> => {
    if (!user) return false;

    const updatedUser = {
      ...user,
      privacy: {
        ...user.privacy,
        commentSettings: {
          ...user.privacy.commentSettings,
          perBook: {
            ...user.privacy.commentSettings.perBook,
            [bookId]: enabled
          }
        }
      }
    };

    setUser(updatedUser);
    return true;
  };

  const getUserById = async (userId: string): Promise<User | null> => {
    // First check if it's the current user
    if (user && user.id === userId) {
      return user;
    }

    // Fetch from database
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      const { data: privacySettings } = await supabase
        .from('privacy_settings')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (profile) {
        return {
          id: profile.id,
          username: profile.username,
          firstName: profile.first_name || undefined,
          lastName: profile.last_name || undefined,
          avatarUrl: profile.avatar_url || undefined,
          coverImageUrl: profile.cover_image_url || undefined,
          bio: profile.bio || undefined,
          displayId: profile.display_id,
          privacy: {
            hideSubscriptions: privacySettings?.hide_subscriptions || false,
            preventCopying: privacySettings?.prevent_copying || false,
            commentSettings: {
              global: privacySettings?.global_comments_enabled ?? true,
              perBook: {}
            }
          }
        };
      }
    } catch (error) {
      console.error('Error fetching user:', error);
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
    canViewSubscriptions: (userId: string) => checkViewSubscriptions(user, userId),
    canCommentOnBook: (bookId: string, authorId: string) => checkCommentOnBook(user, bookId, authorId)
  };
};

export default useAuthFunctions;
