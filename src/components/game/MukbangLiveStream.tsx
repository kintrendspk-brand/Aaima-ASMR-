import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { FoodItem, GirlCharacter, CustomTanghulu, LiveChatMessage } from '../../types/game';
import { CuteGirl, GirlExpression, EatingPhase, CharacterMood } from '../character/CuteGirl';
import { FoodArt } from '../food/FoodArt';
import { soundEngine } from '../../services/soundEngine';
import { VIEWER_CHAT_POOL, SUPERCHAT_DONATIONS } from '../../data/tanghuluData';
import { INITIAL_FOODS } from '../../data/foods';
import {
  ArrowLeft,
  RotateCcw,
  Heart,
  Volume2,
  Users,
  Sparkles,
  Mic,
  Gift,
  Camera,
  UtensilsCrossed,
  Hand,
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

interface ActiveCrumb {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  type: '1' | '2' | '3' | 'b' | 'droplet_r' | 'droplet_l';
  isDroplet?: boolean;
}

export const MukbangLiveStream: React.FC<Props> = ({
  food: initialFood,
  customTanghulu,
  selectedCharacter,
  subscribers,
  onFinishMukbang,
  onBackToMenu,
  onMakeAnotherTanghulu,
}) => {
  // Current Mukbang Food item on desk (Can switch between custom Tanghulu or other 50 mukbang dishes)
  const [activeFood, setActiveFood] = useState<FoodItem>(() => {
    if (customTanghulu) {
      return {
        id: customTanghulu.id,
        name: customTanghulu.name || 'Custom Crystal Tanghulu',
        category: 'tanghulu',
        categoryName: 'Tanghulu Skewers',
        description: 'Handmade fresh fruit skewer coated in ultra-glassy sugar crystal candy!',
        price: 0,
        isUnlocked: true,
        totalBites: customTanghulu.totalBites || 5,
        cookingStyle: 'make_tanghulu',
        soundType: 'crunch_tanghulu',
        colorTheme: '#ef4444',
        crunchLevel: 5,
        tanghuluFruits: customTanghulu.fruits,
        dishType: 'skewer',
      };
    }
    return initialFood;
  });

  const isCustomTanghulu = Boolean(customTanghulu && activeFood.category === 'tanghulu');
  const isTanghulu = activeFood.category === 'tanghulu';
  const isNoodle = activeFood.category === 'noodles';
  const isSpicyRed = activeFood.id.includes('spicy') || activeFood.id.includes('fire') || activeFood.id.includes('chili');
  const isChickenBucket = activeFood.id.includes('bucket');

  const totalBites = activeFood.totalBites || 5;
  const [bitesLeft, setBitesLeft] = useState<number>(totalBites);
  const [girlExpression, setGirlExpression] = useState<GirlExpression>('idle');
  const [moodState, setMoodState] = useState<CharacterMood>('neutral');
  const [isBiting, setIsBiting] = useState<boolean>(false);
  const [viewersCount, setViewersCount] = useState<number>(18500);
  const [streamLikes, setStreamLikes] = useState<number>(420);
  const [streamFinished, setStreamFinished] = useState<boolean>(false);

  // Hand-to-Mouth Animation Motion: idle -> lifting -> contact -> retracting
  const [handMotion, setHandMotion] = useState<'idle' | 'lifting' | 'contact' | 'retracting'>('idle');
  const [activeCrumbs, setActiveCrumbs] = useState<ActiveCrumb[]>([]);
  const [recentBiteIndex, setRecentBiteIndex] = useState<number>(0);
  const [isFoodSquashing, setIsFoodSquashing] = useState<boolean>(false);

  // Live Chat Stream state
  const [chatMessages, setChatMessages] = useState<LiveChatMessage[]>([
    { id: '1', user: 'BobaLover_99', text: 'Live Mukbang started! That food looks unreal! 🍗🍓✨', avatar: '🐱', badge: 'VIP' },
    { id: '2', user: 'ASMR_King', text: 'Headphones on! Ready for the signature crunch! 🎧', avatar: '🐰' },
    { id: '3', user: 'MochiAddict', text: `${selectedCharacter.name} looks so pretty today! 🥰💕`, avatar: '🌸' },
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
  const [showDishSelector, setShowDishSelector] = useState<boolean>(false);

  const biteTimerRef = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    return () => {
      biteTimerRef.current.forEach(clearTimeout);
    };
  }, []);

  // Dynamic viewer count & random chat messages timer
  useEffect(() => {
    const chatInterval = setInterval(() => {
      if (streamFinished) return;
      const randomMsg = VIEWER_CHAT_POOL[Math.floor(Math.random() * VIEWER_CHAT_POOL.length)];
      setChatMessages((prev) => [
        ...prev.slice(-4),
        { ...randomMsg, id: `${Date.now()}_${Math.random()}` },
      ]);
      setViewersCount((prev) => prev + Math.floor(Math.random() * 60) - 20);
    }, 2600);

    return () => clearInterval(chatInterval);
  }, [streamFinished]);

  // Handle Synchronized Hand-to-Mouth ASMR Eating Sequence
  const handleCrunchBite = () => {
    if (isBiting || bitesLeft <= 0 || streamFinished) return;

    soundEngine.initContext();
    setIsBiting(true);
    triggerFlyingHeart();
    setStreamLikes((prev) => prev + 35);
    setViewersCount((prev) => prev + 180);

    biteTimerRef.current.forEach(clearTimeout);
    biteTimerRef.current = [];

    const bitesTaken = totalBites - bitesLeft;
    const currentBiteIdx = bitesTaken;
    const isInitialBite = currentBiteIdx === 0;
    const nextBites = bitesLeft - 1;

    // --- PHASE 1: Grip & Smooth Hand-to-Mouth Lifting Arc (0ms - 520ms) ---
    setHandMotion('lifting');
    setEatingPhase('lifting');
    setGirlExpression('mouth_open');
    soundEngine.playSkewerHandling();

    // --- PHASE 2: Teeth Contact (520ms) ---
    const CONTACT_MS = 520;
    const tContact = setTimeout(() => {
      setHandMotion('contact');
      setEatingPhase('biting');
      setRecentBiteIndex(currentBiteIdx);
      setIsFoodSquashing(true);

      // ASMR burst text
      let bursts = ['CRUNCH!! 💥', 'CRISP SNAP!! 🎧', 'SUGAR GLASS!! 🍯', 'SUPER YUM!! 💕'];
      if (isChickenBucket || activeFood.id.includes('chicken')) {
        bursts = ['GOLDEN CRUNCH!! 🍗', 'CRISPY BATTER!! 💥', 'JUICY CHICKEN!! 🤤'];
      } else if (isNoodle) {
        bursts = ['SLURRRRP!! 🍜', 'RICH BROTH!! 🥢', 'SIZZLE NOODLES!! 🔥'];
      } else if (isTanghulu) {
        bursts = isInitialBite ? ['SHARP CRACK!! 💥', 'BRITTLE GLASS!! 💎'] : ['JUICY SWEET!! 🍓', 'CRYSTAL POP!! ✨'];
      }
      const chosenBurst = bursts[Math.floor(Math.random() * bursts.length)];
      setCrunchBurstText(chosenBurst);
      setTimeout(() => setCrunchBurstText(null), 850);

      // Generate Crumb & Juice Particle Burst
      const newCrumbs: ActiveCrumb[] = [];
      const particleTypes: ('1' | '2' | '3' | 'b' | 'droplet_r' | 'droplet_l')[] = [
        '1', '2', '3', 'b', 'droplet_r', 'droplet_l'
      ];
      const crumbBaseColor = isTanghulu
        ? '#fecdd3'
        : isChickenBucket
        ? '#f59e0b'
        : isSpicyRed
        ? '#ef4444'
        : activeFood.colorTheme || '#fde047';
      const juiceBaseColor = isTanghulu
        ? '#ef4444'
        : isChickenBucket
        ? '#d97706'
        : isSpicyRed
        ? '#dc2626'
        : '#fbbf24';

      for (let i = 0; i < 9; i++) {
        const isDroplet = i % 2 === 1;
        newCrumbs.push({
          id: Date.now() + i,
          x: 48 + (Math.random() * 24 - 12),
          y: 20 + (Math.random() * 16 - 8),
          color: isDroplet ? juiceBaseColor : crumbBaseColor,
          size: isDroplet ? 4 + Math.random() * 3 : 3 + Math.random() * 3,
          type: particleTypes[i % particleTypes.length],
          isDroplet,
        });
      }
      setActiveCrumbs(newCrumbs);
      setTimeout(() => setActiveCrumbs([]), 700);

      // Play Food-Specific Audio and Trigger Food-Reactive Mood State
      if (isNoodle) {
        if (isSpicyRed) {
          setMoodState('spicy_fiery');
          setGirlExpression('spicy_reaction');
          soundEngine.playNoodleSlurp('spicy');
        } else {
          setMoodState('happy_blush');
          setGirlExpression('happy_blush');
          soundEngine.playNoodleSlurp('mild');
        }
      } else if (isTanghulu) {
        if (isInitialBite) {
          setMoodState('surprised');
          setGirlExpression('surprised_mouth');
          soundEngine.playTanghuluGlassSnap(currentBiteIdx);
          if (customTanghulu?.toppingId === 'topping_popping') {
            setTimeout(() => soundEngine.playPoppingFizzle(), 140);
          }
        } else {
          setMoodState('ecstatic');
          setGirlExpression('ecstatic_eyes');
          soundEngine.playAsmrVariant('juicy-mush', currentBiteIdx);
        }
      } else if (isChickenBucket || activeFood.id.includes('chicken')) {
        setMoodState('happy_blush');
        setGirlExpression(isInitialBite ? 'surprised_mouth' : 'happy_blush');
        soundEngine.playAsmrSound('crunch_chicken');
      } else if (activeFood.category === 'desserts') {
        setMoodState('ecstatic');
        setGirlExpression('ecstatic_eyes');
        soundEngine.playAsmrSound(activeFood.soundType);
      } else {
        setMoodState('happy_blush');
        setGirlExpression('happy_blush');
        soundEngine.playAsmrSound(activeFood.soundType);
      }

      setBitesLeft(nextBites);

      // --- PHASE 3: Hand Pulls Back & Rhythmic Chewing (950ms) ---
      const tChew = setTimeout(() => {
        setHandMotion('retracting');
        setEatingPhase('chewing');
        setGirlExpression('chewing');
        setIsFoodSquashing(false);
        soundEngine.playJuicyChewCycle(1);

        setTimeout(() => soundEngine.playJuicyChewCycle(2), 350);

        // Random Superchat trigger
        if (Math.random() > 0.55 && !activeDonation) {
          const don = SUPERCHAT_DONATIONS[Math.floor(Math.random() * SUPERCHAT_DONATIONS.length)];
          setActiveDonation(don);
          soundEngine.playSuperchatDonation();
          setTimeout(() => setActiveDonation(null), 3000);
        }

        // --- PHASE 4: Swallow Gulp (1900ms) ---
        const tSwallow = setTimeout(() => {
          setEatingPhase('swallowing');
          soundEngine.playSwallow();
          soundEngine.playGirlYum();

          if (nextBites <= 0) {
            setStreamFinished(true);
            setEatingPhase('satisfied');
            setGirlExpression('super_happy');
            setMoodState('ecstatic');
            soundEngine.playFanfare();
            soundEngine.playGirlGiggle();
            confetti({
              particleCount: 120,
              spread: 90,
              origin: { y: 0.6 },
            });
            onFinishMukbang(85, 650);
          } else {
            setEatingPhase('satisfied');
            setGirlExpression(moodState === 'ecstatic' ? 'ecstatic_eyes' : 'yum_satisfaction');

            // --- PHASE 5: Return to Ready (2650ms) ---
            const tReturn = setTimeout(() => {
              setHandMotion('idle');
              setEatingPhase('idle');
              setGirlExpression('idle');
              setIsBiting(false);
            }, 750);
            biteTimerRef.current.push(tReturn);
          }
        }, 950);
        biteTimerRef.current.push(tSwallow);
      }, 430);
      biteTimerRef.current.push(tChew);
    }, CONTACT_MS);
    biteTimerRef.current.push(tContact);
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
    setMoodState('neutral');
    setHandMotion('idle');
    soundEngine.playClick();
  };

  // Switch to another Mukbang dish
  const handleSelectFoodItem = (selected: FoodItem) => {
    setActiveFood(selected);
    setBitesLeft(selected.totalBites || 5);
    setStreamFinished(false);
    setIsBiting(false);
    setGirlExpression('idle');
    setMoodState('neutral');
    setHandMotion('idle');
    setShowDishSelector(false);
    soundEngine.playClick();
    soundEngine.playSkewerHandling();
  };

  // Match hand skin tone to character
  const getHandSkinColor = () => {
    return selectedCharacter?.skinTone || '#fed7aa';
  };

  // Render Realistic Hand-to-Mouth Rig (holding skewer, drumstick, chopsticks, burger)
  const renderHandToMouthRig = () => {
    if (handMotion === 'idle') return null;

    const handSkin = getHandSkinColor();
    const animClass =
      handMotion === 'lifting'
        ? 'animate-hand-to-mouth'
        : handMotion === 'contact'
        ? 'translate-x-0 translate-y-0 scale-110 -rotate-12'
        : 'animate-hand-retract';

    return (
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-40 overflow-visible">
        <div className={`relative transition-all duration-300 ${animClass}`}>
          {/* Crumb & Droplet Ejections */}
          {activeCrumbs.map((c) => {
            const animClass =
              c.type === '1'
                ? 'animate-crumb-1'
                : c.type === '2'
                ? 'animate-crumb-2'
                : c.type === '3'
                ? 'animate-crumb-3'
                : c.type === 'b'
                ? 'animate-crumb-b'
                : c.type === 'droplet_r'
                ? 'animate-droplet-r'
                : 'animate-droplet-l';

            return (
              <div
                key={c.id}
                className={`absolute pointer-events-none drop-shadow-sm ${animClass} ${
                  c.isDroplet ? 'rounded-full' : 'rounded-xs'
                }`}
                style={{
                  backgroundColor: c.color,
                  width: `${c.size}px`,
                  height: `${c.size * (c.isDroplet ? 1.25 : 1)}px`,
                  left: `${c.x}px`,
                  top: `${c.y}px`,
                  boxShadow: c.isDroplet
                    ? '0 0 4px rgba(255,255,255,0.8)'
                    : 'inset -1px -1px 2px rgba(0,0,0,0.2)',
                }}
              />
            );
          })}

          {/* Hand Rig Sprite by Food Type */}
          <svg viewBox="0 0 120 160" className="w-32 h-44 drop-shadow-2xl overflow-visible">
            {isTanghulu ? (
              /* Tanghulu Skewer Held in Hand */
              <g>
                <line x1="50" y1="0" x2="50" y2="140" stroke="#d97706" strokeWidth="4.5" strokeLinecap="round" />
                <g transform="translate(50, 22)">
                  <circle cx="0" cy="0" r="16" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" />
                  <circle cx="-5" cy="-3" r="1.3" fill="#fef08a" />
                  <circle cx="4" cy="3" r="1.3" fill="#fef08a" />
                  <circle cx="0" cy="6" r="1.3" fill="#fef08a" />
                  <polygon points="0,-18 5,-13 -5,-13" fill="#22c55e" />
                  {/* Glass sugar shell */}
                  <circle cx="0" cy="0" r="18" fill="none" stroke="#ffffff" strokeWidth="2.8" opacity="0.85" />
                  <path d="M -9,-9 Q -13,0 -8,8" stroke="#ffffff" strokeWidth="3" fill="none" strokeLinecap="round" />
                  <circle cx="-6" cy="-6" r="2.5" fill="#ffffff" />
                </g>
                {/* Finger wrap */}
                <path d="M 36,92 Q 50,86 66,92 L 72,118 Q 50,124 34,118 Z" fill={handSkin} />
                <rect x="40" y="90" width="22" height="6.5" rx="3" fill={handSkin} stroke="#fda4af" strokeWidth="0.8" />
                <rect x="40" y="98" width="22" height="6.5" rx="3" fill={handSkin} stroke="#fda4af" strokeWidth="0.8" />
                <rect x="40" y="106" width="20" height="6.5" rx="3" fill={handSkin} stroke="#fda4af" strokeWidth="0.8" />
                <ellipse cx="44" y="88" rx="5" ry="8" fill={handSkin} transform="rotate(-20, 44, 88)" />
                <ellipse cx="58" y="93" rx="1.5" ry="1.8" fill="#fda4af" />
              </g>
            ) : isChickenBucket || activeFood.id.includes('chicken') ? (
              /* Crispy Fried Drumstick Held in Hand */
              <g>
                <g transform="translate(50, 36)" className={isFoodSquashing ? 'animate-bite-squash' : ''}>
                  {/* Bone Handle */}
                  <rect x="-18" y="24" width="8" height="18" rx="3" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" transform="rotate(-20 -18 24)" />
                  <circle cx="-22" cy="22" r="3.5" fill="#f8fafc" />
                  <circle cx="-16" cy="20" r="3.5" fill="#f8fafc" />
                  {/* Jumbo Golden Meat */}
                  <path
                    d="M -14,14 C -18,0 0,-14 18,-4 C 28,6 26,26 10,26 C -2,26 -10,20 -14,14 Z"
                    fill="#ea580c"
                    stroke="#9a3412"
                    strokeWidth="1.8"
                  />
                  <circle cx="2" cy="4" r="3" fill="#facc15" />
                  <circle cx="12" cy="10" r="2.5" fill="#fef08a" />
                  <circle cx="0" cy="14" r="2.5" fill="#facc15" />
                  <circle cx="8" cy="-2" r="1" fill="#16a34a" />
                </g>
                {/* Hand Holding Drumstick */}
                <path d="M 18,72 Q 48,60 78,72 L 84,104 Q 48,112 14,104 Z" fill={handSkin} />
                <rect x="22" y="58" width="16" height="7" rx="3.5" fill={handSkin} stroke="#fda4af" strokeWidth="0.8" />
                <rect x="40" y="56" width="16" height="7" rx="3.5" fill={handSkin} stroke="#fda4af" strokeWidth="0.8" />
                <rect x="58" y="58" width="16" height="7" rx="3.5" fill={handSkin} stroke="#fda4af" strokeWidth="0.8" />
                <ellipse cx="32" y="61" rx="1.5" ry="1.8" fill="#fda4af" />
              </g>
            ) : isNoodle ? (
              /* Chopsticks Lifting Noodles */
              <g>
                <line x1="20" y1="20" x2="80" y2="40" stroke="#d97706" strokeWidth="4" strokeLinecap="round" />
                <line x1="22" y1="26" x2="82" y2="46" stroke="#b45309" strokeWidth="4" strokeLinecap="round" />
                <g className="animate-slurp">
                  <path d="M 52,36 Q 50,60 54,90 Q 56,120 52,140" stroke={isSpicyRed ? '#ef4444' : '#f59e0b'} strokeWidth="5" strokeLinecap="round" fill="none" />
                  <path d="M 58,38 Q 62,65 58,95 Q 54,125 60,140" stroke={isSpicyRed ? '#dc2626' : '#d97706'} strokeWidth="4.5" strokeLinecap="round" fill="none" />
                </g>
                <ellipse cx="36" cy="42" rx="12" ry="16" fill={handSkin} transform="rotate(-15, 36, 42)" />
                <rect x="32" y="30" width="16" height="7" rx="3.5" fill={handSkin} stroke="#fda4af" strokeWidth="0.8" />
              </g>
            ) : (
              /* Burger / Platter / Snack Hand Rig */
              <g>
                <g transform="translate(48, 38)" className={isFoodSquashing ? 'animate-bite-squash' : ''}>
                  <rect x="-24" y="-18" width="48" height="36" rx="10" fill={activeFood.colorTheme || '#f59e0b'} stroke="#b45309" strokeWidth="1.5" />
                  <ellipse cx="0" cy="-6" rx="20" ry="12" fill="#ffffff" opacity="0.3" />
                </g>
                <path d="M 18,72 Q 48,60 78,72 L 84,104 Q 48,112 14,104 Z" fill={handSkin} />
                <rect x="22" y="58" width="16" height="7" rx="3.5" fill={handSkin} stroke="#fda4af" strokeWidth="0.8" />
                <rect x="40" y="56" width="16" height="7" rx="3.5" fill={handSkin} stroke="#fda4af" strokeWidth="0.8" />
                <rect x="58" y="58" width="16" height="7" rx="3.5" fill={handSkin} stroke="#fda4af" strokeWidth="0.8" />
                <ellipse cx="32" y="61" rx="1.5" ry="1.8" fill="#fda4af" />
              </g>
            )}
          </svg>
        </div>
      </div>
    );
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

        {/* Subs, Camera Zoom, Dish Switcher & Exit */}
        <div className="flex items-center gap-1.5">
          {/* Dish Switcher Button */}
          <button
            onClick={() => {
              soundEngine.playClick();
              setShowDishSelector((prev) => !prev);
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-gradient-to-r from-amber-500 to-pink-500 text-white border border-yellow-200/50 shadow-md active:scale-95 transition-all"
            title="Switch Mukbang Dish"
          >
            <UtensilsCrossed className="w-3.5 h-3.5" />
            <span>Dishes 🍗</span>
          </button>

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

      {/* Dish Selection Modal Overlay (50+ Realistic Dishes) */}
      {showDishSelector && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col p-4 animate-fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-pink-400/30">
            <div>
              <h3 className="font-['Fredoka'] font-extrabold text-base text-yellow-300 flex items-center gap-1.5">
                <span>🍗 Mukbang Menu (50+ Realistic Dishes)</span>
              </h3>
              <p className="text-[10px] text-pink-200">
                Choose a dish to serve on the streamer desk with hand-to-mouth ASMR!
              </p>
            </div>
            <button
              onClick={() => setShowDishSelector(false)}
              className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-full text-xs font-bold"
            >
              Close ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-3 grid grid-cols-2 gap-2">
            {/* Custom Tanghulu option if available */}
            {customTanghulu && (
              <div
                onClick={() => {
                  handleSelectFoodItem({
                    id: customTanghulu.id,
                    name: customTanghulu.name || 'Custom Crystal Tanghulu',
                    category: 'tanghulu',
                    categoryName: 'Tanghulu Skewers',
                    description: 'Handmade fresh fruit skewer with crystal sugar glass snap!',
                    price: 0,
                    isUnlocked: true,
                    totalBites: customTanghulu.totalBites || 5,
                    cookingStyle: 'make_tanghulu',
                    soundType: 'crunch_tanghulu',
                    colorTheme: '#ef4444',
                    tanghuluFruits: customTanghulu.fruits,
                    dishType: 'skewer',
                  });
                }}
                className={`p-2.5 rounded-2xl border flex flex-col items-center text-center cursor-pointer active:scale-95 transition-all ${
                  activeFood.id === customTanghulu.id
                    ? 'bg-rose-500/40 border-rose-300 ring-2 ring-rose-400'
                    : 'bg-white/10 border-white/20 hover:bg-white/15'
                }`}
              >
                <span className="text-2xl mb-1">🍓✨</span>
                <span className="text-xs font-black text-yellow-200 truncate w-full">Custom Tanghulu</span>
                <span className="text-[9px] text-pink-200">Your Fresh Skewer</span>
              </div>
            )}

            {/* List foods from INITIAL_FOODS */}
            {INITIAL_FOODS.map((item) => (
              <div
                key={item.id}
                onClick={() => handleSelectFoodItem(item)}
                className={`p-2.5 rounded-2xl border flex flex-col items-center text-center cursor-pointer active:scale-95 transition-all ${
                  activeFood.id === item.id
                    ? 'bg-rose-500/40 border-rose-300 ring-2 ring-rose-400'
                    : 'bg-white/10 border-white/20 hover:bg-white/15'
                }`}
              >
                <div className="w-12 h-12 flex items-center justify-center">
                  <FoodArt food={item} size="sm" />
                </div>
                <span className="text-xs font-black text-white truncate w-full mt-1">{item.name}</span>
                <span className="text-[9px] text-pink-300 uppercase tracking-wider font-extrabold">
                  {item.dishType || item.category}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Central Live Stream Studio Scene */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 w-full max-w-md mx-auto my-auto">
        {/* Neon Mukbang Channel Sign & Active Dish Name */}
        <div className="w-full flex items-center justify-between px-2 mb-1">
          <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-pink-300 drop-shadow-[0_0_8px_rgba(244,114,182,0.8)]">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>{selectedCharacter.name} ASMR Mukbang Live</span>
          </div>

          {/* Food dish tag */}
          <div className="text-[10px] font-black text-yellow-300 bg-black/40 px-2.5 py-0.5 rounded-full border border-pink-400/30">
            {activeFood.name}
          </div>
        </div>

        {/* Character Mood State Indicator Pill */}
        <div
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black shadow-md border backdrop-blur-md mb-1 transition-all duration-300 ${
            moodState === 'ecstatic'
              ? 'bg-gradient-to-r from-pink-500/40 via-purple-500/40 to-pink-500/40 border-pink-400 text-yellow-200 animate-pulse ring-1 ring-pink-300'
              : moodState === 'surprised'
              ? 'bg-gradient-to-r from-amber-500/40 via-orange-500/40 to-amber-500/40 border-amber-400 text-amber-200 animate-bounce ring-1 ring-amber-300'
              : moodState === 'happy_blush'
              ? 'bg-gradient-to-r from-rose-500/40 via-pink-500/40 to-rose-500/40 border-rose-300 text-pink-200 ring-1 ring-rose-300'
              : moodState === 'spicy_fiery'
              ? 'bg-gradient-to-r from-red-600/50 via-orange-600/50 to-red-600/50 border-red-400 text-red-200 animate-pulse ring-1 ring-red-400'
              : 'bg-black/40 border-pink-400/30 text-pink-200'
          }`}
        >
          <span className="text-sm">
            {moodState === 'ecstatic' && '✨'}
            {moodState === 'surprised' && '😲'}
            {moodState === 'happy_blush' && '🥰'}
            {moodState === 'spicy_fiery' && '🔥'}
            {moodState === 'neutral' && '😋'}
          </span>
          <span className="tracking-wide">
            {moodState === 'ecstatic' && 'Mood: Ecstatic Eyes! ✨'}
            {moodState === 'surprised' && 'Mood: Surprised Mouth! 💥'}
            {moodState === 'happy_blush' && 'Mood: Happy Blush! 🌸'}
            {moodState === 'spicy_fiery' && 'Mood: Fiery Shock! 🌶️'}
            {moodState === 'neutral' && 'Mood: Ready to Mukbang! 💖'}
          </span>
        </div>

        {/* 3D Animated Girl Behind Streamer Desk with Hand-to-Mouth Rig */}
        <div className={`relative flex flex-col items-center transition-all duration-500 ${isCloseUpCamera ? 'scale-115 translate-y-3' : ''}`}>
          <CuteGirl
            character={selectedCharacter}
            expression={girlExpression}
            mood={moodState}
            eatingPhase={eatingPhase}
            activeFoodFruits={isCustomTanghulu && customTanghulu ? customTanghulu.fruits : ['fruit_strawberry', 'fruit_muscat', 'fruit_mandarin', 'fruit_strawberry']}
            bitesLeft={bitesLeft}
            totalBites={totalBites}
            closeUp={isCloseUpCamera}
            size={isCloseUpCamera ? 'xl' : 'lg'}
            onClick={handleCrunchBite}
            hideHandRig={true}
          />

          {/* Articulated Hand-to-Mouth Rig Layer */}
          {renderHandToMouthRig()}
        </div>

        {/* Streamer Mukbang Desk with Realistic Plate/Bucket & Studio Mic */}
        <div className="w-full -mt-10 bg-gradient-to-r from-pink-800 via-purple-800 to-pink-900 rounded-3xl p-4 shadow-2xl border-t-2 border-pink-400/50 flex flex-col items-center relative backdrop-blur-md">
          {/* Professional ASMR Microphone on the desk */}
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

          {/* Cute Desk Companion Pet */}
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

          {/* Central Dish / Chicken Bucket / Platter on Desk */}
          <div
            onClick={handleCrunchBite}
            className={`cursor-pointer group relative flex flex-col items-center transition-transform hover:scale-105 active:scale-95 pt-2 ${
              isFoodSquashing ? 'animate-bite-squash' : ''
            }`}
            title="Tap to pick with hand and feed character!"
          >
            <FoodArt
              food={activeFood}
              bitesRemaining={bitesLeft}
              size="lg"
              isLiftingBite={handMotion === 'lifting'}
            />

            {!streamFinished && (
              <div className="mt-1 flex items-center gap-1.5 bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-white text-xs font-black px-4 py-1.5 rounded-full shadow-lg border border-white/60 group-hover:scale-105 animate-pulse tracking-wide">
                <Hand className="w-3.5 h-3.5" />
                <span>FEED WITH HAND! 🎧✨</span>
              </div>
            )}
          </div>

          {/* Portion Dots & Refill */}
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
            <button
              onClick={handleRefill}
              className="text-[10px] text-yellow-300 hover:text-white flex items-center gap-0.5 ml-2 cursor-pointer font-bold"
              title="Refill dish"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Refill</span>
            </button>
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
            className="w-12 h-12 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 text-white flex items-center justify-center shadow-lg active:scale-90 transition-transform border border-white/30 cursor-pointer"
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
        <div className="absolute inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-amber-400 text-white flex items-center justify-center text-3xl mb-3 shadow-lg">
            👑
          </div>
          <h3 className="font-['Fredoka'] font-extrabold text-2xl text-yellow-300">
            Mukbang Broadcast Complete!
          </h3>
          <p className="text-xs text-pink-200 mt-1 max-w-xs leading-relaxed">
            Your viewers went wild over the ultra-crispy ASMR sounds and delicious reactions!
          </p>

          <div className="w-full max-w-xs grid grid-cols-2 gap-2 my-4">
            <div className="bg-white/10 p-3 rounded-2xl border border-white/20">
              <span className="text-lg font-black text-amber-300">+85 Coins</span>
              <p className="text-[10px] text-pink-200 font-bold">Mukbang Revenue</p>
            </div>
            <div className="bg-white/10 p-3 rounded-2xl border border-white/20">
              <span className="text-lg font-black text-emerald-300">+650 Subs</span>
              <p className="text-[10px] text-pink-200 font-bold">New Followers</p>
            </div>
          </div>

          <div className="flex gap-2 w-full max-w-xs">
            <button
              onClick={handleRefill}
              className="flex-1 py-2.5 rounded-full bg-white/20 hover:bg-white/30 text-white font-extrabold text-xs active:scale-95 transition-all cursor-pointer"
            >
              Eat Again 😋
            </button>
            <button
              onClick={onMakeAnotherTanghulu}
              className="flex-1 py-2.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 text-white font-extrabold text-xs shadow-lg active:scale-95 transition-all cursor-pointer"
            >
              Kitchen Workshop 🍓
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
