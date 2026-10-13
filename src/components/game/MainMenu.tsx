import React from 'react';
import { GirlCharacter, FoodItem } from '../../types/game';
import { CuteGirl } from '../character/CuteGirl';
import { RainbowBackground } from '../common/RainbowBackground';
import { ButterflyLayer } from '../common/ButterflyLayer';
import { soundEngine } from '../../services/soundEngine';
import {
  Play,
  Users,
  UtensilsCrossed,
  BookOpen,
  Store,
  Gift,
  Trophy,
  Settings as SettingsIcon,
  Coins,
  Smartphone,
} from 'lucide-react';

interface Props {
  coins: number;
  selectedCharacter: GirlCharacter;
  activeFood: FoodItem;
  onNavigate: (screen: any) => void;
  wallpaperId: string;
}

export const MainMenu: React.FC<Props> = ({
  coins,
  selectedCharacter,
  activeFood,
  onNavigate,
  wallpaperId,
}) => {
  const handleNav = (targetScreen: string) => {
    soundEngine.playClick();
    onNavigate(targetScreen);
  };

  return (
    <RainbowBackground wallpaperId={wallpaperId}>
      <ButterflyLayer />

      {/* Top Header Bar: Coin Counter, Store & APK info */}
      <header className="w-full flex items-center justify-between px-4 py-3 z-30">
        {/* Coin Display Pill */}
        <div className="flex items-center gap-2 bg-white/85 px-3 py-1.5 rounded-full border border-pink-200 shadow-sm backdrop-blur-xs">
          <div className="w-6 h-6 rounded-full bg-amber-400 flex items-center justify-center text-white text-xs font-bold shadow-xs">
            <Coins className="w-4 h-4 fill-amber-100 text-amber-700" />
          </div>
          <span className="font-bold text-amber-700 text-sm tracking-wide">
            {coins}
          </span>
          <button
            onClick={() => handleNav('rewards')}
            className="text-[10px] bg-pink-100 hover:bg-pink-200 text-pink-700 font-bold px-1.5 py-0.5 rounded-full transition-colors"
          >
            + Free
          </button>
        </div>

        {/* Brand Title Pill */}
        <div className="text-center">
          <span className="font-['Fredoka'] text-sm font-extrabold rainbow-text drop-shadow-xs">
            Aaima ASMR
          </span>
        </div>

        {/* Quick Settings & APK Guide */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleNav('apk_guide')}
            className="p-2 bg-white/85 hover:bg-white text-emerald-600 rounded-full shadow-xs border border-emerald-200 active:scale-95 transition-all"
            title="Android APK Export Guide"
          >
            <Smartphone className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleNav('settings')}
            className="p-2 bg-white/85 hover:bg-white text-purple-600 rounded-full shadow-xs border border-purple-200 active:scale-95 transition-all"
            title="Settings"
          >
            <SettingsIcon className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Center Character Stage */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 relative z-20">
        <div className="relative flex flex-col items-center">
          {/* Active girl display */}
          <div
            onClick={() => handleNav('character_select')}
            className="cursor-pointer group relative flex flex-col items-center"
          >
            <CuteGirl
              character={selectedCharacter}
              expression="idle"
              size="xl"
              className="group-hover:scale-105 transition-transform"
            />
            {/* Character Name Tag */}
            <div className="mt-[-8px] bg-white/95 px-4 py-1 rounded-full border border-pink-300 shadow-md flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-ping" />
              <span className="font-bold text-xs text-purple-800">
                {selectedCharacter.name}
              </span>
              <span className="text-[10px] text-pink-500 font-semibold">
                ({selectedCharacter.title})
              </span>
            </div>
          </div>

          {/* Quick Play Dish Preview */}
          <div className="mt-3 flex items-center gap-2 bg-white/80 backdrop-blur-xs px-3 py-1 rounded-full border border-pink-200 shadow-xs">
            <span className="text-xs text-pink-600 font-medium">Ready Dish:</span>
            <span className="text-xs font-bold text-purple-700 truncate max-w-[130px]">
              {activeFood.name}
            </span>
            <button
              onClick={() => handleNav('food_collection')}
              className="text-[10px] text-blue-600 font-bold underline"
            >
              Change
            </button>
          </div>
        </div>
      </div>

      {/* Main Menu Action Buttons Grid */}
      <div className="w-full max-w-md mx-auto px-4 pb-5 z-30 flex flex-col gap-2">
        {/* Dual Primary Action Buttons: Tanghulu Master & Classic Kitchen */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handleNav('tanghulu_maker')}
            className="py-3 bg-gradient-to-r from-red-500 via-pink-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-md hover:shadow-red-300/60 flex items-center justify-center gap-1.5 transition-transform active:scale-95 border-2 border-white/80"
          >
            <span className="text-base">🍓</span>
            <span>Tanghulu Master</span>
          </button>

          <button
            onClick={() => handleNav('cooking')}
            className="py-3 bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-md hover:shadow-purple-300/60 flex items-center justify-center gap-1.5 transition-transform active:scale-95 border-2 border-white/80"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Kitchen & Eat</span>
          </button>
        </div>

        {/* Grid for Whoyaho Tanghulu Master & Kitchen Menu Buttons */}
        <div className="grid grid-cols-2 gap-2 text-xs font-bold">
          <button
            onClick={() => handleNav('character_select')}
            className="flex items-center gap-2.5 p-2.5 bg-white/90 hover:bg-white text-purple-700 rounded-xl border border-pink-200 shadow-xs active:scale-95 transition-all text-left"
          >
            <div className="w-7 h-7 rounded-lg bg-pink-100 flex items-center justify-center text-pink-600 shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold">Choose Girl</div>
              <div className="text-[10px] text-pink-500 font-normal">10 Characters</div>
            </div>
          </button>

          <button
            onClick={() => handleNav('missions')}
            className="flex items-center gap-2.5 p-2.5 bg-white/90 hover:bg-white text-rose-700 rounded-xl border border-rose-200 shadow-xs active:scale-95 transition-all text-left"
          >
            <div className="w-7 h-7 rounded-lg bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
              <span className="text-base">💌</span>
            </div>
            <div>
              <div className="font-bold">Viewer Orders</div>
              <div className="text-[10px] text-rose-500 font-normal">Missions & Play Buttons</div>
            </div>
          </button>

          <button
            onClick={() => handleNav('bakery_job')}
            className="flex items-center gap-2.5 p-2.5 bg-white/90 hover:bg-white text-amber-800 rounded-xl border border-amber-200 shadow-xs active:scale-95 transition-all text-left"
          >
            <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
              <span className="text-base">🥐</span>
            </div>
            <div>
              <div className="font-bold">Bakery Shift</div>
              <div className="text-[10px] text-amber-600 font-normal">Earn Fast Coins</div>
            </div>
          </button>

          <button
            onClick={() => handleNav('food_collection')}
            className="flex items-center gap-2.5 p-2.5 bg-white/90 hover:bg-white text-purple-800 rounded-xl border border-purple-200 shadow-xs active:scale-95 transition-all text-left"
          >
            <div className="w-7 h-7 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 shrink-0">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold">Collection</div>
              <div className="text-[10px] text-purple-500 font-normal">49 Foods</div>
            </div>
          </button>

          <button
            onClick={() => handleNav('store')}
            className="flex items-center gap-2.5 p-2.5 bg-white/90 hover:bg-white text-emerald-700 rounded-xl border border-emerald-200 shadow-xs active:scale-95 transition-all text-left"
          >
            <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
              <Store className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold">My Store</div>
              <div className="text-[10px] text-emerald-600 font-normal">Decor & Upgrades</div>
            </div>
          </button>

          <button
            onClick={() => handleNav('rewards')}
            className="flex items-center gap-2.5 p-2.5 bg-white/90 hover:bg-white text-blue-700 rounded-xl border border-blue-200 shadow-xs active:scale-95 transition-all text-left"
          >
            <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <Gift className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold">Rewards</div>
              <div className="text-[10px] text-blue-500 font-normal">Daily Coins</div>
            </div>
          </button>
        </div>
      </div>
    </RainbowBackground>
  );
};
