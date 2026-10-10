export type FoodCategory = 'noodles' | 'snacks' | 'fastfood' | 'desserts' | 'drinks';

export type AsmrSoundType =
  | 'slurp_spicy'
  | 'slurp_mild'
  | 'slurp_brown'
  | 'crunch_chips'
  | 'crunch_crispy'
  | 'chew_burger'
  | 'crunch_chicken'
  | 'squish_jelly'
  | 'melt_icecream'
  | 'sip_drink'
  | 'crunch_candy'
  | 'soft_cake';

export type CookingStyle =
  | 'boil_noodles'
  | 'fry_pan'
  | 'assemble_burger'
  | 'open_snack'
  | 'blend_drink'
  | 'bake_dessert'
  | 'scoop_icecream';

export interface FoodItem {
  id: string;
  name: string;
  category: FoodCategory;
  categoryName: string;
  description: string;
  price: number;
  isUnlocked: boolean;
  totalBites: number;
  cookingStyle: CookingStyle;
  soundType: AsmrSoundType;
  colorTheme: string;
  spicyLevel?: number;
  sweetLevel?: number;
  crunchLevel?: number;
}

export interface CharacterOutfit {
  id: string;
  name: string;
  price: number;
  isUnlocked: boolean;
  dressColor: string;
  accentColor: string;
  styleName: string;
}

export interface GirlCharacter {
  id: string;
  name: string;
  title: string;
  description: string;
  hairColor: string;
  hairStyle: 'pigtails' | 'long_flowing' | 'twin_buns' | 'bob_cut' | 'ponytail' | 'braids';
  eyeColor: string;
  skinTone: string;
  baseOutfitColor: string;
  ribbonColor: string;
  personality: string;
  favoriteFoodCategory: FoodCategory;
  price: number;
  isUnlocked: boolean;
  outfits: CharacterOutfit[];
  selectedOutfitId: string;
}

export interface StoreItem {
  id: string;
  name: string;
  category: 'kitchen_decor' | 'table_decor' | 'wallpaper';
  price: number;
  isUnlocked: boolean;
  description: string;
  icon: string;
  previewColor: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  rewardCoins: number;
  currentProgress: number;
  targetProgress: number;
  isCompleted: boolean;
  isClaimed: boolean;
  icon: string;
}

export interface DailyReward {
  day: number;
  coins: number;
  bonusTitle: string;
}

export interface GameSettings {
  masterMute: boolean;
  asmrVolume: number;
  cookingVolume: number;
  musicVolume: number;
  particlesEnabled: boolean;
  fpsMode: '60fps' | 'battery_saver';
  language: 'en';
}

export type GameScreen =
  | 'opening'
  | 'main_menu'
  | 'character_select'
  | 'cooking'
  | 'eating'
  | 'food_collection'
  | 'store'
  | 'rewards'
  | 'achievements'
  | 'settings'
  | 'apk_guide';
