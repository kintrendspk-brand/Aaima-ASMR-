import { GirlCharacter } from '../types/game';

export const INITIAL_CHARACTERS: GirlCharacter[] = [
  {
    id: 'aaima',
    name: 'Aaima',
    title: 'Rainbow Hostess',
    description: 'A sweet, joyful girl who loves slurping spicy noodles and wearing cute pink ribbons.',
    hairColor: '#f472b6', // soft pink
    hairStyle: 'pigtails',
    eyeColor: '#7c3aed',
    skinTone: '#fed7aa',
    baseOutfitColor: '#f472b6',
    ribbonColor: '#f43f5e',
    personality: 'Bubbly & Cheerful',
    favoriteFoodCategory: 'noodles',
    price: 0,
    isUnlocked: true,
    selectedOutfitId: 'aaima_default',
    outfits: [
      {
        id: 'aaima_default',
        name: 'Pink Ribbons Dress',
        price: 0,
        isUnlocked: true,
        dressColor: '#f472b6',
        accentColor: '#fdf2f8',
        styleName: 'Sweet Bow'
      },
      {
        id: 'aaima_strawberry',
        name: 'Strawberry Milk Apron',
        price: 80,
        isUnlocked: false,
        dressColor: '#fb7185',
        accentColor: '#ffe4e6',
        styleName: 'Chef Apron'
      },
      {
        id: 'aaima_sparkle',
        name: 'Starlight Magical Gown',
        price: 200,
        isUnlocked: false,
        dressColor: '#e879f9',
        accentColor: '#fdf4ff',
        styleName: 'Sparkle Party'
      }
    ]
  },
  {
    id: 'hana',
    name: 'Hana',
    title: 'Floral Blossom',
    description: 'Calm and sweet with silky brown hair. Loves crispy snacks and bubble tea.',
    hairColor: '#92400e', // rich brown
    hairStyle: 'long_flowing',
    eyeColor: '#059669',
    skinTone: '#fde68a',
    baseOutfitColor: '#34d399',
    ribbonColor: '#10b981',
    personality: 'Gentle & Polite',
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
        name: 'Tea House Kimono Dress',
        price: 100,
        isUnlocked: false,
        dressColor: '#6ee7b7',
        accentColor: '#065f46',
        styleName: 'Traditional Blossom'
      }
    ]
  },
  {
    id: 'mimi',
    name: 'Mimi',
    title: 'Puff Twin-Tails',
    description: 'Bursting with energy! Loves juicy burgers, crispy fries, and giant crunch bites.',
    hairColor: '#fbbf24', // warm golden blonde
    hairStyle: 'twin_buns',
    eyeColor: '#ea580c',
    skinTone: '#fed7aa',
    baseOutfitColor: '#fb923c',
    ribbonColor: '#f97316',
    personality: 'Enthusiastic & Playful',
    favoriteFoodCategory: 'fastfood',
    price: 120,
    isUnlocked: false,
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
        name: 'Diner Waitress Uniform',
        price: 90,
        isUnlocked: false,
        dressColor: '#f87171',
        accentColor: '#fef2f2',
        styleName: 'Retro Diner'
      }
    ]
  },
  {
    id: 'lulu',
    name: 'Lulu',
    title: 'Lavender Dreamer',
    description: 'Admires fluffy cakes, strawberry creams, and gentle squishy jelly desserts.',
    hairColor: '#c084fc', // soft lavender
    hairStyle: 'bob_cut',
    eyeColor: '#6366f1',
    skinTone: '#fce7f3',
    baseOutfitColor: '#a855f7',
    ribbonColor: '#7e22ce',
    personality: 'Dreamy & Elegant',
    favoriteFoodCategory: 'desserts',
    price: 150,
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
        name: 'French Patissier Apron',
        price: 110,
        isUnlocked: false,
        dressColor: '#c084fc',
        accentColor: '#f3e8ff',
        styleName: 'Sweet Baker'
      }
    ]
  },
  {
    id: 'iris',
    name: 'Iris',
    title: 'Rainbow Prism',
    description: 'Wears the colors of the sky! Loves testing every new ASMR treat in the store.',
    hairColor: '#38bdf8', // sky blue
    hairStyle: 'ponytail',
    eyeColor: '#ec4899',
    skinTone: '#fed7aa',
    baseOutfitColor: '#38bdf8',
    ribbonColor: '#e11d48',
    personality: 'Creative & Joyful',
    favoriteFoodCategory: 'snacks',
    price: 180,
    isUnlocked: false,
    selectedOutfitId: 'iris_default',
    outfits: [
      {
        id: 'iris_default',
        name: 'Rainbow Gradient Sundress',
        price: 0,
        isUnlocked: true,
        dressColor: '#38bdf8',
        accentColor: '#fef08a',
        styleName: 'Rainbow Sky'
      },
      {
        id: 'iris_festival',
        name: 'Prism Star Jumpsuit',
        price: 120,
        isUnlocked: false,
        dressColor: '#f43f5e',
        accentColor: '#38bdf8',
        styleName: 'Star Festival'
      }
    ]
  },
  {
    id: 'chloe',
    name: 'Chloë',
    title: 'Pastel Bunny',
    description: 'Cozy and snuggly! Wears a cute mint hoodie with bunny ears and loves chocolate pudding.',
    hairColor: '#4ade80', // pastel mint green
    hairStyle: 'braids',
    eyeColor: '#0284c7',
    skinTone: '#fed7aa',
    baseOutfitColor: '#2dd4bf',
    ribbonColor: '#0f766e',
    personality: 'Cozy & Chill',
    favoriteFoodCategory: 'desserts',
    price: 220,
    isUnlocked: false,
    selectedOutfitId: 'chloe_default',
    outfits: [
      {
        id: 'chloe_default',
        name: 'Mint Bunny Hoodie',
        price: 0,
        isUnlocked: true,
        dressColor: '#2dd4bf',
        accentColor: '#ccfbf1',
        styleName: 'Fluffy Ears'
      },
      {
        id: 'chloe_pajama',
        name: 'Cloud Dream Nightgown',
        price: 130,
        isUnlocked: false,
        dressColor: '#818cf8',
        accentColor: '#e0e7ff',
        styleName: 'Slumber Party'
      }
    ]
  }
];
