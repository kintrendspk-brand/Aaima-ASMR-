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
  Droplets,
  PackageOpen,
  Utensils,
  Soup,
} from 'lucide-react';

interface Props {
  food: FoodItem;
  selectedCharacter: GirlCharacter;
  onFinishCooking: () => void;
  onBack: () => void;
  hasGoldenLadle?: boolean;
}

interface CookingStepDetail {
  stepNum: number;
  title: string;
  instruction: string;
  actionLabel: string;
  icon: string;
  isHold?: boolean;
  onAction?: () => void;
  visualStage: string;
}

export const CookingStage: React.FC<Props> = ({
  food,
  selectedCharacter,
  onFinishCooking,
  onBack,
  hasGoldenLadle = false,
}) => {
  const isSpicyRed = food.id.includes('spicy') || food.id.includes('fire') || food.id.includes('chili');
  const isBrownNoodle = food.id.includes('brown') || food.id.includes('sesame');

  // Build steps according to specific food type
  const getSteps = (): CookingStepDetail[] => {
    // 1. SPICY RED NOODLES (Detailed 12-Step Authentic Sequence!)
    if (food.category === 'noodles' && isSpicyRed) {
      return [
        {
          stepNum: 1,
          title: 'Step 1: Open Noodle Packet',
          instruction: 'Tear open the spicy ramen foil packaging!',
          actionLabel: 'Tear Packet ✂️',
          icon: '📦',
          visualStage: 'packet_closed',
          onAction: () => soundEngine.playPacketTear(),
        },
        {
          stepNum: 2,
          title: 'Step 2: Unpack Dry Noodles',
          instruction: 'Take out the golden uncooked curly noodle block!',
          actionLabel: 'Unpack Noodles 🍜',
          icon: '🥢',
          visualStage: 'dry_noodles_out',
          onAction: () => soundEngine.playClick(),
        },
        {
          stepNum: 3,
          title: 'Step 3: Pour Fresh Water',
          instruction: 'Pour clear water from the pitcher into the cooking pot!',
          actionLabel: 'Fill Pot with Water 🫗',
          icon: '💧',
          visualStage: 'pot_filling',
          onAction: () => soundEngine.playDrinkSip(),
        },
        {
          stepNum: 4,
          title: 'Step 4: Turn On Stove Flame',
          instruction: 'Ignite the stove flame to heat up the pot!',
          actionLabel: 'Ignite Stove 🔥',
          icon: '🔥',
          visualStage: 'stove_heating',
          onAction: () => soundEngine.playClick(),
        },
        {
          stepNum: 5,
          title: 'Step 5: Boil Water & Steam',
          instruction: 'Hold the heat button until the water bubbles with steam!',
          actionLabel: 'Hold to Boil Water ♨️',
          isHold: true,
          icon: '♨️',
          visualStage: 'water_boiling',
          onAction: () => soundEngine.playBoilingWater(1.4),
        },
        {
          stepNum: 6,
          title: 'Step 6: Drop Noodles into Pot',
          instruction: 'Carefully drop the curly noodle block into the bubbling water!',
          actionLabel: 'Drop Noodles In 🍜',
          icon: '🍲',
          visualStage: 'noodles_in_pot',
          onAction: () => soundEngine.playBoilingWater(1.0),
        },
        {
          stepNum: 7,
          title: 'Step 7: Stir Noodles with Chopsticks',
          instruction: 'Stir in circles to loosen and cook the wavy strands!',
          actionLabel: 'Stir with Chopsticks 🥢',
          icon: '🥢',
          visualStage: 'noodles_stirring',
          onAction: () => soundEngine.playStir(),
        },
        {
          stepNum: 8,
          title: 'Step 8: Add Red Spicy Seasoning',
          instruction: 'Sprinkle red chili seasoning powder packet over the noodles!',
          actionLabel: 'Sprinkle Spicy Powder 🌶️',
          icon: '🧂',
          visualStage: 'seasoning_added',
          onAction: () => soundEngine.playChop(),
        },
        {
          stepNum: 9,
          title: 'Step 9: Drizzle Chili Oil & Sauce',
          instruction: 'Pour the fiery red chili oil and spicy volcano sauce!',
          actionLabel: 'Drizzle Chili Oil 🌶️',
          icon: '🫗',
          visualStage: 'sauce_poured',
          onAction: () => soundEngine.playClick(),
        },
        {
          stepNum: 10,
          title: 'Step 10: Stir until Glossy & Fiery',
          instruction: 'Mix well until the noodles turn rich crimson red!',
          actionLabel: 'Blend Red Sauce ✨',
          icon: '🥢',
          visualStage: 'noodles_cooked_red',
          onAction: () => soundEngine.playStir(),
        },
        {
          stepNum: 11,
          title: 'Step 11: Transfer to Serving Bowl',
          instruction: 'Pour the hot spicy noodles into a cute ceramic bowl!',
          actionLabel: 'Transfer to Bowl 🥣',
          icon: '🥣',
          visualStage: 'plated_in_bowl',
          onAction: () => soundEngine.playCoin(),
        },
        {
          stepNum: 12,
          title: 'Step 12: Add Egg & Garnish',
          instruction: 'Top with a soft-boiled egg, fresh scallions, and toasted sesame!',
          actionLabel: 'Add Garnish & Serve! 🥚',
          icon: '✨',
          visualStage: 'garnish_finished',
          onAction: () => soundEngine.playFanfare(),
        },
      ];
    }

    // 2. BROWN SOY / BLACK BEAN NOODLES (Distinct Recipe & Visuals)
    if (food.category === 'noodles' && isBrownNoodle) {
      return [
        {
          stepNum: 1,
          title: 'Step 1: Open Noodle Pack',
          instruction: 'Unpack the fresh chewy ramen noodles!',
          actionLabel: 'Open Noodle Pack 📦',
          icon: '📦',
          visualStage: 'packet_closed',
          onAction: () => soundEngine.playPacketTear(),
        },
        {
          stepNum: 2,
          title: 'Step 2: Boil Pot of Water',
          instruction: 'Hold to boil bubbling hot water on the stove!',
          actionLabel: 'Hold to Boil Water 🔥',
          isHold: true,
          icon: '🔥',
          visualStage: 'water_boiling',
          onAction: () => soundEngine.playBoilingWater(1.3),
        },
        {
          stepNum: 3,
          title: 'Step 3: Drop Noodles & Simmer',
          instruction: 'Add chewy noodles and let them simmer until tender!',
          actionLabel: 'Add Noodles 🍜',
          icon: '🍲',
          visualStage: 'noodles_in_pot',
          onAction: () => soundEngine.playStir(),
        },
        {
          stepNum: 4,
          title: 'Step 4: Pour Dark Soy Glaze',
          instruction: 'Pour rich, glossy dark soy and black bean sauce!',
          actionLabel: 'Pour Dark Soy Sauce 🫗',
          icon: '🥣',
          visualStage: 'sauce_poured',
          onAction: () => soundEngine.playClick(),
        },
        {
          stepNum: 5,
          title: 'Step 5: Stir into Glossy Brown',
          instruction: 'Stir evenly until all noodle strands absorb the dark sauce!',
          actionLabel: 'Stir Soy Noodles 🥢',
          icon: '🥢',
          visualStage: 'noodles_cooked_brown',
          onAction: () => soundEngine.playStir(),
        },
        {
          stepNum: 6,
          title: 'Step 6: Plate & Garnish',
          instruction: 'Plate into a deep ceramic bowl with toasted sesame seeds and greens!',
          actionLabel: 'Serve Brown Noodles! ✨',
          icon: '✨',
          visualStage: 'garnish_finished',
          onAction: () => soundEngine.playFanfare(),
        },
      ];
    }

    // 3. CLASSIC NOODLES (Instant / Creamy / Veggie)
    if (food.category === 'noodles') {
      return [
        {
          stepNum: 1,
          title: 'Step 1: Unpack Noodles',
          instruction: 'Tear open the noodle packet and drop noodles into pot!',
          actionLabel: 'Unpack Noodles 🍜',
          icon: '📦',
          visualStage: 'noodles_in_pot',
          onAction: () => soundEngine.playPacketTear(),
        },
        {
          stepNum: 2,
          title: 'Step 2: Boil & Simmer',
          instruction: 'Hold the flame button to cook in simmering broth!',
          actionLabel: 'Hold to Simmer 🔥',
          isHold: true,
          icon: '🔥',
          visualStage: 'water_boiling',
          onAction: () => soundEngine.playBoilingWater(1.3),
        },
        {
          stepNum: 3,
          title: 'Step 3: Add Savory Broth & Toppings',
          instruction: 'Pour aromatic seasoning broth and stir gently!',
          actionLabel: 'Pour Broth & Stir 🍲',
          icon: '🥢',
          visualStage: 'sauce_poured',
          onAction: () => soundEngine.playStir(),
        },
        {
          stepNum: 4,
          title: 'Step 4: Plate and Serve',
          instruction: 'Pour into serving bowl with fresh scallions and egg!',
          actionLabel: 'Serve in Bowl ✨',
          icon: '🥣',
          visualStage: 'garnish_finished',
          onAction: () => soundEngine.playFanfare(),
        },
      ];
    }

    // 4. FAST FOOD: BURGERS
    if (food.cookingStyle === 'assemble_burger') {
      return [
        {
          stepNum: 1,
          title: 'Step 1: Lay Warm Brioche Bun',
          instruction: 'Place toasted bottom bun on the wooden prep board!',
          actionLabel: 'Place Bun 🥖',
          icon: '🍞',
          visualStage: 'bun_base',
          onAction: () => soundEngine.playClick(),
        },
        {
          stepNum: 2,
          title: 'Step 2: Add Juicy Patty & Melted Cheese',
          instruction: 'Layer the grilled beef patty and thick cheddar cheese slice!',
          actionLabel: 'Add Patty & Cheese 🥩',
          icon: '🧀',
          visualStage: 'patty_cheese',
          onAction: () => soundEngine.playBurgerChew(),
        },
        {
          stepNum: 3,
          title: 'Step 3: Add Fresh Crisp Veggies',
          instruction: 'Stack crisp green lettuce and ripe ruby tomato slices!',
          actionLabel: 'Add Lettuce & Tomato 🥗',
          icon: '🍅',
          visualStage: 'veggies_added',
          onAction: () => soundEngine.playChop(),
        },
        {
          stepNum: 4,
          title: 'Step 4: Crown with Sesame Top Bun',
          instruction: 'Place the golden sesame seed bun on top and press gently!',
          actionLabel: 'Finish Deluxe Burger 🍔',
          icon: '✨',
          visualStage: 'garnish_finished',
          onAction: () => soundEngine.playFanfare(),
        },
      ];
    }

    // 5. FRYING PAN (Fries, Fried Chicken, Nuggets, Spring Rolls)
    if (food.cookingStyle === 'fry_pan') {
      return [
        {
          stepNum: 1,
          title: 'Step 1: Coat Skillet with Oil',
          instruction: 'Pour golden vegetable oil onto the hot pastel skillet!',
          actionLabel: 'Pour Oil 🫗',
          icon: '🍳',
          visualStage: 'oil_poured',
          onAction: () => soundEngine.playClick(),
        },
        {
          stepNum: 2,
          title: 'Step 2: Place in Hot Pan',
          instruction: 'Drop items into the hot oil with tongs!',
          actionLabel: 'Place Food in Pan 🍗',
          icon: '🥢',
          visualStage: 'placed_in_pan',
          onAction: () => soundEngine.playFryingSizzle(1.2),
        },
        {
          stepNum: 3,
          title: 'Step 3: Sizzle & Golden Flip',
          instruction: 'Hold the spatula button to fry until golden crunchy!',
          actionLabel: 'Hold to Sizzle & Fry ♨️',
          isHold: true,
          icon: '🔥',
          visualStage: 'sizzling_fried',
          onAction: () => soundEngine.playFryingSizzle(1.6),
        },
        {
          stepNum: 4,
          title: 'Step 4: Plate with Dip',
          instruction: 'Drain crispy items onto serving plate with dip sauce!',
          actionLabel: 'Serve Dish 🍽️',
          icon: '✨',
          visualStage: 'garnish_finished',
          onAction: () => soundEngine.playFanfare(),
        },
      ];
    }

    // 6. BLEND DRINKS (Milkshakes, Smoothies, Boba)
    if (food.cookingStyle === 'blend_drink') {
      return [
        {
          stepNum: 1,
          title: 'Step 1: Add Fruits, Milk & Ice',
          instruction: 'Drop fresh fruits, sweet cream, and ice cubes into blender!',
          actionLabel: 'Add Ingredients 🍓',
          icon: '🧊',
          visualStage: 'blender_ingredients',
          onAction: () => soundEngine.playClick(),
        },
        {
          stepNum: 2,
          title: 'Step 2: Blend & Whirl',
          instruction: 'Hold the blender switch to crush ice into a smooth frosty shake!',
          actionLabel: 'Hold to Blend 🌀',
          isHold: true,
          icon: '🍹',
          visualStage: 'blender_whirring',
          onAction: () => soundEngine.playBlender(1.8),
        },
        {
          stepNum: 3,
          title: 'Step 3: Pour into Tall Glass',
          instruction: 'Pour the frosty smoothie into the glass cup!',
          actionLabel: 'Pour Drink 🧋',
          icon: '🥛',
          visualStage: 'poured_in_glass',
          onAction: () => soundEngine.playDrinkSip(),
        },
        {
          stepNum: 4,
          title: 'Step 4: Add Boba Pearls & Straw',
          instruction: 'Pop in colorful chewy boba pearls and rainbow straw!',
          actionLabel: 'Add Straw & Boba ⭐',
          icon: '✨',
          visualStage: 'garnish_finished',
          onAction: () => soundEngine.playFanfare(),
        },
      ];
    }

    // 7. OPEN SNACKS (Chips, Crackers, Popcorn, Jelly)
    return [
      {
        stepNum: 1,
        title: 'Step 1: Tear Open Packaging',
        instruction: 'Tear open the crinkly fresh foil snack bag!',
        actionLabel: 'Tear Bag ✂️',
        icon: '📦',
        visualStage: 'packet_closed',
        onAction: () => soundEngine.playPacketTear(),
      },
      {
        stepNum: 2,
        title: 'Step 2: Pour into Rainbow Bowl',
        instruction: 'Pour the crispy snack pieces into a cute bowl!',
        actionLabel: 'Pour into Bowl 🥣',
        icon: '🍿',
        visualStage: 'sauce_poured',
        onAction: () => soundEngine.playCrunchChips(),
      },
      {
        stepNum: 3,
        title: 'Step 3: Dust with Seasoning',
        instruction: 'Hold to sprinkle savory seasoning and sea salt crystals!',
        actionLabel: 'Dust Seasoning 🧂',
        isHold: true,
        icon: '✨',
        visualStage: 'noodles_cooked_red',
        onAction: () => soundEngine.playChop(),
      },
      {
        stepNum: 4,
        title: 'Step 4: Ready to Crunch!',
        instruction: 'All set! Bring this crunchy treat to the dining table!',
        actionLabel: 'Serve to Table 🍽️',
        icon: '🎉',
        visualStage: 'garnish_finished',
        onAction: () => soundEngine.playFanfare(),
      },
    ];
  };

  const steps = getSteps();
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [stepProgress, setStepProgress] = useState<number>(0);
  const [isActionActive, setIsActionActive] = useState<boolean>(false);
  const [isCookingDone, setIsCookingDone] = useState<boolean>(false);

  const currentStep = steps[currentStepIdx] || steps[steps.length - 1];

  const handleTapAction = () => {
    if (isCookingDone) return;
    if (currentStep.onAction) currentStep.onAction();

    const nextProgress = stepProgress + 40;
    if (nextProgress >= 100) {
      setStepProgress(100);
      setIsActionActive(true);
      setTimeout(() => {
        setIsActionActive(false);
        if (currentStepIdx < steps.length - 1) {
          setCurrentStepIdx((prev) => prev + 1);
          setStepProgress(0);
        } else {
          setIsCookingDone(true);
          soundEngine.playFanfare();
          soundEngine.playGirlGiggle();
        }
      }, 400);
    } else {
      setStepProgress(nextProgress);
    }
  };

  const handleHoldStart = () => {
    if (isCookingDone) return;
    setIsActionActive(true);
    if (currentStep.onAction) currentStep.onAction();

    const interval = setInterval(() => {
      setStepProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsActionActive(false);
            if (currentStepIdx < steps.length - 1) {
              setCurrentStepIdx((s) => s + 1);
              setStepProgress(0);
            } else {
              setIsCookingDone(true);
              soundEngine.playFanfare();
              soundEngine.playGirlGiggle();
            }
          }, 350);
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
          <div className="text-[10px] text-pink-600 font-extrabold uppercase tracking-wider">
            Cooking Kitchen
          </div>
          <div className="font-extrabold text-sm text-purple-900 truncate max-w-[170px]">
            {food.name}
          </div>
        </div>

        {hasGoldenLadle ? (
          <div className="flex items-center gap-1 bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-1 rounded-full border border-amber-300">
            <span>✨ Golden +5</span>
          </div>
        ) : (
          <div className="text-xs font-extrabold text-purple-700 bg-white/80 px-2.5 py-1 rounded-full border border-pink-200">
            {currentStepIdx + 1}/{steps.length}
          </div>
        )}
      </div>

      {/* Main Kitchen Preparation Station */}
      <div className="flex-1 flex flex-col items-center justify-center my-auto relative z-10 w-full max-w-md mx-auto">
        {/* Step Progress Indicators */}
        <div className="w-full flex items-center justify-center gap-1 mb-2.5 max-w-xs overflow-x-auto">
          {steps.map((s, idx) => (
            <div
              key={idx}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx < currentStepIdx
                  ? 'w-4 bg-emerald-500'
                  : idx === currentStepIdx
                  ? 'w-7 bg-pink-500'
                  : 'w-2 bg-pink-200'
              }`}
            />
          ))}
        </div>

        {/* Cooking Worktop Card */}
        <div className="w-full bg-white/95 rounded-3xl p-4 shadow-lg border-2 border-pink-200 flex flex-col items-center relative overflow-hidden backdrop-blur-xs">
          {/* Assistant Companion Girl cheering */}
          <div className="absolute top-2 right-2">
            <CuteGirl
              character={selectedCharacter}
              expression={isCookingDone ? 'super_happy' : isActionActive ? 'waving' : 'idle'}
              size="sm"
            />
          </div>

          {/* Step Banner */}
          <div className="w-full text-center pr-16 mb-2">
            <span className="text-[11px] font-extrabold text-pink-600 uppercase tracking-wide block">
              {currentStep.title}
            </span>
            <p className="text-xs text-purple-900 font-bold mt-0.5 leading-snug">
              {currentStep.instruction}
            </p>
          </div>

          {/* Interactive Cooking Pot / Pan Visuals */}
          <div className="relative my-3 flex items-center justify-center">
            {/* Stove Burner Glow */}
            <div className="relative w-48 h-48 rounded-full bg-gradient-to-b from-pink-100 to-rose-200 p-2 shadow-inner flex items-center justify-center border-4 border-white">
              {/* Active Flame Ring */}
              {isActionActive && (
                <div className="absolute inset-0 rounded-full border-4 border-amber-400 animate-ping opacity-60 pointer-events-none" />
              )}

              {/* Steam Particles */}
              {isActionActive && (
                <div className="absolute -top-3 text-2xl animate-bounce">
                  ♨️
                </div>
              )}

              {/* Interactive Utensils / Ingredient Motion */}
              <div
                className={`transition-transform duration-300 ${
                  isActionActive ? 'animate-sizzle scale-105' : ''
                }`}
              >
                <FoodArt
                  food={food}
                  bitesRemaining={food.totalBites}
                  size="lg"
                  isCooking={!isCookingDone}
                  cookingStep={currentStepIdx}
                />
              </div>

              {/* Dynamic Chopsticks Stirring Icon if stirring step */}
              {currentStep.visualStage === 'noodles_stirring' && isActionActive && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-stir text-3xl">
                  🥢
                </div>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full max-w-xs mt-1">
            <div className="flex justify-between text-[11px] font-bold text-purple-800 mb-1">
              <span>Step Progress</span>
              <span>{Math.round(stepProgress)}%</span>
            </div>
            <div className="w-full h-2.5 bg-pink-100 rounded-full overflow-hidden border border-pink-200">
              <div
                className="h-full bg-gradient-to-r from-pink-400 to-rose-500 rounded-full transition-all duration-200"
                style={{ width: `${stepProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer Button */}
      <div className="w-full max-w-md mx-auto z-20 pb-2">
        {!isCookingDone ? (
          <div>
            {currentStep.isHold ? (
              <button
                onMouseDown={handleHoldStart}
                onTouchStart={handleHoldStart}
                className="w-full py-4 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-extrabold text-base rounded-2xl shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform border-2 border-white/60"
              >
                <Flame className="w-5 h-5 fill-amber-200 text-amber-200" />
                <span>{currentStep.actionLabel}</span>
              </button>
            ) : (
              <button
                onClick={handleTapAction}
                className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-extrabold text-base rounded-2xl shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform border-2 border-white/60"
              >
                <Sparkles className="w-5 h-5 text-amber-300 fill-amber-300" />
                <span>{currentStep.actionLabel}</span>
              </button>
            )}
          </div>
        ) : (
          <div className="animate-bounce">
            <button
              onClick={onFinishCooking}
              className="w-full py-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-extrabold text-lg rounded-2xl shadow-xl flex items-center justify-center gap-2.5 border-2 border-white/80 active:scale-95 transition-transform"
            >
              <CheckCircle2 className="w-6 h-6 text-white" />
              <span>Dish Cooked! Go to Dining Table ➔</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
