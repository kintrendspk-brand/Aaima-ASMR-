import React, { useEffect, useState } from 'react';
import { GirlCharacter } from '../../types/game';

export type GirlExpression =
  | 'idle'
  | 'waving'
  | 'mouth_open'
  | 'chewing'
  | 'super_happy'
  | 'yum_satisfaction';

interface Props {
  character: GirlCharacter;
  expression?: GirlExpression;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onClick?: () => void;
}

export const CuteGirl: React.FC<Props> = ({
  character,
  expression = 'idle',
  size = 'lg',
  className = '',
  onClick,
}) => {
  const [isBlinking, setIsBlinking] = useState(false);

  // Natural cute blinking timer
  useEffect(() => {
    if (expression === 'chewing' || expression === 'yum_satisfaction') return;
    const interval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 180);
    }, 3800 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, [expression]);

  const activeOutfit =
    character.outfits.find((o) => o.id === character.selectedOutfitId) ||
    character.outfits[0];

  const dressColor = activeOutfit ? activeOutfit.dressColor : character.baseOutfitColor;
  const accentColor = activeOutfit ? activeOutfit.accentColor : '#ffffff';

  const sizeClasses = {
    sm: 'w-20 h-28',
    md: 'w-32 h-44',
    lg: 'w-56 h-72',
    xl: 'w-72 h-96',
  }[size];

  return (
    <div
      onClick={onClick}
      className={`relative inline-block select-none cursor-pointer transition-transform ${sizeClasses} ${className}`}
    >
      <svg
        viewBox="0 0 200 260"
        className="w-full h-full overflow-visible drop-shadow-md"
      >
        <defs>
          <filter id="blushGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>

        {/* --- BACK HAIR --- */}
        {character.hairStyle === 'long_flowing' && (
          <path
            d="M 60,90 C 30,130 25,200 50,230 C 70,200 70,160 80,120 Z 
               M 140,90 C 170,130 175,200 150,230 C 130,200 130,160 120,120 Z"
            fill={character.hairColor}
          />
        )}
        {character.hairStyle === 'pigtails' && (
          <g>
            {/* Left pigtail */}
            <path
              d="M 50,85 C 10,95 5,160 30,195 C 45,170 45,120 55,95 Z"
              fill={character.hairColor}
            />
            {/* Right pigtail */}
            <path
              d="M 150,85 C 190,95 195,160 170,195 C 155,170 155,120 145,95 Z"
              fill={character.hairColor}
            />
            {/* Ribbon bows */}
            <circle cx="52" cy="85" r="9" fill={character.ribbonColor} />
            <circle cx="148" cy="85" r="9" fill={character.ribbonColor} />
          </g>
        )}
        {character.hairStyle === 'twin_buns' && (
          <g>
            <circle cx="42" cy="60" r="22" fill={character.hairColor} />
            <circle cx="158" cy="60" r="22" fill={character.hairColor} />
            <circle cx="42" cy="60" r="8" fill={character.ribbonColor} />
            <circle cx="158" cy="60" r="8" fill={character.ribbonColor} />
          </g>
        )}
        {character.hairStyle === 'braids' && (
          <g>
            <path
              d="M 55,100 C 40,140 38,180 44,210 C 50,180 58,150 62,110 Z"
              fill={character.hairColor}
            />
            <path
              d="M 145,100 C 160,140 162,180 156,210 C 150,180 142,150 138,110 Z"
              fill={character.hairColor}
            />
            <circle cx="44" cy="205" r="6" fill={character.ribbonColor} />
            <circle cx="156" cy="205" r="6" fill={character.ribbonColor} />
          </g>
        )}
        {character.hairStyle === 'ponytail' && (
          <g>
            <path
              d="M 145,60 C 185,55 195,120 170,155 C 155,130 150,95 145,75 Z"
              fill={character.hairColor}
            />
            <circle cx="145" cy="65" r="9" fill={character.ribbonColor} />
          </g>
        )}

        {/* --- BODY & OUTFIT --- */}
        <g id="body">
          {/* Neck */}
          <rect x="92" y="132" width="16" height="18" rx="4" fill={character.skinTone} />

          {/* Torso & Dress */}
          <path
            d="M 72,150 L 128,150 L 144,225 C 120,235 80,235 56,225 Z"
            fill={dressColor}
          />

          {/* Collar / Dress Accents */}
          <path
            d="M 80,150 Q 100,165 120,150 L 115,165 Q 100,175 85,165 Z"
            fill={accentColor}
          />
          {/* Waist Ribbon */}
          <rect x="74" y="180" width="52" height="7" rx="3" fill={character.ribbonColor} />
          <circle cx="100" cy="183" r="5" fill="#ffffff" />

          {/* Left Arm */}
          <path
            d="M 72,152 Q 55,180 62,205"
            stroke={character.skinTone}
            strokeWidth="11"
            strokeLinecap="round"
            fill="none"
          />
          {/* Left Sleeve */}
          <path d="M 68,150 Q 60,165 72,170 Z" fill={dressColor} />

          {/* Right Arm - Waving or Normal */}
          {expression === 'waving' ? (
            <g className="origin-[130px_155px] animate-bounce">
              <path
                d="M 128,152 Q 155,130 162,105"
                stroke={character.skinTone}
                strokeWidth="11"
                strokeLinecap="round"
                fill="none"
              />
              {/* Hand */}
              <circle cx="162" cy="102" r="7" fill={character.skinTone} />
              {/* Right Sleeve */}
              <path d="M 126,150 Q 140,145 132,165 Z" fill={dressColor} />
            </g>
          ) : (
            <g>
              <path
                d="M 128,152 Q 145,180 138,205"
                stroke={character.skinTone}
                strokeWidth="11"
                strokeLinecap="round"
                fill="none"
              />
              {/* Right Sleeve */}
              <path d="M 132,150 Q 140,165 128,170 Z" fill={dressColor} />
            </g>
          )}

          {/* Bunny Ears if Chloe */}
          {character.id === 'chloe' && (
            <g>
              <path d="M 65,45 Q 60,10 75,15 Q 85,30 80,50 Z" fill="#ccfbf1" stroke="#2dd4bf" strokeWidth="2" />
              <path d="M 135,45 Q 140,10 125,15 Q 115,30 120,50 Z" fill="#ccfbf1" stroke="#2dd4bf" strokeWidth="2" />
            </g>
          )}
        </g>

        {/* --- HEAD & FACE --- */}
        <g id="head">
          {/* Face Base */}
          <ellipse cx="100" cy="95" rx="46" ry="43" fill={character.skinTone} />

          {/* Cute Blushing Cheeks */}
          <ellipse
            cx="68"
            cy="106"
            rx="10"
            ry="6"
            fill="#f43f5e"
            opacity={expression === 'super_happy' || expression === 'chewing' ? '0.6' : '0.4'}
            filter="url(#blushGlow)"
          />
          <ellipse
            cx="132"
            cy="106"
            rx="10"
            ry="6"
            fill="#f43f5e"
            opacity={expression === 'super_happy' || expression === 'chewing' ? '0.6' : '0.4'}
            filter="url(#blushGlow)"
          />

          {/* EYES */}
          {isBlinking || expression === 'yum_satisfaction' ? (
            /* Closed / Joyful Curved Anime Eyes (^.^) */
            <g stroke="#374151" strokeWidth="3.5" strokeLinecap="round" fill="none">
              <path d="M 70,95 Q 80,87 90,95" />
              <path d="M 110,95 Q 120,87 130,95" />
            </g>
          ) : expression === 'super_happy' ? (
            /* Starry / Heart Sparkle Eyes */
            <g>
              <circle cx="80" cy="94" r="10" fill="#ec4899" />
              <circle cx="120" cy="94" r="10" fill="#ec4899" />
              <polygon points="80,88 83,93 88,94 84,97 86,102 80,99 75,102 77,97 72,94 77,93" fill="#ffffff" />
              <polygon points="120,88 123,93 128,94 124,97 126,102 120,99 115,102 117,97 112,94 117,93" fill="#ffffff" />
            </g>
          ) : (
            /* Big, Cute Anime Eyes */
            <g>
              {/* Left Eye */}
              <ellipse cx="80" cy="94" rx="10" ry="12" fill="#1f2937" />
              <ellipse cx="80" cy="96" rx="8" ry="9" fill={character.eyeColor} />
              {/* Highlights */}
              <circle cx="77" cy="90" r="4" fill="#ffffff" />
              <circle cx="83" cy="98" r="2" fill="#ffffff" />
              {/* Eyelash */}
              <path d="M 68,90 Q 80,80 92,90" stroke="#111827" strokeWidth="3" fill="none" strokeLinecap="round" />

              {/* Right Eye */}
              <ellipse cx="120" cy="94" rx="10" ry="12" fill="#1f2937" />
              <ellipse cx="120" cy="96" rx="8" ry="9" fill={character.eyeColor} />
              {/* Highlights */}
              <circle cx="117" cy="90" r="4" fill="#ffffff" />
              <circle cx="123" cy="98" r="2" fill="#ffffff" />
              {/* Eyelash */}
              <path d="M 108,90 Q 120,80 132,90" stroke="#111827" strokeWidth="3" fill="none" strokeLinecap="round" />
            </g>
          )}

          {/* Eyebrows */}
          <path d="M 72,78 Q 80,74 88,78" stroke="#374151" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M 112,78 Q 120,74 128,78" stroke="#374151" strokeWidth="2.5" fill="none" strokeLinecap="round" />

          {/* Tiny Cute Nose */}
          <circle cx="100" cy="103" r="1.5" fill="#f43f5e" opacity="0.7" />

          {/* MOUTH & EXPRESSIONS */}
          {expression === 'mouth_open' ? (
            /* Open Wide for Feeding "Aaahh~" */
            <g>
              <ellipse cx="100" cy="116" rx="9" ry="11" fill="#be123c" />
              <path d="M 94,121 Q 100,126 106,121" fill="#f43f5e" />
              <path d="M 94,110 Q 100,108 106,110" stroke="#ffffff" strokeWidth="2.5" fill="none" />
            </g>
          ) : expression === 'chewing' ? (
            /* Chewing Puffed Cheeks Motion */
            <g className="animate-chew origin-center">
              <path d="M 93,114 Q 100,111 107,114 Q 100,118 93,114 Z" fill="#e11d48" />
              {/* Puffed cheek lines */}
              <path d="M 64,103 Q 60,110 65,116" stroke="#fb7185" strokeWidth="2" fill="none" />
              <path d="M 136,103 Q 140,110 135,116" stroke="#fb7185" strokeWidth="2" fill="none" />
            </g>
          ) : expression === 'super_happy' || expression === 'waving' ? (
            /* Wide Happy Smile */
            <path
              d="M 92,110 Q 100,124 108,110 Z"
              fill="#e11d48"
              stroke="#be123c"
              strokeWidth="1.5"
            />
          ) : (
            /* Gentle Content Smile */
            <path
              d="M 94,112 Q 100,117 106,112"
              stroke="#be123c"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
          )}

          {/* --- FRONT HAIR & BANGS --- */}
          <path
            d="M 54,80 C 50,45 80,35 100,35 C 120,35 150,45 146,80 C 130,68 115,70 100,75 C 85,70 70,68 54,80 Z"
            fill={character.hairColor}
          />
          {/* Bang Details */}
          <path
            d="M 75,65 Q 85,82 92,72"
            stroke={character.hairColor}
            strokeWidth="3"
            fill="none"
          />
          <path
            d="M 125,65 Q 115,82 108,72"
            stroke={character.hairColor}
            strokeWidth="3"
            fill="none"
          />

          {/* Hair Accessory Pin */}
          <circle cx="62" cy="62" r="8" fill={character.ribbonColor} />
          <circle cx="62" cy="62" r="3" fill="#ffffff" />
        </g>
      </svg>

      {/* Floating Love Heart on Satisfaction */}
      {(expression === 'yum_satisfaction' || expression === 'super_happy') && (
        <div className="pointer-events-none absolute -top-4 right-2 text-2xl animate-bounce">
          💖
        </div>
      )}
    </div>
  );
};
