
import { User } from '@/types/auth';

// Test authors for demo account
export const testAuthors = [
  { 
    id: 'author1', 
    username: 'bestseller', 
    displayName: 'Игорь Бестселлер', 
    firstName: 'Игорь', 
    lastName: 'Бестселлер',
    displayId: '456789',
    subscriptions: [],
    subscribers: [],
    blockedUsers: [],
    publishedBooks: ['book4'],
    avatarUrl: null,
    privacy: {
      hideSubscriptions: false,
      commentSettings: {
        global: true,
        perBook: {}
      }
    }
  },
  { 
    id: 'author2', 
    username: 'fantasywriter', 
    displayName: 'Анна Фэнтези', 
    firstName: 'Анна', 
    lastName: 'Фэнтези',
    displayId: '234567',
    subscriptions: [],
    subscribers: [],
    blockedUsers: [],
    publishedBooks: ['book3'],
    avatarUrl: null,
    privacy: {
      hideSubscriptions: false,
      commentSettings: {
        global: true,
        perBook: {}
      }
    }
  },
  { 
    id: 'author3', 
    username: 'scifi', 
    displayName: 'Сергей Фантастика', 
    firstName: 'Сергей', 
    lastName: 'Фантастика',
    displayId: '345678',
    subscriptions: [],
    subscribers: [],
    blockedUsers: [],
    publishedBooks: ['book1'],
    avatarUrl: null,
    privacy: {
      hideSubscriptions: false,
      commentSettings: {
        global: true,
        perBook: {}
      }
    }
  },
  { 
    id: 'author4', 
    username: 'detective', 
    displayName: 'Мария Детектив', 
    firstName: 'Мария', 
    lastName: 'Детектив',
    displayId: '567890',
    subscriptions: [],
    subscribers: [],
    blockedUsers: [],
    publishedBooks: ['book2'],
    avatarUrl: null,
    privacy: {
      hideSubscriptions: false,
      commentSettings: {
        global: true,
        perBook: {}
      }
    }
  },
];

// Test books for demo account
export const testBooks = [
  { id: 'book1', title: 'Путешествие во времени', author: 'Сергей Фантастика', authorId: 'author3', coverUrl: null },
  { id: 'book2', title: 'Тайна старого дома', author: 'Мария Детектив', authorId: 'author4', coverUrl: null },
  { id: 'book3', title: 'Королевство драконов', author: 'Анна Фэнтези', authorId: 'author2', coverUrl: null },
  { id: 'book4', title: 'Психология успеха', author: 'Игорь Бестселлер', authorId: 'author1', coverUrl: null },
];

export const getTestUserById = (userId: string): User | null => {
  const user = testAuthors.find(author => author.id === userId);
  if (user) {
    return user as User;
  }
  return null;
};

export const searchTestAuthors = (query: string) => {
  if (!query.trim()) return [];
  
  return testAuthors.filter(author => 
    author.username.toLowerCase().includes(query.toLowerCase()) || 
    author.displayName.toLowerCase().includes(query.toLowerCase()) ||
    (author.firstName && author.firstName.toLowerCase().includes(query.toLowerCase())) ||
    (author.lastName && author.lastName.toLowerCase().includes(query.toLowerCase()))
  );
};

export const searchTestBooks = (query: string) => {
  if (!query.trim()) return [];
  
  return testBooks.filter(book => 
    book.title.toLowerCase().includes(query.toLowerCase()) || 
    book.author.toLowerCase().includes(query.toLowerCase())
  );
};
