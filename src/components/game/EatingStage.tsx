import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { FoodItem, GirlCharacter } from '../../types/game';
import { CuteGirl, GirlExpression } from '../character/CuteGirl';
import { FoodArt } from '../food/FoodArt';
import { soundEngine } from '../../services/soundEngine';
import {
  ArrowLeft,
  RotateCcw,
  Sparkles,
  Trophy,
  Coins,
  Heart,
  Volume2,
} from 'lucide-react';

interface Props {
  food: FoodItem;
  selectedCharacter: GirlCharacter;
  onFinishMeal: (food: FoodItem) => void;
  onBackToMenu: () => void;
  onCookAgain: () => void;
  tableDecorId?: string;
}

export const EatingStage: React.FC<Props> = ({
  food,
  selectedCharacter,
  onFinishMeal,
  onBackToMenu,
  onCookAgain,
  tableDecorId,
}) => {
  const totalBites = food.totalBites || 5;
  const [bitesLeft, setBitesLeft] = useState<number>(totalBites);
  const [girlExpression, setGirlExpression] = useState<GirlExpression>('idle');
  const [isBiting, setIsBiting] = useState<boolean>(false);
  const [reactionText, setReactionText] = useState<string>('Tap the dish to feed me! 💕');
  const [mealFinished, setMealFinished] = useState<boolean>(false);
  const [floatingParticles, setFloatingParticles] = useState<{ id: number; text: string; x: number; y: number }[]>([]);

  // Cute quotes per food category
  const getHappyQuote = () => {
    switch (food.category) {
      case 'noodles':
        return ['So springy and delicious! 🍜', 'Best noodles ever! ✨', 'Mmm, that spicy kick! 🌶️', 'Super satisfying slurp! 💕'][Math.floor(Math.random() * 4)];
      case 'snacks':
        return ['The crunch is so crisp! 🥔', 'Unbelievable ASMR sound! 🎧', 'Melt-in-mouth yummy! ✨', 'So addictive! 🍿'][Math.floor(Math.random() * 4)];
      case 'fastfood':
        return ['Juicy and so flavorful! 🍔', 'Golden crispy goodness! 🍗', 'Cheesy perfection! 🧀', 'So satisfying! 🤤'][Math.floor(Math.random() * 4)];
      case 'desserts':
        return ['Sweet, fluffy heaven! 🍰', 'Melts like a dream! 🍓', 'Pure sugar happiness! 💖', 'So soft and creamy! 🧁'][Math.floor(Math.random() * 4)];
      case 'drinks':
        return ['So refreshing and cool! 🧋', 'Love the boba pearls! 🍹', 'Fruity and sweet! 🍓', 'Ahhh, so refreshing! 🥤'][Math.floor(Math.random() * 4)];
      default:
        return 'Yummy in my tummy! 💕';
    }
  };

  const handleBite = () => {
    if (isBiting || bitesLeft <= 0 || mealFinished) return;

    setIsBiting(true);
    setGirlExpression('mouth_open');
    setReactionText('Aaahh~ 👄');

    // Slight anticipation delay
    setTimeout(() => {
      // Play ASMR audio
      soundEngine.playAsmrSound(food.soundType);

      // Decrement portion
      const nextBites = bitesLeft - 1;
      setBitesLeft(nextBites);

      // Chewing animation
      setGirlExpression('chewing');
      setReactionText('Nom nom nom... 😋');

      // Spawn floating hearts
      const newParticle = {
        id: Date.now(),
        text: Math.random() > 0.5 ? '💖' : '✨',
        x: 45 + Math.random() * 10,
        y: 40 + Math.random() * 10,
      };
      setFloatingParticles((prev) => [...prev, newParticle]);

      // After chewing ends
      setTimeout(() => {
        setIsBiting(false);
        setFloatingParticles((prev) => prev.filter((p) => p.id !== newParticle.id));

        if (nextBites <= 0) {
          // Finished meal celebration!
          setMealFinished(true);
          setGirlExpression('super_happy');
          setReactionText('Oishii! All done! That was incredible! 🎉');
          soundEngine.playFanfare();
          soundEngine.playGirlGiggle();
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
          onFinishMeal(food);
        } else {
          setGirlExpression('yum_satisfaction');
          setReactionText(getHappyQuote());
          setTimeout(() => {
            setGirlExpression('idle');
          }, 1200);
        }
      }, 1000);
    }, 280);
  };

  const handleReplayMeal = () => {
    setBitesLeft(totalBites);
    setMealFinished(false);
    setGirlExpression('idle');
    setReactionText('Let’s eat again! So tasty! 😋');
    soundEngine.playClick();
  };

  return (
    <div className="relative w-full h-full min-h-screen flex flex-col justify-between p-4 select-none overflow-hidden bg-gradient-to-b from-purple-100 via-pink-100 to-amber-50">
      {/* Top Header */}
      <div className="w-full flex items-center justify-between z-20">
        <button
          onClick={onBackToMenu}
          className="flex items-center gap-1 px-3 py-1.5 bg-white/90 hover:bg-white text-purple-700 text-xs font-bold rounded-full shadow-xs border border-purple-200 transition-all active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Menu</span>
        </button>

        {/* Meal Info Badge */}
        <div className="text-center bg-white/80 px-3 py-1 rounded-full border border-pink-200 shadow-xs backdrop-blur-xs">
          <div className="text-xs font-bold text-pink-700 truncate max-w-[150px]">
            {food.name}
          </div>
        </div>

        {/* Replay Sound Button */}
        <button
          onClick={handleReplayMeal}
          className="flex items-center gap-1 px-3 py-1.5 bg-white/90 hover:bg-white text-pink-600 text-xs font-bold rounded-full shadow-xs border border-pink-200 transition-all active:scale-95"
          title="Restart Meal to hear sounds again"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Refill</span>
        </button>
      </div>

      {/* Eating Scene Center */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 w-full max-w-md mx-auto my-auto">
        {/* Girl Reaction Bubble */}
        <div className="bg-white/95 px-4 py-2 rounded-2xl rounded-bl-none border border-pink-300 shadow-md mb-2 animate-float max-w-xs text-center">
          <p className="text-xs font-extrabold text-purple-800">
            {reactionText}
          </p>
        </div>

        {/* Seated Girl Display */}
        <div className="relative flex flex-col items-center">
          <CuteGirl
            character={selectedCharacter}
            expression={girlExpression}
            size="xl"
            onClick={handleBite}
          />
        </div>

        {/* Dining Table Surface */}
        <div className="w-full -mt-10 bg-gradient-to-r from-pink-200 via-purple-100 to-pink-200 rounded-3xl p-4 shadow-xl border-t-4 border-pink-300 flex flex-col items-center relative">
          {/* Tablecloth Pattern Overlay */}
          <div className="absolute inset-0 rounded-3xl bg-[radial-gradient(#ec4899_1.5px,transparent_1.5px)] [background-size:20px_20px] opacity-10 pointer-events-none" />

          {/* Table Decor Companion (e.g. plushie or flower) */}
          {tableDecorId === 'decor_cherry_blossom' && (
            <div className="absolute left-4 top-2 text-2xl animate-float">
              🌸
            </div>
          )}
          {tableDecorId === 'decor_kawaii_bear' && (
            <div className="absolute right-4 top-2 text-2xl animate-bounce">
              🧸
            </div>
          )}

          {/* Centered Food on Table */}
          <div
            onClick={handleBite}
            className="cursor-pointer group relative flex flex-col items-center transition-transform hover:scale-105 active:scale-95"
            title="Tap to feed a delicious bite!"
          >
            <FoodArt
              food={food}
              bitesRemaining={bitesLeft}
              size="lg"
            />

            {!mealFinished && (
              <div className="mt-1 flex items-center gap-1.5 bg-white/90 text-pink-600 text-xs font-extrabold px-3 py-1 rounded-full shadow-md border border-pink-300 group-hover:bg-pink-50">
                <Volume2 className="w-3.5 h-3.5" />
                <span>Tap to Feed Bite!</span>
              </div>
            )}
          </div>

          {/* Meal Progress Tracker */}
          <div className="w-full max-w-xs mt-3">
            <div className="flex justify-between items-center text-xs font-bold text-purple-800 mb-1">
              <span>Portion Remaining</span>
              <span>
                {bitesLeft} / {totalBites} Bites
              </span>
            </div>
            {/* Bite indicator dots */}
            <div className="flex gap-1.5 justify-center">
              {Array.from({ length: totalBites }).map((_, idx) => (
                <div
                  key={idx}
                  className={`h-2.5 flex-1 rounded-full transition-all duration-300 ${
                    idx < bitesLeft
                      ? 'bg-pink-500 shadow-xs'
                      : 'bg-pink-200 opacity-50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Sparkles & Hearts */}
      {floatingParticles.map((p) => (
        <div
          key={p.id}
          className="pointer-events-none fixed animate-ping text-3xl z-40"
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
        >
          {p.text}
        </div>
      ))}

      {/* Bottom Action Footer */}
      <div className="w-full max-w-md mx-auto z-20 pb-2">
        {!mealFinished ? (
          <button
            onClick={handleBite}
            disabled={isBiting}
            className={`w-full py-4 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-extrabold text-base rounded-2xl shadow-lg flex items-center justify-center gap-2 border-2 border-white/60 active:scale-95 transition-transform ${
              isBiting ? 'opacity-80 scale-98' : ''
            }`}
          >
            <Sparkles className="w-5 h-5 text-amber-300 fill-amber-300" />
            <span>{isBiting ? 'Chewing happily... 🎧' : 'Feed Next Bite (Listen ASMR)'}</span>
          </button>
        ) : (
          /* Finished Meal Modal / Card */
          <div className="bg-white/95 rounded-3xl p-4 shadow-xl border-2 border-pink-300 flex flex-col items-center gap-3 animate-fade-in">
            <div className="flex items-center gap-2 text-amber-600 font-extrabold text-base">
              <Trophy className="w-6 h-6 text-amber-500 fill-amber-400" />
              <span>Meal Complete! +35 Coins!</span>
            </div>
            <p className="text-xs text-purple-700 font-medium text-center">
              {selectedCharacter.name} loved every single bite! The sounds were so relaxing!
            </p>
            <div className="w-full grid grid-cols-2 gap-2">
              <button
                onClick={handleReplayMeal}
                className="py-3 bg-pink-100 hover:bg-pink-200 text-pink-700 font-bold text-xs rounded-xl border border-pink-300 flex items-center justify-center gap-1.5 active:scale-95 transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Eat Again</span>
              </button>
              <button
                onClick={onCookAgain}
                className="py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 active:scale-95 transition-all"
              >
                <span>Cook New Dish ➔</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
