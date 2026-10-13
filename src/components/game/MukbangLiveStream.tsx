import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { FoodItem, GirlCharacter, CustomTanghulu, LiveChatMessage } from '../../types/game';
import { CuteGirl, GirlExpression, EatingPhase } from '../character/CuteGirl';
import { FoodArt } from '../food/FoodArt';
import { soundEngine } from '../../services/soundEngine';
import { VIEWER_CHAT_POOL, SUPERCHAT_DONATIONS } from '../../data/tanghuluData';
import {
  ArrowLeft,
  RotateCcw,
  Heart,
  Volume2,
  Users,
  Coins,
  Sparkles,
  Trophy,
  Mic,
  Gift,
  Share2,
  Camera,
} from 'lucide-react';

interface Props {
  food: FoodItem;
  customTanghulu?: CustomTanghulu | null;
  selectedCharacter: GirlCharacter;
  subscribers: number;
  onFinishMukbang: (coinsEarned: number, subsGained: number) => void;
  onBackToMenu: () => void;
  onMakeAnotherTanghulu: () => void;
}

export const MukbangLiveStream: React.FC<Props> = ({
  food,
  customTanghulu,
  selectedCharacter,
  subscribers,
  onFinishMukbang,
  onBackToMenu,
  onMakeAnotherTanghulu,
}) => {
  const isCustomTanghulu = Boolean(customTanghulu);
  const totalBites = isCustomTanghulu
    ? (customTanghulu?.totalBites || 4)
    : (food.totalBites || 5);

  const [bitesLeft, setBitesLeft] = useState<number>(totalBites);
  const [girlExpression, setGirlExpression] = useState<GirlExpression>('idle');
  const [isBiting, setIsBiting] = useState<boolean>(false);
  const [viewersCount, setViewersCount] = useState<number>(14200);
  const [streamLikes, setStreamLikes] = useState<number>(340);
  const [streamFinished, setStreamFinished] = useState<boolean>(false);

  // Live Chat Stream state
  const [chatMessages, setChatMessages] = useState<LiveChatMessage[]>([
    { id: '1', user: 'BobaLover_99', text: 'Stream started! Let\'s gooo! 🍓✨', avatar: '🐱', badge: 'VIP' },
    { id: '2', user: 'ASMR_Addict', text: 'Waiting for that glassy sugar crunch! 🎧', avatar: '🐰' },
    { id: '3', user: 'SweetTooth', text: 'Aaima looks so adorable today! 🥰💕', avatar: '🌸' },
  ]);

  // Floating Hearts on screen
  const [flyingHearts, setFlyingHearts] = useState<{ id: number; left: number }[]>([]);

  // Superchat popups
  const [activeDonation, setActiveDonation] = useState<{ user: string; amount: number; text: string } | null>(null);

  // ASMR Crunch impact text popup
  const [crunchBurstText, setCrunchBurstText] = useState<string | null>(null);

  // Studio customization
  const [micSkin, setMicSkin] = useState<'silver' | 'pink_kitty' | 'golden'>('pink_kitty');
  const [petCompanion, setPetCompanion] = useState<{ name: string; emoji: string }>({ name: 'Mochi', emoji: '🐰' });
  const [eatingPhase, setEatingPhase] = useState<EatingPhase>('idle');
  const [isCloseUpCamera, setIsCloseUpCamera] = useState<boolean>(false);

  // Dynamic viewer count & random chat messages timer
  useEffect(() => {
    const chatInterval = setInterval(() => {
      if (streamFinished) return;
      const randomMsg = VIEWER_CHAT_POOL[Math.floor(Math.random() * VIEWER_CHAT_POOL.length)];
      setChatMessages((prev) => [
        ...prev.slice(-4),
        { ...randomMsg, id: `${Date.now()}_${Math.random()}` },
      ]);
      setViewersCount((prev) => prev + Math.floor(Math.random() * 50) - 20);
    }, 2800);

    return () => clearInterval(chatInterval);
  }, [streamFinished]);

  // Handle Synchronized Hand-to-Mouth ASMR Eating Sequence
  const handleCrunchBite = () => {
    if (isBiting || bitesLeft <= 0 || streamFinished) return;

    setIsBiting(true);
    triggerFlyingHeart();
    setStreamLikes((prev) => prev + 25);
    setViewersCount((prev) => prev + 160);

    // --- PHASE 1: Grip & Lifting Food to Mouth (0ms - 650ms) ---
    // Arm & hand lifts food naturally, character looks at food with anticipation, mouth opens wide
    setEatingPhase('lifting');
    setGirlExpression('mouth_open');
    soundEngine.playSkewerHandling();

    // --- PHASE 2: Teeth Clamping & Brittle Sugar Snap (650ms - 1050ms) ---
    setTimeout(() => {
      setEatingPhase('biting');

      // Visual crunch burst pop
      const bursts = ['CRUNCH!! 💥', 'KKADEUK!! 🎧', 'SUGAR SNAP!! 🍯', 'CRACKLE!! ✨', 'SUPER YUM!! 💕'];
      const chosenBurst = bursts[Math.floor(Math.random() * bursts.length)];
      setCrunchBurstText(chosenBurst);
      setTimeout(() => setCrunchBurstText(null), 850);

      // Play authentic food-specific ASMR Audio precisely synchronized with teeth contact
      const biteIndex = totalBites - bitesLeft;
      if (isCustomTanghulu || food.category === 'tanghulu') {
        soundEngine.playTanghuluGlassSnap(biteIndex);
        if (customTanghulu?.toppingId === 'topping_popping') {
          setTimeout(() => soundEngine.playPoppingFizzle(), 180);
        }
      } else if (food.category === 'noodles') {
        const isSpicy = food.id.includes('spicy') || food.id.includes('fire');
        soundEngine.playNoodleSlurp(isSpicy ? 'spicy' : 'mild');
      } else {
        soundEngine.playAsmrSound(food.soundType);
      }

      // Decrement visible food portion
      const nextBites = bitesLeft - 1;
      setBitesLeft(nextBites);

      // --- PHASE 3: Hand Pulls Back & Rhythmic Chewing (1050ms - 2200ms) ---
      setTimeout(() => {
        setEatingPhase('chewing');
        setGirlExpression('chewing');
        soundEngine.playJuicyChewCycle(1);

        // Chew audio follow-up
        setTimeout(() => soundEngine.playJuicyChewCycle(2), 350);

        // Random Superchat trigger during chewing
        if (Math.random() > 0.55 && !activeDonation) {
          const don = SUPERCHAT_DONATIONS[Math.floor(Math.random() * SUPERCHAT_DONATIONS.length)];
          setActiveDonation(don);
          soundEngine.playSuperchatDonation();
          setTimeout(() => setActiveDonation(null), 3000);
        }

        // --- PHASE 4: Swallow & Throat Gulp (2200ms - 2900ms) ---
        setTimeout(() => {
          setEatingPhase('swallowing');
          soundEngine.playSwallow();
          soundEngine.playGirlYum();

          if (nextBites <= 0) {
            // Finished stream broadcast celebration!
            setStreamFinished(true);
            setEatingPhase('satisfied');
            setGirlExpression('super_happy');
            soundEngine.playFanfare();
            soundEngine.playGirlGiggle();
            confetti({
              particleCount: 100,
              spread: 85,
              origin: { y: 0.6 },
            });
            onFinishMukbang(75, 520);
          } else {
            setEatingPhase('satisfied');
            setGirlExpression('yum_satisfaction');

            // --- PHASE 5: Return to Idle Ready for Next Player Bite ---
            setTimeout(() => {
              setEatingPhase('idle');
              setGirlExpression('idle');
              setIsBiting(false);
            }, 800);
          }
        }, 900);
      }, 400);
    }, 650);
  };

  const triggerFlyingHeart = () => {
    soundEngine.playHeartPop();
    const newHeart = {
      id: Date.now() + Math.random(),
      left: 70 + Math.random() * 22,
    };
    setFlyingHearts((prev) => [...prev.slice(-8), newHeart]);
    setTimeout(() => {
      setFlyingHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
    }, 1200);
  };

  const handleRefill = () => {
    setBitesLeft(totalBites);
    setStreamFinished(false);
    setIsBiting(false);
    setGirlExpression('idle');
    soundEngine.playClick();
  };

  return (
    <div className="relative w-full h-full min-h-screen flex flex-col justify-between p-3 select-none overflow-hidden bg-gradient-to-b from-purple-900 via-pink-900 to-indigo-950 text-white">
      {/* 1. Top Mukbang Live Overlay Bar */}
      <div className="w-full flex items-center justify-between z-30 pt-1 px-1">
        <div className="flex items-center gap-2">
          {/* Pulsing LIVE Badge */}
          <div className="flex items-center gap-1.5 bg-rose-600 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider animate-pulse shadow-md">
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            <span>LIVE</span>
          </div>

          {/* Viewers Counter */}
          <div className="flex items-center gap-1 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold border border-white/10">
            <Users className="w-3.5 h-3.5 text-pink-400" />
            <span>{viewersCount.toLocaleString()}</span>
          </div>
        </div>

        {/* Subs, Camera Zoom & Exit */}
        <div className="flex items-center gap-1.5">
          {/* Close-Up Camera Mode Toggle */}
          <button
            onClick={() => {
              soundEngine.playClick();
              setIsCloseUpCamera((prev) => !prev);
            }}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold transition-all border active:scale-95 ${
              isCloseUpCamera
                ? 'bg-rose-500 text-white border-rose-300 shadow-md ring-2 ring-rose-400/50'
                : 'bg-black/50 text-pink-200 border-white/20 hover:bg-black/70'
            }`}
            title="Toggle Close-up ASMR Camera"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>{isCloseUpCamera ? 'Close-up 🔍' : 'Camera 📷'}</span>
          </button>

          <div className="flex items-center gap-1 bg-amber-500/90 text-amber-950 px-2.5 py-1 rounded-full text-[11px] font-extrabold shadow-sm">
            <span>👑 {subscribers.toLocaleString()} Subs</span>
          </div>

          <button
            onClick={onBackToMenu}
            className="p-1.5 bg-white/20 hover:bg-white/30 rounded-full active:scale-95 transition-all"
            title="End Stream"
          >
            <ArrowLeft className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Superchat Donation Alert Popup */}
      {activeDonation && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-40 bg-gradient-to-r from-amber-400 via-rose-500 to-purple-600 p-2.5 rounded-2xl shadow-2xl border-2 border-white/60 animate-bounce max-w-xs w-full text-center">
          <div className="flex items-center justify-center gap-1.5 text-xs font-extrabold text-white">
            <Gift className="w-4 h-4 text-yellow-200" />
            <span>{activeDonation.user} donated ${activeDonation.amount}!</span>
          </div>
          <p className="text-[11px] font-bold text-white/90 mt-0.5">"{activeDonation.text}"</p>
        </div>
      )}

      {/* 2. Central Live Stream Studio Scene */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 w-full max-w-md mx-auto my-auto">
        {/* Neon Mukbang Channel Sign */}
        <div className="absolute top-1 left-4 flex items-center gap-1.5 text-[11px] font-extrabold text-pink-300 drop-shadow-[0_0_8px_rgba(244,114,182,0.8)]">
          <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
          <span>Aaima ASMR Live Channel</span>
        </div>

        {/* 3D Animated Girl Behind Streamer Desk with Hand-to-Mouth Rig */}
        <div className={`relative flex flex-col items-center transition-all duration-500 ${isCloseUpCamera ? 'scale-115 translate-y-3' : ''}`}>
          <CuteGirl
            character={selectedCharacter}
            expression={girlExpression}
            eatingPhase={eatingPhase}
            activeFoodFruits={isCustomTanghulu && customTanghulu ? customTanghulu.fruits : ['fruit_strawberry', 'fruit_muscat', 'fruit_mandarin', 'fruit_strawberry']}
            bitesLeft={bitesLeft}
            totalBites={totalBites}
            closeUp={isCloseUpCamera}
            size={isCloseUpCamera ? 'xl' : 'lg'}
            onClick={handleCrunchBite}
          />
        </div>

        {/* Streamer Desk with ASMR Studio Microphone & Tanghulu Stand */}
        <div className="w-full -mt-10 bg-gradient-to-r from-pink-800 via-purple-800 to-pink-900 rounded-3xl p-4 shadow-2xl border-t-2 border-pink-400/50 flex flex-col items-center relative backdrop-blur-md">
          {/* Professional ASMR Microphone on the desk (Tap to change style) */}
          <button
            onClick={() => {
              soundEngine.playClick();
              setMicSkin((prev) => (prev === 'pink_kitty' ? 'golden' : prev === 'golden' ? 'silver' : 'pink_kitty'));
            }}
            className="absolute left-3 top-2.5 flex items-center gap-1.5 bg-black/50 px-2.5 py-1 rounded-full border border-pink-400/40 text-[10px] font-bold text-pink-200 active:scale-95 transition-all"
            title="Tap to change ASMR Microphone"
          >
            <Mic className={`w-3.5 h-3.5 ${micSkin === 'golden' ? 'text-amber-300' : micSkin === 'silver' ? 'text-slate-200' : 'text-pink-400'} animate-pulse`} />
            <div className="flex items-center gap-0.5 h-2.5">
              <span className={`w-0.5 bg-pink-400 rounded-full transition-all ${isBiting ? 'h-3 animate-bounce' : 'h-1.5'}`} />
              <span className={`w-0.5 bg-pink-300 rounded-full transition-all ${isBiting ? 'h-3.5 animate-bounce [animation-delay:0.1s]' : 'h-2'}`} />
              <span className={`w-0.5 bg-rose-400 rounded-full transition-all ${isBiting ? 'h-2.5 animate-bounce [animation-delay:0.2s]' : 'h-1'}`} />
            </div>
            <span>{micSkin === 'golden' ? 'Gold Studio' : micSkin === 'silver' ? 'Classic Silver' : 'Kitty ASMR'}</span>
          </button>

          {/* Cute Desk Companion Pet (Tap to interact & switch) */}
          <button
            onClick={() => {
              soundEngine.playHeartPop();
              const pets = [
                { name: 'Mochi', emoji: '🐰' },
                { name: 'Neko', emoji: '🐱' },
                { name: 'Hammy', emoji: '🐹' },
                { name: 'Panda', emoji: '🐼' },
              ];
              const currentIndex = pets.findIndex((p) => p.name === petCompanion.name);
              const nextPet = pets[(currentIndex + 1) % pets.length];
              setPetCompanion(nextPet);
            }}
            className="absolute right-3 top-2 flex flex-col items-center active:scale-90 transition-transform"
            title="Tap to play with stream mascot!"
          >
            <div className="text-2xl animate-bounce">{petCompanion.emoji}</div>
            <span className="text-[8px] font-bold text-pink-200 bg-black/45 px-2 py-0.5 rounded-full border border-pink-400/30">
              {petCompanion.name} 🐾
            </span>
          </button>

          {/* ASMR Pop Burst Comic Text on Screen */}
          {crunchBurstText && (
            <div className="absolute -top-12 z-30 pointer-events-none animate-bounce">
              <span className="text-xl sm:text-2xl font-black text-yellow-300 drop-shadow-[0_2px_8px_rgba(244,63,94,0.9)] bg-rose-600/90 px-3.5 py-1 rounded-2xl border-2 border-white tracking-wider transform -rotate-3 inline-block">
                {crunchBurstText}
              </span>
            </div>
          )}

          {/* Central Dish / Skewer */}
          <div
            onClick={handleCrunchBite}
            className="cursor-pointer group relative flex flex-col items-center transition-transform hover:scale-105 active:scale-95 pt-2"
            title="Tap to take a signature crunchy bite!"
          >
            {isCustomTanghulu && customTanghulu ? (
              <FoodArt
                food={{
                  ...food,
                  category: 'tanghulu',
                  tanghuluFruits: customTanghulu.fruits,
                  totalBites: customTanghulu.totalBites,
                }}
                bitesRemaining={bitesLeft}
                size="lg"
              />
            ) : (
              <FoodArt
                food={food}
                bitesRemaining={bitesLeft}
                size="lg"
              />
            )}

            {!streamFinished && (
              <div className="mt-1 flex items-center gap-1.5 bg-rose-500/95 text-white text-xs font-black px-3.5 py-1 rounded-full shadow-lg border border-white/50 group-hover:bg-rose-600 animate-pulse tracking-wide">
                <Volume2 className="w-3.5 h-3.5" />
                <span>TAP TO CRUNCH! 🎧💥</span>
              </div>
            )}
          </div>

          {/* Portion Dots */}
          <div className="w-full max-w-xs mt-3 flex justify-between items-center text-[10px] font-bold text-pink-200">
            <span>Bites: {bitesLeft}/{totalBites}</span>
            <div className="flex gap-1.5">
              {Array.from({ length: totalBites }).map((_, idx) => (
                <div
                  key={idx}
                  className={`h-2 flex-1 w-6 rounded-full transition-all ${
                    idx < bitesLeft ? 'bg-pink-400 shadow-sm' : 'bg-white/20'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Scrolling Live Viewer Chat Overlay (Bottom Left) */}
      <div className="w-full max-w-md mx-auto z-20 flex justify-between items-end gap-2 pb-1">
        {/* Chat Stream Box */}
        <div className="flex-1 space-y-1.5 max-h-28 overflow-hidden pointer-events-none">
          {chatMessages.map((msg) => (
            <div
              key={msg.id}
              className="bg-black/45 backdrop-blur-md rounded-xl px-2.5 py-1 text-[11px] border border-white/10 flex items-center gap-1.5 animate-fade-in"
            >
              <span>{msg.avatar}</span>
              <span className="font-bold text-pink-300 truncate max-w-[80px]">
                {msg.user}:
              </span>
              <span className="text-white/90 truncate flex-1 font-medium">
                {msg.text}
              </span>
            </div>
          ))}
        </div>

        {/* Flying Hearts Tap Button (Bottom Right) */}
        <div className="shrink-0 flex flex-col items-center gap-1">
          <button
            onClick={triggerFlyingHeart}
            className="w-12 h-12 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 text-white flex items-center justify-center shadow-lg active:scale-90 transition-transform border border-white/30"
          >
            <Heart className="w-6 h-6 fill-white text-white" />
          </button>
          <span className="text-[10px] font-bold text-pink-200">{streamLikes}</span>
        </div>
      </div>

      {/* Flying Hearts in Air */}
      {flyingHearts.map((h) => (
        <div
          key={h.id}
          className="pointer-events-none fixed bottom-16 text-3xl animate-bounce z-40 transition-all duration-1000"
          style={{ left: `${h.left}%`, transform: 'translateY(-120px)' }}
        >
          💖
        </div>
      ))}

      {/* 4. Stream End Celebration Card */}
      {streamFinished && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-amber-400 text-white flex items-center justify-center text-3xl mb-3 shadow-lg">
            👑
          </div>
          <h3 className="font-['Fredoka'] font-extrabold text-2xl text-yellow-300">
            Mukbang Broadcast Complete!
          </h3>
          <p className="text-xs text-pink-200 mt-1 max-w-xs leading-relaxed">
            Your viewers went wild over the ultra-glassy sugar shell crunch sounds!
          </p>

          <div className="w-full max-w-xs grid grid-cols-2 gap-2 my-4">
            <div className="bg-white/10 p-3 rounded-2xl border border-white/20">
              <span className="text-xs text-pink-300 block">Subs Gained</span>
              <span className="font-extrabold text-lg text-emerald-400">+450 👑</span>
            </div>
            <div className="bg-white/10 p-3 rounded-2xl border border-white/20">
              <span className="text-xs text-pink-300 block">Superchat Coins</span>
              <span className="font-extrabold text-lg text-amber-300">+65 💰</span>
            </div>
          </div>

          <div className="w-full max-w-xs space-y-2">
            <button
              onClick={handleRefill}
              className="w-full py-3 bg-pink-500 hover:bg-pink-600 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 active:scale-95 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Crunch Another Skewer (Refill)</span>
            </button>
            <button
              onClick={onMakeAnotherTanghulu}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 active:scale-95 transition-all"
            >
              <span>🍓 Make New Tanghulu in Workshop ➔</span>
            </button>
            <button
              onClick={onBackToMenu}
              className="w-full py-2.5 bg-white/20 hover:bg-white/30 text-white font-bold text-xs rounded-xl active:scale-95 transition-all"
            >
              End Live Broadcast (Back to Store)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
