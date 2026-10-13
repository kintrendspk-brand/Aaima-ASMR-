export type FoodCategory = 'tanghulu' | 'noodles' | 'snacks' | 'fastfood' | 'desserts' | 'drinks';

export type AsmrSoundType =
  | 'crunch_tanghulu'
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
  | 'make_tanghulu'
  | 'boil_noodles'
  | 'fry_pan'
  | 'assemble_burger'
  | 'open_snack'
  | 'blend_drink'
  | 'bake_dessert'
  | 'scoop_icecream';

export interface FruitIngredient {
  id: string;
  name: string;
  icon: string;
  color: string;
  taste: string;
  price: number;
  isUnlocked: boolean;
}

export interface TanghuluSkewerStick {
  id: string;
  name: string;
  icon: string;
  color: string;
  price: number;
  isUnlocked: boolean;
}

export interface TanghuluTopping {
  id: string;
  name: string;
  icon: string;
  soundEffect: string;
  price: number;
  isUnlocked: boolean;
}

export interface CustomTanghulu {
  id: string;
  name: string;
  fruits: string[];
  skewerStickId: string;
  toppingId: string;
  syrupColor: string;
  totalBites: number;
  bitesLeft: number;
}

export interface LiveChatMessage {
  id: string;
  user: string;
  avatar: string;
  badge?: string;
  text: string;
  color?: string;
  isDonation?: boolean;
  donationAmount?: number;
}

export interface MukbangMission {
  id: string;
  title: string;
  description: string;
  targetCount: number;
  currentCount: number;
  rewardCoins: number;
  rewardSubs: number;
  isCompleted: boolean;
  isClaimed: boolean;
}

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
  tanghuluFruits?: string[]; // for pre-made Tanghulu items
  dishType?: 'bucket' | 'plate' | 'bowl' | 'skewer' | 'steamer' | 'platter' | 'glass' | 'basket';
  isHandFingerFood?: boolean;
}

export interface CharacterOutfit {
  id: string;
  name: string;
  price: number;
  isUnlocked: boolean;
  dressColor: string;
  accentColor: string;
  styleName: string;
  hasHeadset?: boolean;
}

export interface GirlCharacter {
  id: string;
  name: string;
  title: string;
  description: string;
  hairColor: string;
  hairStyle:
    | 'pigtails'
    | 'long_flowing'
    | 'twin_buns'
    | 'bob_cut'
    | 'ponytail'
    | 'braids'
    | 'wavy_curls'
    | 'side_braid'
    | 'hime_cut'
    | 'messy_bun';
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
  category: 'kitchen_decor' | 'table_decor' | 'wallpaper' | 'streamer_gear';
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

export interface StudioPet {
  id: string;
  name: string;
  icon: string;
  price: number;
  isUnlocked: boolean;
  cheerPhrase: string;
}

export type GameScreen =
  | 'opening'
  | 'main_menu'
  | 'character_select'
  | 'tanghulu_maker'
  | 'cooking'
  | 'eating'
  | 'mukbang_live'
  | 'bakery_job'
  | 'food_collection'
  | 'store'
  | 'rewards'
  | 'missions'
  | 'achievements'
  | 'settings'
  | 'apk_guide';
