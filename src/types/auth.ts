
/**
 * Authentication related types
 */

/**
 * User type definition
 */
export interface User {
  id: string;
  username: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  coverImageUrl?: string; // New field for profile cover image
  bio?: string; // New field for bio information
  displayId: string; // 6-digit ID
  subscriptions?: string[]; // IDs of users this user is subscribed to
  subscribers?: string[]; // IDs of users subscribed to this user
  blockedUsers?: string[]; // IDs of users this user has blocked
  publishedBooks?: string[]; // IDs of books published by this user
  banStatus?: {
    /**
     * Defiance System (Система Неповиновения) - Ban levels
     * В будущем будет интегрирована система бана по уровням в полноценной версии приложения.
     * 
     * Level 1: Caution (Осторожность)
     * Level 2: 24-Hour Restriction (Ограничение на 24 часа)
     * Level 3: Week of Silence (Неделя молчания)
     * Level 4: 30-Day Isolation (30-дневная изоляция)
     * Level 5: Ultimate Ban (Окончательный бан - блокировка аккаунта до уровня устройства)
     * 
     * В будущем эта система будет интегрирована с API Kaspersky Threat Intelligence Portal
     * для обеспечения дополнительной безопасности и обнаружения вредоносной активности.
     */
    level: number; // 1-5
    expiresAt?: Date;
    reason?: string;
  };
  privacy: {
    hideSubscriptions: boolean;
    commentSettings: {
      global: boolean; // true = enabled, false = disabled
      perBook: Record<string, boolean>; // bookId: boolean (true = enabled, false = disabled)
    };
  };
}

export interface ProfileUpdateData {
  username?: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  coverImageUrl?: string; // New field for profile cover image
  bio?: string; // New field for bio information
  privacy?: {
    hideSubscriptions?: boolean;
    commentSettings?: {
      global?: boolean;
      perBook?: Record<string, boolean>;
    };
  };
}

export interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: ProfileUpdateData) => Promise<boolean>;
  isAuthenticated: boolean;
  subscribeToUser: (userId: string) => Promise<boolean>;
  unsubscribeFromUser: (userId: string) => Promise<boolean>;
  blockUser: (userId: string) => Promise<boolean>;
  unblockUser: (userId: string) => Promise<boolean>;
  setBookCommentSetting: (bookId: string, enabled: boolean) => Promise<boolean>;
  toggleGlobalComments: (enabled: boolean) => Promise<boolean>;
  toggleHideSubscriptions: (hide: boolean) => Promise<boolean>;
  canViewSubscriptions: (userId: string) => boolean;
  canCommentOnBook: (bookId: string, authorId: string) => boolean;
  getUserById: (userId: string) => User | null;
}

/**
 * Book related types
 */
export type BookStatus = "published" | "draft" | "in-progress";

export type BookGenre = 
  "fiction" | "non-fiction" | "fantasy" | "sci-fi" | "romance" | 
  "thriller" | "mystery" | "horror" | "biography" | "history" | 
  "poetry" | "children" | "young-adult" | "educational" | "other";

export interface BookTag {
  id: string;
  name: string;
}
