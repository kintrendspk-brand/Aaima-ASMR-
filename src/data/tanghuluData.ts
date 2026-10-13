import {
  FruitIngredient,
  TanghuluSkewerStick,
  TanghuluTopping,
  LiveChatMessage,
  MukbangMission,
  StudioPet,
} from '../types/game';

// 1. Fresh Fruits & Viral Ingredients for Tanghulu Skewering (Exact Whoyaho Tanghulu Master style!)
export const FRUIT_INGREDIENTS: FruitIngredient[] = [
  {
    id: 'fruit_strawberry',
    name: 'Strawberry',
    icon: '🍓',
    color: '#ef4444',
    taste: 'Sweet & Juicy',
    price: 0,
    isUnlocked: true,
  },
  {
    id: 'fruit_muscat',
    name: 'Shine Muscat',
    icon: '🍇',
    color: '#84cc16',
    taste: 'Crispy & Honey Sweet',
    price: 0,
    isUnlocked: true,
  },
  {
    id: 'fruit_mandarin',
    name: 'Tangerine',
    icon: '🍊',
    color: '#f97316',
    taste: 'Citrus Burst',
    price: 0,
    isUnlocked: true,
  },
  {
    id: 'fruit_tomato',
    name: 'Cherry Tomato',
    icon: '🍅',
    color: '#dc2626',
    taste: 'Juicy Savory Tang',
    price: 20,
    isUnlocked: true, // Starter Whoyaho classic!
  },
  {
    id: 'fruit_marshmallow',
    name: 'Fluffy Marshmallow',
    icon: '🍡',
    color: '#f472b6',
    taste: 'Puffy Cloud Melt',
    price: 30,
    isUnlocked: true, // Whoyaho fan favorite!
  },
  {
    id: 'fruit_blueberry',
    name: 'Blueberry',
    icon: '🫐',
    color: '#3b82f6',
    taste: 'Tart & Refreshing',
    price: 25,
    isUnlocked: false,
  },
  {
    id: 'fruit_cherry',
    name: 'Hawthorn Berry',
    icon: '🍒',
    color: '#b91c1c',
    taste: 'Traditional Tanghulu',
    price: 35,
    isUnlocked: false,
  },
  {
    id: 'fruit_gummy',
    name: 'Gummy Bear',
    icon: '🧸',
    color: '#fbbf24',
    taste: 'Chewy Fruit Sugar',
    price: 40,
    isUnlocked: false,
  },
  {
    id: 'fruit_kiwi',
    name: 'Kiwi Slice',
    icon: '🥝',
    color: '#22c55e',
    taste: 'Zesty & Tropical',
    price: 45,
    isUnlocked: false,
  },
  {
    id: 'fruit_pineapple',
    name: 'Pineapple',
    icon: '🍍',
    color: '#eab308',
    taste: 'Tangy Sunburst',
    price: 55,
    isUnlocked: false,
  },
  {
    id: 'fruit_chili',
    name: 'Red Chili Pepper',
    icon: '🌶️',
    color: '#ef4444',
    taste: 'Viral Spicy ASMR Shock!',
    price: 60,
    isUnlocked: false,
  },
  {
    id: 'fruit_watermelon',
    name: 'Watermelon',
    icon: '🍉',
    color: '#f43f5e',
    taste: 'Hydrating & Crisp',
    price: 65,
    isUnlocked: false,
  },
  {
    id: 'fruit_mango',
    name: 'Sweet Mango',
    icon: '🥭',
    color: '#f59e0b',
    taste: 'Golden Sweet',
    price: 80,
    isUnlocked: false,
  },
  {
    id: 'fruit_earth_candy',
    name: 'Earth Planet Candy',
    icon: '🌍',
    color: '#06b6d4',
    taste: 'Viral Marshmallow Jelly Gum',
    price: 95,
    isUnlocked: false,
  },
  {
    id: 'fruit_cheese',
    name: 'Cube Cheese Stick',
    icon: '🧀',
    color: '#facc15',
    taste: 'Creamy Salty-Sweet Crunch',
    price: 105,
    isUnlocked: false,
  },
  {
    id: 'fruit_rainbow',
    name: 'Rainbow Candy Fruit',
    icon: '🌈',
    color: '#ec4899',
    taste: 'Magical Sugar Melody',
    price: 120,
    isUnlocked: false,
  },
];

// 2. Skewer Sticks for Tanghulu
export const TANGHULU_SKEWER_STICKS: TanghuluSkewerStick[] = [
  {
    id: 'stick_bamboo',
    name: 'Classic Bamboo Stick',
    icon: '🎋',
    color: '#d97706',
    price: 0,
    isUnlocked: true,
  },
  {
    id: 'stick_sakura',
    name: 'Sakura Pastel Pink Stick',
    icon: '🌸',
    color: '#f472b6',
    price: 40,
    isUnlocked: false,
  },
  {
    id: 'stick_golden',
    name: 'Golden Dragon Stick',
    icon: '✨',
    color: '#eab308',
    price: 90,
    isUnlocked: false,
  },
  {
    id: 'stick_rainbow',
    name: 'Rainbow Star Skewer',
    icon: '⭐',
    color: '#a855f7',
    price: 130,
    isUnlocked: false,
  },
];

