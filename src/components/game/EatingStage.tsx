import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { FoodItem, GirlCharacter } from '../../types/game';
import { CuteGirl, GirlExpression, EatingPhase, CharacterMood } from '../character/CuteGirl';
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
  Heart,
} from 'lucide-react';

export type EatingMood = CharacterMood;

interface Props {
  food: FoodItem;
  selectedCharacter: GirlCharacter;
  onFinishMeal: (food: FoodItem) => void;
  onBackToMenu: () => void;
  onCookAgain: () => void;
  tableDecorId?: string;
}

type HandMotionState = 'idle' | 'lifting' | 'contact' | 'retracting';

interface BiteCrumb {
  id: number;
  x: number;
  y: number;
  color: string;
  type: 'tr' | 'tl' | 'b' | 'droplet_r' | 'droplet_l' | 'crumb_up';
  size: number;
  isDroplet?: boolean;
}

export const EatingStage: React.FC<Props> = ({
  food,
  selectedCharacter,
  onFinishMeal,
  onBackToMenu,
  onCookAgain,
  tableDecorId,
}) => {
  const isNoodle = food.category === 'noodles';
  const isSpicyRed = isNoodle && (food.id.includes('spicy') || food.id.includes('fire') || food.id.includes('chili'));
  const isBrownNoodle = isNoodle && (food.id.includes('brown') || food.id.includes('sesame'));
  const isTanghulu = food.category === 'tanghulu';

  const determineInitialMood = (item: FoodItem): CharacterMood => {
    if (isSpicyRed) return 'spicy_fiery';
    if (item.category === 'tanghulu') return 'surprised'; // anticipation of glassy sugar shell crunch
    if (item.category === 'desserts') return 'ecstatic';
    if (item.category === 'noodles' || item.category === 'fastfood') return 'happy_blush';
    return 'neutral';
  };

  const totalBites = food.totalBites || 5;
  const [bitesLeft, setBitesLeft] = useState<number>(totalBites);
  const [moodState, setMoodState] = useState<CharacterMood>(() => determineInitialMood(food));
  const [girlExpression, setGirlExpression] = useState<GirlExpression>('idle');
  const [eatingPhase, setEatingPhase] = useState<EatingPhase>('idle');
  const [handMotion, setHandMotion] = useState<HandMotionState>('idle');
  const [isBiting, setIsBiting] = useState<boolean>(false);
  const [reactionText, setReactionText] = useState<string>('Tap the dish or button to feed me! 💕');
  const [mealFinished, setMealFinished] = useState<boolean>(false);
  const [impactBadge, setImpactBadge] = useState<string | null>(null);
  const [activeCrumbs, setActiveCrumbs] = useState<BiteCrumb[]>([]);
  const [recentBiteIndex, setRecentBiteIndex] = useState<number | null>(null);
  const [isFoodSquashing, setIsFoodSquashing] = useState<boolean>(false);
  const [floatingParticles, setFloatingParticles] = useState<{ id: number; text: string; x: number; y: number }[]>([]);

  const biteTimerRef = useRef<NodeJS.Timeout[]>([]);

  // Clear timers on unmount
  useEffect(() => {
    return () => {
      biteTimerRef.current.forEach(clearTimeout);
    };
  }, []);

  const getHappyQuote = () => {
    if (isSpicyRed) {
      return ['Super fiery and so flavorful! 🌶️', 'Mmm! The spicy red chili kicks in! 🔥', 'So addictive, I love spicy food! 💕'][Math.floor(Math.random() * 3)];
    }
    if (isBrownNoodle) {
      return ['Rich dark savory soy glaze! 🥢', 'Deep, fragrant black bean flavor! ✨', 'So silky and chewy! 🍜'][Math.floor(Math.random() * 3)];
    }
    switch (food.category) {
      case 'tanghulu':
        return ['The crispy sugar shell snap is perfection! 🍓', 'Super glassy and so juicy inside! ✨', 'Unreal crunch sound! 💕'][Math.floor(Math.random() * 3)];
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

  const getCrunchBadgeText = (isInitial: boolean) => {
    if (isSpicyRed) return 'HOT SLURP!! 🌶️';
    if (isNoodle) return 'SLURRRRP!! 🍜';
    if (isTanghulu) {
      if (isInitial) {
        return 'SHARP CRACK!! 💥';
      }
      return 'JUICY SQUISH!! 🍓';
    }
    if (isInitial) return 'CRISP SNAP!! ⚡';
    if (food.category === 'snacks') return 'CRISP CRACKLE!! 🥔';
    if (food.category === 'fastfood') return 'JUICY CHOMP!! 🍔';
    return 'NOM NOM!! 💖';
  };

  const getCrumbColor = () => {
    if (isSpicyRed) return '#ef4444';
    if (isBrownNoodle) return '#78350f';
    if (isNoodle) return '#f59e0b';
    if (isTanghulu) return '#fecdd3';
    if (food.category === 'fastfood') return '#f59e0b';
    if (food.category === 'desserts') return '#f472b6';
    return '#fde047';
  };

  const getJuiceColor = () => {
    if (isSpicyRed) return '#dc2626';
    if (isBrownNoodle) return '#92400e';
    if (isNoodle) return '#ea580c';
    if (isTanghulu) return '#f43f5e';
    if (food.category === 'desserts') return '#ec4899';
    if (food.category === 'drinks') return '#38bdf8';
    return '#fbbf24';
  };

  // --- Realistic Hand-to-Mouth Multi-Phase Eating Sequence ---
  const handleBite = () => {
    if (isBiting || bitesLeft <= 0 || mealFinished) return;

    // Immediately wake & prime AudioContext for zero-latency audio dispatch
    soundEngine.initContext();

    setIsBiting(true);
    biteTimerRef.current.forEach(clearTimeout);
    biteTimerRef.current = [];

    const bitesTaken = totalBites - bitesLeft;
    const currentBiteIdx = bitesTaken; // 0, 1, 2, 3, 4
    const isInitialBite = currentBiteIdx === 0;
    const nextBites = bitesLeft - 1;

    // --- PHASE 1: Smooth Hand-to-Mouth Arc (0ms - 520ms) ---
    // The hand smoothly raises food toward mouth along an arc
    // Character looks down in sweet anticipation, opening mouth
    setHandMotion('lifting');
    setEatingPhase('lifting');
    setGirlExpression('mouth_open');
    soundEngine.playSkewerHandling();
    setReactionText(isNoodle ? 'Bringing noodles up... Aaahh~ 👄' : 'Here it comes... Aaahh~ 👄');

    // --- PHASE 2: EXACT CONTACT WITH MOUTH (Exact Millisecond: 520ms) ---
    // Synchronized to the exact millisecond when the hand animation frame arrives at the mouth
    const CONTACT_POINT_MS = 520;
    const tContact = setTimeout(() => {
      setHandMotion('contact');
      setEatingPhase('biting');
      setRecentBiteIndex(currentBiteIdx);
      setIsFoodSquashing(true);

      // Trigger specific ASMR sound variants and food-reactive character mood expressions at contact
      if (isNoodle) {
        if (isSpicyRed) {
          setMoodState('spicy_fiery');
          setGirlExpression('spicy_reaction');
          setReactionText('FIERY SLURP!! 🌶️ Spicy fire noodle kick!');
          soundEngine.playNoodleSlurp('spicy');
        } else if (isBrownNoodle) {
          setMoodState('happy_blush');
          setGirlExpression('happy_blush');
          setReactionText('SO SILKY & SAVORY!! 🥢 Rich comforting soy glaze!');
          soundEngine.playNoodleSlurp('brown');
        } else {
          setMoodState('happy_blush');
          setGirlExpression('happy_blush');
          setReactionText('WARM SLURRP!! 🍜 Happy blushing comfort!');
          soundEngine.playNoodleSlurp('mild');
        }
      } else if (isTanghulu) {
        if (isInitialBite) {
          // Initial brittle glass sugar shell fracture triggers SURPRISED MOOD with gasped "O" mouth and wide eyes!
          setMoodState('surprised');
          setGirlExpression('surprised_mouth');
          soundEngine.playAsmrVariant('sharp-crack', currentBiteIdx);
          setReactionText('SHARP CRACK!! 💥 Surprised by brittle candy shell snap!');
          if (food.id.includes('popping')) {
            setTimeout(() => soundEngine.playPoppingFizzle(), 140);
          }
        } else {
          // Subsequent bites into succulent juicy fruit trigger ECSTATIC MOOD with dazzling star/heart anime eyes!
          setMoodState('ecstatic');
          setGirlExpression('ecstatic_eyes');
          soundEngine.playAsmrVariant('juicy-mush', currentBiteIdx);
          setReactionText('JUICY SQUISH!! ✨ Ecstatic strawberry sweetness!');
        }
      } else if (food.category === 'desserts') {
        setMoodState('ecstatic');
        setGirlExpression('ecstatic_eyes');
        soundEngine.playAsmrSound(food.soundType);
        setReactionText('MELT-IN-MOUTH!! 💖 Ecstatic dessert bliss!');
      } else if (food.category === 'snacks') {
        if (isInitialBite) {
          setMoodState('surprised');
          setGirlExpression('surprised_mouth');
          soundEngine.playAsmrVariant('sharp-crack', currentBiteIdx);
          setReactionText('CRISP SNAP!! 🥔 Surprised crunchy pop!');
        } else {
          setMoodState('happy_blush');
          setGirlExpression('happy_blush');
          soundEngine.playAsmrVariant('juicy-mush', currentBiteIdx);
          setReactionText('CRUNCHY YUM!! 🥰 Happy blush indulgence!');
        }
      } else if (food.category === 'fastfood') {
        setMoodState('happy_blush');
        setGirlExpression('happy_blush');
        soundEngine.playAsmrVariant(isInitialBite ? 'sharp-crack' : 'juicy-mush', currentBiteIdx);
        setReactionText('JUICY CHOMP!! 🍔 Happy blushing savory delight!');
      } else if (food.category === 'drinks') {
        setMoodState('surprised');
        setGirlExpression('surprised_mouth');
        soundEngine.playAsmrSound(food.soundType);
        setReactionText('CHEWY BOBA POP!! 🧋 Surprised by tapioca pearl!');
      } else {
        setMoodState('ecstatic');
        setGirlExpression('ecstatic_eyes');
        soundEngine.playAsmrSound(food.soundType);
        setReactionText('DELICIOUS BITE!! 😋 Ecstatic flavor!');
      }

      // Visual Contact Impact Badge & Flying Crumbs + Juice Droplets Particle System
      setImpactBadge(getCrunchBadgeText(isInitialBite));
      const crumbColor = getCrumbColor();
      const juiceColor = getJuiceColor();
      const now = Date.now();

      // Coordinated Particle System: Crisp Crumbs, Sugar Crystals, and Juicy Droplets
      const newCrumbs: BiteCrumb[] = [
        // 1. Food Crumb / Sugar Shell pieces
        { id: now + 1, x: 26, y: 10, color: crumbColor, type: 'tr', size: 8 },
        { id: now + 2, x: 28, y: 12, color: '#ffffff', type: 'tl', size: 6 }, // Glassy candy shimmer crumb
        { id: now + 3, x: 30, y: 14, color: crumbColor, type: 'b', size: 7 },
        { id: now + 4, x: 28, y: 8, color: '#fef08a', type: 'crumb_up', size: 6 },
        // 2. Translucent Juice Droplets
        { id: now + 5, x: 27, y: 11, color: juiceColor, type: 'droplet_r', size: 9, isDroplet: true },
        { id: now + 6, x: 29, y: 11, color: juiceColor, type: 'droplet_l', size: 8, isDroplet: true },
        { id: now + 7, x: 28, y: 13, color: juiceColor, type: 'b', size: 6, isDroplet: true },
      ];
      setActiveCrumbs(newCrumbs);

      // Heart / Sparkle particle floating with mood flavor
      setFloatingParticles((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: isSpicyRed ? '🔥' : moodState === 'ecstatic' || isTanghulu ? '✨' : '💖',
          x: 46 + Math.random() * 8,
          y: 35 + Math.random() * 8,
        },
      ]);

      // Decrement visible food portion exactly on contact
      setBitesLeft(nextBites);

      // Squash recovery
      setTimeout(() => setIsFoodSquashing(false), 280);
      setTimeout(() => setImpactBadge(null), 700);

      // --- PHASE 3: Hand Pulls Back & Chewing (950ms - 2000ms) ---
      const tChew = setTimeout(() => {
        setHandMotion('retracting');
        setEatingPhase('chewing');
        setGirlExpression('chewing');
        setReactionText('Chewing happily... 😋');

        // Subsequent chew 1: 'juicy-mush' sound variant
        soundEngine.playAsmrVariant('juicy-mush', 1);

        // Subsequent chew 2: 'juicy-mush' sound variant with varied pitch and wet squelch
        const tChew2 = setTimeout(() => {
          soundEngine.playAsmrVariant('juicy-mush', 2);
        }, 340);
        biteTimerRef.current.push(tChew2);

        // Subsequent chew 3: soft final pulp mastication
        const tChew3 = setTimeout(() => {
          soundEngine.playAsmrVariant('juicy-mush', 3);
        }, 660);
        biteTimerRef.current.push(tChew3);

        // --- PHASE 4: Swallow & Throat Gulp (2000ms - 2700ms) ---
        const tSwallow = setTimeout(() => {
          setHandMotion('idle');
          setEatingPhase('swallowing');
          soundEngine.playSwallow();
          soundEngine.playGirlYum();

          if (isSpicyRed) {
            setMoodState('spicy_fiery');
            setGirlExpression('spicy_reaction');
            setReactionText('Haaah! That spicy red chili is so fiery! 🔥');
            const tEndSpicy = setTimeout(() => {
              setEatingPhase('satisfied');
              finishBiteCycle(nextBites);
            }, 1100);
            biteTimerRef.current.push(tEndSpicy);
          } else if (isTanghulu || food.category === 'desserts') {
            setMoodState('ecstatic');
            setGirlExpression('ecstatic_eyes');
            setReactionText(getHappyQuote());
            const tEndSweet = setTimeout(() => {
              setEatingPhase('satisfied');
              finishBiteCycle(nextBites);
            }, 900);
            biteTimerRef.current.push(tEndSweet);
          } else {
            setMoodState('happy_blush');
            setGirlExpression('happy_blush');
            setReactionText(getHappyQuote());
            const tEndNormal = setTimeout(() => {
              setEatingPhase('satisfied');
              finishBiteCycle(nextBites);
            }, 900);
            biteTimerRef.current.push(tEndNormal);
          }
        }, 950);
        biteTimerRef.current.push(tSwallow);
      }, 430);
      biteTimerRef.current.push(tChew);
    }, CONTACT_POINT_MS);

    biteTimerRef.current.push(tContact);
  };

  const finishBiteCycle = (remainingBites: number) => {
    setIsBiting(false);
    setFloatingParticles([]);
    setActiveCrumbs([]);

    if (remainingBites <= 0) {
      setMealFinished(true);
      setMoodState('ecstatic');
      setGirlExpression('ecstatic_eyes');
      setReactionText('Oishii! Clean plate! That was amazingly delicious! 🎉');
      soundEngine.playFanfare();
      soundEngine.playGirlGiggle();
      confetti({
        particleCount: 95,
        spread: 80,
        origin: { y: 0.6 },
      });
      onFinishMeal(food);
    } else {
      setEatingPhase('idle');
    }
  };

  const handleReplayMeal = () => {
    biteTimerRef.current.forEach(clearTimeout);
    biteTimerRef.current = [];
    setBitesLeft(totalBites);
    setMealFinished(false);
    setHandMotion('idle');
    setIsBiting(false);
    setMoodState(determineInitialMood(food));
    setGirlExpression('idle');
    setEatingPhase('idle');
    setRecentBiteIndex(null);
    setImpactBadge(null);
    setActiveCrumbs([]);
    setReactionText('Fresh portion prepared! Let’s eat again! 😋');
    soundEngine.playClick();
  };

  // --- Hand-to-Mouth Rig SVG Component ---
  // Renders the character's hand holding the active food item smoothly moving towards her lips
  const renderHandToMouthRig = () => {
    if (handMotion === 'idle') return null;

    const motionClass =
      handMotion === 'lifting'
        ? 'animate-hand-to-mouth'
        : handMotion === 'contact'
        ? 'scale-110 -rotate-16'
        : 'animate-hand-retract';

    const handSkin = selectedCharacter.skinTone;
    const bitesTaken = totalBites - bitesLeft;

    return (
      <div
        className={`absolute z-30 pointer-events-none transition-transform duration-200 ${motionClass}`}
        style={{
          top: '32%',
          left: '52%',
          transformOrigin: 'bottom center',
        }}
      >
        <div className="relative -translate-x-1/2 -translate-y-1/2">
          {/* Contact Flash Effect */}
          {handMotion === 'contact' && (
            <div className="absolute -top-4 -left-4 w-20 h-20 rounded-full bg-radial from-amber-300 via-pink-400 to-transparent animate-bite-flash pointer-events-none" />
          )}

          {/* Particle System: Flying Crumbs & Juice Droplets on Tooth Contact */}
          {activeCrumbs.map((c) => {
            const animClass =
              c.type === 'tr'
                ? 'animate-crumb-tr'
                : c.type === 'tl'
                ? 'animate-crumb-tl'
                : c.type === 'b'
                ? 'animate-crumb-b'
                : c.type === 'droplet_r'
                ? 'animate-droplet-r'
                : c.type === 'droplet_l'
                ? 'animate-droplet-l'
                : 'animate-crumb-up';

            return (
              <div
                key={c.id}
                className={`absolute pointer-events-none drop-shadow-sm ${animClass} ${
                  c.isDroplet
                    ? 'rounded-full rounded-tr-xs' // Tear/droplet shape
                    : 'rounded-sm' // Crisp crumb facet
                }`}
                style={{
                  backgroundColor: c.color,
                  width: `${c.size}px`,
                  height: `${c.size * (c.isDroplet ? 1.25 : 1)}px`,
                  left: `${c.x}px`,
                  top: `${c.y}px`,
                  boxShadow: c.isDroplet
                    ? '0 0 4px rgba(255,255,255,0.7), inset 1px 1px 2px rgba(255,255,255,0.8)'
                    : 'inset -1px -1px 2px rgba(0,0,0,0.2)',
                }}
              >
                {/* Glossy specular highlight on droplet */}
                {c.isDroplet && (
                  <div className="w-1 h-1 rounded-full bg-white opacity-80 absolute top-0.5 left-0.5" />
                )}
              </div>
            );
          })}

          {/* Hand Rig Sprite by Food Type */}
          <svg viewBox="0 0 120 160" className="w-32 h-44 drop-shadow-2xl overflow-visible">
            <defs>
              <linearGradient id="skewerStickGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#d97706" />
                <stop offset="50%" stopColor="#fef3c7" />
                <stop offset="100%" stopColor="#b45309" />
              </linearGradient>
            </defs>

            {/* 1. TANGHULU SKEWER HAND RIG */}
            {isTanghulu ? (
              <g>
                {/* Bamboo Skewer Stick */}
                <line x1="50" y1="0" x2="50" y2="140" stroke="url(#skewerStickGrad)" strokeWidth="4.5" strokeLinecap="round" />

                {/* Top Fruit Being Eaten */}
                <g transform="translate(50, 22)">
                  {/* Fruit Ball */}
                  <circle cx="0" cy="0" r="16" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" />
                  {/* Strawberry Seeds */}
                  <circle cx="-5" cy="-3" r="1.3" fill="#fef08a" />
                  <circle cx="4" cy="3" r="1.3" fill="#fef08a" />
                  <circle cx="0" cy="6" r="1.3" fill="#fef08a" />
                  {/* Green Calyx Leaf */}
                  <polygon points="0,-18 5,-13 -5,-13" fill="#22c55e" />

                  {/* Glassy Hard Sugar Coating */}
                  <circle cx="0" cy="0" r="18" fill="none" stroke="#ffffff" strokeWidth="2.8" opacity="0.85" />
                  <path d="M -9,-9 Q -13,0 -8,8" stroke="#ffffff" strokeWidth="3" fill="none" strokeLinecap="round" />
                  <circle cx="-6" cy="-6" r="2.5" fill="#ffffff" />

                  {/* Tooth Bite Mark Cutout on Top Fruit */}
                  {(handMotion === 'contact' || bitesTaken > 0) && (
                    <g className="animate-bite-mark">
                      {/* Scalloped Tooth Bite Cutout */}
                      <path
                        d="M 6,-14 C 11,-10 13,-4 11,2 C 14,8 11,14 6,17 L 18,10 L 18,-10 Z"
                        fill="#fee2e2"
                        stroke="#b91c1c"
                        strokeWidth="1.2"
                      />
                      {/* Inner Strawberry Flesh & Core */}
                      <path
                        d="M 6,-12 C 10,-8 11,-4 9,2 C 12,7 9,12 6,15"
                        stroke="#fca5a5"
                        strokeWidth="2.5"
                        fill="none"
                      />
                      {/* Sweet Glassy Syrup Drip */}
                      <circle cx="12" cy="18" r="2" fill="#ffffff" opacity="0.9" />
                    </g>
                  )}
                </g>

                {/* Lower Fruits on Skewer */}
                {bitesLeft > 2 && (
                  <g transform="translate(50, 56)">
                    <circle cx="0" cy="0" r="14" fill="#84cc16" stroke="#65a30d" strokeWidth="1" />
                    <circle cx="-3" cy="-3" r="15" fill="none" stroke="#ffffff" strokeWidth="2.2" opacity="0.8" />
                  </g>
                )}

                {/* The Character's Hand Wrapping Around The Skewer Stick */}
                {/* Palm */}
                <path d="M 36,92 Q 50,86 66,92 L 72,118 Q 50,124 34,118 Z" fill={handSkin} />
                {/* Fingers Clamped in Front */}
                <rect x="40" y="90" width="22" height="6.5" rx="3" fill={handSkin} stroke="#fda4af" strokeWidth="0.8" />
                <rect x="40" y="98" width="22" height="6.5" rx="3" fill={handSkin} stroke="#fda4af" strokeWidth="0.8" />
                <rect x="40" y="106" width="20" height="6.5" rx="3" fill={handSkin} stroke="#fda4af" strokeWidth="0.8" />
                {/* Thumb Clamping Front */}
                <ellipse cx="44" y="88" rx="5" ry="8" fill={handSkin} transform="rotate(-20, 44, 88)" />
                {/* Glossy Pink Fingernails */}
                <ellipse cx="58" y="93" rx="1.5" ry="1.8" fill="#fda4af" />
                <ellipse cx="58" y="101" rx="1.5" ry="1.8" fill="#fda4af" />
                <ellipse cx="56" y="109" rx="1.5" ry="1.8" fill="#fda4af" />
              </g>
            ) : isNoodle ? (
              /* 2. NOODLES & CHOPSTICKS HAND RIG */
              <g>
                {/* Wooden Chopsticks */}
                <line x1="20" y1="20" x2="80" y2="40" stroke="#d97706" strokeWidth="4" strokeLinecap="round" />
                <line x1="22" y1="26" x2="82" y2="46" stroke="#b45309" strokeWidth="4" strokeLinecap="round" />

                {/* Cluster of Lifted Noodles */}
                <g className="animate-slurp">
                  <path
                    d="M 52,36 Q 50,60 54,90 Q 56,120 52,140"
                    stroke={isSpicyRed ? '#ef4444' : isBrownNoodle ? '#78350f' : '#f59e0b'}
                    strokeWidth="5"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path
                    d="M 58,38 Q 62,65 58,95 Q 54,125 60,140"
                    stroke={isSpicyRed ? '#dc2626' : isBrownNoodle ? '#451a03' : '#f59e0b'}
                    strokeWidth="4.5"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path
                    d="M 46,38 Q 42,65 48,95 Q 52,125 46,140"
                    stroke={isSpicyRed ? '#b91c1c' : isBrownNoodle ? '#78350f' : '#fbbf24'}
                    strokeWidth="4"
                    strokeLinecap="round"
                    fill="none"
                  />
                </g>

                {/* Hand Holding Chopsticks */}
                <ellipse cx="36" cy="42" rx="12" ry="16" fill={handSkin} transform="rotate(-15, 36, 42)" />
                <rect x="32" y="30" width="16" height="7" rx="3.5" fill={handSkin} stroke="#fda4af" strokeWidth="0.8" />
                <rect x="30" y="38" width="18" height="7" rx="3.5" fill={handSkin} stroke="#fda4af" strokeWidth="0.8" />
                <ellipse cx="45" cy="33" rx="1.8" ry="2" fill="#fda4af" />
              </g>
            ) : (
              /* 3. BURGER / SNACK / CHICKEN / CAKE HAND RIG */
              <g>
                {/* Food Item Held in Hand */}
                <g transform="translate(48, 38)" className={isFoodSquashing ? 'animate-bite-squash' : ''}>
                  {/* Miniature Food Visual */}
                  <rect x="-24" y="-18" width="48" height="36" rx="10" fill={food.colorTheme || '#f59e0b'} stroke="#b45309" strokeWidth="1.5" />
                  <ellipse cx="0" cy="-6" rx="20" ry="12" fill="#ffffff" opacity="0.3" />

                  {/* Scalloped Bite Cutout on Food Item */}
                  {(handMotion === 'contact' || bitesTaken > 0) && (
                    <g className="animate-bite-mark">
                      {/* Deep Tooth Cutout */}
                      <path
                        d="M -6,-19 C -2,-13 4,-13 8,-19 C 12,-13 18,-13 22,-19 L 24,-8 L -8,-8 Z"
                        fill="#fee2e2"
                        stroke="#b45309"
                        strokeWidth="1.2"
                      />
                      {/* Inner Filling Texture */}
                      <ellipse cx="8" cy="-14" rx="4" ry="2" fill="#ef4444" />
                      <circle cx="2" cy="-14" r="1.5" fill="#facc15" />
                    </g>
                  )}
                </g>

                {/* Hand Cradling Food */}
                <path d="M 18,72 Q 48,60 78,72 L 84,104 Q 48,112 14,104 Z" fill={handSkin} />
                <rect x="22" y="58" width="16" height="7" rx="3.5" fill={handSkin} stroke="#fda4af" strokeWidth="0.8" />
                <rect x="40" y="56" width="16" height="7" rx="3.5" fill={handSkin} stroke="#fda4af" strokeWidth="0.8" />
                <rect x="58" y="58" width="16" height="7" rx="3.5" fill={handSkin} stroke="#fda4af" strokeWidth="0.8" />
                <ellipse cx="32" y="61" rx="1.5" ry="1.8" fill="#fda4af" />
                <ellipse cx="50" y="59" rx="1.5" ry="1.8" fill="#fda4af" />
                <ellipse cx="68" y="61" rx="1.5" ry="1.8" fill="#fda4af" />
              </g>
            )}
          </svg>
        </div>
      </div>
    );
  };

  // --- Progressive Bite Marks Overlay for Central Food on Table ---
  const renderProgressiveBiteMarks = () => {
    const bitesTaken = totalBites - bitesLeft;
    if (bitesTaken <= 0 && !isFoodSquashing) return null;

    return (
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
          {/* Bite 1: Top-Right Scalloped Tooth Mark */}
          {bitesTaken >= 1 && (
            <g className={recentBiteIndex === 0 ? 'animate-bite-mark' : ''}>
              <path
                d="M 62,22 C 67,27 71,28 75,24 C 79,28 83,27 86,22 L 86,32 L 62,32 Z"
                fill="#fee2e2"
                stroke="#dc2626"
                strokeWidth="1"
                opacity="0.95"
              />
              <circle cx="70" cy="28" r="1.2" fill="#ef4444" />
              <circle cx="78" cy="27" r="1" fill="#fef08a" />
            </g>
          )}

          {/* Bite 2: Top-Left Tooth Mark */}
          {bitesTaken >= 2 && (
            <g className={recentBiteIndex === 1 ? 'animate-bite-mark' : ''}>
              <path
                d="M 14,24 C 18,29 22,29 26,25 C 30,30 35,29 39,24 L 39,33 L 14,33 Z"
                fill="#fee2e2"
                stroke="#dc2626"
                strokeWidth="1"
                opacity="0.95"
              />
              <circle cx="24" cy="29" r="1.2" fill="#ef4444" />
              <circle cx="32" cy="28" r="1" fill="#fef08a" />
            </g>
          )}

          {/* Bite 3: Central Deep Chomp */}
          {bitesTaken >= 3 && (
            <g className={recentBiteIndex === 2 ? 'animate-bite-mark' : ''}>
              <path
                d="M 36,36 C 42,44 48,44 54,38 C 60,44 66,43 72,36 L 72,48 L 36,48 Z"
                fill="#fee2e2"
                stroke="#dc2626"
                strokeWidth="1.2"
                opacity="0.95"
              />
              {/* Exposed Juicy Core Texture */}
              <ellipse cx="54" cy="42" rx="6" ry="2.5" fill="#ef4444" />
              <circle cx="46" cy="42" r="1.2" fill="#fef08a" />
              <circle cx="62" cy="41" r="1.2" fill="#fef08a" />
            </g>
          )}

          {/* Bite 4: Major Chomp Cutout */}
          {bitesTaken >= 4 && (
            <g className={recentBiteIndex === 3 ? 'animate-bite-mark' : ''}>
              <path
                d="M 28,50 C 36,58 44,58 52,51 C 60,58 68,57 76,50 L 76,64 L 28,64 Z"
                fill="#fee2e2"
                stroke="#dc2626"
                strokeWidth="1.2"
                opacity="0.95"
              />
              <circle cx="44" cy="56" r="1.5" fill="#fef08a" />
              <circle cx="58" cy="55" r="1.5" fill="#fef08a" />
            </g>
          )}

          {/* Scalloped Sugar Glass Cracks for Tanghulu */}
          {isTanghulu && bitesTaken >= 1 && (
            <g opacity="0.8">
              <line x1="58" y1="20" x2="64" y2="14" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
              <line x1="64" y1="14" x2="72" y2="16" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="64" y1="14" x2="62" y2="8" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" />
            </g>
          )}
        </svg>
      </div>
    );
  };

  return (
    <div className="relative w-full h-full min-h-screen flex flex-col justify-between p-4 select-none overflow-hidden bg-gradient-to-b from-purple-100 via-pink-100 to-amber-50">
      {/* Top Header */}
      <div className="w-full flex items-center justify-between z-20">
        <button
          onClick={onBackToMenu}
          className="flex items-center gap-1 px-3 py-1.5 bg-white/90 hover:bg-white text-purple-700 text-xs font-bold rounded-full shadow-xs border border-purple-200 transition-all active:scale-95 cursor-pointer"
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
          className="flex items-center gap-1 px-3 py-1.5 bg-white/90 hover:bg-white text-pink-600 text-xs font-bold rounded-full shadow-xs border border-pink-200 transition-all active:scale-95 cursor-pointer"
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

        {/* Character Mood State Indicator Pill */}
        <div
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black shadow-md border backdrop-blur-md mb-2 transition-all duration-300 ${
            moodState === 'ecstatic'
              ? 'bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-pink-500/20 border-pink-400 text-pink-700 animate-pulse ring-1 ring-pink-300'
              : moodState === 'surprised'
              ? 'bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 border-amber-400 text-amber-700 animate-bounce ring-1 ring-amber-300'
              : moodState === 'happy_blush'
              ? 'bg-gradient-to-r from-rose-500/20 via-pink-500/20 to-rose-500/20 border-rose-300 text-rose-700 ring-1 ring-rose-300'
              : moodState === 'spicy_fiery'
              ? 'bg-gradient-to-r from-red-500/25 via-orange-500/25 to-red-500/25 border-red-400 text-red-700 animate-pulse ring-1 ring-red-400'
              : 'bg-white/90 border-purple-200 text-purple-700'
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
            {moodState === 'neutral' && 'Mood: Ready to Eat! 💕'}
          </span>
        </div>

        {/* Contact Crunch Badge Pop-up */}
        {impactBadge && (
          <div className="absolute top-12 z-50 px-4 py-1.5 bg-gradient-to-r from-amber-400 via-pink-500 to-rose-500 text-white font-black text-sm rounded-full shadow-2xl border-2 border-white animate-bounce drop-shadow-md">
            {impactBadge}
          </div>
        )}

        {/* Character Stage Container */}
        <div className="relative flex flex-col items-center">
          <CuteGirl
            character={selectedCharacter}
            expression={girlExpression}
            mood={moodState}
            eatingPhase={eatingPhase}
            bitesLeft={bitesLeft}
            totalBites={totalBites}
            size="xl"
            onClick={handleBite}
            hideHandRig={true}
          />

          {/* Articulated Hand-to-Mouth Rig Layer */}
          {renderHandToMouthRig()}
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

          {/* Centered Food on Table with Progressive Bite Marks */}
          <div
            onClick={handleBite}
            className={`cursor-pointer group relative flex flex-col items-center transition-transform hover:scale-105 active:scale-95 ${
              isFoodSquashing ? 'animate-bite-squash' : ''
            }`}
            title="Tap dish to feed a delicious portion!"
          >
            <div className="relative">
              <FoodArt
                food={food}
                bitesRemaining={bitesLeft}
                size="lg"
                isLiftingBite={handMotion === 'lifting'}
              />

              {/* Progressive Bite Marks & Tooth Indentations Overlay */}
              {renderProgressiveBiteMarks()}
            </div>

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
            className={`w-full py-4 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-extrabold text-base rounded-2xl shadow-lg flex items-center justify-center gap-2 border-2 border-white/60 active:scale-95 transition-transform cursor-pointer ${
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
                className="py-3 bg-pink-100 hover:bg-pink-200 text-pink-700 font-bold text-xs rounded-xl border border-pink-300 flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Eat Again</span>
              </button>
              <button
                onClick={onCookAgain}
                className="py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
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
