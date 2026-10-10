import React, { useState } from 'react';
import { FoodItem, FoodCategory } from '../../types/game';
import { FoodArt } from '../food/FoodArt';
import { soundEngine } from '../../services/soundEngine';
import {
  ArrowLeft,
  Search,
  Lock,
  Coins,
  UtensilsCrossed,
  Play,
  Flame,
  Volume2,
} from 'lucide-react';

interface Props {
  foods: FoodItem[];
  coins: number;
  onSelectFood: (food: FoodItem) => void;
  onUnlockFood: (foodId: string) => boolean;
  onStartCooking: (food: FoodItem) => void;
  onStartEating: (food: FoodItem) => void;
  onBack: () => void;
}

export const FoodCollectionModal: React.FC<Props> = ({
  foods,
  coins,
  onSelectFood,
  onUnlockFood,
  onStartCooking,
  onStartEating,
  onBack,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activePreviewFood, setActivePreviewFood] = useState<FoodItem>(foods[0]);

  const categories = [
    { id: 'all', label: 'All (49)', icon: '🍱' },
    { id: 'noodles', label: 'Noodles (12)', icon: '🍜' },
    { id: 'snacks', label: 'Snacks (11)', icon: '🥔' },
    { id: 'fastfood', label: 'Fast Food (10)', icon: '🍔' },
    { id: 'desserts', label: 'Sweets (10)', icon: '🍰' },
    { id: 'drinks', label: 'Drinks (6)', icon: '🧋' },
  ];

  const filteredFoods = foods.filter((f) => {
    const matchesCategory = selectedCategory === 'all' || f.category === selectedCategory;
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCardClick = (food: FoodItem) => {
    setActivePreviewFood(food);
    onSelectFood(food);
    soundEngine.playClick();
  };

  const handleUnlock = (food: FoodItem) => {
    if (onUnlockFood(food.id)) {
      setActivePreviewFood({ ...food, isUnlocked: true });
    }
  };

  return (
    <div className="relative w-full h-full min-h-screen flex flex-col justify-between p-4 select-none overflow-hidden bg-gradient-to-b from-pink-100 via-rose-50 to-purple-100">
      {/* Header */}
      <div className="w-full flex items-center justify-between mb-2 z-20">
        <button
          onClick={onBack}
          className="flex items-center gap-1 px-3 py-1.5 bg-white/90 hover:bg-white text-pink-700 text-xs font-bold rounded-full shadow-xs border border-pink-200 transition-all active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="text-center">
          <h2 className="font-['Fredoka'] font-extrabold text-base text-purple-900">
            Food Collection
          </h2>
          <span className="text-[10px] text-pink-600 font-bold">
            {foods.filter((f) => f.isUnlocked).length} / {foods.length} Dishes Unlocked
          </span>
        </div>

        {/* Coin counter */}
        <div className="flex items-center gap-1.5 bg-white/90 px-3 py-1 rounded-full border border-pink-200 shadow-xs">
          <Coins className="w-4 h-4 text-amber-500 fill-amber-400" />
          <span className="font-extrabold text-xs text-amber-700">{coins}</span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="w-full max-w-md mx-auto mb-2 z-20 space-y-2">
        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-purple-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search spicy noodles, burger, cake, boba..."
            className="w-full pl-9 pr-3 py-2 bg-white/90 rounded-2xl border border-pink-200 text-xs font-semibold text-purple-900 placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-pink-300 shadow-xs"
          />
        </div>

        {/* Category horizontal scroll pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setSelectedCategory(c.id as any);
                soundEngine.playClick();
              }}
              className={`shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 ${
                selectedCategory === c.id
                  ? 'bg-pink-500 text-white shadow-xs'
                  : 'bg-white/80 text-purple-700 hover:bg-white border border-pink-100'
              }`}
            >
              <span>{c.icon}</span>
              <span>{c.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Food Grid */}
      <div className="flex-1 overflow-y-auto w-full max-w-md mx-auto pr-1 mb-2">
        <div className="grid grid-cols-3 gap-2 pb-20">
          {filteredFoods.map((food) => {
            const isSelected = activePreviewFood.id === food.id;
            return (
              <div
                key={food.id}
                onClick={() => handleCardClick(food)}
                className={`relative p-2 rounded-2xl border flex flex-col items-center justify-between text-center cursor-pointer transition-all active:scale-95 ${
                  isSelected
                    ? 'bg-white border-2 border-pink-500 shadow-md scale-102'
                    : food.isUnlocked
                    ? 'bg-white/80 border-pink-200 hover:bg-white'
                    : 'bg-slate-50/80 border-slate-200 opacity-75'
                }`}
              >
                {/* Food Graphic */}
                <div className="w-16 h-16 flex items-center justify-center my-0.5">
                  <FoodArt food={food} size="sm" />
                </div>

                {/* Name */}
                <span className="text-[11px] font-bold text-purple-900 leading-tight mt-1 line-clamp-2">
                  {food.name}
                </span>

                {/* Status or Price */}
                <div className="mt-1">
                  {food.isUnlocked ? (
                    <span className="text-[10px] text-emerald-600 font-extrabold bg-emerald-50 px-2 py-0.5 rounded-full">
                      Ready
                    </span>
                  ) : (
                    <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                      <Coins className="w-2.5 h-2.5" /> {food.price}
                    </span>
                  )}
                </div>

                {/* Lock icon overlay */}
                {!food.isUnlocked && (
                  <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-slate-900/60 text-white flex items-center justify-center text-[10px]">
                    <Lock className="w-3 h-3" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Bottom Preview Sheet for selected food */}
      <div className="w-full max-w-md mx-auto bg-white/95 rounded-3xl p-3.5 shadow-xl border-2 border-pink-300 z-30">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 shrink-0">
              <FoodArt food={activePreviewFood} size="sm" />
            </div>
            <div>
              <h3 className="font-['Fredoka'] font-extrabold text-sm text-purple-900 leading-tight">
                {activePreviewFood.name}
              </h3>
              <p className="text-[11px] text-pink-600 font-medium line-clamp-1">
                {activePreviewFood.description}
              </p>
            </div>
          </div>

          {/* Flavor tag */}
          {activePreviewFood.spicyLevel ? (
            <span className="shrink-0 flex items-center gap-0.5 bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
              <Flame className="w-3 h-3 text-red-500 fill-red-500" /> Spicy
            </span>
          ) : (
            <span className="shrink-0 flex items-center gap-0.5 bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
              <Volume2 className="w-3 h-3 text-purple-500" /> ASMR
            </span>
          )}
        </div>

        {/* Action Buttons */}
        {activePreviewFood.isUnlocked ? (
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onStartCooking(activePreviewFood)}
              className="py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all"
            >
              <UtensilsCrossed className="w-3.5 h-3.5" />
              <span>Cook in Kitchen</span>
            </button>
            <button
              onClick={() => onStartEating(activePreviewFood)}
              className="py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-extrabold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Direct Eat (ASMR)</span>
            </button>
          </div>
        ) : (
          <button
            onClick={() => handleUnlock(activePreviewFood)}
            disabled={coins < activePreviewFood.price}
            className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 active:scale-95 transition-all disabled:opacity-50"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Unlock Recipe for {activePreviewFood.price} Coins</span>
          </button>
        )}
      </div>
    </div>
  );
};
