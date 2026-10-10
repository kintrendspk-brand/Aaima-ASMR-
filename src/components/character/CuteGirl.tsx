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

  // Natural blinking
  useEffect(() => {
    if (expression === 'chewing' || expression === 'yum_satisfaction') return;
    const interval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 160);
    }, 3600 + Math.random() * 2200);
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

  // Dynamic SVG IDs to prevent conflicting SVG gradients across instances
  const prefix = character.id;

  return (
    <div
      onClick={onClick}
      className={`relative inline-block select-none cursor-pointer transition-transform ${sizeClasses} ${className}`}
    >
      <svg
        viewBox="0 0 220 280"
        className="w-full h-full overflow-visible drop-shadow-lg"
      >
        <defs>
          {/* Soft Cheek Blush Filter */}
          <filter id={`${prefix}_blush`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4.5" />
          </filter>

          {/* Skin Soft Ambient Gradient */}
          <radialGradient id={`${prefix}_skinGrad`} cx="50%" cy="45%" r="55%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
            <stop offset="70%" stopColor={character.skinTone} />
            <stop offset="100%" stopColor="#fca5a5" stopOpacity="0.25" />
          </radialGradient>

          {/* Hair Gloss Highlight */}
          <linearGradient id={`${prefix}_hairGloss`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
            <stop offset="25%" stopColor={character.hairColor} />
            <stop offset="60%" stopColor={character.hairColor} />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.3" />
          </linearGradient>

          {/* Multi-layered Realistic Eye Iris Gradient */}
          <radialGradient id={`${prefix}_irisGrad`} cx="45%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
            <stop offset="35%" stopColor={character.eyeColor} />
            <stop offset="85%" stopColor="#0f172a" />
          </radialGradient>

          {/* Dress Shading Gradient */}
          <linearGradient id={`${prefix}_dressGrad`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={dressColor} />
            <stop offset="80%" stopColor={dressColor} />
            <stop offset="100%" stopColor="#1e1b4b" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* ============================================================== */}
        {/* --- 1. BACK HAIR LAYER (Behind Neck & Body) --- */}
        {/* ============================================================== */}
        {character.hairStyle === 'long_flowing' && (
          <g>
            <path
              d="M 60,95 C 25,140 18,220 45,255 C 65,225 68,175 78,130 Z"
              fill={`url(#${prefix}_hairGloss)`}
            />
            <path
              d="M 160,95 C 195,140 202,220 175,255 C 155,225 152,175 142,130 Z"
              fill={`url(#${prefix}_hairGloss)`}
            />
            <path
              d="M 45,110 C 20,180 35,260 70,270 C 50,220 55,160 65,115 Z"
              fill={character.hairColor}
              opacity="0.8"
            />
          </g>
        )}

        {character.hairStyle === 'pigtails' && (
          <g>
            {/* Left Twin Tail */}
            <path
              d="M 52,90 C 8,105 2,175 32,220 C 48,185 46,135 56,100 Z"
              fill={`url(#${prefix}_hairGloss)`}
            />
            {/* Right Twin Tail */}
            <path
              d="M 168,90 C 212,105 218,175 188,220 C 172,185 174,135 164,100 Z"
              fill={`url(#${prefix}_hairGloss)`}
            />
            {/* Hair Ribbons */}
            <circle cx="53" cy="92" r="9" fill={character.ribbonColor} />
            <circle cx="167" cy="92" r="9" fill={character.ribbonColor} />
            <circle cx="53" cy="92" r="3.5" fill="#ffffff" />
            <circle cx="167" cy="92" r="3.5" fill="#ffffff" />
          </g>
        )}

        {character.hairStyle === 'twin_buns' && (
          <g>
            {/* Left Top Bun */}
            <circle cx="40" cy="62" r="24" fill={`url(#${prefix}_hairGloss)`} />
            <circle cx="40" cy="62" r="10" fill={character.ribbonColor} />
            {/* Right Top Bun */}
            <circle cx="180" cy="62" r="24" fill={`url(#${prefix}_hairGloss)`} />
            <circle cx="180" cy="62" r="10" fill={character.ribbonColor} />
          </g>
        )}

        {character.hairStyle === 'wavy_curls' && (
          <g>
            {/* Voluminous wavy locks for Zoya */}
            <path
              d="M 55,95 C 10,135 15,200 35,235 C 50,250 65,220 60,180 C 55,145 68,125 75,105 Z"
              fill={`url(#${prefix}_hairGloss)`}
            />
            <path
              d="M 165,95 C 210,135 205,200 185,235 C 170,250 155,220 160,180 C 165,145 152,125 145,105 Z"
              fill={`url(#${prefix}_hairGloss)`}
            />
          </g>
        )}

        {character.hairStyle === 'side_braid' && (
          <g>
            {/* Sakura's twin romantic low braids */}
            <path
              d="M 55,110 C 35,160 38,215 50,250 C 58,220 62,180 66,130 Z"
              fill={`url(#${prefix}_hairGloss)`}
            />
            <path
              d="M 165,110 C 185,160 182,215 170,250 C 162,220 158,180 154,130 Z"
              fill={`url(#${prefix}_hairGloss)`}
            />
            <circle cx="49" cy="246" r="6" fill={character.ribbonColor} />
            <circle cx="171" cy="246" r="6" fill={character.ribbonColor} />
          </g>
        )}

        {character.hairStyle === 'ponytail' && (
          <g>
            <path
              d="M 155,70 C 205,65 218,140 190,185 C 172,150 166,110 158,85 Z"
              fill={`url(#${prefix}_hairGloss)`}
            />
            <circle cx="156" cy="74" r="10" fill={character.ribbonColor} />
            {/* Star Clip */}
            <polygon points="156,66 158,72 164,73 159,77 161,83 156,79 151,83 153,77 148,73 154,72" fill="#facc15" />
          </g>
        )}

        {character.hairStyle === 'hime_cut' && (
          <g>
            {/* Maya's long sleek midnight hair */}
            <path
              d="M 58,90 C 30,140 25,230 45,268 C 65,240 68,180 75,125 Z"
              fill={`url(#${prefix}_hairGloss)`}
            />
            <path
              d="M 162,90 C 190,140 195,230 175,268 C 155,240 152,180 145,125 Z"
              fill={`url(#${prefix}_hairGloss)`}
            />
          </g>
        )}

        {character.hairStyle === 'messy_bun' && (
          <g>
            {/* Amber's textured bun */}
            <ellipse cx="110" cy="38" rx="28" ry="22" fill={`url(#${prefix}_hairGloss)`} />
            <circle cx="126" cy="48" r="8" fill={character.ribbonColor} />
          </g>
        )}

        {/* ============================================================== */}
        {/* --- 2. BODY, NECK, ARMS & DRESS --- */}
        {/* ============================================================== */}
        <g id="body">
          {/* Elegant Slender Neck */}
          <path
            d="M 102,140 L 102,156 C 102,160 118,160 118,156 L 118,140 Z"
            fill={character.skinTone}
          />
          {/* Delicate Collarbone / Neck shading */}
          <path d="M 104,152 Q 110,155 116,152" stroke="#fda4af" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6" />

          {/* Tiny Pearl / Heart Pendant Necklace */}
          <path d="M 98,154 Q 110,166 122,154" stroke="#e2e8f0" strokeWidth="1.5" fill="none" />
          <circle cx="110" cy="164" r="3.5" fill={character.ribbonColor} />

          {/* Main Torso & Dress */}
          <path
            d="M 78,164 L 142,164 L 158,245 C 130,256 90,256 62,245 Z"
            fill={`url(#${prefix}_dressGrad)`}
          />

          {/* Cute Dress Collar / Ruffles */}
          <path
            d="M 88,164 Q 110,180 132,164 L 126,180 Q 110,190 94,180 Z"
            fill={accentColor}
          />

          {/* Sweet Bow or Belt on Waist */}
          <rect x="80" y="196" width="60" height="9" rx="4" fill={character.ribbonColor} />
          <circle cx="110" cy="200.5" r="5.5" fill="#ffffff" />
          <circle cx="110" cy="200.5" r="3" fill={character.ribbonColor} />

          {/* Left Arm */}
          <path
            d="M 78,166 Q 58,198 68,228"
            stroke={character.skinTone}
            strokeWidth="12"
            strokeLinecap="round"
            fill="none"
          />
          <path d="M 74,164 Q 65,180 78,185 Z" fill={dressColor} />

          {/* Right Arm - Waving, Spicy Fanning, or Natural */}
          {expression === 'waving' ? (
            <g className="origin-[140px_170px] animate-bounce">
              <path
                d="M 142,166 Q 172,140 180,112"
                stroke={character.skinTone}
                strokeWidth="12"
                strokeLinecap="round"
                fill="none"
              />
              <circle cx="180" cy="108" r="8" fill={character.skinTone} />
              <path d="M 140,164 Q 155,158 146,180 Z" fill={dressColor} />
            </g>
          ) : expression === 'spicy_reaction' ? (
            <g className="origin-[135px_155px] animate-spicy-fan">
              {/* Hand fanning open mouth */}
              <path
                d="M 142,166 Q 148,135 128,124"
                stroke={character.skinTone}
                strokeWidth="11"
                strokeLinecap="round"
                fill="none"
              />
              <circle cx="126" cy="122" r="7.5" fill={character.skinTone} />
              <path d="M 140,164 Q 150,152 142,175 Z" fill={dressColor} />
            </g>
          ) : (
            <g>
              <path
                d="M 142,166 Q 162,198 152,228"
                stroke={character.skinTone}
                strokeWidth="12"
                strokeLinecap="round"
                fill="none"
              />
              <path d="M 146,164 Q 155,180 142,185 Z" fill={dressColor} />
            </g>
          )}

          {/* Bunny Ears if Chloe */}
          {character.id === 'chloe' && (
            <g>
              <path d="M 72,52 Q 62,12 80,18 Q 94,36 88,58 Z" fill="#ccfbf1" stroke="#14b8a6" strokeWidth="2.5" />
              <path d="M 76,46 Q 70,22 80,24 Q 88,34 84,48 Z" fill="#fecdd3" opacity="0.8" />
              <path d="M 148,52 Q 158,12 140,18 Q 126,36 132,58 Z" fill="#ccfbf1" stroke="#14b8a6" strokeWidth="2.5" />
              <path d="M 144,46 Q 150,22 140,24 Q 132,34 136,48 Z" fill="#fecdd3" opacity="0.8" />
            </g>
          )}

          {/* Golden Earrings if Zoya */}
          {character.id === 'zoya' && (
            <g>
              <circle cx="58" cy="116" r="3" fill="#f59e0b" />
              <path d="M 58,119 L 58,126" stroke="#f59e0b" strokeWidth="1.5" />
              <circle cx="162" cy="116" r="3" fill="#f59e0b" />
              <path d="M 162,119 L 162,126" stroke="#f59e0b" strokeWidth="1.5" />
            </g>
          )}
        </g>

        {/* ============================================================== */}
        {/* --- 3. HEAD & REALISTIC CUTE FACE --- */}
        {/* ============================================================== */}
        <g id="head">
          {/* Soft-contoured cute chin and head */}
          <path
            d="M 60,98 C 60,54 82,42 110,42 C 138,42 160,54 160,98 C 160,132 136,148 110,148 C 84,148 60,132 60,98 Z"
            fill={`url(#${prefix}_skinGrad)`}
          />

          {/* Airbrushed Rosy Cheeks */}
          <ellipse
            cx="75"
            cy="114"
            rx="12"
            ry="7"
            fill="#fb7185"
            opacity={expression === 'super_happy' || expression === 'chewing' ? '0.65' : '0.45'}
            filter={`url(#${prefix}_blush)`}
          />
          <ellipse
            cx="145"
            cy="114"
            rx="12"
            ry="7"
            fill="#fb7185"
            opacity={expression === 'super_happy' || expression === 'chewing' ? '0.65' : '0.45'}
            filter={`url(#${prefix}_blush)`}
          />

          {/* --- EYES --- */}
          {isBlinking || expression === 'yum_satisfaction' ? (
            /* Curved Anime Happy Bliss Eyes (^.^) */
            <g stroke="#1f2937" strokeWidth="3.5" strokeLinecap="round" fill="none">
              <path d="M 76,102 Q 88,92 100,102" />
              <path d="M 120,102 Q 132,92 144,102" />
              {/* Cute Eyelash flicks */}
              <path d="M 100,102 Q 104,98 106,99" strokeWidth="2.5" />
              <path d="M 144,102 Q 148,98 150,99" strokeWidth="2.5" />
            </g>
          ) : expression === 'super_happy' ? (
            /* Sparkle Heart Eyes */
            <g>
              <circle cx="88" cy="100" r="12" fill="#ec4899" />
              <circle cx="132" cy="100" r="12" fill="#ec4899" />
              {/* Star reflection sparkles */}
              <polygon points="88,93 91,98 97,99 93,103 95,109 88,105 82,109 84,103 79,99 85,98" fill="#ffffff" />
              <polygon points="132,93 135,98 141,99 137,103 139,109 132,105 126,109 128,103 123,99 129,98" fill="#ffffff" />
            </g>
          ) : (
            /* Deep, Realistic Anime Irises with Gloss Highlights */
            <g>
              {/* Upper Eyelid Creases */}
              <path d="M 75,88 Q 88,83 100,88" stroke="#cbd5e1" strokeWidth="1.5" fill="none" />
              <path d="M 120,88 Q 132,83 145,88" stroke="#cbd5e1" strokeWidth="1.5" fill="none" />

              {/* Left Eye Sclera & Iris */}
              <ellipse cx="88" cy="101" rx="13" ry="15" fill="#ffffff" />
              <ellipse cx="88" cy="102" rx="10.5" ry="12.5" fill={`url(#${prefix}_irisGrad)`} />
              {/* Pupil */}
              <ellipse cx="88" cy="102" rx="5.5" ry="6.5" fill="#090d16" />
              {/* Multi-tier Catchlight Reflections */}
              <circle cx="84" cy="96" r="4.5" fill="#ffffff" />
              <circle cx="92" cy="106" r="2.5" fill="#ffffff" opacity="0.85" />
              <ellipse cx="87" cy="109" rx="4" ry="1.5" fill={character.eyeColor} opacity="0.75" />
              {/* Top Eyelash */}
              <path d="M 73,98 Q 88,87 103,97" stroke="#111827" strokeWidth="4" strokeLinecap="round" fill="none" />
              <path d="M 101,96 Q 106,93 108,94" stroke="#111827" strokeWidth="2.5" fill="none" />

              {/* Right Eye Sclera & Iris */}
              <ellipse cx="132" cy="101" rx="13" ry="15" fill="#ffffff" />
              <ellipse cx="132" cy="102" rx="10.5" ry="12.5" fill={`url(#${prefix}_irisGrad)`} />
              {/* Pupil */}
              <ellipse cx="132" cy="102" rx="5.5" ry="6.5" fill="#090d16" />
              {/* Multi-tier Catchlight Reflections */}
              <circle cx="128" cy="96" r="4.5" fill="#ffffff" />
              <circle cx="136" cy="106" r="2.5" fill="#ffffff" opacity="0.85" />
              <ellipse cx="131" cy="109" rx="4" ry="1.5" fill={character.eyeColor} opacity="0.75" />
              {/* Top Eyelash */}
              <path d="M 117,97 Q 132,87 147,98" stroke="#111827" strokeWidth="4" strokeLinecap="round" fill="none" />
              <path d="M 145,96 Q 150,93 152,94" stroke="#111827" strokeWidth="2.5" fill="none" />
            </g>
          )}

          {/* Gentle Natural Eyebrows matching hair */}
          <path d="M 76,84 Q 87,79 98,84" stroke={character.hairColor} strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M 122,84 Q 133,79 144,84" stroke={character.hairColor} strokeWidth="3" strokeLinecap="round" fill="none" />

          {/* Cute Button Nose with soft highlight */}
          <circle cx="110" cy="112" r="1.5" fill="#f43f5e" opacity="0.75" />
          <circle cx="109" cy="111" r="0.8" fill="#ffffff" opacity="0.8" />

          {/* --- MOUTH & LIP GLOSS --- */}
          {expression === 'slurping' ? (
            /* Puckered Slurping Mouth with Noodle Strands Entering */
            <g>
              <ellipse cx="110" cy="126" rx="8" ry="11" fill="#881337" />
              <ellipse cx="110" cy="126" rx="5" ry="7" fill="#be123c" />
              {/* Noodle strands getting sucked in */}
              <g className="animate-slurp">
                <path d="M 108,126 Q 107,144 110,158" stroke="#ef4444" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                <path d="M 112,126 Q 114,142 112,156" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" fill="none" />
              </g>
              <ellipse cx="110" cy="121" rx="9" ry="3.5" fill="#fecdd3" opacity="0.8" />
            </g>
          ) : expression === 'spicy_reaction' ? (
            /* Open Heat Panting Mouth ("Haaah~ Hot & Spicy!") */
            <g>
              <ellipse cx="110" cy="127" rx="10" ry="12" fill="#881337" />
              <path d="M 104,133 Q 110,137 116,133" fill="#f43f5e" />
              <path d="M 104,121 Q 110,118 116,121" stroke="#ffffff" strokeWidth="2.5" fill="none" />
              {/* Cute blue sweat drop on forehead/cheek */}
              <path d="M 152,90 Q 155,96 152,98 Q 149,96 152,90 Z" fill="#38bdf8" opacity="0.9" />
              <circle cx="152" cy="97" r="1" fill="#ffffff" />
            </g>
          ) : expression === 'mouth_open' ? (
            /* Open Wide for Feeding Anticipation ("Aaahh~") */
            <g>
              {/* Outer Lip Shadow */}
              <ellipse cx="110" cy="126" rx="11" ry="14" fill="#9f1239" />
              {/* Inner Mouth / Tongue */}
              <path d="M 103,132 Q 110,138 117,132" fill="#fb7185" />
              {/* Upper White Teeth line */}
              <path d="M 103,119 Q 110,116 117,119" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" fill="none" />
              {/* Lip Gloss Highlight */}
              <ellipse cx="110" cy="138" rx="5" ry="1.5" fill="#fecdd3" opacity="0.8" />
            </g>
          ) : expression === 'chewing' ? (
            /* Chewing Puffed Cheek Animation */
            <g className="animate-chew origin-center">
              <path d="M 102,123 Q 110,120 118,123 Q 110,127 102,123 Z" fill="#e11d48" />
              {/* Puffed Cheeks Contour */}
              <path d="M 68,111 Q 62,119 69,126" stroke="#fb7185" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M 152,111 Q 158,119 151,126" stroke="#fb7185" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            </g>
          ) : expression === 'super_happy' || expression === 'waving' ? (
            /* Wide Joyful Smile with Glossy Pink Lips */
            <g>
              <path
                d="M 100,120 Q 110,135 120,120 Z"
                fill="#e11d48"
                stroke="#be123c"
                strokeWidth="1.5"
              />
              <path d="M 103,121 Q 110,125 117,121" fill="#ffffff" />
            </g>
          ) : (
            /* Sweet Gentle Smile with Lip Gloss */
            <g>
              <path
                d="M 102,123 Q 110,128 118,123"
                stroke="#be123c"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
              />
              <ellipse cx="110" cy="126" rx="4" ry="1.5" fill="#fecdd3" opacity="0.75" />
            </g>
          )}

          {/* ============================================================== */}
          {/* --- 4. FRONT HAIR, BANGS & ACCESSORIES --- */}
          {/* ============================================================== */}
          {/* Bangs Base */}
          <path
            d="M 60,86 C 54,48 84,36 110,36 C 136,36 166,48 160,86 C 145,72 130,75 110,80 C 90,75 75,72 60,86 Z"
            fill={`url(#${prefix}_hairGloss)`}
          />
          {/* Hair Strand Highlights & Fringe */}
          <path d="M 85,70 Q 95,88 102,78" stroke={character.hairColor} strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <path d="M 135,70 Q 125,88 118,78" stroke={character.hairColor} strokeWidth="3.5" fill="none" strokeLinecap="round" />
          {/* Glossy Hair Ribbon Arch on Bangs */}
          <path d="M 78,54 Q 110,48 142,54" stroke="#ffffff" strokeWidth="2.5" fill="none" opacity="0.4" strokeLinecap="round" />

          {/* Hair Accessories */}
          {character.hairStyle === 'side_braid' && (
            /* Sakura Blossom Clips */
            <g>
              <circle cx="68" cy="68" r="7" fill="#fb7185" />
              <circle cx="68" cy="68" r="3" fill="#ffffff" />
              <circle cx="152" cy="68" r="7" fill="#fb7185" />
              <circle cx="152" cy="68" r="3" fill="#ffffff" />
            </g>
          )}
          {character.hairStyle !== 'side_braid' && (
            /* Cute Hair Ribbon Pin */
            <g>
              <circle cx="70" cy="68" r="8" fill={character.ribbonColor} />
              <circle cx="70" cy="68" r="3" fill="#ffffff" />
            </g>
          )}
        </g>
      </svg>

      {/* Floating Love Heart on Satisfaction */}
      {(expression === 'yum_satisfaction' || expression === 'super_happy') && (
        <div className="pointer-events-none absolute -top-4 right-2 text-3xl animate-bounce">
          💖
        </div>
      )}
    </div>
  );
};
