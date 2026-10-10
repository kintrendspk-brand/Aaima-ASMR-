import React, { useState } from 'react';
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
  Volume2,
  Utensils,
  Flame,
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
  const [isLiftingBite, setIsLiftingBite] = useState<boolean>(false);
  const [isBiting, setIsBiting] = useState<boolean>(false);
  const [reactionText, setReactionText] = useState<string>('Tap the dish or button to feed me! 💕');
  const [mealFinished, setMealFinished] = useState<boolean>(false);
  const [floatingParticles, setFloatingParticles] = useState<{ id: number; text: string; x: number; y: number }[]>([]);

  const isNoodle = food.category === 'noodles';
  const isSpicyRed = isNoodle && (food.id.includes('spicy') || food.id.includes('fire') || food.id.includes('chili'));
  const isBrownNoodle = isNoodle && (food.id.includes('brown') || food.id.includes('sesame'));

  const getHappyQuote = () => {
    if (isSpicyRed) {
      return ['Super fiery and so flavorful! 🌶️', 'Mmm! The spicy red chili kicks in! 🔥', 'So addictive, I love spicy food! 💕'][Math.floor(Math.random() * 3)];
    }
    if (isBrownNoodle) {
      return ['Rich dark savory soy glaze! 🥢', 'Deep, fragrant black bean flavor! ✨', 'So silky and chewy! 🍜'][Math.floor(Math.random() * 3)];
    }
    switch (food.category) {
      case 'noodles':
        return ['The springy noodles are heavenly! 🍜', 'Best ramen in the world! ✨', 'Super satisfying slurp! 💕'][Math.floor(Math.random() * 3)];
      case 'snacks':
        return ['That crunch is so crisp! 🥔', 'Unbelievable ASMR sound! 🎧', 'Melt-in-mouth goodness! ✨'][Math.floor(Math.random() * 3)];
      case 'fastfood':
        return ['Juicy and so flavorful! 🍔', 'Golden crispy perfection! 🍗', 'Cheesy goodness! 🧀'][Math.floor(Math.random() * 3)];
      case 'desserts':
        return ['Fluffy, sweet dream! 🍰', 'Melts like silk on my tongue! 🍓', 'Pure dessert bliss! 💖'][Math.floor(Math.random() * 3)];
      case 'drinks':
        return ['So frosty and refreshing! 🧋', 'Love the chewy boba pearls! 🍹', 'Fruity and sweet! 🍓'][Math.floor(Math.random() * 3)];
      default:
        return 'Yummy in my tummy! 💕';
    }
  };

  const handleBite = () => {
    if (isBiting || bitesLeft <= 0 || mealFinished) return;

    setIsBiting(true);
    setIsLiftingBite(true);

    // 1. Anticipation: Girl opens mouth wide ("Aaahh~")
    setGirlExpression('mouth_open');
    setReactionText(isNoodle ? 'Lifting noodles... Aaahh~ 👄' : 'Aaahh~ 👄');

    // 2. Feed bite moves towards mouth
    setTimeout(() => {
      // Play Food-Specific ASMR audio
      if (isSpicyRed) {
        soundEngine.playNoodleSlurp('spicy');
      } else if (isBrownNoodle) {
        soundEngine.playNoodleSlurp('brown');
      } else if (isNoodle) {
        soundEngine.playNoodleSlurp('mild');
      } else {
        soundEngine.playAsmrSound(food.soundType);
      }

      // Decrement food portion visibly
      const nextBites = bitesLeft - 1;
      setBitesLeft(nextBites);

      // Slurping / Crunching state
      if (isNoodle) {
        setGirlExpression('slurping');
        setReactionText('Slurrrrpppp! 🍜');
      } else {
        setGirlExpression('chewing');
        setReactionText('Crunch crunch nom nom... 😋');
      }

      // Floating heart particle
      const newParticle = {
        id: Date.now(),
        text: Math.random() > 0.4 ? '💖' : '✨',
        x: 44 + Math.random() * 12,
        y: 38 + Math.random() * 10,
      };
      setFloatingParticles((prev) => [...prev, newParticle]);

      // 3. Chewing phase
      setTimeout(() => {
        setIsLiftingBite(false);
        setGirlExpression('chewing');
        setReactionText('Masticating happily... 😋');

        // 4. Swallow phase
        setTimeout(() => {
          soundEngine.playGirlYum();

          // If spicy noodles, cute heat fanning reaction!
          if (isSpicyRed && Math.random() > 0.3) {
            setGirlExpression('spicy_reaction');
            setReactionText('Haaah! That chili has a spicy kick! 🔥');
            setTimeout(() => {
              finishBiteCycle(nextBites);
            }, 1200);
          } else {
            setGirlExpression('yum_satisfaction');
            setReactionText(getHappyQuote());
            setTimeout(() => {
              finishBiteCycle(nextBites);
            }, 1000);
          }
        }, 800);
      }, 700);
    }, 350);
  };

  const finishBiteCycle = (remainingBites: number) => {
    setIsBiting(false);
    setFloatingParticles([]);

    if (remainingBites <= 0) {
      // Finished Meal Celebration
      setMealFinished(true);
      setGirlExpression('super_happy');
      setReactionText('Oishii! Finished every single drop! That was amazing! 🎉');
      soundEngine.playFanfare();
      soundEngine.playGirlGiggle();
      confetti({
        particleCount: 85,
        spread: 75,
        origin: { y: 0.6 },
      });
      onFinishMeal(food);
    } else {
      setGirlExpression('idle');
    }
  };

  const handleReplayMeal = () => {
    setBitesLeft(totalBites);
    setMealFinished(false);
    setIsLiftingBite(false);
    setIsBiting(false);
    setGirlExpression('idle');
    setReactionText('Fresh portion prepared! Let’s eat again! 😋');
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

        {/* Dish Badge */}
        <div className="text-center bg-white/85 px-3 py-1 rounded-full border border-pink-200 shadow-xs backdrop-blur-xs flex items-center gap-1.5">
          {isSpicyRed ? (
            <Flame className="w-3.5 h-3.5 text-red-500 fill-red-500" />
          ) : (
            <Utensils className="w-3.5 h-3.5 text-purple-500" />
          )}
          <span className="text-xs font-bold text-purple-900 truncate max-w-[150px]">
            {food.name}
          </span>
        </div>

        {/* Refill Button */}
        <button
          onClick={handleReplayMeal}
          className="flex items-center gap-1 px-3 py-1.5 bg-white/90 hover:bg-white text-pink-600 text-xs font-bold rounded-full shadow-xs border border-pink-200 transition-all active:scale-95"
          title="Refill dish to hear ASMR sounds again"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Refill</span>
        </button>
      </div>

      {/* Main Dining Stage */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 w-full max-w-md mx-auto my-auto">
        {/* Dialogue Bubble */}
        <div className="bg-white/95 px-4 py-2 rounded-2xl rounded-bl-none border border-pink-300 shadow-md mb-2 animate-float max-w-xs text-center backdrop-blur-xs">
          <p className="text-xs font-extrabold text-purple-800">
            {reactionText}
          </p>
        </div>

        {/* Seated Girl Behind Table */}
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
          <div className="absolute inset-0 rounded-3xl bg-[radial-gradient(#ec4899_1.5px,transparent_1.5px)] [background-size:20px_20px] opacity-10 pointer-events-none" />

          {/* Table Decors */}
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
            title="Tap dish to feed a delicious portion!"
          >
            <FoodArt
              food={food}
              bitesRemaining={bitesLeft}
              size="lg"
              isLiftingBite={isLiftingBite}
            />

            {!mealFinished && (
              <div className="mt-1 flex items-center gap-1.5 bg-white/90 text-pink-600 text-xs font-extrabold px-3 py-1 rounded-full shadow-md border border-pink-300 group-hover:bg-pink-50">
                <Volume2 className="w-3.5 h-3.5" />
                <span>
                  {isNoodle ? 'Tap to Slurp Noodles! 🍜' : 'Tap to Feed Bite! 🎧'}
                </span>
              </div>
            )}
          </div>

          {/* Remaining Portion Tracker */}
          <div className="w-full max-w-xs mt-3">
            <div className="flex justify-between items-center text-xs font-bold text-purple-800 mb-1">
              <span>Portion Remaining</span>
              <span>
                {bitesLeft} / {totalBites} {isNoodle ? 'Slurps' : 'Bites'}
              </span>
            </div>
            {/* Dot Progress Indicators */}
            <div className="flex gap-1.5 justify-center">
              {Array.from({ length: totalBites }).map((_, idx) => (
                <div
                  key={idx}
                  className={`h-2.5 flex-1 rounded-full transition-all duration-300 ${
                    idx < bitesLeft
                      ? isSpicyRed
                        ? 'bg-red-500 shadow-xs'
                        : isBrownNoodle
                        ? 'bg-amber-800 shadow-xs'
                        : 'bg-pink-500 shadow-xs'
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

      {/* Action Footer */}
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
            <span>
              {isBiting
                ? isNoodle
                  ? 'Slurping & Chewing... 🎧'
                  : 'Chewing happily... 🎧'
                : isNoodle
                ? 'Lift & Slurp Noodles (Listen ASMR)'
                : 'Feed Next Bite (Listen ASMR)'}
            </span>
          </button>
        ) : (
          /* Finished Meal Modal / Card */
          <div className="bg-white/95 rounded-3xl p-4 shadow-xl border-2 border-pink-300 flex flex-col items-center gap-3 animate-fade-in">
            <div className="flex items-center gap-2 text-amber-600 font-extrabold text-base">
              <Trophy className="w-6 h-6 text-amber-500 fill-amber-400" />
              <span>Meal Complete! +35 Coins!</span>
            </div>
            <p className="text-xs text-purple-700 font-medium text-center">
              {selectedCharacter.name} loved every single bite! The sounds were so relaxing and delicious!
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
