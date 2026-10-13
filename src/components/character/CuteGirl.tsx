import React, { useEffect, useState } from 'react';
import { GirlCharacter } from '../../types/game';

export type GirlExpression =
  | 'idle'
  | 'waving'
  | 'mouth_open'
  | 'slurping'
  | 'chewing'
  | 'spicy_reaction'
  | 'super_happy'
  | 'yum_satisfaction'
  | 'ecstatic_eyes'
  | 'surprised_mouth'
  | 'happy_blush';

export type CharacterMood =
  | 'neutral'
  | 'ecstatic'
  | 'surprised'
  | 'happy_blush'
  | 'spicy_fiery';

export type EatingPhase =
  | 'idle'
  | 'lifting'
  | 'biting'
  | 'chewing'
  | 'swallowing'
  | 'satisfied';

interface Props {
  character: GirlCharacter;
  expression?: GirlExpression;
  mood?: CharacterMood;
  eatingPhase?: EatingPhase;
  activeFoodFruits?: string[];
  bitesLeft?: number;
  totalBites?: number;
  closeUp?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onClick?: () => void;
  hideHandRig?: boolean;
}

export const CuteGirl: React.FC<Props> = ({
  character,
  expression = 'idle',
  mood = 'neutral',
  eatingPhase,
  activeFoodFruits = ['fruit_strawberry', 'fruit_muscat', 'fruit_mandarin', 'fruit_strawberry'],
  bitesLeft = 4,
  totalBites = 4,
  closeUp = false,
  size = 'lg',
  className = '',
  onClick,
  hideHandRig = false,
}) => {
  const [isBlinking, setIsBlinking] = useState(false);
  const [chewFrame, setChewFrame] = useState(0);

  // Derive active expression if driven by eatingPhase, mood, and custom expressions
  const currentExpression: GirlExpression = (() => {
    // If an explicit specialized expression is set, give it top priority
    if (
      expression === 'surprised_mouth' ||
      expression === 'ecstatic_eyes' ||
      expression === 'happy_blush' ||
      expression === 'spicy_reaction' ||
      expression === 'slurping' ||
      expression === 'super_happy'
    ) {
      return expression;
    }

    if (eatingPhase) {
      if (eatingPhase === 'lifting') return 'mouth_open';
      if (eatingPhase === 'biting') {
        if (mood === 'surprised') return 'surprised_mouth';
        return 'mouth_open';
      }
      if (eatingPhase === 'chewing') return 'chewing';
      if (eatingPhase === 'swallowing' || eatingPhase === 'satisfied') {
        if (mood === 'ecstatic') return 'ecstatic_eyes';
        if (mood === 'happy_blush') return 'happy_blush';
        if (mood === 'spicy_fiery') return 'spicy_reaction';
        return 'yum_satisfaction';
      }
    }

    // Mood fallbacks when not actively in a phase override
    if (mood === 'ecstatic') return 'ecstatic_eyes';
    if (mood === 'surprised') return 'surprised_mouth';
    if (mood === 'happy_blush') return 'happy_blush';
    if (mood === 'spicy_fiery') return 'spicy_reaction';

    return expression || 'idle';
  })();

  // Natural Blinking Loop
  useEffect(() => {
    if (
      currentExpression === 'chewing' ||
      currentExpression === 'yum_satisfaction' ||
      currentExpression === 'super_happy' ||
      eatingPhase === 'biting'
    ) {
      return;
    }
    const interval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 140);
    }, 3400 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, [currentExpression, eatingPhase]);

  // Rhythmic Chewing Jaw Animation
  useEffect(() => {
    if (currentExpression !== 'chewing') return;
    const interval = setInterval(() => {
      setChewFrame((prev) => (prev + 1) % 4);
    }, 160);
    return () => clearInterval(interval);
  }, [currentExpression]);

  const activeOutfit =
    character.outfits.find((o) => o.id === character.selectedOutfitId) ||
    character.outfits[0];

  const dressColor = activeOutfit ? activeOutfit.dressColor : character.baseOutfitColor;
  const accentColor = activeOutfit ? activeOutfit.accentColor : '#ffffff';

  const sizeClasses = {
    sm: 'w-20 h-28',
    md: 'w-32 h-44',
    lg: 'w-56 h-72',
    xl: closeUp ? 'w-80 h-[430px]' : 'w-72 h-96',
  }[size];

  const prefix = `char_${character.id}`;

  // Unique 3D Jaw & Face Contours per Character
  const getFacePath = () => {
    switch (character.id) {
      case 'hana':
        // Elegant heart-shaped jaw with delicate chin
        return 'M 59,96 C 59,50 82,40 110,40 C 138,40 161,50 161,96 C 161,130 134,148 110,149 C 86,148 59,130 59,96 Z';
      case 'zoya':
        // Defined high cheekbones & sculpted jawline
        return 'M 58,95 C 57,50 82,39 110,39 C 138,39 163,50 162,95 C 162,126 136,149 110,150 C 84,149 58,126 58,95 Z';
      case 'lulu':
        // Soft round anime face with cute button chin
        return 'M 60,98 C 60,52 82,42 110,42 C 138,42 160,52 160,98 C 160,134 135,147 110,147 C 85,147 60,134 60,98 Z';
      case 'maya':
        // Striking diamond-contoured jaw
        return 'M 60,94 C 59,48 83,38 110,38 C 137,38 161,48 160,94 C 159,128 133,148 110,149 C 87,148 61,128 60,94 Z';
      case 'sakura':
        // Petite V-line chin with soft cheeks
        return 'M 61,97 C 61,54 84,43 110,43 C 136,43 159,54 159,97 C 159,132 133,147 110,148 C 87,147 61,132 61,97 Z';
      case 'amber':
        // Soft square-oval athletic model jaw
        return 'M 59,96 C 59,51 83,41 110,41 C 137,41 161,51 161,96 C 161,131 135,148 110,149 C 85,148 59,131 59,96 Z';
      case 'iris':
        // Sharp angular modern jaw
        return 'M 59,95 C 58,49 83,39 110,39 C 137,39 162,49 161,95 C 160,129 135,148 110,149 C 85,148 60,129 59,95 Z';
      case 'chloe':
        // Soft rounded baby-face curves
        return 'M 61,98 C 61,54 83,44 110,44 C 137,44 159,54 159,98 C 159,133 135,147 110,147 C 85,147 61,133 61,98 Z';
      case 'mimi':
        // Youthful plump cheeks
        return 'M 60,99 C 60,54 83,43 110,43 C 137,43 160,54 160,99 C 160,135 136,148 110,148 C 84,148 60,135 60,99 Z';
      default:
        // Aaima: Sweet classic feminine oval
        return 'M 60,97 C 60,52 83,41 110,41 C 137,41 160,52 160,97 C 160,132 135,148 110,148 C 85,148 60,132 60,97 Z';
    }
  };

  // Unique Eye Coordinates & Shape by Character
  const isLookingAtFood = eatingPhase === 'lifting' || eatingPhase === 'biting';
  const pupilOffsetY = isLookingAtFood ? 2.5 : 0;
  const pupilOffsetX = isLookingAtFood ? -0.8 : 0;

  // Hand-to-Mouth Skewer Coordinates
  const getHandPosition = () => {
    switch (eatingPhase) {
      case 'lifting':
        return { armX: 118, armY: 158, stickAngle: -18, scale: 1.05 };
      case 'biting':
        return { armX: 110, armY: 138, stickAngle: -22, scale: 1.12 };
      case 'chewing':
        return { armX: 142, armY: 205, stickAngle: -6, scale: 0.98 };
      case 'swallowing':
      case 'satisfied':
        return { armX: 152, armY: 215, stickAngle: 0, scale: 0.95 };
      default:
        // Idle
        return { armX: 146, armY: 200, stickAngle: -10, scale: 1.0 };
    }
  };

  const handPose = getHandPosition();
  const showActiveHandRig = Boolean(eatingPhase) && !hideHandRig;

  // Jaw displacement during chew
  const jawShiftY = currentExpression === 'chewing' ? (chewFrame % 2 === 0 ? 2.2 : 0) : 0;
  const jawShiftX = currentExpression === 'chewing' ? (chewFrame === 1 ? 1 : chewFrame === 3 ? -1 : 0) : 0;

  return (
    <div
      onClick={onClick}
      className={`relative inline-block select-none cursor-pointer transition-all duration-300 ${sizeClasses} ${className}`}
    >
      <svg
        viewBox="0 0 220 280"
        className="w-full h-full overflow-visible drop-shadow-xl"
      >
        <defs>
          {/* 3D Soft Ambient Occlusion / Cheek Blush Filter */}
          <filter id={`${prefix}_blush`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="5.2" />
          </filter>

          <filter id={`${prefix}_rimGlow`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.0" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* 3D Realistic Skin Subsurface Scattering Gradient */}
          <radialGradient id={`${prefix}_skinGrad`} cx="42%" cy="40%" r="62%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
            <stop offset="45%" stopColor={character.skinTone} />
            <stop offset="85%" stopColor={character.skinTone} />
            <stop offset="100%" stopColor="#fda4af" stopOpacity="0.4" />
          </radialGradient>

          {/* 3D Volumetric Hair Light Gradient */}
          <linearGradient id={`${prefix}_hairVol`} x1="0%" y1="0%" x2="70%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
            <stop offset="25%" stopColor={character.hairColor} />
            <stop offset="70%" stopColor={character.hairColor} />
            <stop offset="100%" stopColor="#0f172a" stopOpacity="0.5" />
          </linearGradient>

          {/* 3D Glass Cornea & Deep Iris Spherical Gradient */}
          <radialGradient id={`${prefix}_iris3D`} cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
            <stop offset="30%" stopColor={character.eyeColor} />
            <stop offset="75%" stopColor={character.eyeColor} />
            <stop offset="100%" stopColor="#020617" />
          </radialGradient>

          {/* 3D Fabric Shading Gradient */}
          <linearGradient id={`${prefix}_dress3D`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
            <stop offset="20%" stopColor={dressColor} />
            <stop offset="80%" stopColor={dressColor} />
            <stop offset="100%" stopColor="#0f172a" stopOpacity="0.35" />
          </linearGradient>
        </defs>

        {/* ============================================================== */}
        {/* --- 1. BACK HAIR VOLUME (Behind Neck & Torso) --- */}
        {/* ============================================================== */}
        {character.hairStyle === 'long_flowing' && (
          <g>
            <path
              d="M 58,92 C 18,140 12,220 42,258 C 65,225 68,175 78,128 Z"
              fill={`url(#${prefix}_hairVol)`}
            />
            <path
              d="M 162,92 C 202,140 208,220 178,258 C 155,225 152,175 142,128 Z"
              fill={`url(#${prefix}_hairVol)`}
            />
          </g>
        )}

        {character.hairStyle === 'pigtails' && (
          <g>
            {/* Aaima: Soft flowing twin tails with realistic wave */}
            <path
              d="M 50,88 C 6,108 0,180 32,224 C 48,188 46,136 56,98 Z"
              fill={`url(#${prefix}_hairVol)`}
            />
            <path
              d="M 170,88 C 214,108 220,180 188,224 C 172,188 174,136 164,98 Z"
              fill={`url(#${prefix}_hairVol)`}
            />
            {/* Twin Silky Ribbons */}
            <circle cx="51" cy="90" r="9" fill={character.ribbonColor} />
            <circle cx="169" cy="90" r="9" fill={character.ribbonColor} />
            <circle cx="51" cy="90" r="3.5" fill="#ffffff" />
            <circle cx="169" cy="90" r="3.5" fill="#ffffff" />
          </g>
        )}

        {character.hairStyle === 'twin_buns' && (
          <g>
            {/* Mimi: High Volumetric Spherical Buns */}
            <circle cx="38" cy="60" r="25" fill={`url(#${prefix}_hairVol)`} />
            <circle cx="38" cy="60" r="11" fill={character.ribbonColor} />
            <circle cx="182" cy="60" r="25" fill={`url(#${prefix}_hairVol)`} />
            <circle cx="182" cy="60" r="11" fill={character.ribbonColor} />
          </g>
        )}

        {character.hairStyle === 'wavy_curls' && (
          <g>
            {/* Zoya: Rich Cascading Volumetric Chestnut Waves */}
            <path
              d="M 54,92 C 8,135 12,205 34,242 C 50,256 66,224 60,182 C 55,145 68,124 76,102 Z"
              fill={`url(#${prefix}_hairVol)`}
            />
            <path
              d="M 166,92 C 212,135 208,205 186,242 C 170,256 154,224 160,182 C 165,145 152,124 144,102 Z"
              fill={`url(#${prefix}_hairVol)`}
            />
          </g>
        )}

        {character.hairStyle === 'ponytail' && (
          <g>
            {/* Iris: High Curved Ponytail */}
            <path
              d="M 154,68 C 210,62 222,142 192,190 C 172,152 166,110 158,84 Z"
              fill={`url(#${prefix}_hairVol)`}
            />
            <circle cx="155" cy="72" r="10" fill={character.ribbonColor} />
          </g>
        )}

        {character.hairStyle === 'hime_cut' && (
          <g>
            {/* Maya: Sleek Midnight Straight Strands */}
            <path
              d="M 57,88 C 28,140 22,235 44,272 C 64,242 67,180 74,124 Z"
              fill={`url(#${prefix}_hairVol)`}
            />
            <path
              d="M 163,88 C 192,140 198,235 176,272 C 156,242 153,180 146,124 Z"
              fill={`url(#${prefix}_hairVol)`}
            />
          </g>
        )}

        {/* ============================================================== */}
        {/* --- 2. 3D TORSO, NECK & CLOTHING --- */}
        {/* ============================================================== */}
        <g id="torso">
          {/* Slender 3D Neck with Shadow */}
          <path
            d="M 101,138 L 101,156 C 101,161 119,161 119,156 L 119,138 Z"
            fill={character.skinTone}
          />
          {/* Ambient Occlusion under chin */}
          <path
            d="M 101,138 Q 110,146 119,138"
            stroke="#9f1239"
            strokeWidth="1.8"
            fill="none"
            opacity="0.3"
          />

          {/* Torso & Dress Base with 3D Lighting */}
          <path
            d="M 76,163 L 144,163 L 160,248 C 130,260 90,260 60,248 Z"
            fill={`url(#${prefix}_dress3D)`}
          />

          {/* Ruffle Collar / Accent Detail */}
          <path
            d="M 86,163 Q 110,182 134,163 L 128,181 Q 110,192 92,181 Z"
            fill={accentColor}
          />

          {/* Waist Ribbon Belt */}
          <rect x="78" y="196" width="64" height="10" rx="5" fill={character.ribbonColor} />
          <circle cx="110" cy="201" r="5" fill="#ffffff" />
          <circle cx="110" cy="201" r="2.8" fill={character.ribbonColor} />

          {/* Left Rest Arm */}
          <path
            d="M 76,165 Q 56,198 66,230"
            stroke={character.skinTone}
            strokeWidth="12"
            strokeLinecap="round"
            fill="none"
          />
          <path d="M 72,163 Q 63,180 76,186 Z" fill={dressColor} />

          {/* Right Arm: Natural or Controlled by Hand-To-Mouth Eating Rig */}
          {!showActiveHandRig && currentExpression === 'waving' && (
            <g className="origin-[140px_170px] animate-bounce">
              <path
                d="M 144,165 Q 174,138 182,110"
                stroke={character.skinTone}
                strokeWidth="12"
                strokeLinecap="round"
                fill="none"
              />
              <circle cx="182" cy="106" r="8" fill={character.skinTone} />
            </g>
          )}

          {!showActiveHandRig && currentExpression !== 'waving' && (
            <g>
              <path
                d="M 144,165 Q 164,198 154,230"
                stroke={character.skinTone}
                strokeWidth="12"
                strokeLinecap="round"
                fill="none"
              />
              <path d="M 148,163 Q 157,180 144,186 Z" fill={dressColor} />
            </g>
          )}
        </g>

        {/* ============================================================== */}
        {/* --- 3. 3D HEAD & DISTINCT FACIAL STRUCTURE --- */}
        {/* ============================================================== */}
        <g id="head" transform={`translate(${jawShiftX}, ${jawShiftY})`}>
          {/* Volumetric Head Mesh */}
          <path
            d={getFacePath()}
            fill={`url(#${prefix}_skinGrad)`}
          />

          {/* 3D Soft Ambient Occlusion Rim Shadow */}
          <path
            d={getFacePath()}
            fill="none"
            stroke="#ffffff"
            strokeWidth="1.2"
            opacity="0.5"
          />

          {/* Airbrushed 3D Rosy Cheeks & Dynamic Mood Flush */}
          <ellipse
            cx="74"
            cy="114"
            rx={currentExpression === 'happy_blush' || mood === 'happy_blush' ? '16' : '13'}
            ry={currentExpression === 'happy_blush' || mood === 'happy_blush' ? '9.5' : '7.5'}
            fill={currentExpression === 'spicy_reaction' || mood === 'spicy_fiery' ? '#ef4444' : '#fb7185'}
            opacity={
              currentExpression === 'happy_blush' || mood === 'happy_blush'
                ? '0.95'
                : currentExpression === 'spicy_reaction' || mood === 'spicy_fiery'
                ? '0.85'
                : currentExpression === 'super_happy' ||
                  currentExpression === 'chewing' ||
                  eatingPhase === 'chewing'
                ? '0.75'
                : '0.45'
            }
            filter={`url(#${prefix}_blush)`}
          />
          <ellipse
            cx="146"
            cy="114"
            rx={currentExpression === 'happy_blush' || mood === 'happy_blush' ? '16' : '13'}
            ry={currentExpression === 'happy_blush' || mood === 'happy_blush' ? '9.5' : '7.5'}
            fill={currentExpression === 'spicy_reaction' || mood === 'spicy_fiery' ? '#ef4444' : '#fb7185'}
            opacity={
              currentExpression === 'happy_blush' || mood === 'happy_blush'
                ? '0.95'
                : currentExpression === 'spicy_reaction' || mood === 'spicy_fiery'
                ? '0.85'
                : currentExpression === 'super_happy' ||
                  currentExpression === 'chewing' ||
                  eatingPhase === 'chewing'
                ? '0.75'
                : '0.45'
            }
            filter={`url(#${prefix}_blush)`}
          />

          {/* Happy Blush Anime Hash Lines (///) & Nose Glow */}
          {(currentExpression === 'happy_blush' || mood === 'happy_blush') && (
            <g>
              {/* Soft horizontal bridge-of-nose flush */}
              <ellipse cx="110" cy="113" rx="16" ry="4.5" fill="#fb7185" opacity="0.65" filter={`url(#${prefix}_blush)`} />
              {/* Left Cheek Cute Anime Hatching (///) */}
              <g stroke="#e11d48" strokeWidth="2.2" strokeLinecap="round" opacity="0.85">
                <line x1="67" y1="110" x2="72" y2="118" />
                <line x1="73" y1="110" x2="78" y2="118" />
                <line x1="79" y1="110" x2="84" y2="118" />
              </g>
              {/* Right Cheek Cute Anime Hatching (///) */}
              <g stroke="#e11d48" strokeWidth="2.2" strokeLinecap="round" opacity="0.85">
                <line x1="136" y1="110" x2="141" y2="118" />
                <line x1="142" y1="110" x2="147" y2="118" />
                <line x1="148" y1="110" x2="153" y2="118" />
              </g>
            </g>
          )}

          {/* Spicy Fiery Sweat Droplets on Forehead / Temple */}
          {(currentExpression === 'spicy_reaction' || mood === 'spicy_fiery') && (
            <g>
              {/* Blue/Cyan sweat tear beads */}
              <path d="M 62,79 C 59,84 65,88 65,83 C 65,80 62,79 62,79 Z" fill="#38bdf8" opacity="0.9" />
              <path d="M 154,79 C 151,84 157,88 157,83 C 157,80 154,79 154,79 Z" fill="#38bdf8" opacity="0.9" />
            </g>
          )}

          {/* ============================================================ */}
          {/* --- 3D EXPRESSIVE EYES WITH VISUAL TRACKING & MOOD STATES --- */}
          {/* ============================================================ */}
          {isBlinking ||
          currentExpression === 'yum_satisfaction' ||
          currentExpression === 'happy_blush' ||
          (eatingPhase === 'chewing' && currentExpression !== 'surprised_mouth' && mood !== 'surprised') ? (
            /* Relaxed Blissful Curved Eyelashes (^.^) with Lush Lash Wings */
            <g stroke="#0f172a" strokeWidth="3.6" strokeLinecap="round" fill="none">
              <path d="M 75,101 Q 88,89 101,101" />
              <path d="M 119,101 Q 132,89 145,101" />
              {/* Eyelash wings */}
              <path d="M 101,101 Q 105,96 107,97" strokeWidth="2.5" />
              <path d="M 145,101 Q 149,96 151,97" strokeWidth="2.5" />
              {/* Cute blissful crinkle when in happy blush mood */}
              {(currentExpression === 'happy_blush' || mood === 'happy_blush') && (
                <g stroke="#f43f5e" strokeWidth="1.6" opacity="0.75">
                  <path d="M 78,106 Q 88,110 98,106" />
                  <path d="M 122,106 Q 132,110 142,106" />
                </g>
              )}
            </g>
          ) : currentExpression === 'ecstatic_eyes' ||
            currentExpression === 'super_happy' ||
            (eatingPhase === 'satisfied' && mood === 'ecstatic') ? (
            /* Dazzling Ecstatic Star & Heart Sparkle Anime Eyes */
            <g>
              {/* Radiant Eye glow background */}
              <ellipse cx="88" cy="100" rx="14" ry="15" fill="#fdf2f8" />
              <ellipse cx="132" cy="100" rx="14" ry="15" fill="#fdf2f8" />
              {/* Magenta / Pink Iris ring */}
              <circle cx="88" cy="100" r="13" fill="#ec4899" />
              <circle cx="132" cy="100" r="13" fill="#ec4899" />
              {/* Golden inner star core glow */}
              <circle cx="88" cy="100" r="8" fill="#fbbf24" opacity="0.9" />
              <circle cx="132" cy="100" r="8" fill="#fbbf24" opacity="0.9" />
              {/* 8-pointed golden/white sparkle star in left eye */}
              <polygon
                points="88,90 90,97 97,98 92,102 94,109 88,105 82,109 84,102 79,98 86,97"
                fill="#ffffff"
              />
              {/* 8-pointed golden/white sparkle star in right eye */}
              <polygon
                points="132,90 134,97 141,98 136,102 138,109 132,105 126,109 128,102 123,98 130,97"
                fill="#ffffff"
              />
              {/* Extra diamond sparkles */}
              <circle cx="94" cy="94" r="2.5" fill="#ffffff" />
              <circle cx="138" cy="94" r="2.5" fill="#ffffff" />
              <circle cx="82" cy="106" r="1.8" fill="#ffffff" />
              <circle cx="126" cy="106" r="1.8" fill="#ffffff" />
              {/* Eyelash Liner */}
              <path d="M 72,96 Q 88,84 104,95" stroke="#090d16" strokeWidth="4.2" strokeLinecap="round" fill="none" />
              <path d="M 116,95 Q 132,84 148,96" stroke="#090d16" strokeWidth="4.2" strokeLinecap="round" fill="none" />
            </g>
          ) : currentExpression === 'surprised_mouth' || mood === 'surprised' ? (
            /* Wide Round Surprised Shock Eyes (○_○) */
            <g>
              {/* Wide open sclera */}
              <ellipse cx="88" cy="100" rx="14.5" ry="16" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
              <ellipse cx="132" cy="100" rx="14.5" ry="16" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
              {/* Smaller shocked dilated iris */}
              <circle cx="88" cy="100" r="8.5" fill={`url(#${prefix}_iris3D)`} />
              <circle cx="132" cy="100" r="8.5" fill={`url(#${prefix}_iris3D)`} />
              {/* Dark pupil with white shock dot */}
              <circle cx="88" cy="100" r="4.5" fill="#020617" />
              <circle cx="132" cy="100" r="4.5" fill="#020617" />
              <circle cx="87" cy="98" r="2" fill="#ffffff" />
              <circle cx="131" cy="98" r="2" fill="#ffffff" />
              {/* Curved Surprised Liner */}
              <path d="M 72,93 Q 88,80 104,93" stroke="#090d16" strokeWidth="4.2" strokeLinecap="round" fill="none" />
              <path d="M 116,93 Q 132,80 148,93" stroke="#090d16" strokeWidth="4.2" strokeLinecap="round" fill="none" />
            </g>
          ) : (
            /* 3D Realistic Animated Eyes with Spherical Cornea */
            <g>
              {/* Upper Eyelid Creases */}
              <path d="M 74,87 Q 88,81 101,87" stroke="#cbd5e1" strokeWidth="1.5" fill="none" opacity="0.8" />
              <path d="M 119,87 Q 132,81 146,87" stroke="#cbd5e1" strokeWidth="1.5" fill="none" opacity="0.8" />

              {/* Left Eye Sclera */}
              <ellipse cx="88" cy="101" rx="13.5" ry="15" fill="#ffffff" />
              {/* Left 3D Spherical Iris with Gaze Tracking */}
              <ellipse
                cx={88 + pupilOffsetX}
                cy={101 + pupilOffsetY}
                rx="10.8"
                ry="12.5"
                fill={`url(#${prefix}_iris3D)`}
              />
              {/* Left Dark Pupil */}
              <ellipse
                cx={88 + pupilOffsetX}
                cy={101 + pupilOffsetY}
                rx="5.5"
                ry="6.5"
                fill="#020617"
              />
              {/* Specular Catchlights */}
              <circle cx={84 + pupilOffsetX} cy={96 + pupilOffsetY} r="4.5" fill="#ffffff" />
              <circle cx={92 + pupilOffsetX} cy={105 + pupilOffsetY} r="2.2" fill="#ffffff" opacity="0.85" />
              {/* Eyelash Liner */}
              <path d="M 72,98 Q 88,86 104,97" stroke="#090d16" strokeWidth="4.2" strokeLinecap="round" fill="none" />
              <path d="M 102,96 Q 107,92 109,93" stroke="#090d16" strokeWidth="2.5" fill="none" />

              {/* Right Eye Sclera */}
              <ellipse cx="132" cy="101" rx="13.5" ry="15" fill="#ffffff" />
              {/* Right 3D Spherical Iris with Gaze Tracking */}
              <ellipse
                cx={132 + pupilOffsetX}
                cy={101 + pupilOffsetY}
                rx="10.8"
                ry="12.5"
                fill={`url(#${prefix}_iris3D)`}
              />
              {/* Right Dark Pupil */}
              <ellipse
                cx={132 + pupilOffsetX}
                cy={101 + pupilOffsetY}
                rx="5.5"
                ry="6.5"
                fill="#020617"
              />
              {/* Specular Catchlights */}
              <circle cx={128 + pupilOffsetX} cy={96 + pupilOffsetY} r="4.5" fill="#ffffff" />
              <circle cx={136 + pupilOffsetX} cy={105 + pupilOffsetY} r="2.2" fill="#ffffff" opacity="0.85" />
              {/* Eyelash Liner */}
              <path d="M 116,97 Q 132,86 148,98" stroke="#090d16" strokeWidth="4.2" strokeLinecap="round" fill="none" />
              <path d="M 146,96 Q 151,92 153,93" stroke="#090d16" strokeWidth="2.5" fill="none" />
            </g>
          )}

          {/* Eyebrows with Anticipation Shift & Mood Modulation */}
          <path
            d={
              currentExpression === 'surprised_mouth' || mood === 'surprised'
                ? 'M 74,74 Q 87,67 100,75' // High arched in surprise shock
                : currentExpression === 'happy_blush' || mood === 'happy_blush'
                ? 'M 75,81 Q 87,79 99,83' // Gentle relaxed angle
                : currentExpression === 'ecstatic_eyes' || mood === 'ecstatic'
                ? 'M 74,78 Q 87,72 100,79' // Raised in excitement
                : currentExpression === 'spicy_reaction' || mood === 'spicy_fiery'
                ? 'M 76,77 Q 88,83 98,78' // Wavy spicy eyebrow
                : isLookingAtFood
                ? 'M 75,81 Q 87,76 99,82'
                : 'M 75,83 Q 87,78 99,83'
            }
            stroke={character.hairColor}
            strokeWidth="3.2"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d={
              currentExpression === 'surprised_mouth' || mood === 'surprised'
                ? 'M 120,75 Q 133,67 146,74'
                : currentExpression === 'happy_blush' || mood === 'happy_blush'
                ? 'M 121,83 Q 133,79 145,81'
                : currentExpression === 'ecstatic_eyes' || mood === 'ecstatic'
                ? 'M 120,79 Q 133,72 146,78'
                : currentExpression === 'spicy_reaction' || mood === 'spicy_fiery'
                ? 'M 122,78 Q 132,83 144,77'
                : isLookingAtFood
                ? 'M 121,82 Q 133,76 145,81'
                : 'M 121,83 Q 133,78 145,83'
            }
            stroke={character.hairColor}
            strokeWidth="3.2"
            strokeLinecap="round"
            fill="none"
          />

          {/* Cute 3D Button Nose with soft drop shadow */}
          <circle cx="110" cy="112.5" r="1.6" fill="#f43f5e" opacity="0.75" />
          <circle cx="109" cy="111.5" r="0.8" fill="#ffffff" opacity="0.85" />

          {/* ============================================================ */}
          {/* --- 3D MOUTH, TEETH, TONGUE & CHEWING RIG --- */}
          {/* ============================================================ */}
          {currentExpression === 'mouth_open' ? (
            /* Open Wide for Anticipation & Bite ("Aaahh~") */
            <g>
              {/* Deep Mouth Cavity */}
              <ellipse cx="110" cy="126" rx="12" ry="14" fill="#881337" />
              {/* Inner Soft Tongue */}
              <path d="M 102,132 Q 110,138 118,132" fill="#fb7185" />
              {/* Upper White Teeth line */}
              <path d="M 102,118 Q 110,115 118,118" stroke="#ffffff" strokeWidth="3.4" strokeLinecap="round" fill="none" />
              {/* Lower Teeth peek */}
              <path d="M 104,133 Q 110,135 116,133" stroke="#ffffff" strokeWidth="1.8" fill="none" opacity="0.8" />
              {/* Lip Gloss Highlight on Bottom Lip */}
              <ellipse cx="110" cy="139" rx="5.5" ry="1.8" fill="#fecdd3" opacity="0.9" />
            </g>
          ) : currentExpression === 'surprised_mouth' ? (
            /* Surprised Round "O" Gasped Mouth (:O) */
            <g>
              <ellipse cx="110" cy="127" rx="8" ry="11" fill="#881337" stroke="#be123c" strokeWidth="1.5" />
              <ellipse cx="110" cy="133" rx="5.5" ry="3.5" fill="#fb7185" />
              <path d="M 104,119 Q 110,117 116,119" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <ellipse cx="110" cy="137" rx="3.5" ry="1.2" fill="#fecdd3" opacity="0.9" />
            </g>
          ) : currentExpression === 'chewing' ? (
            /* Rhythmic Mastication Closed Mouth with Puffed Cheeks */
            <g>
              {/* Chewing Lip Shape */}
              <path
                d={`M 102,${123 + (chewFrame % 2 === 0 ? 1 : -1)} Q 110,${121 + (chewFrame % 2 === 0 ? 2 : 0)} 118,${123 + (chewFrame % 2 === 0 ? 1 : -1)} Q 110,126 102,${123 + (chewFrame % 2 === 0 ? 1 : -1)} Z`}
                fill="#e11d48"
              />
              {/* Dynamic Puffed Cheek Contours */}
              <path
                d={chewFrame % 2 === 0 ? 'M 67,110 Q 60,119 68,127' : 'M 68,111 Q 63,119 69,126'}
                stroke="#fb7185"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d={chewFrame % 2 === 0 ? 'M 153,110 Q 160,119 152,127' : 'M 152,111 Q 157,119 151,126'}
                stroke="#fb7185"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
              />
            </g>
          ) : currentExpression === 'spicy_reaction' ? (
            /* Hot panting mouth with tongue sticking out */
            <g>
              <ellipse cx="110" cy="126" rx="10" ry="8" fill="#881337" />
              <path d="M 105,127 C 105,138 115,138 115,127 Z" fill="#f43f5e" />
              <path d="M 103,121 Q 110,119 117,121" stroke="#ffffff" strokeWidth="2.5" fill="none" />
            </g>
          ) : currentExpression === 'happy_blush' ? (
            /* Sweet contented glossy smile */
            <g>
              <path d="M 101,122 Q 110,131 119,122 Z" fill="#e11d48" stroke="#be123c" strokeWidth="1.2" />
              <path d="M 103,123 Q 110,126 117,123" fill="#ffffff" />
              <ellipse cx="110" cy="130" rx="4" ry="1.5" fill="#fecdd3" opacity="0.9" />
            </g>
          ) : currentExpression === 'ecstatic_eyes' || currentExpression === 'super_happy' || currentExpression === 'yum_satisfaction' ? (
            /* Joyful Wide Smile with Lip Gloss */
            <g>
              <path d="M 100,121 Q 110,136 120,121 Z" fill="#e11d48" stroke="#be123c" strokeWidth="1.5" />
              <path d="M 103,122 Q 110,126 117,122" fill="#ffffff" />
            </g>
          ) : (
            /* Natural Sweet Smile with Specular Lip Shine */
            <g>
              <path d="M 102,123 Q 110,128 118,123" stroke="#be123c" strokeWidth="3" strokeLinecap="round" fill="none" />
              <ellipse cx="110" cy="126" rx="4" ry="1.5" fill="#fecdd3" opacity="0.85" />
            </g>
          )}

          {/* ============================================================ */}
          {/* --- 4. FRONT HAIR, BANGS & 3D HIGHLIGHTS --- */}
          {/* ============================================================ */}
          <path
            d="M 59,86 C 53,46 84,35 110,35 C 136,35 167,46 161,86 C 145,71 130,74 110,79 C 90,74 75,71 59,86 Z"
            fill={`url(#${prefix}_hairVol)`}
          />
          {/* 3D Hair Strands */}
          <path d="M 84,68 Q 95,88 102,78" stroke={character.hairColor} strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <path d="M 136,68 Q 125,88 118,78" stroke={character.hairColor} strokeWidth="3.5" fill="none" strokeLinecap="round" />
          {/* Glossy Hair Halo Arch */}
          <path d="M 78,52 Q 110,46 142,52" stroke="#ffffff" strokeWidth="2.8" fill="none" opacity="0.45" strokeLinecap="round" />
        </g>

        {/* ============================================================== */}
        {/* --- 5. ARTICULATED HAND-TO-MOUTH EATING RIG --- */}
        {/* ============================================================== */}
        {showActiveHandRig && (
          <g
            className="transition-all duration-300 ease-out pointer-events-none"
            transform={`translate(${handPose.armX}, ${handPose.armY}) rotate(${handPose.stickAngle}) scale(${handPose.scale})`}
          >
            {/* The Bamboo / Candy Skewer Stick */}
            <line
              x1="0"
              y1="-65"
              x2="0"
              y2="55"
              stroke="#d97706"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <line
              x1="-1"
              y1="-65"
              x2="-1"
              y2="55"
              stroke="#fef3c7"
              strokeWidth="1.2"
              opacity="0.7"
            />

            {/* Skewered Fruits on Stick being held by the hand */}
            {activeFoodFruits.slice(0, 4).map((fruitId, idx) => {
              const fruitY = -48 + idx * 26;
              const isEaten = idx < 4 - bitesLeft;
              const isCurrentlyBeingBitten = idx === 4 - bitesLeft && eatingPhase === 'biting';

              if (isEaten) {
                // Empty Stick Spot or Bitten Fragment
                return (
                  <circle
                    key={idx}
                    cx="0"
                    cy={fruitY}
                    r="2"
                    fill="#fef08a"
                    opacity="0.6"
                  />
                );
              }

              return (
                <g key={idx} transform={`translate(0, ${fruitY})`}>
                  {/* Fruit Ball */}
                  <circle
                    cx="0"
                    cy="0"
                    r={isCurrentlyBeingBitten ? 13 : 11}
                    fill={fruitId.includes('muscat') ? '#84cc16' : fruitId.includes('mandarin') ? '#f97316' : '#ef4444'}
                    stroke="#b91c1c"
                    strokeWidth="0.8"
                  />
                  {/* Seeds / Calyx */}
                  <circle cx="-3" cy="-2" r="1.2" fill="#fef08a" />
                  <circle cx="3" cy="2" r="1.2" fill="#fef08a" />
                  {/* Glassy Sugar Coating Gleam */}
                  <circle
                    cx="0"
                    cy="0"
                    r={isCurrentlyBeingBitten ? 15 : 13}
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="2.2"
                    opacity="0.85"
                  />
                  <path
                    d="M -7,-7 Q -10,0 -6,6"
                    stroke="#ffffff"
                    strokeWidth="2.2"
                    fill="none"
                    strokeLinecap="round"
                  />

                  {/* Candy Shard Burst on Immediate Bite */}
                  {isCurrentlyBeingBitten && (
                    <g className="animate-ping">
                      <polygon points="0,-18 3,-14 -3,-14" fill="#ffffff" />
                      <polygon points="16,-4 12,0 12,-6" fill="#fef08a" />
                      <polygon points="-16,-4 -12,0 -12,-6" fill="#ffffff" />
                    </g>
                  )}
                </g>
              );
            })}

            {/* The Character's Hand & Fingers Wrapping Around The Stick */}
            {/* Palm & Wrist */}
            <path
              d="M -14,16 Q 0,10 16,16 L 24,38 Q 0,44 -16,38 Z"
              fill={character.skinTone}
            />
            {/* Curled Fingers in Front of Stick */}
            <rect x="-10" y="14" width="20" height="6" rx="3" fill={character.skinTone} stroke="#fda4af" strokeWidth="0.8" />
            <rect x="-10" y="21" width="20" height="6" rx="3" fill={character.skinTone} stroke="#fda4af" strokeWidth="0.8" />
            <rect x="-10" y="28" width="18" height="6" rx="3" fill={character.skinTone} stroke="#fda4af" strokeWidth="0.8" />
            {/* Cute Thumb Clamping in Front */}
            <ellipse cx="-6" cy="12" rx="4.5" ry="7" fill={character.skinTone} transform="rotate(-25, -6, 12)" />
            {/* Glossy Pink Fingernails */}
            <ellipse cx="6" cy="17" rx="1.5" ry="1.8" fill="#fda4af" />
            <ellipse cx="6" cy="24" rx="1.5" ry="1.8" fill="#fda4af" />
            <ellipse cx="4" cy="31" rx="1.5" ry="1.8" fill="#fda4af" />
          </g>
        )}
      </svg>

      {/* Floating Mood & Emotion Aura Particles */}
      {currentExpression === 'ecstatic_eyes' || mood === 'ecstatic' ? (
        <div className="pointer-events-none absolute -top-4 right-1 text-3xl animate-bounce drop-shadow-md">
          ✨
        </div>
      ) : currentExpression === 'surprised_mouth' || mood === 'surprised' ? (
        <div className="pointer-events-none absolute -top-4 right-2 text-2xl animate-ping drop-shadow-md">
          😲
        </div>
      ) : currentExpression === 'happy_blush' || mood === 'happy_blush' ? (
        <div className="pointer-events-none absolute -top-4 right-1 text-3xl animate-pulse drop-shadow-md">
          🌸
        </div>
      ) : currentExpression === 'spicy_reaction' || mood === 'spicy_fiery' ? (
        <div className="pointer-events-none absolute -top-4 right-1 text-3xl animate-bounce drop-shadow-md">
          🔥
        </div>
      ) : (currentExpression === 'yum_satisfaction' || currentExpression === 'super_happy' || eatingPhase === 'satisfied') ? (
        <div className="pointer-events-none absolute -top-4 right-1 text-3xl animate-bounce">
          💖
        </div>
      ) : null}
    </div>
  );
};
