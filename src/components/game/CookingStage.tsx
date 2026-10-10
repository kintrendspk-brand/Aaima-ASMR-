import React, { useState } from 'react';
import { FoodItem, GirlCharacter } from '../../types/game';
import { CuteGirl } from '../character/CuteGirl';
import { FoodArt } from '../food/FoodArt';
import { soundEngine } from '../../services/soundEngine';
import {
  ArrowLeft,
  Flame,
  Sparkles,
  CheckCircle2,
  Soup,
  Play,
  RotateCcw,
} from 'lucide-react';

interface Props {
  food: FoodItem;
  selectedCharacter: GirlCharacter;
  onFinishCooking: () => void;
  onBack: () => void;
  hasGoldenLadle?: boolean;
}

export const CookingStage: React.FC<Props> = ({
  food,
  selectedCharacter,
  onFinishCooking,
  onBack,
  hasGoldenLadle = false,
}) => {
  // Step index (0 to 3)
  const [step, setStep] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [isActionActive, setIsActionActive] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string>('Tap to prepare ingredients!');
  const [isCookingDone, setIsCookingDone] = useState<boolean>(false);

  // Define steps according to food's cooking style
  const getStepConfigs = () => {
    switch (food.cookingStyle) {
      case 'boil_noodles':
        return [
          {
            title: 'Step 1: Open Packet & Drop Noodles',
            instruction: 'Tap to unpack curly noodles and drop them into the pot!',
            actionLabel: 'Drop Noodles 🍜',
            icon: '📦',
            sound: () => soundEngine.playPacketTear(),
          },
          {
            title: 'Step 2: Boil & Simmer Water',
            instruction: 'Hold the flame button to boil the water with bubbling bubbles!',
            actionLabel: 'Hold to Boil 🔥',
            isHold: true,
            icon: '🔥',
            sound: () => soundEngine.playBoilingWater(1.2),
          },
          {
            title: 'Step 3: Pour Sauce & Seasonings',
            instruction: 'Tap repeatedly to drizzle savory seasoning & fragrant sauce!',
            actionLabel: 'Drizzle Sauce 🌶️',
            icon: '🧂',
            sound: () => soundEngine.playChop(),
          },
          {
            title: 'Step 4: Stir & Serve in Bowl',
            instruction: 'Tap or stir in circles to blend everything into a delicious bowl!',
            actionLabel: 'Stir & Plate ✨',
            icon: '🥣',
            sound: () => soundEngine.playStir(),
          },
        ];
      case 'fry_pan':
        return [
          {
            title: 'Step 1: Heat Pan & Coat with Oil',
            instruction: 'Tap to drizzle cooking oil onto the pastel skillet!',
            actionLabel: 'Pour Oil 🫗',
            icon: '🍳',
            sound: () => soundEngine.playClick(),
          },
          {
            title: 'Step 2: Place in Pan',
            instruction: 'Tap to drop food into the sizzling hot pan!',
            actionLabel: 'Place Food 🍗',
            icon: '🥢',
            sound: () => soundEngine.playFryingSizzle(1.2),
          },
          {
            title: 'Step 3: Sizzle & Flip',
            instruction: 'Hold the spatula button to fry until golden crispy!',
            actionLabel: 'Hold to Sizzle ♨️',
            isHold: true,
            icon: '🔥',
            sound: () => soundEngine.playFryingSizzle(1.6),
          },
          {
            title: 'Step 4: Plate with Sauce',
            instruction: 'Tap to transfer onto serving plate with dip!',
            actionLabel: 'Serve Dish 🍽️',
            icon: '✨',
            sound: () => soundEngine.playCoin(),
          },
        ];
      case 'assemble_burger':
        return [
          {
            title: 'Step 1: Place Toasted Bun',
            instruction: 'Tap to set down the warm bottom brioche bun!',
            actionLabel: 'Place Bun 🥖',
            icon: '🍞',
            sound: () => soundEngine.playClick(),
          },
          {
            title: 'Step 2: Add Juicy Patty & Cheese',
            instruction: 'Tap to stack the freshly grilled patty & melted cheese!',
            actionLabel: 'Add Patty 🥩',
            icon: '🧀',
            sound: () => soundEngine.playBurgerChew(),
          },
          {
            title: 'Step 3: Add Lettuce & Tomato',
            instruction: 'Tap to layer fresh crisp greens and juicy tomato slice!',
            actionLabel: 'Add Veggies 🥗',
            icon: '🍅',
            sound: () => soundEngine.playChop(),
          },
          {
            title: 'Step 4: Crown with Top Bun',
            instruction: 'Tap to top with sesame bun and press gently!',
            actionLabel: 'Complete Burger 🍔',
            icon: '✨',
            sound: () => soundEngine.playFanfare(),
          },
        ];
      case 'blend_drink':
        return [
          {
            title: 'Step 1: Add Ingredients',
            instruction: 'Tap to add ripe fruit, milk, and crystal ice cubes!',
            actionLabel: 'Add Fruits & Milk 🍓',
            icon: '🧊',
            sound: () => soundEngine.playClick(),
          },
          {
            title: 'Step 2: Blend & Whirl',
            instruction: 'Hold the blender switch to crush ice into a smooth shake!',
            actionLabel: 'Hold to Blend 🌀',
            isHold: true,
            icon: '🍹',
            sound: () => soundEngine.playBlender(1.8),
          },
          {
            title: 'Step 3: Pour into Glass',
            instruction: 'Tap to pour the frosty drink into the tall glass cup!',
            actionLabel: 'Pour Drink 🧋',
            icon: '🥛',
            sound: () => soundEngine.playDrinkSip(),
          },
          {
            title: 'Step 4: Add Toppings & Straw',
            instruction: 'Tap to pop in chewy boba pearls, cream, and rainbow straw!',
            actionLabel: 'Add Straw & Boba ⭐',
            icon: '✨',
            sound: () => soundEngine.playCoin(),
          },
        ];
      case 'open_snack':
      default:
        return [
          {
            title: 'Step 1: Tear Open Packaging',
            instruction: 'Tap to unseal the crinkly fresh snack bag!',
            actionLabel: 'Tear Bag ✂️',
            icon: '📦',
            sound: () => soundEngine.playPacketTear(),
          },
          {
            title: 'Step 2: Pour into Rainbow Bowl',
            instruction: 'Tap repeatedly to pour the crispy snacks into a cute bowl!',
            actionLabel: 'Pour Snacks 🥣',
            icon: '🍿',
            sound: () => soundEngine.playCrunchChips(),
          },
          {
            title: 'Step 3: Dust with Seasoning',
            instruction: 'Hold to sprinkle savory cheese and sea salt crystals!',
            actionLabel: 'Dust Salt 🧂',
            isHold: true,
            icon: '✨',
            sound: () => soundEngine.playChop(),
          },
          {
            title: 'Step 4: Ready to Crunch!',
            instruction: 'All set! Tap to bring this crunchy treat to the dining table!',
            actionLabel: 'Serve to Table 🍽️',
            icon: '🎉',
            sound: () => soundEngine.playCoin(),
          },
        ];
    }
  };

  const steps = getStepConfigs();
  const currentStepConfig = steps[step] || steps[steps.length - 1];

  const handleStepAction = () => {
    soundEngine.playClick();
    if (currentStepConfig.sound) {
      currentStepConfig.sound();
    }

    const nextProgress = progress + 34;
    if (nextProgress >= 100) {
      setProgress(100);
      setIsActionActive(true);
      setTimeout(() => {
        setIsActionActive(false);
        if (step < steps.length - 1) {
          setStep((prev) => prev + 1);
          setProgress(0);
          setFeedback('Great job! Continue to the next step.');
        } else {
          setIsCookingDone(true);
          soundEngine.playFanfare();
          soundEngine.playGirlGiggle();
          setFeedback('Delicious! Perfectly cooked and plated!');
        }
      }, 500);
    } else {
      setProgress(nextProgress);
      setFeedback('Keep going! Smells amazing!');
    }
  };

  // Hold action handler
  const handleHoldStart = () => {
    setIsActionActive(true);
    if (currentStepConfig.sound) {
      currentStepConfig.sound();
    }
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsActionActive(false);
            if (step < steps.length - 1) {
              setStep((s) => s + 1);
              setProgress(0);
              setFeedback('Nice sizzle! Onto the next step.');
            } else {
              setIsCookingDone(true);
              soundEngine.playFanfare();
              soundEngine.playGirlGiggle();
              setFeedback('Delicious! Finished cooking!');
            }
          }, 300);
          return 100;
        }
        return prev + 25;
      });
    }, 280);
  };

  return (
    <div className="relative w-full h-full min-h-screen flex flex-col justify-between p-4 select-none overflow-hidden bg-gradient-to-b from-amber-50 via-rose-50 to-pink-100">
      {/* Header Bar */}
      <div className="w-full flex items-center justify-between z-20">
        <button
          onClick={onBack}
          className="flex items-center gap-1 px-3 py-1.5 bg-white/90 hover:bg-white text-pink-700 text-xs font-bold rounded-full shadow-xs border border-pink-200 transition-all active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Kitchen</span>
        </button>

        <div className="text-center">
          <div className="text-xs text-pink-600 font-bold uppercase tracking-wider">
            Cooking Kitchen
          </div>
          <div className="font-extrabold text-sm text-purple-900 truncate max-w-[170px]">
            {food.name}
          </div>
        </div>

        {hasGoldenLadle && (
          <div className="flex items-center gap-1 bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-1 rounded-full border border-amber-300">
            <span>✨ Ladle +5</span>
          </div>
        )}
      </div>

      {/* Main Cooking Station */}
      <div className="flex-1 flex flex-col items-center justify-center my-auto relative z-10 w-full max-w-md mx-auto">
        {/* Step Progress Pills */}
        <div className="w-full flex items-center justify-center gap-2 mb-3">
          {steps.map((s, idx) => (
            <div
              key={idx}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx < step
                  ? 'w-7 bg-emerald-500'
                  : idx === step
                  ? 'w-10 bg-pink-500'
                  : 'w-5 bg-pink-200'
              }`}
            />
          ))}
        </div>

        {/* Cooking Surface Card */}
        <div className="w-full bg-white/90 rounded-3xl p-5 shadow-lg border-2 border-pink-200 flex flex-col items-center relative overflow-hidden backdrop-blur-xs">
          {/* Subtle Kitchen Tile Grid Decor */}
          <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#ec4899_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* Assistant Girl watching happily */}
          <div className="absolute top-2 right-2">
            <CuteGirl
              character={selectedCharacter}
              expression={isCookingDone ? 'super_happy' : isActionActive ? 'waving' : 'idle'}
              size="sm"
            />
          </div>

          {/* Current Step Instruction Banner */}
          <div className="w-full text-center pr-16 mb-2">
            <span className="text-[11px] font-extrabold text-pink-600 uppercase tracking-wider block">
              {currentStepConfig.title}
            </span>
            <p className="text-xs text-purple-800 font-semibold mt-0.5 leading-snug">
              {currentStepConfig.instruction}
            </p>
          </div>

          {/* Interactive Cooking Stage Visuals */}
          <div className="relative my-4 flex items-center justify-center">
            {/* Stove / Pot Base */}
            <div className="relative w-52 h-52 rounded-full bg-gradient-to-b from-pink-100 to-rose-200 p-3 shadow-inner flex items-center justify-center border-4 border-white">
              {/* Flame or Sizzle Glow if active */}
              {isActionActive && (
                <div className="absolute inset-0 rounded-full border-4 border-amber-400 animate-ping opacity-75 pointer-events-none" />
              )}

              {/* Boiling / Sizzling particles */}
              {isActionActive && (
                <div className="absolute -top-4 text-2xl animate-bounce">
                  ✨
                </div>
              )}

              {/* The Food Visual, evolving as steps progress */}
              <div className={`transition-transform duration-300 ${isActionActive ? 'animate-sizzle scale-105' : ''}`}>
                <FoodArt
                  food={food}
                  bitesRemaining={food.totalBites}
                  size="lg"
                  isCooking={!isCookingDone}
                  cookingStep={step}
                />
              </div>
            </div>
          </div>

          {/* Current Step Progress Bar */}
          <div className="w-full max-w-xs mt-1">
            <div className="flex justify-between text-[11px] font-bold text-purple-700 mb-1">
              <span>Step Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full h-3 bg-pink-100 rounded-full overflow-hidden border border-pink-200">
              <div
                className="h-full bg-gradient-to-r from-pink-400 to-rose-500 rounded-full transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-center text-[11px] text-pink-600 font-bold mt-1.5 italic">
              "{feedback}"
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Action Area */}
      <div className="w-full max-w-md mx-auto z-20 pb-2">
        {!isCookingDone ? (
          <div className="flex flex-col gap-2">
            {currentStepConfig.isHold ? (
              <button
                onMouseDown={handleHoldStart}
                onTouchStart={handleHoldStart}
                className="w-full py-4 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-extrabold text-base rounded-2xl shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform border-2 border-white/60"
              >
                <Flame className="w-5 h-5 fill-amber-200 text-amber-200" />
                <span>{currentStepConfig.actionLabel}</span>
              </button>
            ) : (
              <button
                onClick={handleStepAction}
                className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-extrabold text-base rounded-2xl shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform border-2 border-white/60"
              >
                <Sparkles className="w-5 h-5 text-amber-300 fill-amber-300" />
                <span>{currentStepConfig.actionLabel}</span>
              </button>
            )}
          </div>
        ) : (
          /* Finished Cooking Banner & Proceed to Eat Button */
          <div className="flex flex-col gap-2 animate-bounce">
            <button
              onClick={onFinishCooking}
              className="w-full py-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-extrabold text-lg rounded-2xl shadow-xl flex items-center justify-center gap-3 border-2 border-white/80 active:scale-95 transition-transform"
            >
              <CheckCircle2 className="w-6 h-6 text-white" />
              <span>Dish Ready! Go Eat ➔</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
