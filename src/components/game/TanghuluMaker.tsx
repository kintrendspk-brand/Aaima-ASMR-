import React, { useState } from 'react';
import { GirlCharacter, CustomTanghulu, FruitIngredient, TanghuluSkewerStick, TanghuluTopping } from '../../types/game';
import { FRUIT_INGREDIENTS, TANGHULU_SKEWER_STICKS, TANGHULU_TOPPINGS } from '../../data/tanghuluData';
import { soundEngine } from '../../services/soundEngine';
import { CuteGirl } from '../character/CuteGirl';
import { ArrowLeft, Sparkles, Check, Flame, RotateCcw, Play } from 'lucide-react';

interface Props {
  selectedCharacter: GirlCharacter;
  onFinishTanghulu: (tanghulu: CustomTanghulu) => void;
  onBack: () => void;
  unlockedFruits: string[];
}

export const TanghuluMaker: React.FC<Props> = ({
  selectedCharacter,
  onFinishTanghulu,
  onBack,
  unlockedFruits,
}) => {
  // Stages: 1: Skewer Sticks -> 2: Add Fruits -> 3: Sugar Boiling -> 4: Dip & Coat -> 5: Ice Snap -> 6: Toppings & Ready
  const [stage, setStage] = useState<number>(1);
  const [selectedStick, setSelectedStick] = useState<string>('stick_bamboo');
  const [skeweredFruits, setSkeweredFruits] = useState<string[]>([]);
  const [selectedTopping, setSelectedTopping] = useState<string>('topping_none');
  const [isBoilingSyrup, setIsBoilingSyrup] = useState<boolean>(false);
  const [syrupProgress, setSyrupProgress] = useState<number>(0);
  const [isDipped, setIsDipped] = useState<boolean>(false);
  const [isIceCooled, setIsIceCooled] = useState<boolean>(false);

  const maxFruits = 5;

  const handleSelectStick = (stickId: string) => {
    setSelectedStick(stickId);
    soundEngine.playClick();
    setStage(2);
  };

  const handleAddFruit = (fruitId: string) => {
    if (skeweredFruits.length >= maxFruits) return;
    soundEngine.playClick();
    soundEngine.playChop();
    setSkeweredFruits((prev) => [...prev, fruitId]);
  };

  const handleRemoveFruit = () => {
    if (skeweredFruits.length === 0) return;
    soundEngine.playClick();
    setSkeweredFruits((prev) => prev.slice(0, -1));
  };

  const handleBoilSyrup = () => {
    setIsBoilingSyrup(true);
    soundEngine.playBoilingWater(2.8);
    const interval = setInterval(() => {
      setSyrupProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsBoilingSyrup(false);
          soundEngine.playFanfare();
          setTimeout(() => setStage(4), 400);
          return 100;
        }
        return prev + 20;
      });
    }, 400);
  };

  const handleDipSyrup = () => {
    setIsDipped(true);
    soundEngine.playStir();
    setTimeout(() => {
      soundEngine.playFryingSizzle(1.0);
      setStage(5);
    }, 800);
  };

  const handleIceCool = () => {
    soundEngine.playTanghuluCrunch();
    setIsIceCooled(true);
    setTimeout(() => {
      soundEngine.playGirlGiggle();
      setStage(6);
    }, 700);
  };

  const handleFinish = () => {
    const customTanghulu: CustomTanghulu = {
      id: `custom_tanghulu_${Date.now()}`,
      name: 'Custom Glass Tanghulu',
      fruits: skeweredFruits.length > 0 ? skeweredFruits : ['fruit_strawberry', 'fruit_muscat', 'fruit_mandarin', 'fruit_strawberry'],
      skewerStickId: selectedStick,
      toppingId: selectedTopping,
      syrupColor: '#fef08a',
      totalBites: skeweredFruits.length > 0 ? skeweredFruits.length : 4,
      bitesLeft: skeweredFruits.length > 0 ? skeweredFruits.length : 4,
    };
    soundEngine.playFanfare();
    soundEngine.playGirlGiggle();
    onFinishTanghulu(customTanghulu);
  };

  const getStickStyle = () => {
    switch (selectedStick) {
      case 'stick_rainbow':
        return 'bg-gradient-to-b from-rose-400 via-yellow-400 to-purple-400 border border-white';
      case 'stick_golden':
        return 'bg-gradient-to-b from-amber-300 via-yellow-400 to-amber-500 shadow-[0_0_10px_rgba(251,191,36,0.8)] border border-amber-200';
      case 'stick_kitty':
        return 'bg-gradient-to-b from-pink-300 to-pink-400 border border-pink-200';
      default:
        return 'bg-amber-600 border-r border-amber-800';
    }
  };

  return (
    <div className="relative w-full h-full min-h-screen flex flex-col justify-between p-3 select-none overflow-y-auto bg-gradient-to-b from-rose-100 via-pink-50 to-purple-100">
      {/* Header */}
      <div className="w-full flex items-center justify-between z-20 mb-1">
        <button
          onClick={onBack}
          className="flex items-center gap-1 px-3 py-1.5 bg-white/90 hover:bg-white text-pink-700 text-xs font-bold rounded-full shadow-xs border border-pink-200 active:scale-95 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Shop</span>
        </button>

        <div className="text-center">
          <h2 className="font-['Fredoka'] font-extrabold text-base text-purple-900 flex items-center justify-center gap-1">
            <span>🍓 Tanghulu Master Workshop</span>
          </h2>
          <span className="text-[10px] text-pink-600 font-bold">
            Whoyaho Style ASMR Fruit Skewer Kitchen
          </span>
        </div>

        <div className="w-16" />
      </div>

      {/* Main Workshop Canvas */}
      <div className="flex-1 w-full max-w-md mx-auto flex flex-col items-center justify-center relative z-10 my-auto">
        {/* Step Banner */}
        <div className="w-full bg-white/95 rounded-2xl p-2.5 shadow-sm border border-pink-200 mb-2 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            {[1, 2, 3, 4, 5, 6].map((s) => (
              <div
                key={s}
                className={`w-6 h-6 rounded-full text-[11px] font-extrabold flex items-center justify-center transition-all ${
                  stage === s
                    ? 'bg-rose-500 text-white scale-110 shadow-sm'
                    : stage > s
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                {stage > s ? '✓' : s}
              </div>
            ))}
          </div>
          <span className="text-[11px] font-extrabold text-rose-600 uppercase tracking-wider block">
            {stage === 1 && 'Step 1: Choose Bamboo or Rainbow Skewer Stick'}
            {stage === 2 && 'Step 2: Thread Fresh Fruits onto Skewer'}
            {stage === 3 && 'Step 3: Boil Sugar Syrup to 150°C'}
            {stage === 4 && 'Step 4: Dip & Swirl in Golden Sugar Glaze'}
            {stage === 5 && 'Step 5: Ice Water Plunge (Snap Crystallization!)'}
            {stage === 6 && 'Step 6: Crunchy ASMR Toppings & Ready!'}
          </span>
          <p className="text-xs text-purple-950 font-bold mt-0.5">
            {stage === 1 && 'Pick your favorite stick design to start making Tanghulu!'}
            {stage === 2 && `Tap juicy fruits below to slide onto stick (${skeweredFruits.length}/${maxFruits})`}
            {stage === 3 && 'Boil sugar and water until golden and bubbly!'}
            {stage === 4 && 'Roll the fruit skewer in the hot syrup for a paper-thin glaze!'}
            {stage === 5 && 'Dunk into icy water to freeze into an ultra-glassy shell!'}
            {stage === 6 && 'Add popping candy or rainbow sprinkles for maximum crunch!'}
          </p>
        </div>

        {/* Central Workshop Display */}
        <div className="w-full bg-white/95 rounded-3xl p-4 shadow-xl border-2 border-pink-200 flex flex-col items-center relative overflow-hidden">
          {/* Assistant Streamer Girl Watching */}
          <div className="absolute top-2 right-2">
            <CuteGirl
              character={selectedCharacter}
              expression={stage === 6 ? 'super_happy' : isBoilingSyrup ? 'waving' : 'idle'}
              size="sm"
            />
          </div>

          {/* Central Tanghulu Skewer Visual & Stage Environment */}
          <div className="h-60 w-44 relative flex flex-col items-center justify-center my-2">
            {/* Stage 3: Boiling Pot Background */}
            {stage === 3 && (
              <div className="absolute -bottom-2 w-36 h-28 bg-gradient-to-t from-slate-700 via-slate-600 to-slate-500 rounded-b-3xl border-2 border-slate-400 shadow-xl flex flex-col items-center overflow-hidden z-0">
                <div className="w-full h-4 bg-slate-800 rounded-t-sm flex items-center justify-between px-2">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  <span className="text-[8px] text-amber-200 font-bold">150°C SUGAR POT</span>
                  <div className="w-2 h-2 rounded-full bg-amber-400" />
                </div>
                {/* Boiling Golden Liquid */}
                <div className="w-full flex-1 bg-gradient-to-t from-amber-600 via-amber-400 to-yellow-300 relative flex items-center justify-center overflow-hidden">
                  {isBoilingSyrup && (
                    <div className="absolute inset-0 flex justify-around items-center">
                      <span className="text-sm animate-bounce">🫧</span>
                      <span className="text-base animate-pulse">♨️</span>
                      <span className="text-sm animate-bounce [animation-delay:0.2s]">🫧</span>
                      <span className="text-lg animate-pulse [animation-delay:0.3s]">♨️</span>
                    </div>
                  )}
                  <span className="text-xs font-black text-amber-950/80 drop-shadow-xs">
                    {syrupProgress < 100 ? `${syrupProgress}% Thickened` : '✨ Crystal Syrup Ready!'}
                  </span>
                </div>
              </div>
            )}

            {/* Stage 4: Dipping Pot */}
            {stage === 4 && (
              <div className="absolute -bottom-2 w-40 h-28 bg-gradient-to-t from-amber-700 via-amber-500 to-yellow-400 rounded-b-3xl border-2 border-amber-300 shadow-xl flex flex-col items-center overflow-hidden z-0 animate-pulse">
                <div className="w-full h-4 bg-amber-800 flex items-center justify-center text-[9px] text-yellow-100 font-extrabold">
                  🍯 LIQUID GLASS SYRUP
                </div>
                <div className="w-full flex-1 flex items-center justify-center">
                  <span className="text-xs font-extrabold text-amber-950 bg-white/40 px-2 py-0.5 rounded-full">
                    {isDipped ? '✨ Coated in Glass Sugar!' : 'Ready to Dip!'}
                  </span>
                </div>
              </div>
            )}

            {/* Stage 5: Ice Bowl */}
            {stage === 5 && (
              <div className="absolute -bottom-2 w-40 h-28 bg-gradient-to-t from-cyan-600 via-blue-400 to-sky-200 rounded-b-3xl border-2 border-cyan-200 shadow-xl flex flex-col items-center overflow-hidden z-0">
                <div className="w-full h-4 bg-cyan-800 flex items-center justify-center text-[9px] text-cyan-100 font-extrabold">
                  ❄️ ICE COLD BATH
                </div>
                <div className="w-full flex-1 flex items-center justify-center gap-1">
                  <span className="text-base animate-bounce">🧊</span>
                  <span className="text-xs font-extrabold text-cyan-950 bg-white/60 px-2 py-0.5 rounded-full">
                    {isIceCooled ? '⚡ Crystallized Hard!' : 'Dunk for Glass Snap!'}
                  </span>
                  <span className="text-base animate-bounce [animation-delay:0.3s]">🧊</span>
                </div>
              </div>
            )}

            {/* Skewer Stick */}
            <div className={`absolute w-2.5 h-52 rounded-full shadow-md z-10 ${getStickStyle()}`}>
              {/* Pointed top tip */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-r-[4px] border-b-[8px] border-l-transparent border-r-transparent border-b-amber-700" />
            </div>

            {/* Skewered Fruits with Realistic Glaze & Particles */}
            <div className={`relative z-20 flex flex-col items-center gap-1 pt-1 transition-all duration-500 ${isDipped && stage === 4 ? 'translate-y-4' : ''}`}>
              {skeweredFruits.map((fruitId, idx) => {
                const fruit = FRUIT_INGREDIENTS.find((f: FruitIngredient) => f.id === fruitId);
                return (
                  <div
                    key={idx}
                    className="relative w-11 h-11 rounded-full flex items-center justify-center text-2xl shadow-lg transition-transform transform hover:scale-110 active:scale-95 animate-fade-in group cursor-pointer"
                    style={{
                      backgroundColor: fruit?.color || '#ef4444',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.18)',
                    }}
                  >
                    {/* Natural 3D Sphere Highlight */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-black/25 via-transparent to-white/40 pointer-events-none" />

                    {/* Fruit Icon */}
                    <span className="relative z-10 drop-shadow-sm select-none">{fruit?.icon || '🍓'}</span>

                    {/* Glassy Sugar Coating Overlay */}
                    {isDipped && (
                      <div className="absolute inset-0 rounded-full border-2 border-white/90 bg-white/35 backdrop-blur-[0.5px] pointer-events-none flex items-center justify-center overflow-hidden">
                        {/* Diagonal Specular Gleam */}
                        <div className="absolute -top-1 -left-1 w-4 h-4 bg-white/70 rounded-full blur-[0.8px]" />
                        <div className="absolute bottom-1 right-2 w-2 h-2 bg-white/60 rounded-full" />
                      </div>
                    )}

                    {/* Ice Crystallized Hard Cracks */}
                    {isIceCooled && (
                      <div className="absolute inset-0 rounded-full border-2 border-cyan-200/90 pointer-events-none shadow-[0_0_8px_rgba(34,211,238,0.7)] flex items-center justify-center">
                        <span className="text-[10px] text-cyan-200 select-none">✨</span>
                      </div>
                    )}

                    {/* Toppings Particles (Popping Candy, Sprinkles, Gold) */}
                    {selectedTopping !== 'topping_none' && stage === 6 && (
                      <div className="absolute inset-0 rounded-full pointer-events-none flex flex-wrap items-center justify-around p-0.5 overflow-hidden">
                        {selectedTopping === 'topping_popping' && (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-yellow-300 animate-ping" />
                            <span className="w-1 h-1 rounded-full bg-pink-400 animate-pulse" />
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-ping" />
                          </>
                        )}
                        {selectedTopping === 'topping_sprinkles' && (
                          <>
                            <span className="w-2 h-0.5 bg-rose-400 rotate-45" />
                            <span className="w-2 h-0.5 bg-blue-400 -rotate-12" />
                            <span className="w-2 h-0.5 bg-amber-400 rotate-90" />
                          </>
                        )}
                        {selectedTopping === 'topping_gold' && (
                          <>
                            <span className="text-[8px] text-amber-300 animate-pulse">✦</span>
                            <span className="text-[8px] text-yellow-200 animate-pulse">✦</span>
                          </>
                        )}
                        {selectedTopping === 'topping_peanuts' && (
                          <>
                            <span className="w-1 h-1 rounded-sm bg-amber-800" />
                            <span className="w-1.5 h-1 rounded-sm bg-amber-700" />
                          </>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              {skeweredFruits.length === 0 && (
                <div className="text-xs text-purple-400 font-bold mt-16 text-center bg-white/80 px-3 py-1.5 rounded-xl border border-pink-100 shadow-xs">
                  Stick is empty!<br />Tap fruits below! 👇
                </div>
              )}
            </div>

            {/* Ice Cool Crack Aura */}
            {isIceCooled && (
              <div className="absolute inset-0 rounded-2xl border-2 border-cyan-300/80 animate-pulse pointer-events-none shadow-[0_0_15px_rgba(34,211,238,0.5)]" />
            )}
          </div>

          {/* Controls per Stage */}
          {stage === 1 && (
            <div className="w-full mt-2">
              <span className="text-xs font-bold text-purple-800 mb-1.5 block">Choose Stick:</span>
              <div className="grid grid-cols-2 gap-2">
                {TANGHULU_SKEWER_STICKS.map((stick: TanghuluSkewerStick) => (
                  <button
                    key={stick.id}
                    onClick={() => handleSelectStick(stick.id)}
                    className="p-2.5 bg-pink-50 hover:bg-pink-100 rounded-xl border border-pink-200 flex items-center gap-2 active:scale-95 transition-all text-left"
                  >
                    <span className="text-xl">{stick.icon}</span>
                    <span className="text-xs font-bold text-purple-900">{stick.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {stage === 2 && (
            <div className="w-full mt-2">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-bold text-purple-800">Available Fruits:</span>
                {skeweredFruits.length > 0 && (
                  <button
                    onClick={handleRemoveFruit}
                    className="text-[10px] text-rose-600 font-bold underline"
                  >
                    Undo Last Fruit
                  </button>
                )}
              </div>
              <div className="grid grid-cols-4 gap-1.5 max-h-36 overflow-y-auto p-1">
                {FRUIT_INGREDIENTS.map((fruit: FruitIngredient) => {
                  const isAvailable = fruit.price === 0 || unlockedFruits.includes(fruit.id);
                  return (
                    <button
                      key={fruit.id}
                      onClick={() => handleAddFruit(fruit.id)}
                      disabled={!isAvailable || skeweredFruits.length >= maxFruits}
                      className="p-1.5 bg-slate-50 hover:bg-pink-50 rounded-xl border border-pink-200 flex flex-col items-center active:scale-95 transition-all disabled:opacity-40"
                    >
                      <span className="text-xl">{fruit.icon}</span>
                      <span className="text-[9px] font-bold text-purple-900 mt-0.5 truncate w-full text-center">
                        {fruit.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              {skeweredFruits.length >= maxFruits && (
                <button
                  onClick={() => setStage(3)}
                  className="w-full mt-2.5 py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-extrabold text-xs rounded-xl shadow-md active:scale-95 transition-all"
                >
                  Skewer Complete! Cook Sugar Syrup ➔
                </button>
              )}
            </div>
          )}

          {stage === 3 && (
            <div className="w-full mt-2 text-center">
              <div className="w-full h-3 bg-pink-100 rounded-full overflow-hidden border border-pink-200 mb-2">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-rose-500 rounded-full transition-all"
                  style={{ width: `${syrupProgress}%` }}
                />
              </div>
              <button
                onClick={handleBoilSyrup}
                disabled={isBoilingSyrup}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 active:scale-95 transition-all"
              >
                <Flame className="w-4 h-4 fill-amber-200 text-amber-200" />
                <span>{isBoilingSyrup ? 'Boiling Sugar & Water... ♨️' : 'Heat Sugar Syrup to 150°C 🔥'}</span>
              </button>
            </div>
          )}

          {stage === 4 && (
            <div className="w-full mt-2 text-center">
              <button
                onClick={handleDipSyrup}
                className="w-full py-3.5 bg-gradient-to-r from-amber-400 via-pink-500 to-purple-600 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 active:scale-95 transition-all animate-bounce"
              >
                <Sparkles className="w-4 h-4" />
                <span>Dip & Roll Skewer in Sugar Glaze! ✨</span>
              </button>
            </div>
          )}

          {stage === 5 && (
            <div className="w-full mt-2 text-center">
              <button
                onClick={handleIceCool}
                className="w-full py-3.5 bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 active:scale-95 transition-all animate-pulse"
              >
                <span>❄️ Dunk into Ice Water (Snap Crystallize!)</span>
              </button>
            </div>
          )}

          {stage === 6 && (
            <div className="w-full mt-2">
              <span className="text-xs font-bold text-purple-800 mb-1.5 block">Choose Crunchy Topping:</span>
              <div className="grid grid-cols-3 gap-1.5 mb-2.5">
                {TANGHULU_TOPPINGS.map((top: TanghuluTopping) => (
                  <button
                    key={top.id}
                    onClick={() => {
                      setSelectedTopping(top.id);
                      soundEngine.playClick();
                    }}
                    className={`p-1.5 rounded-xl border text-center transition-all ${
                      selectedTopping === top.id
                        ? 'bg-pink-100 border-pink-400 ring-2 ring-pink-300'
                        : 'bg-slate-50 border-pink-100'
                    }`}
                  >
                    <span className="text-lg">{top.icon}</span>
                    <span className="text-[9px] font-bold text-purple-900 block truncate">
                      {top.name}
                    </span>
                  </button>
                ))}
              </div>

              <button
                onClick={handleFinish}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-green-600 text-white font-extrabold text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Ready! Start Mukbang Live Stream ➔</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
