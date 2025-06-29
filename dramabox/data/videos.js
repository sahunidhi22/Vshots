export const sampleVideos = [
  {
    id: '1',
    title: 'REEL REVENGE',
    subtitle: 'WHEN FANTASY BECOMES EVERYTHING',
    thumbnail: 'https://picsum.photos/400/600?random=1',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    category: 'top1',
    genre: 'Drama',
    isFavorite: false,
    isNew: true,
    isLocked: false,
    episodes: [
      { id: 1, title: 'Episode 1', duration: '25:30', isLocked: false, watchedTime: 0 },
      { id: 2, title: 'Episode 2', duration: '23:45', isLocked: false, watchedTime: 1250 },
      { id: 3, title: 'Episode 3', duration: '26:15', isLocked: true, watchedTime: 0 },
      { id: 4, title: 'Episode 4', duration: '24:20', isLocked: true, watchedTime: 0 },
    ],
    totalEpisodes: 12,
    language: 'English',
    subtitles: ['English', 'Hindi', 'Korean'],
    quality: ['HD', 'SD'],
    likes: 1200,
    dislikes: 45,
    views: 15000,
    description: 'A thrilling drama about revenge and fantasy that keeps you on the edge of your seat.',
    rating: 4.5,
    releaseDate: '2024-01-15',
    lastWatched: null,
    downloadable: true,
    watchPartyEnabled: true,
  },
  {
    id: '2',
    title: 'LOVER',
    subtitle: 'A romantic drama',
    thumbnail: 'https://picsum.photos/400/600?random=2',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    category: 'top2',
    genre: 'Romance',
    isFavorite: true,
    isNew: false,
    isLocked: false,
    episodes: [
      { id: 1, title: 'First Love', duration: '28:30', isLocked: false, watchedTime: 1710 },
      { id: 2, title: 'Heartbreak', duration: '25:45', isLocked: false, watchedTime: 0 },
      { id: 3, title: 'New Beginning', duration: '27:15', isLocked: true, watchedTime: 0 },
    ],
    totalEpisodes: 8,
    language: 'Korean',
    subtitles: ['English', 'Hindi', 'Korean'],
    quality: ['HD', 'SD'],
    likes: 2500,
    dislikes: 120,
    views: 35000,
    description: 'A beautiful love story that spans across different seasons of life.',
    rating: 4.8,
    releaseDate: '2024-02-20',
    lastWatched: '2024-06-28T10:30:00Z',
    downloadable: true,
    watchPartyEnabled: true,
  },
  {
    id: '3',
    title: 'Falling for You',
    subtitle: 'A heartwarming story',
    thumbnail: 'https://picsum.photos/400/600?random=3',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    category: 'top3',
    genre: 'Romance',
    isFavorite: false,
    isNew: true,
    isLocked: false,
    episodes: [
      { id: 1, title: 'Meet Cute', duration: '22:30', isLocked: false, watchedTime: 0 },
      { id: 2, title: 'First Date', duration: '24:45', isLocked: true, watchedTime: 0 },
    ],
    totalEpisodes: 6,
    language: 'English',
    subtitles: ['English', 'Spanish', 'French'],
    quality: ['HD', 'SD'],
    likes: 890,
    dislikes: 23,
    views: 12000,
    description: 'A heartwarming romantic comedy about unexpected love.',
    rating: 4.3,
    releaseDate: '2024-06-15',
    lastWatched: null,
    downloadable: false,
    watchPartyEnabled: true,
  },
  {
    id: '4',
    title: 'THE NOTEBOOK',
    subtitle: 'Classic romance',
    thumbnail: 'https://picsum.photos/400/600?random=4',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    category: 'popular',
    genre: 'Romance',
    isFavorite: true,
    isNew: false,
    isLocked: true,
    episodes: [
      { id: 1, title: 'Young Love', duration: '30:30', isLocked: false, watchedTime: 1830 },
      { id: 2, title: 'Separation', duration: '28:45', isLocked: true, watchedTime: 0 },
      { id: 3, title: 'Reunion', duration: '32:15', isLocked: true, watchedTime: 0 },
    ],
    totalEpisodes: 10,
    language: 'English',
    subtitles: ['English', 'Hindi', 'Spanish'],
    quality: ['HD', 'SD'],
    likes: 5600,
    dislikes: 89,
    views: 78000,
    description: 'A timeless love story that will make you believe in true love.',
    rating: 4.9,
    releaseDate: '2023-12-01',
    lastWatched: '2024-06-25T15:45:00Z',
    downloadable: true,
    watchPartyEnabled: false,
  },
  // Add more videos with similar structure...
];

export const categories = [
  { id: 'whatsNew', title: 'Whats New', active: true },
  { id: 'favourite', title: 'Favourite', active: false },
  { id: 'genre', title: 'Genre', active: false },
  { id: 'watchHistory', title: 'History', active: false },
  { id: 'myList', title: 'My List', active: false },
];

export const topCategories = [
  { id: 'top1', title: 'Top 1', image: 'https://picsum.photos/100/100?random=11' },
  { id: 'top2', title: 'Top 2', image: 'https://picsum.photos/100/100?random=12' },
  { id: 'top3', title: 'Top 3', image: 'https://picsum.photos/100/100?random=13' },
];

export const genres = [
  'All',
  'Drama',
  'Romance', 
  'Action',
  'Comedy',
  'Thriller',
  'Mystery',
  'Adventure',
  'K-Drama',
  'Historical',
  'Fantasy'
];

export const languages = [
  'All',
  'English',
  'Hindi',
  'Korean',
  'Spanish',
  'French',
  'Japanese',
  'Thai'
];

export const coinPacks = [
  { id: 1, coins: 100, price: 90, originalPrice: 99, discount: 9 },
  { id: 2, coins: 500, price: 450, originalPrice: 499, discount: 49 },
  { id: 3, coins: 1000, price: 900, originalPrice: 999, discount: 99 },
  { id: 4, coins: 3000, price: 2700, originalPrice: 2999, discount: 299 },
];

export const subscriptionPlans = {
  domestic: {
    weekly: { price: 30, duration: 'week', gst: 5.4 },
    monthly: { price: 60, duration: 'month', gst: 10.8 },
    annual: { price: 600, duration: 'year', gst: 108, comingSoon: true },
  },
  international: {
    weekly: { price: 3, currency: 'USD', duration: 'week' },
    annual: { price: 36, currency: 'USD', duration: 'year' },
  }
};

export const payPerViewOptions = [
  { id: 1, price: 0.90, episodes: 1, description: 'Per Episode' },
  { id: 2, price: 7.50, episodes: 10, description: '10 Episodes Pack' },
];

export const rewards = {
  dailyCheckIn: [
    { day: 1, coins: 10, bonus: false },
    { day: 2, coins: 15, bonus: false },
    { day: 3, coins: 20, bonus: false },
    { day: 4, coins: 25, bonus: false },
    { day: 5, coins: 30, bonus: false },
    { day: 6, coins: 40, bonus: false },
    { day: 7, coins: 50, bonus: true },
  ],
  watchAd: {
    coinsPerAd: 9,
    unlockEpisodes: 1,
    dailyLimit: null, // No limit
  }
};