// 3. Crunchy & Sparkling Tanghulu Toppings
export const TANGHULU_TOPPINGS: TanghuluTopping[] = [
  {
    id: 'topping_none',
    name: 'Glass Sugar Glaze (Pure Crunch)',
    icon: '✨',
    soundEffect: 'crunch_tanghulu',
    price: 0,
    isUnlocked: true,
  },
  {
    id: 'topping_popping',
    name: 'Popping Candy (ASMR Fizz)',
    icon: '💥',
    soundEffect: 'popping_fizzle',
    price: 35,
    isUnlocked: false,
  },
  {
    id: 'topping_sprinkles',
    name: 'Rainbow Sugar Confetti',
    icon: '🎉',
    soundEffect: 'crunch_candy',
    price: 45,
    isUnlocked: false,
  },
  {
    id: 'topping_cookie',
    name: 'Crushed Oreo Crumbs',
    icon: '🍪',
    soundEffect: 'crunch_crispy',
    price: 55,
    isUnlocked: false,
  },
  {
    id: 'topping_gold',
    name: '24K Edible Gold Dust',
    icon: '👑',
    soundEffect: 'crunch_tanghulu',
    price: 95,
    isUnlocked: false,
  },
  {
    id: 'topping_matcha',
    name: 'Matcha Powder Dust',
    icon: '🍵',
    soundEffect: 'soft_cake',
    price: 50,
    isUnlocked: false,
  },
];

// 4. Live Stream Viewer Chat Pool (Whoyaho Tanghulu Master Style)
export const VIEWER_CHAT_POOL: LiveChatMessage[] = [
  {
    id: 'chat_1',
    user: 'BobaLover_99',
    avatar: '🐱',
    badge: 'VIP',
    text: 'That glass sugar crack sound is so satisfying! 🎧✨',
    color: '#ec4899',
  },
  {
    id: 'chat_2',
    user: 'TanghuluFan',
    avatar: '🍓',
    badge: 'SUB',
    text: 'The shine muscat grape looks crystal clear! 🍇',
    color: '#84cc16',
  },
  {
    id: 'chat_3',
    user: 'CrunchMaster',
    avatar: '🎧',
    text: 'Best ASMR mukbang streamer on the internet! 💖',
    color: '#a855f7',
  },
  {
    id: 'chat_4',
    user: 'SweetTooth_Sara',
    avatar: '🌸',
    text: 'Omg she is so cute!! Please eat the top strawberry first! 🍓',
    color: '#f43f5e',
  },
  {
    id: 'chat_5',
    user: 'NightOwl_Vibes',
    avatar: '🌙',
    text: 'Listening with headphones in bed... instant tingles! 😴✨',
    color: '#3b82f6',
  },
  {
    id: 'chat_6',
    user: 'K_SnackQueen',
    avatar: '👑',
    badge: 'VIP',
    text: 'Sugar ratio is 150°C perfect! No stickiness, pure crunch! 🔥',
    color: '#eab308',
  },
  {
    id: 'chat_7',
    user: 'GummyLover',
    avatar: '🧸',
    text: 'OMG she dipped a Gummy Bear and Earth Candy into sugar!! 🌍🍭',
    color: '#06b6d4',
  },
  {
    id: 'chat_8',
    user: 'PastelGamer',
    avatar: '🎀',
    text: 'Tapping screen like crazy for more hearts! 💕💕',
    color: '#f472b6',
  },
  {
    id: 'chat_9',
    user: 'ChiliFanatic',
    avatar: '🌶️',
    text: 'DID SHE JUST EAT A CHILI PEPPER TANGHULU?! 🔥😂 LEGEND!!',
    color: '#ef4444',
  },
  {
    id: 'chat_10',
    user: 'AaimaSuperfan',
    avatar: '💖',
    badge: 'MOD',
    text: 'Aaima is the ultimate Tanghulu Master Queen! Sending love! 🗼🌸',
    color: '#ec4899',
  },
  {
    id: 'chat_11',
    user: 'ASMR_TingleBoy',
    avatar: '🎧',
    text: 'Turn volume UP! The stereo crunch is 100/10! 👂🔊',
    color: '#8b5cf6',
  },
];

// 5. Superchat Donations during Live Mukbang
export const SUPERCHAT_DONATIONS = [
  {
    user: 'RainbowWhale',
    amount: 50,
    text: 'Love the crispy crack! Keep up the cute ASMR streams! 🍓👑',
  },
  {
    user: 'SugarKing_Alex',
    amount: 100,
    text: 'Big tip for the best chef! Please try popping candy next! 💥✨',
  },
  {
    user: 'CuteVibesOnly',
    amount: 25,
    text: 'So relaxing after a long day! Love your dress! 💖🌸',
  },
  {
    user: 'GourmetMukbang',
    amount: 80,
    text: 'Perfect 10/10 crunch rating! Buying you more strawberries! 🍓💸',
  },
  {
    user: 'StarlightAngel',
    amount: 150,
    text: 'SUPERCHAT! You made me crave Tanghulu so much! 🍇✨',
  },
  {
    user: 'TokyoBoba_Club',
    amount: 200,
    text: 'Diamond Creator incoming! Lulu & Aaima to 100K subs! 💎🎉',
  },
];

