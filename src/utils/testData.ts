import { BookGenre, BookStatus } from "@/types/auth";

export const testUsers = [
  {
    id: "user1",
    username: "tester111",
    email: "test@example.com",
    displayName: "Test User",
    bio: "Just a test user for demo purposes.",
    profilePicture: "/images/avatars/avatar-1.png",
    role: "user",
    isVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    blockedUsers: [],
  },
  {
    id: "user2",
    username: "anna_author",
    email: "anna@example.com",
    displayName: "Anna Petrova",
    bio: "Fantasy author and dreamer.",
    profilePicture: "/images/avatars/avatar-2.png",
    role: "author",
    isVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    blockedUsers: [],
  },
  {
    id: "user3",
    username: "sergey_writer",
    email: "sergey@example.com",
    displayName: "Sergey Volkov",
    bio: "Modern fiction writer.",
    profilePicture: "/images/avatars/avatar-3.png",
    role: "author",
    isVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    blockedUsers: [],
  },
  {
    id: "user4",
    username: "elena_poet",
    email: "elena@example.com",
    displayName: "Elena Smirnova",
    bio: "Passionate poet and dreamer.",
    profilePicture: "/images/avatars/avatar-4.png",
    role: "author",
    isVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    blockedUsers: [],
  },
  {
    id: "user5",
    username: "alex_tech",
    email: "alex@example.com",
    displayName: "Alex Morozov",
    bio: "Tech enthusiast and blogger.",
    profilePicture: "/images/avatars/avatar-5.png",
    role: "user",
    isVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    blockedUsers: [],
  },
];

export const testAuthors = [
  {
    id: "author1",
    username: "anna_author",
    firstName: "Anna",
    lastName: "Petrova",
    displayId: "123456",
    bio: "Fantasy author and dreamer.",
    avatarUrl: "/images/avatars/avatar-2.png",
    subscriptions: [],
    subscribers: [],
    blockedUsers: [],
    publishedBooks: [],
    isTestAccount: true,
    privacy: {
      hideSubscriptions: false,
      preventCopying: false,
      commentSettings: {
        global: true,
        perBook: {}
      }
    }
  },
  {
    id: "author2",
    username: "sergey_writer",
    firstName: "Sergey",
    lastName: "Volkov",
    displayId: "234567",
    bio: "Modern fiction writer.",
    avatarUrl: "/images/avatars/avatar-3.png",
    subscriptions: [],
    subscribers: [],
    blockedUsers: [],
    publishedBooks: [],
    isTestAccount: true,
    privacy: {
      hideSubscriptions: false,
      preventCopying: false,
      commentSettings: {
        global: true,
        perBook: {}
      }
    }
  },
  {
    id: "author3",
    username: "elena_poet",
    firstName: "Elena",
    lastName: "Smirnova",
    displayId: "345678",
    bio: "Passionate poet and dreamer.",
    avatarUrl: "/images/avatars/avatar-4.png",
    subscriptions: [],
    subscribers: [],
    blockedUsers: [],
    publishedBooks: [],
    isTestAccount: true,
    privacy: {
      hideSubscriptions: false,
      preventCopying: false,
      commentSettings: {
        global: true,
        perBook: {}
      }
    }
  },
];

export const getTestUserById = (userId: string) => {
  return testAuthors.find(author => author.id === userId) || null;
};

export const searchTestAuthors = (query: string) => {
  const lowerCaseQuery = query.toLowerCase();
  return testAuthors.filter(author =>
    (author.firstName && author.firstName.toLowerCase().includes(lowerCaseQuery)) ||
    (author.lastName && author.lastName.toLowerCase().includes(lowerCaseQuery)) ||
    author.username.toLowerCase().includes(lowerCaseQuery)
  );
};

