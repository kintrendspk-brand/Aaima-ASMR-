import { GirlCharacter } from '../types/game';

export const INITIAL_CHARACTERS: GirlCharacter[] = [
  // 1. Aaima (Hostess, Soft Pink Hair & Ribbons)
  {
    id: 'aaima',
    name: 'Aaima',
    title: 'Rainbow Hostess',
    description: 'A sweet, caring girl with delicate pink ribbons, glowing rose cheeks, and sparkling violet eyes. Loves spicy noodles and welcoming guests!',
    hairColor: '#f472b6', // soft pink
    hairStyle: 'pigtails',
    eyeColor: '#8b5cf6', // luminous violet
    skinTone: '#fed7aa', // porcelain warm
    baseOutfitColor: '#f472b6',
    ribbonColor: '#f43f5e',
    personality: 'Sweet & Cheerful Hostess',
    favoriteFoodCategory: 'noodles',
    price: 0,
    isUnlocked: true,
    selectedOutfitId: 'aaima_default',
    outfits: [
      {
        id: 'aaima_default',
        name: 'Sweet Pink Ribbon Dress',
        price: 0,
        isUnlocked: true,
        dressColor: '#f472b6',
        accentColor: '#fdf2f8',
        styleName: 'Sweet Bow'
      },
      {
        id: 'aaima_strawberry',
        name: 'Strawberry Milk Apron',
        price: 70,
        isUnlocked: false,
        dressColor: '#fb7185',
        accentColor: '#ffe4e6',
        styleName: 'Chef Apron'
      },
      {
        id: 'aaima_sparkle',
        name: 'Starlight Magical Gown',
        price: 150,
        isUnlocked: false,
        dressColor: '#e879f9',
        accentColor: '#fdf4ff',
        styleName: 'Sparkle Party'
      }
    ]
  },

  // 2. Hana (Long Silky Brown Hair & Mint Blossom)
  {
    id: 'hana',
    name: 'Hana',
    title: 'Floral Blossom',
    description: 'Gentle, polite girl with silky flowing brown hair and emerald eyes. Passionate about refreshing bubble tea and crispy snacks.',
    hairColor: '#78350f', // rich espresso brown
    hairStyle: 'long_flowing',
    eyeColor: '#059669', // emerald
    skinTone: '#fde68a',
    baseOutfitColor: '#34d399',
    ribbonColor: '#10b981',
    personality: 'Calm & Elegant',
    favoriteFoodCategory: 'drinks',
    price: 0,
    isUnlocked: true,
    selectedOutfitId: 'hana_default',
    outfits: [
      {
        id: 'hana_default',
        name: 'Mint Petal Sundress',
        price: 0,
        isUnlocked: true,
        dressColor: '#34d399',
        accentColor: '#ecfdf5',
        styleName: 'Fresh Spring'
      },
      {
        id: 'hana_matcha',
        name: 'Tea Blossom Kimono Dress',
        price: 80,
        isUnlocked: false,
        dressColor: '#6ee7b7',
        accentColor: '#065f46',
        styleName: 'Traditional Blossom'
      }
    ]
  },

  // 3. Mimi (Golden Twin Buns & Warm Sunshine)
  {
    id: 'mimi',
    name: 'Mimi',
    title: 'Sunny Puff Buns',
    description: 'Brimming with joyous energy! Honey-blonde hair in cute twin buns and sparkling amber eyes. Addicted to huge crunchy bites.',
    hairColor: '#f59e0b', // warm golden amber
    hairStyle: 'twin_buns',
    eyeColor: '#ea580c',
    skinTone: '#fed7aa',
    baseOutfitColor: '#fb923c',
    ribbonColor: '#f97316',
    personality: 'Energetic & Playful',
    favoriteFoodCategory: 'fastfood',
    price: 50,
    isUnlocked: true, // Also unlocked starter!
    selectedOutfitId: 'mimi_default',
    outfits: [
      {
        id: 'mimi_default',
        name: 'Sunny Peach Romper',
        price: 0,
        isUnlocked: true,
        dressColor: '#fb923c',
        accentColor: '#ffedd5',
        styleName: 'Casual Energy'
      },
      {
        id: 'mimi_fastfoodie',
        name: 'Retro Diner Uniform',
        price: 80,
        isUnlocked: false,
        dressColor: '#f87171',
        accentColor: '#fef2f2',
        styleName: 'Retro Diner'
      }
    ]
  },

  // 4. Lulu (Chic Lavender Bob Cut)
  {
    id: 'lulu',
    name: 'Lulu',
    title: 'Lavender Dreamer',
    description: 'Chic Parisian aesthetics with a soft lavender bob cut and indigo eyes. Loves fluffy cakes, chocolate puddings, and sweet treats.',
    hairColor: '#c084fc', // soft lilac
    hairStyle: 'bob_cut',
    eyeColor: '#6366f1',
    skinTone: '#fce7f3',
    baseOutfitColor: '#a855f7',
    ribbonColor: '#7e22ce',
    personality: 'Dreamy & Artistic',
    favoriteFoodCategory: 'desserts',
    price: 60,
    isUnlocked: false,
    selectedOutfitId: 'lulu_default',
    outfits: [
      {
        id: 'lulu_default',
        name: 'Lilac Bell Dress',
        price: 0,
        isUnlocked: true,
        dressColor: '#a855f7',
        accentColor: '#faf5ff',
        styleName: 'Pastel Lavender'
      },
      {
        id: 'lulu_patisserie',
        name: 'Sweet Patissier Apron',
        price: 90,
        isUnlocked: false,
        dressColor: '#c084fc',
        accentColor: '#f3e8ff',
        styleName: 'Sweet Baker'
      }
    ]
  },

  // 5. Iris (Sky Blue Ponytail with Rainbow Star)
  {
    id: 'iris',
    name: 'Iris',
    title: 'Rainbow Prism',
    description: 'Vibrant sky-blue high ponytail, glittering cyan eyes, and star accessories. Always excited to test crunchy ASMR snacks!',
    hairColor: '#38bdf8', // radiant sky blue
    hairStyle: 'ponytail',
    eyeColor: '#ec4899', // contrasting magenta
    skinTone: '#fed7aa',
    baseOutfitColor: '#38bdf8',
    ribbonColor: '#e11d48',
    personality: 'Creative & Spontaneous',
    favoriteFoodCategory: 'snacks',
    price: 75,
    isUnlocked: false,
    selectedOutfitId: 'iris_default',
    outfits: [
      {
        id: 'iris_default',
        name: 'Rainbow Sky Sundress',
        price: 0,
        isUnlocked: true,
        dressColor: '#38bdf8',
        accentColor: '#fef08a',
        styleName: 'Rainbow Sky'
      },
      {
        id: 'iris_festival',
        name: 'Prism Star Jumpsuit',
        price: 95,
        isUnlocked: false,
        dressColor: '#f43f5e',
        accentColor: '#38bdf8',
        styleName: 'Star Festival'
      }
    ]
  },

  // 6. Chloë (Pastel Mint Bunny Braids)
  {
    id: 'chloe',
    name: 'Chloë',
    title: 'Pastel Bunny',
    description: 'Super cozy and cuddly! Cute mint green braids with fluffy bunny ears on her hoodie. Adores chocolate desserts and warm waffles.',
    hairColor: '#2dd4bf', // pastel mint teal
    hairStyle: 'braids',
    eyeColor: '#0284c7',
    skinTone: '#fed7aa',
    baseOutfitColor: '#14b8a6',
    ribbonColor: '#0f766e',
    personality: 'Cozy & Snuggly',
    favoriteFoodCategory: 'desserts',
    price: 90,
    isUnlocked: false,
    selectedOutfitId: 'chloe_default',
    outfits: [
      {
        id: 'chloe_default',
        name: 'Mint Bunny Hoodie',
        price: 0,
        isUnlocked: true,
        dressColor: '#14b8a6',
        accentColor: '#ccfbf1',
        styleName: 'Fluffy Ears'
      },
      {
        id: 'chloe_pajama',
        name: 'Cloud Dream Nightgown',
        price: 100,
        isUnlocked: false,
        dressColor: '#818cf8',
        accentColor: '#e0e7ff',
        styleName: 'Slumber Party'
      }
    ]
  },

  // 7. Zoya (Wavy Chestnut Curls & Golden Glow)
  {
    id: 'zoya',
    name: 'Zoya',
    title: 'Golden Radiance',
    description: 'Gorgeous cascading wavy chestnut hair, warm hazel eyes, and delicate gold hair ornaments. Loves rich butter noodles and grilled delicacies.',
    hairColor: '#5c2c16', // deep chestnut
    hairStyle: 'wavy_curls',
    eyeColor: '#d97706', // warm golden hazel
    skinTone: '#fdba74', // warm sun-kissed
    baseOutfitColor: '#f59e0b',
    ribbonColor: '#b45309',
    personality: 'Warm & Charming',
    favoriteFoodCategory: 'noodles',
    price: 110,
    isUnlocked: false,
    selectedOutfitId: 'zoya_default',
    outfits: [
      {
        id: 'zoya_default',
        name: 'Golden Blossom Kurti',
        price: 0,
        isUnlocked: true,
        dressColor: '#f59e0b',
        accentColor: '#fef3c7',
        styleName: 'Golden Silk'
      },
      {
        id: 'zoya_ruby',
        name: 'Ruby Velvet Tunic',
        price: 110,
        isUnlocked: false,
        dressColor: '#be123c',
        accentColor: '#fecdd3',
        styleName: 'Royal Velvet'
      }
    ]
  },

  // 8. Sakura (Rose-Gold Twin Low Pigtails & Sakura Pins)
  {
    id: 'sakura',
    name: 'Sakura',
    title: 'Cherry Blossom Angel',
    description: 'Delicate rose-gold twin low pigtails adorned with sakura floral pins. Her blush pink eyes glow with joy when eating sweet desserts.',
    hairColor: '#fda4af', // rose gold pink
    hairStyle: 'side_braid',
    eyeColor: '#e11d48', // ruby rose
    skinTone: '#fff1f2', // delicate pale rose
    baseOutfitColor: '#fb7185',
    ribbonColor: '#f43f5e',
    personality: 'Gentle & Sweethearted',
    favoriteFoodCategory: 'desserts',
    price: 125,
    isUnlocked: false,
    selectedOutfitId: 'sakura_default',
    outfits: [
      {
        id: 'sakura_default',
        name: 'Sakura Petal Kimono Dress',
        price: 0,
        isUnlocked: true,
        dressColor: '#fb7185',
        accentColor: '#fff1f2',
        styleName: 'Sakura Petal'
      },
      {
        id: 'sakura_yukata',
        name: 'Spring Festival Yukata',
        price: 115,
        isUnlocked: false,
        dressColor: '#f43f5e',
        accentColor: '#ffe4e6',
        styleName: 'Cherry Festival'
      }
    ]
  },

  // 9. Amber (Auburn Honey Bangs & Autumn Casual)
  {
    id: 'amber',
    name: 'Amber',
    title: 'Autumn Cozy',
    description: 'Trendy autumn aesthetic with warm auburn curls, honey-gold eyes, and cozy sweater dresses. Loves juicy double burgers and crispy fries!',
    hairColor: '#b45309', // auburn copper
    hairStyle: 'messy_bun',
    eyeColor: '#92400e', // amber topaz
    skinTone: '#fed7aa',
    baseOutfitColor: '#ea580c',
    ribbonColor: '#9a3412',
    personality: 'Confident & Trendy',
    favoriteFoodCategory: 'fastfood',
    price: 140,
    isUnlocked: false,
    selectedOutfitId: 'amber_default',
    outfits: [
      {
        id: 'amber_default',
        name: 'Honey Knit Sweater Dress',
        price: 0,
        isUnlocked: true,
        dressColor: '#ea580c',
        accentColor: '#ffedd5',
        styleName: 'Cozy Knit'
      },
      {
        id: 'amber_cafe',
        name: 'Autumn Cafe Jacket',
        price: 120,
        isUnlocked: false,
        dressColor: '#78350f',
        accentColor: '#fed7aa',
        styleName: 'Barista Chic'
      }
    ]
  },

  // 10. Maya (Midnight Silky Hair & Celestial Sapphire)
  {
    id: 'maya',
    name: 'Maya',
    title: 'Midnight Starlight',
    description: 'Mesmerizing midnight black hair with neat hime bangs, deep sapphire eyes, and starry pins. Loves listening to chilled ASMR drinks & boba.',
    hairColor: '#1e1b4b', // deep midnight raven
    hairStyle: 'hime_cut',
    eyeColor: '#2563eb', // sapphire blue
    skinTone: '#f8fafc', // porcelain fair
    baseOutfitColor: '#4338ca',
    ribbonColor: '#312e81',
    personality: 'Mysterious & Thoughtful',
    favoriteFoodCategory: 'drinks',
    price: 160,
    isUnlocked: false,
    selectedOutfitId: 'maya_default',
    outfits: [
      {
        id: 'maya_default',
        name: 'Celestial Twilight Gown',
        price: 0,
        isUnlocked: true,
        dressColor: '#4338ca',
        accentColor: '#e0e7ff',
        styleName: 'Star Twilight'
      },
      {
        id: 'maya_gothic',
        name: 'Midnight Ribbon Lolita',
        price: 130,
        isUnlocked: false,
        dressColor: '#1e1b4b',
        accentColor: '#818cf8',
        styleName: 'Royal Midnight'
      }
    ]
  }
];