// 6. Tanghulu Master Mukbang Missions (Viewer Request Orders)
export const INITIAL_MUKBANG_MISSIONS: MukbangMission[] = [
  {
    id: 'mission_tanghulu_1',
    title: 'First Tanghulu Skewer',
    description: 'Skewer 4 fresh fruits and dip them into boiling sugar glaze.',
    targetCount: 1,
    currentCount: 0,
    rewardCoins: 50,
    rewardSubs: 300,
    isCompleted: false,
    isClaimed: false,
  },
  {
    id: 'mission_likes_500',
    title: '500 Live Stream Hearts',
    description: 'Tap screen to send 500 likes during a live Mukbang broadcast.',
    targetCount: 500,
    currentCount: 0,
    rewardCoins: 75,
    rewardSubs: 600,
    isCompleted: false,
    isClaimed: false,
  },
  {
    id: 'mission_marshmallow',
    title: 'Fluffy & Crunchy Cloud',
    description: 'Make and eat a tanghulu skewer containing Marshmallow.',
    targetCount: 1,
    currentCount: 0,
    rewardCoins: 90,
    rewardSubs: 750,
    isCompleted: false,
    isClaimed: false,
  },
  {
    id: 'mission_crunch_10',
    title: 'ASMR Master Cruncher',
    description: 'Bite and crunch 10 pieces of crispy glass-coated tanghulu.',
    targetCount: 10,
    currentCount: 0,
    rewardCoins: 100,
    rewardSubs: 1000,
    isCompleted: false,
    isClaimed: false,
  },
  {
    id: 'mission_popping_candy',
    title: 'Popping ASMR Fizz',
    description: 'Make a tanghulu skewer with Popping Candy topping.',
    targetCount: 1,
    currentCount: 0,
    rewardCoins: 120,
    rewardSubs: 1200,
    isCompleted: false,
    isClaimed: false,
  },
  {
    id: 'mission_viral_chili',
    title: 'Spicy Chili Pepper Challenge',
    description: 'Stream a fiery Red Chili Pepper tanghulu to shock your viewers!',
    targetCount: 1,
    currentCount: 0,
    rewardCoins: 150,
    rewardSubs: 2000,
    isCompleted: false,
    isClaimed: false,
  },
];

// 7. Cute Studio Desk Pets (Whoyaho Tanghulu Master feature!)
export const STUDIO_PETS: StudioPet[] = [
  {
    id: 'pet_bunny',
    name: 'Mochi Bunny',
    icon: '🐰',
    price: 0,
    isUnlocked: true,
    cheerPhrase: 'Hop Hop! So yummy! 🥕',
  },
  {
    id: 'pet_kitty',
    name: 'Milk Kitty',
    icon: '🐱',
    price: 80,
    isUnlocked: false,
    cheerPhrase: 'Meow! Best crunch ever! 🐾',
  },
  {
    id: 'pet_shiba',
    name: 'Boba Shiba',
    icon: '🐶',
    price: 120,
    isUnlocked: false,
    cheerPhrase: 'Woof! Superchat arrived! 🦴',
  },
  {
    id: 'pet_hamster',
    name: 'Chubby Hamster',
    icon: '🐹',
    price: 160,
    isUnlocked: false,
    cheerPhrase: 'Chewing sounds are bliss! 🌻',
  },
];

// 8. Bakery Mini-Game Pastry Orders (Whoyaho Part-Time Job!)
export interface BakeryOrder {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export const BAKERY_PASTRIES: BakeryOrder[] = [
  { id: 'pastry_croissant', name: 'Golden Croissant', icon: '🥐', color: '#f59e0b' },
  { id: 'pastry_cake', name: 'Strawberry Cake', icon: '🍰', color: '#ec4899' },
  { id: 'pastry_donut', name: 'Pink Glazed Donut', icon: '🍩', color: '#f43f5e' },
  { id: 'pastry_bagel', name: 'Toasted Bagel', icon: '🥯', color: '#d97706' },
  { id: 'pastry_cookie', name: 'Chocolate Chip Cookie', icon: '🍪', color: '#854d0e' },
  { id: 'pastry_pudding', name: 'Custard Pudding', icon: '🍮', color: '#fbbf24' },
];

// 9. Play Button Milestones (YouTube / Streamer Silver & Gold Play Buttons)
export const CREATOR_MILESTONES = [
  { subs: 1000, title: 'Streamer Debut 🎀', badge: '🎀' },
  { subs: 10000, title: 'Silver Play Button 🥈', badge: '🥈' },
  { subs: 50000, title: 'Gold Play Button 🥇', badge: '🥇' },
  { subs: 100000, title: 'Diamond Play Button 💎', badge: '💎' },
];
