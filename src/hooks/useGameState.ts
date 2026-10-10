import { useState, useEffect } from 'react';
import {
  GameScreen,
  GirlCharacter,
  FoodItem,
  StoreItem,
  Achievement,
  GameSettings,
} from '../types/game';
import { INITIAL_CHARACTERS } from '../data/characters';
import { INITIAL_FOODS } from '../data/foods';
import { INITIAL_STORE_ITEMS } from '../data/storeItems';
import { INITIAL_ACHIEVEMENTS, DAILY_REWARDS } from '../data/achievements';
import { soundEngine } from '../services/soundEngine';

const SAVE_KEY = 'aaima_asmr_save_v1';

interface SavedState {
  coins: number;
  selectedCharacterId: string;
  characters: GirlCharacter[];
  foods: FoodItem[];
  storeItems: StoreItem[];
  achievements: Achievement[];
  dailyDay: number;
  lastDailyClaim: number | null;
  settings: GameSettings;
  stats: {
    dishesCooked: number;
    mealsEaten: number;
    noodlesEaten: number;
    snacksEaten: number;
    dessertsEaten: number;
    drinksEaten: number;
  };
}

const DEFAULT_SETTINGS: GameSettings = {
  masterMute: false,
  asmrVolume: 0.9,
  cookingVolume: 0.85,
  musicVolume: 0.5,
  particlesEnabled: true,
  fpsMode: '60fps',
  language: 'en',
};

