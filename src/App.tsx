import React, { useState, useEffect } from 'react';
import { useGameState } from './hooks/useGameState';
import { soundEngine } from './services/soundEngine';
import { OpeningSequence } from './components/game/OpeningSequence';
import { MainMenu } from './components/game/MainMenu';
import { CharacterSelector } from './components/game/CharacterSelector';
import { CookingStage } from './components/game/CookingStage';
import { EatingStage } from './components/game/EatingStage';
import { FoodCollectionModal } from './components/game/FoodCollectionModal';
import { StoreModal } from './components/game/StoreModal';
import { RewardsModal } from './components/game/RewardsModal';
import { AchievementsModal } from './components/game/AchievementsModal';
import { SettingsModal } from './components/game/SettingsModal';
import { ApkGuideModal } from './components/game/ApkGuideModal';
import { TanghuluMaker } from './components/game/TanghuluMaker';
import { MukbangLiveStream } from './components/game/MukbangLiveStream';
import { BakeryMiniGame } from './components/game/BakeryMiniGame';
import { ViewerMissionsModal } from './components/game/ViewerMissionsModal';
import { INITIAL_MUKBANG_MISSIONS } from './data/tanghuluData';
import { FoodItem, CustomTanghulu, MukbangMission } from './types/game';

export default function App() {
  const {
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
    activeFood,
    activeWallpaper,
    addCoins,
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
  } = useGameState();

  const [musicActive, setMusicActive] = useState<boolean>(true);

  // Synchronize audio settings on start
  useEffect(() => {
    soundEngine.setVolumes(settings);
  }, [settings]);

  const toggleMusic = () => {
    if (musicActive) {
      soundEngine.stopMusic();
      setMusicActive(false);
    } else {
      soundEngine.startMusic();
      setMusicActive(true);
    }
  };

  const [customTanghulu, setCustomTanghulu] = useState<CustomTanghulu | null>(null);
  const [subscribers, setSubscribers] = useState<number>(1280);
  const [missions, setMissions] = useState<MukbangMission[]>(INITIAL_MUKBANG_MISSIONS);
  const [unlockedFruits] = useState<string[]>([
    'fruit_strawberry',
    'fruit_muscat',
    'fruit_mandarin',
    'fruit_tomato',
    'fruit_marshmallow',
  ]);

  // Navigators
  const startCookingFood = (food: FoodItem) => {
    selectFood(food);
    setScreen('cooking');
  };

  const startEatingFood = (food: FoodItem) => {
    selectFood(food);
    setScreen('eating');
  };

  const handleFinishCooking = () => {
    recordCookCompletion();
    setScreen('eating');
  };

  const handleFinishTanghulu = (tanghulu: CustomTanghulu) => {
    setCustomTanghulu(tanghulu);
    setScreen('mukbang_live');
  };

  const handleFinishMukbang = (coinsEarned: number, subsGained: number) => {
    addCoins(coinsEarned);
    setSubscribers((prev) => prev + subsGained);
  };

  const handleEarnBakerySalary = (amount: number) => {
    addCoins(amount);
  };

  const handleClaimMission = (id: string, rewardCoins: number, rewardSubs: number) => {
    addCoins(rewardCoins);
    setSubscribers((prev) => prev + rewardSubs);
    setMissions((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isClaimed: true, isCompleted: true } : m))
    );
  };

  const hasGoldenLadle = Boolean(
    storeItems.find((s) => s.id === 'decor_golden_ladle')?.isUnlocked
  );

  const activeTableDecor = storeItems.find(
    (s) => s.category === 'table_decor' && s.isUnlocked
  )?.id;

  return (
    <div className="w-full min-h-screen bg-pink-100 flex items-center justify-center font-['Fredoka',sans-serif]">
      {/* Mobile-First Shell Container (Responsive, Portrait-Optimized) */}
      <div className="w-full max-w-md min-h-screen sm:min-h-[840px] sm:max-h-[920px] sm:rounded-3xl sm:shadow-2xl overflow-hidden relative flex flex-col bg-white">
        {/* Screen 1: Opening Animated Sequence */}
        {screen === 'opening' && (
          <OpeningSequence
            character={selectedCharacter}
            onStartGame={() => setScreen('main_menu')}
            musicEnabled={musicActive}
            onToggleMusic={toggleMusic}
          />
        )}

        {/* Screen 2: Rainbow Main Menu */}
        {screen === 'main_menu' && (
          <MainMenu
            coins={coins}
            selectedCharacter={selectedCharacter}
            activeFood={activeFood}
            onNavigate={(target) => setScreen(target)}
            wallpaperId={activeWallpaper}
          />
        )}

        {/* Screen 3: Choose Your Girl Character Selection */}
        {screen === 'character_select' && (
          <CharacterSelector
            characters={characters}
            selectedCharacter={selectedCharacter}
            coins={coins}
            onSelectCharacter={selectCharacter}
            onUnlockCharacter={unlockCharacter}
            onSelectOutfit={selectOutfit}
            onUnlockOutfit={unlockOutfit}
            onBack={() => setScreen('main_menu')}
          />
        )}

        {/* Screen 4: Tanghulu Master Fruit Skewer & Sugar Syrup Maker */}
        {screen === 'tanghulu_maker' && (
          <TanghuluMaker
            selectedCharacter={selectedCharacter}
            onFinishTanghulu={handleFinishTanghulu}
            onBack={() => setScreen('main_menu')}
            unlockedFruits={unlockedFruits}
          />
        )}

        {/* Screen 5: Mukbang Live Stream (Tanghulu Master Mukbang ASMR) */}
        {screen === 'mukbang_live' && (
          <MukbangLiveStream
            food={activeFood}
            customTanghulu={customTanghulu}
            selectedCharacter={selectedCharacter}
            subscribers={subscribers}
            onFinishMukbang={handleFinishMukbang}
            onBackToMenu={() => setScreen('main_menu')}
            onMakeAnotherTanghulu={() => setScreen('tanghulu_maker')}
          />
        )}

        {/* Screen 6: Stage A - Interactive Cooking Kitchen */}
        {screen === 'cooking' && (
          <CookingStage
            food={activeFood}
            selectedCharacter={selectedCharacter}
            onFinishCooking={handleFinishCooking}
            onBack={() => setScreen('main_menu')}
            hasGoldenLadle={hasGoldenLadle}
          />
        )}

        {/* Screen 5: Stage B - Interactive ASMR Eating Table */}
        {screen === 'eating' && (
          <EatingStage
            food={activeFood}
            selectedCharacter={selectedCharacter}
            onFinishMeal={(food) => recordMealCompletion(food)}
            onBackToMenu={() => setScreen('main_menu')}
            onCookAgain={() => setScreen('cooking')}
            tableDecorId={activeTableDecor}
          />
        )}

        {/* Screen 6: Food Collection (49 Foods across 5 categories) */}
        {screen === 'food_collection' && (
          <FoodCollectionModal
            foods={foods}
            coins={coins}
            onSelectFood={selectFood}
            onUnlockFood={unlockFood}
            onStartCooking={startCookingFood}
            onStartEating={startEatingFood}
            onBack={() => setScreen('main_menu')}
          />
        )}

        {/* Screen 7: My Store & Upgrades */}
        {screen === 'store' && (
          <StoreModal
            storeItems={storeItems}
            coins={coins}
            onBuyItem={buyStoreItem}
            onBack={() => setScreen('main_menu')}
          />
        )}

        {/* Screen 8: Daily Rewards Calendar */}
        {screen === 'rewards' && (
          <RewardsModal
            dailyDay={dailyDay}
            lastDailyClaim={lastDailyClaim}
            coins={coins}
            onClaimDailyReward={claimDailyReward}
            onBack={() => setScreen('main_menu')}
          />
        )}

        {/* Screen 9: Achievements & Badges */}
        {screen === 'achievements' && (
          <AchievementsModal
            achievements={achievements}
            coins={coins}
            onClaimAchievement={claimAchievement}
            onBack={() => setScreen('main_menu')}
          />
        )}

        {/* Screen: Viewer Request Missions & Play Button Milestones (Whoyaho Tanghulu Master feature!) */}
        {screen === 'missions' && (
          <ViewerMissionsModal
            missions={missions}
            subscribers={subscribers}
            onClaimMission={handleClaimMission}
            onBack={() => setScreen('main_menu')}
          />
        )}

        {/* Screen: Bakery Part-Time Job (Whoyaho Tanghulu Master feature!) */}
        {screen === 'bakery_job' && (
          <BakeryMiniGame
            onEarnCoins={handleEarnBakerySalary}
            onBack={() => setScreen('main_menu')}
          />
        )}

        {/* Screen 10: Game Settings */}
        {screen === 'settings' && (
          <SettingsModal
            settings={settings}
            onUpdateSettings={updateSettings}
            onResetProgress={resetProgress}
            onOpenApkGuide={() => setScreen('apk_guide')}
            onBack={() => setScreen('main_menu')}
          />
        )}

        {/* Screen 11: Free Android APK Build Guide */}
        {screen === 'apk_guide' && (
          <ApkGuideModal onBack={() => setScreen('settings')} />
        )}
      </div>
    </div>
  );
}