export const testBooks = [
  {
    id: "book1",
    title: "Веер Императора",
    author: "Анна Петрова",
    coverUrl: "/lovable-uploads/01c01930-5bfb-48ae-869d-a4e4d30a45ea.png",
    description: "Захватывающая история о древнем артефакте и его влиянии на судьбы людей",
    rating: 9.2,
    totalRatings: 1847,
    genre: "fantasy" as BookGenre,
    status: "published" as BookStatus,
    tags: ["фэнтези", "приключения", "магия"],
    content: `# Веер Императора

## Глава 1: Загадочная находка

В глубинах древнего дворца, забытого временем, археолог Лина Чжан обнаружила артефакт, который изменит её жизнь навсегда. Веер Императора — легендарный предмет, о котором ходили лишь слухи.

Изящные складки веера переливались в тусклом свете фонаря, а на его поверхности виднелись древние символы, значение которых было утрачено веками назад. Лина осторожно взяла артефакт в руки, не подозревая, что этот момент станет началом невероятного путешествия.

## Глава 2: Пробуждение силы

Как только пальцы Лины коснулись веера, комната наполнилась мягким золотистым свечением. Символы на веере ожили, медленно вращаясь и формируя новые узоры. В воздухе послышался едва различимый шёпот — голоса давно ушедших императоров.

Веер обладал способностью показывать прошлое и будущее, открывая тайны, которые могли изменить ход истории. Но с великой силой приходит и великая ответственность...`
  },
  {
    id: "book2",
    title: "Время перемен",
    author: "Сергей Волков",
    coverUrl: "/lovable-uploads/c07f8bce-3d6d-44bb-bf4e-86bfc7c10a21.png",
    description: "История о том, как один человек может изменить мир, если у него есть цель",
    rating: 8.4,
    totalRatings: 1520,
    genre: "fiction" as BookGenre,
    status: "published" as BookStatus,
    tags: ["драма", "современность", "психология"],
    content: `# Время перемен

## Пролог

Мир стоял на пороге великих перемен. Александр Морозов, обычный программист из небольшого города, не подозревал, что его идея изменит жизни миллионов людей.

## Глава 1: Искра вдохновения

Всё началось с простого наблюдения. Александр заметил, как его пожилая соседка с трудом добирается до магазина каждый день. Этот момент стал катализатором для создания революционного приложения, которое соединило бы людей, нуждающихся в помощи, с теми, кто готов её оказать.

## Глава 2: Первые шаги

Работая по вечерам после основной работы, Александр создавал прототип своего приложения. Каждая строчка кода была написана с мыслью о том, как сделать мир немного лучше. Но путь к успеху оказался не таким простым, как казалось вначале...`
  },
  {
    id: "book3",
    title: "Звёздные врата",
    author: "Елена Смирнова",
    coverUrl: "/images/book-covers/cover-3.jpg",
    description: "Межгалактическое приключение, полное опасностей и открытий",
    rating: 7.8,
    totalRatings: 1256,
    genre: "sci-fi" as BookGenre,
    status: "published" as BookStatus,
    tags: ["космос", "пришельцы", "технологии"],
    content: `# Звёздные врата

## Глава 1: Зов космоса

Космический корабль «Аврора» бороздил просторы вселенной, направляясь к неизведанной планете. Экипаж, состоящий из лучших учёных и исследователей, готовился к встрече с новым миром.

## Глава 2: Открытие

Приземлившись на планете, команда обнаружила древние руины, свидетельствующие о существовании развитой цивилизации. В центре руин находились звёздные врата — портал, способный перемещать в другие галактики.

## Глава 3: Путешествие

Активировав врата, экипаж «Авроры» отправился в захватывающее путешествие, полное опасностей и открытий. На их пути встретились враждебные пришельцы, заброшенные станции и загадочные артефакты. Но ничто не могло остановить их стремление к знаниям и новым горизонтам...`
  },
  {
    id: "book4",
    title: "Тени прошлого",
    author: "Алексей Иванов",
    coverUrl: "/images/book-covers/cover-4.jpg",
    description: "Детективная история, полная загадок и неожиданных поворотов",
    rating: 8.9,
    totalRatings: 2145,
    genre: "mystery" as BookGenre,
    status: "published" as BookStatus,
    tags: ["детектив", "загадки", "расследования"],
    content: `# Тени прошлого

## Глава 1: Убийство

В тихом провинциальном городке происходит жестокое убийство. Жертвой становится известный бизнесмен, чья жизнь была полна тайн и секретов.

## Глава 2: Расследование

За расследование берётся опытный детектив, которому предстоит разгадать сложную головоломку и найти убийцу. По мере продвижения в деле, он сталкивается с множеством подозреваемых, каждый из которых имеет свой мотив.

## Глава 3: Разгадка

В ходе расследования детектив обнаруживает связь между убийством и событиями прошлого. Тени прошлого оживают, раскрывая тайны, которые долгое время были скрыты. В финале детектива ждёт неожиданная разгадка, которая перевернёт всё с ног на голову...`
  },
  {
    id: "book5",
    title: "Сердце леса",
    author: "Ольга Васильева",
    coverUrl: "/images/book-covers/cover-5.jpg",
    description: "Романтическая история о любви и природе",
    rating: 9.5,
    totalRatings: 2589,
    genre: "romance" as BookGenre,
    status: "published" as BookStatus,
    tags: ["любовь", "природа", "романтика"],
    content: `# Сердце леса

## Глава 1: Встреча

В глухом лесу, вдали от цивилизации, встречаются два одиноких сердца. Она — художница, ищущая вдохновение в природе. Он — лесник, живущий в гармонии с лесом.

## Глава 2: Любовь

Между ними возникает чувство, которое невозможно описать словами. Они проводят дни вместе, наслаждаясь красотой природы и обществом друг друга.

## Глава 3: Испытание

Но их счастье оказывается под угрозой. В лес приходят люди, которые хотят уничтожить его ради наживы. Героям предстоит бороться за свою любовь и за сохранение сердца леса...`
  }
];

export const searchTestBooks = (query: string) => {
  const lowerCaseQuery = query.toLowerCase();
  return testBooks.filter(book =>
    book.title.toLowerCase().includes(lowerCaseQuery) ||
    book.author.toLowerCase().includes(lowerCaseQuery)
  );
};