export function useGameState() {
  const [screen, setScreen] = useState<GameScreen>('opening');
  const [coins, setCoins] = useState<number>(120); // 120 starter gift coins
  const [selectedCharacterId, setSelectedCharacterId] = useState<string>('aaima');
  const [characters, setCharacters] = useState<GirlCharacter[]>(INITIAL_CHARACTERS);
  const [foods, setFoods] = useState<FoodItem[]>(INITIAL_FOODS);
  const [storeItems, setStoreItems] = useState<StoreItem[]>(INITIAL_STORE_ITEMS);
  const [achievements, setAchievements] = useState<Achievement[]>(INITIAL_ACHIEVEMENTS);
  const [dailyDay, setDailyDay] = useState<number>(1);
  const [lastDailyClaim, setLastDailyClaim] = useState<number | null>(null);
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_SETTINGS);
  const [stats, setStats] = useState({
    dishesCooked: 0,
    mealsEaten: 0,
    noodlesEaten: 0,
    snacksEaten: 0,
    dessertsEaten: 0,
    drinksEaten: 0,
  });

  const [activeFood, setActiveFood] = useState<FoodItem>(INITIAL_FOODS[0]);

  // Load saved state on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(SAVE_KEY);
      if (saved) {
        const parsed: SavedState = JSON.parse(saved);
        if (typeof parsed.coins === 'number') setCoins(parsed.coins);
        if (parsed.selectedCharacterId) setSelectedCharacterId(parsed.selectedCharacterId);
        if (Array.isArray(parsed.characters)) {
          const mergedChars = INITIAL_CHARACTERS.map((initChar) => {
            const existing = parsed.characters.find((c) => c.id === initChar.id);
            return existing
              ? {
                  ...initChar,
                  isUnlocked: existing.isUnlocked || initChar.isUnlocked,
                  selectedOutfitId: existing.selectedOutfitId || initChar.selectedOutfitId,
                }
              : initChar;
          });
          setCharacters(mergedChars);
        }
        if (Array.isArray(parsed.foods)) setFoods(parsed.foods);
        if (Array.isArray(parsed.storeItems)) setStoreItems(parsed.storeItems);
        if (Array.isArray(parsed.achievements)) setAchievements(parsed.achievements);
        if (typeof parsed.dailyDay === 'number') setDailyDay(parsed.dailyDay);
        if (parsed.lastDailyClaim !== undefined) setLastDailyClaim(parsed.lastDailyClaim);
        if (parsed.settings) {
          setSettings(parsed.settings);
          soundEngine.setVolumes(parsed.settings);
        }
        if (parsed.stats) setStats(parsed.stats);
      }
    } catch {
      // Ignore corrupted save and proceed with defaults
    }
  }, []);

  // Save state on updates
  useEffect(() => {
    try {
      const payload: SavedState = {
        coins,
        selectedCharacterId,
        characters,
        foods,
        storeItems,
        achievements,
        dailyDay,
        lastDailyClaim,
        settings,
        stats,
      };
      localStorage.setItem(SAVE_KEY, JSON.stringify(payload));
    } catch {
      // LocalStorage full or private browsing
    }
  }, [coins, selectedCharacterId, characters, foods, storeItems, achievements, dailyDay, lastDailyClaim, settings, stats]);

  // Active girl character helper
  const selectedCharacter =
    characters.find((c) => c.id === selectedCharacterId) || characters[0];

  const addCoins = (amount: number) => {
    if (amount <= 0) return;
    setCoins((prev) => {
      const newCoins = prev + amount;
      updateAchievementProgress('coin_hoarder', newCoins);
      return newCoins;
    });
    soundEngine.playCoin();
  };

  const deductCoins = (amount: number): boolean => {
    if (coins < amount) return false;
    setCoins((prev) => prev - amount);
    return true;
  };

  const selectCharacter = (id: string) => {
    const target = characters.find((c) => c.id === id);
    if (target && target.isUnlocked) {
      setSelectedCharacterId(id);
      soundEngine.playClick();
    }
  };

  const unlockCharacter = (id: string) => {
    const target = characters.find((c) => c.id === id);
    if (!target || target.isUnlocked || coins < target.price) return false;

    if (deductCoins(target.price)) {
      setCharacters((prev) =>
        prev.map((c) => (c.id === id ? { ...c, isUnlocked: true } : c))
      );
      setSelectedCharacterId(id);
      soundEngine.playFanfare();
      const unlockedCount = characters.filter((c) => c.isUnlocked).length + 1;
      updateAchievementProgress('girl_squad', unlockedCount - 2);
      return true;
    }
    return false;
  };

  const selectOutfit = (charId: string, outfitId: string) => {
    setCharacters((prev) =>
      prev.map((c) => {
        if (c.id !== charId) return c;
        const outfit = c.outfits.find((o) => o.id === outfitId);
        if (outfit && outfit.isUnlocked) {
          return { ...c, selectedOutfitId: outfitId };
        }
        return c;
      })
    );
    soundEngine.playClick();
  };

  const unlockOutfit = (charId: string, outfitId: string) => {
    const char = characters.find((c) => c.id === charId);
    if (!char) return false;
    const outfit = char.outfits.find((o) => o.id === outfitId);
    if (!outfit || outfit.isUnlocked || coins < outfit.price) return false;

    if (deductCoins(outfit.price)) {
      setCharacters((prev) =>
        prev.map((c) => {
          if (c.id !== charId) return c;
          const updatedOutfits = c.outfits.map((o) =>
            o.id === outfitId ? { ...o, isUnlocked: true } : o
          );
          return { ...c, outfits: updatedOutfits, selectedOutfitId: outfitId };
        })
      );
      soundEngine.playFanfare();
      updateAchievementProgress('fashionista', 1);
      return true;
    }
    return false;
  };

  const unlockFood = (foodId: string) => {
    const food = foods.find((f) => f.id === foodId);
    if (!food || food.isUnlocked || coins < food.price) return false;

    if (deductCoins(food.price)) {
      setFoods((prev) =>
        prev.map((f) => (f.id === foodId ? { ...f, isUnlocked: true } : f))
      );
      soundEngine.playFanfare();
      const unlockedFoodsCount = foods.filter((f) => f.isUnlocked).length + 1;
      updateAchievementProgress('unlock_foods', unlockedFoodsCount - 5);
      return true;
    }
    return false;
  };

  const selectFood = (food: FoodItem) => {
    setActiveFood(food);
    soundEngine.playClick();
  };

  const buyStoreItem = (itemId: string) => {
    const item = storeItems.find((s) => s.id === itemId);
    if (!item || item.isUnlocked || coins < item.price) return false;

    if (deductCoins(item.price)) {
      setStoreItems((prev) =>
        prev.map((s) => (s.id === itemId ? { ...s, isUnlocked: true } : s))
      );
      soundEngine.playFanfare();
      const boughtCount = storeItems.filter((s) => s.isUnlocked).length + 1;
      updateAchievementProgress('store_shopper', boughtCount);
      return true;
    }
    return false;
  };

  const claimDailyReward = () => {
    const now = Date.now();
    // Allow claim once every 20 hours or on fresh run
    const cooldownMs = 20 * 60 * 60 * 1000;
    if (lastDailyClaim && now - lastDailyClaim < cooldownMs) return false;

    const currentReward = DAILY_REWARDS.find((r) => r.day === dailyDay) || DAILY_REWARDS[0];
    addCoins(currentReward.coins);
    setLastDailyClaim(now);
    setDailyDay((prev) => (prev >= 7 ? 1 : prev + 1));
    soundEngine.playFanfare();
    return true;
  };

  const updateAchievementProgress = (achievementId: string, currentVal: number) => {
    setAchievements((prev) =>
      prev.map((ach) => {
        if (ach.id !== achievementId) return ach;
        const newProgress = Math.min(ach.targetProgress, Math.max(ach.currentProgress, currentVal));
        const isCompleted = newProgress >= ach.targetProgress;
        return {
          ...ach,
          currentProgress: newProgress,
          isCompleted,
        };
      })
    );
  };

  const claimAchievement = (achievementId: string) => {
    const ach = achievements.find((a) => a.id === achievementId);
    if (!ach || !ach.isCompleted || ach.isClaimed) return;

    addCoins(ach.rewardCoins);
    setAchievements((prev) =>
      prev.map((a) => (a.id === achievementId ? { ...a, isClaimed: true } : a))
    );
    soundEngine.playFanfare();
  };

  const recordCookCompletion = () => {
    setStats((prev) => {
      const nextCount = prev.dishesCooked + 1;
      updateAchievementProgress('chef_explorer', nextCount);
      return { ...prev, dishesCooked: nextCount };
    });
    // Check if kitchen upgrade decor gives bonus
    const hasGoldenLadle = storeItems.find((s) => s.id === 'decor_golden_ladle')?.isUnlocked;
    const baseReward = 25;
    const bonus = hasGoldenLadle ? 5 : 0;
    addCoins(baseReward + bonus);
  };

  const recordMealCompletion = (food: FoodItem) => {
    setStats((prev) => {
      const nextMeals = prev.mealsEaten + 1;
      updateAchievementProgress('first_meal', 1);

      let nextNoodles = prev.noodlesEaten;
      let nextSnacks = prev.snacksEaten;
      let nextDesserts = prev.dessertsEaten;
      let nextDrinks = prev.drinksEaten;

      if (food.category === 'noodles') {
        nextNoodles++;
        updateAchievementProgress('slurp_master', nextNoodles);
      } else if (food.category === 'snacks') {
        nextSnacks++;
        updateAchievementProgress('crunch_lover', nextSnacks);
      } else if (food.category === 'desserts') {
        nextDesserts++;
        updateAchievementProgress('sweet_tooth', nextDesserts);
      } else if (food.category === 'drinks') {
        nextDrinks++;
        updateAchievementProgress('boba_expert', nextDrinks);
      }

      return {
        ...prev,
        mealsEaten: nextMeals,
        noodlesEaten: nextNoodles,
        snacksEaten: nextSnacks,
        dessertsEaten: nextDesserts,
        drinksEaten: nextDrinks,
      };
    });
    addCoins(35);
  };

  const updateSettings = (newSettings: Partial<GameSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      soundEngine.setVolumes(updated);
      return updated;
    });
  };

  const resetProgress = () => {
    localStorage.removeItem(SAVE_KEY);
    setCoins(120);
    setSelectedCharacterId('aaima');
    setCharacters(INITIAL_CHARACTERS);
    setFoods(INITIAL_FOODS);
    setStoreItems(INITIAL_STORE_ITEMS);
    setAchievements(INITIAL_ACHIEVEMENTS);
    setDailyDay(1);
    setLastDailyClaim(null);
    setStats({
      dishesCooked: 0,
      mealsEaten: 0,
      noodlesEaten: 0,
      snacksEaten: 0,
      dessertsEaten: 0,
      drinksEaten: 0,
    });
    soundEngine.playClick();
  };

  const activeWallpaper = storeItems.find(
    (s) => s.category === 'wallpaper' && s.isUnlocked
  )?.id || 'wall_rainbow_dream';

  return {
    screen,
    setScreen,
    coins,
    selectedCharacter,
    characters,
    foods,
    storeItems,
    achievements,
    dailyDay,
    lastDailyClaim,
    settings,
    stats,
    activeFood,
    activeWallpaper,
    addCoins,
    deductCoins,
    selectCharacter,
    unlockCharacter,
    selectOutfit,
    unlockOutfit,
    unlockFood,
    selectFood,
    buyStoreItem,
    claimDailyReward,
    claimAchievement,
    recordCookCompletion,
    recordMealCompletion,
    updateSettings,
    resetProgress,
  };
}
