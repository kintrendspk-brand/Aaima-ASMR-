import React from 'react';
import { FoodItem } from '../../types/game';

interface Props {
  food: FoodItem;
  bitesRemaining?: number; // e.g. 5 down to 0
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  isCooking?: boolean;
  cookingStep?: number;
  isLiftingBite?: boolean; // When chopsticks / utensil lift a bite
}

export const FoodArt: React.FC<Props> = ({
  food,
  bitesRemaining,
  size = 'md',
  className = '',
  isCooking = false,
  cookingStep = 0,
  isLiftingBite = false,
}) => {
  const totalBites = food.totalBites || 5;
  const currentBites = bitesRemaining !== undefined ? bitesRemaining : totalBites;
  const portionFraction = Math.max(0, Math.min(1, currentBites / totalBites));

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-28 h-28',
    lg: 'w-48 h-48 sm:w-56 sm:h-56',
  }[size];

  // Render food graphic
  const renderCategoryGraphic = () => {
    if (portionFraction <= 0 && !isCooking) {
      // Empty Clean Plate or Bowl with Sparkles
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
          <ellipse cx="50" cy="65" rx="42" ry="18" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2.5" />
          <ellipse cx="50" cy="63" rx="34" ry="13" fill="#ffffff" />
          <text x="50" y="66" textAnchor="middle" fontSize="10" fill="#ec4899" fontWeight="bold">
            ✨ All Yummy! ✨
          </text>
        </svg>
      );
    }

    // 0. TANGHULU SKEWERS (Signature Mukbang Treat)
    if (food.category === 'tanghulu') {
      const fruits = food.tanghuluFruits || ['strawberry', 'muscat', 'tangerine', 'strawberry'];
      const fruitCount = fruits.length;
      // Fruits remaining based on currentBites / totalBites
      const visibleFruitsCount = Math.ceil(portionFraction * fruitCount);

      const renderFruitItem = (fruitId: string, cx: number, cy: number, r: number) => {
        const id = fruitId.toLowerCase();
        if (id.includes('muscat') || id.includes('grape')) {
          return (
            <g>
              <circle cx={cx} cy={cy} r={r} fill="#84cc16" stroke="#65a30d" strokeWidth="1" />
              <circle cx={cx - 3} cy={cy - 3} r={r * 0.4} fill="#a3e635" opacity="0.8" />
              <circle cx={cx + 2} cy={cy + 2} r="1.5" fill="#facc15" opacity="0.6" />
            </g>
          );
        }
        if (id.includes('mandarin') || id.includes('tangerine') || id.includes('orange')) {
          return (
            <g>
              <ellipse cx={cx} cy={cy} rx={r * 1.15} ry={r * 0.85} fill="#f97316" stroke="#ea580c" strokeWidth="1" />
              <ellipse cx={cx - 2} cy={cy - 2} rx={r * 0.7} ry={r * 0.45} fill="#fb923c" opacity="0.8" />
              <line x1={cx - 5} y1={cy} x2={cx + 5} y2={cy} stroke="#fdba74" strokeWidth="1" opacity="0.7" />
            </g>
          );
        }
        if (id.includes('marshmallow')) {
          return (
            <g>
              <rect x={cx - r} y={cy - r * 0.8} width={r * 2} height={r * 1.6} rx={r * 0.5} fill="#fce7f3" stroke="#f472b6" strokeWidth="1.2" />
              <rect x={cx - r + 2} y={cy - r * 0.8 + 2} width={r * 1.6} height={r * 0.6} rx="2" fill="#ffffff" opacity="0.9" />
              <circle cx={cx - 3} cy={cy} r="1" fill="#ec4899" />
              <circle cx={cx + 3} cy={cy} r="1" fill="#ec4899" />
            </g>
          );
        }
        if (id.includes('tomato')) {
          return (
            <g>
              <circle cx={cx} cy={cy} r={r} fill="#dc2626" stroke="#991b1b" strokeWidth="1" />
              <circle cx={cx - 3} cy={cy - 3} r={r * 0.35} fill="#f87171" opacity="0.8" />
              {/* Green star calyx */}
              <polygon points={`${cx},${cy - r - 2} ${cx + 3},${cy - r + 1} ${cx - 3},${cy - r + 1}`} fill="#22c55e" />
            </g>
          );
        }
        if (id.includes('chili')) {
          return (
            <g>
              <path
                d={`M ${cx - 4},${cy - r} Q ${cx + 8},${cy} ${cx - 2},${cy + r + 3} Q ${cx - 6},${cy + 2} ${cx - 4},${cy - r} Z`}
                fill="#ef4444"
                stroke="#b91c1c"
                strokeWidth="1.2"
              />
              <path d={`M ${cx - 4},${cy - r} Q ${cx - 6},${cy - r - 4} ${cx - 2},${cy - r - 3}`} stroke="#16a34a" strokeWidth="2.5" fill="none" />
            </g>
          );
        }
        if (id.includes('earth')) {
          return (
            <g>
              <circle cx={cx} cy={cy} r={r} fill="#0284c7" stroke="#0369a1" strokeWidth="1" />
              {/* Earth continents pattern */}
              <circle cx={cx - 2} cy={cy - 2} r="4" fill="#22c55e" opacity="0.9" />
              <circle cx={cx + 3} cy={cy + 3} r="3" fill="#22c55e" opacity="0.9" />
              <circle cx={cx - 4} cy={cy + 3} r="2" fill="#22c55e" opacity="0.9" />
            </g>
          );
        }
        if (id.includes('gummy')) {
          return (
            <g>
              {/* Gummy bear silhouette */}
              <rect x={cx - r * 0.7} y={cy - r * 0.7} width={r * 1.4} height={r * 1.4} rx="4" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
              <circle cx={cx - 4} cy={cy - r * 0.7} r="2.5" fill="#fbbf24" />
              <circle cx={cx + 4} cy={cy - r * 0.7} r="2.5" fill="#fbbf24" />
              <circle cx={cx - 2} cy={cy - 1} r="1" fill="#78350f" />
              <circle cx={cx + 2} cy={cy - 1} r="1" fill="#78350f" />
            </g>
          );
        }
        if (id.includes('cheese')) {
          return (
            <g>
              <rect x={cx - r * 0.8} y={cy - r * 0.8} width={r * 1.6} height={r * 1.6} rx="2" fill="#facc15" stroke="#eab308" strokeWidth="1" />
              <circle cx={cx - 2} cy={cy - 2} r="1.5" fill="#ca8a04" opacity="0.7" />
              <circle cx={cx + 3} cy={cy + 2} r="1.2" fill="#ca8a04" opacity="0.7" />
            </g>
          );
        }
        if (id.includes('blueberry')) {
          return (
            <g>
              <circle cx={cx} cy={cy} r={r * 0.9} fill="#3b82f6" stroke="#1d4ed8" strokeWidth="1" />
              <circle cx={cx} cy={cy - r * 0.6} r="2" fill="#1e3a8a" />
              <circle cx={cx - 2} cy={cy - 2} r={r * 0.3} fill="#60a5fa" opacity="0.7" />
            </g>
          );
        }
        if (id.includes('kiwi')) {
          return (
            <g>
              <circle cx={cx} cy={cy} r={r} fill="#65a30d" stroke="#4d7c0f" strokeWidth="1" />
              <circle cx={cx} cy={cy} r={r * 0.4} fill="#ecfccb" />
              <circle cx={cx - 3} cy={cy} r="0.8" fill="#1f2937" />
              <circle cx={cx + 3} cy={cy} r="0.8" fill="#1f2937" />
              <circle cx={cx} cy={cy - 3} r="0.8" fill="#1f2937" />
              <circle cx={cx} cy={cy + 3} r="0.8" fill="#1f2937" />
            </g>
          );
        }
        // Default: Juicy Strawberry with Seeds & Calyx
        return (
          <g>
            <path
              d={`M ${cx},${cy - r} C ${cx + r * 1.2},${cy - r * 0.5} ${cx + r},${cy + r * 1.1} ${cx},${cy + r * 1.2} C ${cx - r},${cy + r * 1.1} ${cx - r * 1.2},${cy - r * 0.5} ${cx},${cy - r} Z`}
              fill="#ef4444"
              stroke="#b91c1c"
              strokeWidth="1"
            />
            {/* Strawberry Seeds */}
            <circle cx={cx - 4} cy={cy} r="1" fill="#fef08a" />
            <circle cx={cx + 3} cy={cy + 2} r="1" fill="#fef08a" />
            <circle cx={cx - 1} cy={cy + 6} r="1" fill="#fef08a" />
            <circle cx={cx} cy={cy - 4} r="1" fill="#fef08a" />
            {/* Green Leaf Calyx */}
            <path d={`M ${cx - 6},${cy - r} Q ${cx},${cy - r - 4} ${cx + 6},${cy - r}`} stroke="#22c55e" strokeWidth="3" fill="none" strokeLinecap="round" />
          </g>
        );
      };

      const fruitPositions = [
        { y: 22, r: 10 },
        { y: 40, r: 10.5 },
        { y: 58, r: 10.5 },
        { y: 76, r: 10 },
      ];

      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          {/* Bamboo Skewer Stick */}
          <line x1="50" y1="10" x2="50" y2="96" stroke="#d97706" strokeWidth="3.2" strokeLinecap="round" />
          <line x1="49" y1="10" x2="49" y2="96" stroke="#fef3c7" strokeWidth="1" strokeLinecap="round" opacity="0.6" />

          {/* Fruits Stack */}
          {fruitPositions.map((pos, idx) => {
            const isVisible = (fruitCount - idx) <= visibleFruitsCount;
            if (!isVisible) return null;
            const fruitType = fruits[idx % fruits.length];

            return (
              <g key={idx}>
                {/* 1. Base Fruit */}
                {renderFruitItem(fruitType, 50, pos.y, pos.r)}

                {/* 2. Glassy Sugar Shell Glaze Overlay */}
                <circle
                  cx="50"
                  cy={pos.y}
                  r={pos.r + 2}
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2.5"
                  opacity="0.75"
                />
                {/* Glassy Specular Curved Highlight */}
                <path
                  d={`M ${43},${pos.y - pos.r * 0.7} Q ${41},${pos.y} ${44},${pos.y + pos.r * 0.5}`}
                  stroke="#ffffff"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  fill="none"
                  opacity="0.9"
                />
                <circle cx={45} cy={pos.y - pos.r * 0.5} r="2" fill="#ffffff" opacity="0.95" />

                {/* Optional Topping Sparkles */}
                {food.id.includes('gold') && (
                  <circle cx={53} cy={pos.y + 2} r="2" fill="#facc15" />
                )}
                {food.id.includes('popping') && (
                  <g>
                    <circle cx={54} cy={pos.y - 3} r="1.5" fill="#c084fc" />
                    <circle cx={47} cy={pos.y + 4} r="1.5" fill="#f43f5e" />
                  </g>
                )}
              </g>
            );
          })}

          {/* Dripping Crystal Sugar Droplet at bottom */}
          {visibleFruitsCount > 0 && (
            <path d="M 50,88 C 48,91 48,93 50,94 C 52,93 52,91 50,88 Z" fill="#ffffff" opacity="0.75" />
          )}
        </svg>
      );
    }

    // 1. NOODLES & PASTA
    if (food.category === 'noodles') {
      const isRedSpicy =
        food.id.includes('spicy') || food.id.includes('fire') || food.id.includes('chili');
      const isBrown =
        food.id.includes('brown') || food.id.includes('sesame');

      const noodleColor = isRedSpicy
        ? '#ef4444'
        : isBrown
        ? '#78350f'
        : '#f59e0b';

      const brothColor = isRedSpicy
        ? '#dc2626'
        : isBrown
        ? '#451a03'
        : '#fef08a';

      const bowlColor = isRedSpicy
        ? '#be123c'
        : isBrown
        ? '#1e293b'
        : '#ec4899';

      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          {/* Bowl Back Edge */}
          <ellipse cx="50" cy="50" rx="43" ry="19" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2" />
          {/* Rich Broth Base */}
          <ellipse cx="50" cy="52" rx="39" ry="15" fill={brothColor} opacity="0.9" />

          {/* Wavy Noodles with visible reduction */}
          <g
            style={{
              opacity: portionFraction,
              transform: `scale(${0.68 + portionFraction * 0.32})`,
              transformOrigin: '50px 55px',
            }}
          >
            {/* Wavy Noodle Strands */}
            <path d="M 20,50 Q 30,36 40,52 Q 50,60 62,48 Q 72,38 80,52" stroke={noodleColor} strokeWidth="5.5" strokeLinecap="round" fill="none" />
            <path d="M 24,56 Q 36,42 48,56 Q 60,64 74,50" stroke={noodleColor} strokeWidth="5.5" strokeLinecap="round" fill="none" />
            <path d="M 30,46 Q 44,60 56,46 Q 68,36 76,48" stroke={noodleColor} strokeWidth="4.5" strokeLinecap="round" fill="none" />

            {/* Toppings: Soft Boiled Egg */}
            {portionFraction > 0.35 && (
              <g>
                <ellipse cx="40" cy="46" rx="9" ry="6.5" fill="#ffffff" />
                <ellipse cx="40" cy="46" rx="5" ry="4" fill="#f97316" />
                <circle cx="39" cy="45" r="1.5" fill="#ffffff" opacity="0.8" />
              </g>
            )}

            {/* Green Scallion Flecks */}
            {portionFraction > 0.25 && (
              <g>
                <circle cx="58" cy="44" r="2.2" fill="#22c55e" />
                <circle cx="64" cy="50" r="2.5" fill="#16a34a" />
                <circle cx="32" cy="54" r="2.2" fill="#22c55e" />
                <circle cx="48" cy="58" r="2" fill="#16a34a" />
              </g>
            )}

            {/* Spicy Chili Flakes if Spicy */}
            {isRedSpicy && (
              <g>
                <circle cx="48" cy="48" r="1.5" fill="#7f1d1d" />
                <circle cx="54" cy="54" r="1.5" fill="#7f1d1d" />
                <circle cx="68" cy="46" r="1.5" fill="#7f1d1d" />
              </g>
            )}

            {/* Toasted Sesame if Brown Noodles */}
            {isBrown && (
              <g>
                <ellipse cx="52" cy="46" rx="1.5" ry="1" fill="#fef08a" />
                <ellipse cx="60" cy="52" rx="1.5" ry="1" fill="#fef08a" />
                <ellipse cx="36" cy="50" rx="1.5" ry="1" fill="#fef08a" />
              </g>
            )}
          </g>

          {/* Ceramic Bowl Front */}
          <path
            d="M 7,50 C 7,80 27,90 50,90 C 73,90 93,80 93,50 C 93,56 73,67 50,67 C 27,67 7,56 7,50 Z"
            fill={bowlColor}
          />
          <path
            d="M 7,50 C 7,80 27,90 50,90 C 73,90 93,80 93,50"
            fill="none"
            stroke="#ffffff"
            strokeWidth="1.5"
            opacity="0.6"
          />

          {/* Bowl Rim Highlight */}
          <ellipse cx="50" cy="74" rx="15" ry="4" fill="#ffffff" opacity="0.3" />

          {/* Rising Steam Vapors */}
          {portionFraction > 0.2 && (
            <g className="animate-steam">
              <path d="M 36,36 Q 40,22 36,14" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.75" />
              <path d="M 50,34 Q 46,20 52,12" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.75" />
              <path d="M 64,36 Q 68,24 64,16" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.75" />
            </g>
          )}

          {/* Chopsticks lifting noodles or resting */}
          {isLiftingBite ? (
            <g className="animate-bounce">
              {/* Lifted Chopsticks */}
              <line x1="30" y1="20" x2="70" y2="28" stroke="#d97706" strokeWidth="3.5" strokeLinecap="round" />
              <line x1="32" y1="24" x2="72" y2="32" stroke="#b45309" strokeWidth="3.5" strokeLinecap="round" />
              {/* Hanging lifted noodle strands */}
              <path d="M 45,26 Q 43,42 46,55" stroke={noodleColor} strokeWidth="4.5" strokeLinecap="round" fill="none" />
              <path d="M 52,28 Q 55,44 50,56" stroke={noodleColor} strokeWidth="4.5" strokeLinecap="round" fill="none" />
            </g>
          ) : (
            <g>
              <line x1="16" y1="36" x2="84" y2="44" stroke="#d97706" strokeWidth="3" strokeLinecap="round" />
              <line x1="18" y1="40" x2="86" y2="48" stroke="#b45309" strokeWidth="3" strokeLinecap="round" />
            </g>
          )}
        </svg>
      );
    }

    // 2. ASMR SNACKS (Chips, Crackers, Popcorn, Jelly)
    if (food.category === 'snacks') {
      const isJelly = food.id.includes('jelly') || food.id.includes('marshmallow');
      if (isJelly) {
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <ellipse cx="50" cy="76" rx="42" ry="14" fill="#e0f2fe" stroke="#38bdf8" strokeWidth="2" opacity="0.8" />
            <g style={{ opacity: portionFraction, transform: `scale(${0.5 + portionFraction * 0.5})`, transformOrigin: '50px 65px' }}>
              <path d="M 28,68 C 24,38 38,30 50,30 C 62,30 76,38 72,68 C 60,74 40,74 28,68 Z" fill={food.colorTheme} />
              <path d="M 36,44 Q 44,38 52,40" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.8" />
              <circle cx="50" cy="28" r="6" fill="#be123c" />
              <path d="M 50,24 Q 56,14 62,16" stroke="#059669" strokeWidth="2" fill="none" strokeLinecap="round" />
            </g>
          </svg>
        );
      }

      // Golden Wavy Potato Chips / Crackers
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          <ellipse cx="50" cy="56" rx="40" ry="16" fill="#e2e8f0" />
          <g style={{ opacity: portionFraction, transform: `scale(${0.6 + portionFraction * 0.4})`, transformOrigin: '50px 55px' }}>
            {portionFraction > 0.65 && (
              <ellipse cx="50" cy="40" rx="14" ry="8" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" transform="rotate(-15 50 40)" />
            )}
            {portionFraction > 0.45 && (
              <ellipse cx="36" cy="46" rx="13" ry="8" fill="#f59e0b" stroke="#b45309" strokeWidth="1.5" transform="rotate(20 36 46)" />
            )}
            {portionFraction > 0.25 && (
              <ellipse cx="64" cy="46" rx="13" ry="8" fill="#fbbf24" stroke="#ca8a04" strokeWidth="1.5" transform="rotate(-10 64 46)" />
            )}
            <ellipse cx="48" cy="52" rx="15" ry="9" fill="#f59e0b" stroke="#b45309" strokeWidth="1.5" />
          </g>
          <path d="M 10,55 C 10,80 30,90 50,90 C 70,90 90,80 90,55 C 90,62 70,72 50,72 C 30,72 10,62 10,55 Z" fill="#818cf8" />
          <ellipse cx="50" cy="74" rx="12" ry="3" fill="#c7d2fe" />
        </svg>
      );
    }

    // 3. FAST FOOD & MUKBANG PLATTERS (Chicken Buckets, Corn Dogs, Tteokbokki, Dim Sum, Sushi, Burgers)
    if (food.category === 'fastfood') {
      const isBucket = food.id.includes('bucket');
      const isCornDog = food.id.includes('corndog');
      const isTteokbokki = food.id.includes('tteokbokki');
      const isDimSum = food.id.includes('dimsum');
      const isSushi = food.id.includes('sushi');
      const isSeafood = food.id.includes('seafood');
      const isTakoyaki = food.id.includes('takoyaki');
      const isChickenDrumstick = food.id === 'fast_fried_chicken';
      const isChickenNuggets = food.id.includes('nuggets');
      const isFries = food.id.includes('fries');
      const isPizza = food.id.includes('pizza');

      // 1. MEGA CRISPY CHICKEN MUKBANG BUCKET (Signature Mukbang Feature)
      if (isBucket) {
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl overflow-visible">
            {/* Table Shadow */}
            <ellipse cx="50" cy="88" rx="38" ry="8" fill="#1e1b4b" opacity="0.25" />

            {/* Red & White Striped Mukbang Bucket */}
            <defs>
              <linearGradient id="bucketGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#b91c1c" />
                <stop offset="25%" stopColor="#ef4444" />
                <stop offset="50%" stopColor="#ffffff" />
                <stop offset="75%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#991b1b" />
              </linearGradient>
              <linearGradient id="chickenGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="40%" stopColor="#d97706" />
                <stop offset="80%" stopColor="#b45309" />
                <stop offset="100%" stopColor="#78350f" />
              </linearGradient>
            </defs>

            {/* Bucket Body Trapezoid */}
            <path
              d="M 22,46 L 28,84 Q 50,88 72,84 L 78,46 Q 50,42 22,46 Z"
              fill="url(#bucketGrad)"
              stroke="#7f1d1d"
              strokeWidth="1.5"
            />

            {/* Bucket Stripes */}
            <path d="M 36,45 L 39,85" stroke="#ffffff" strokeWidth="6" opacity="0.9" />
            <path d="M 50,45 L 50,86" stroke="#b91c1c" strokeWidth="6" opacity="0.95" />
            <path d="M 64,45 L 61,85" stroke="#ffffff" strokeWidth="6" opacity="0.9" />

            {/* Bucket Mukbang Logo Badge */}
            <circle cx="50" cy="65" r="9" fill="#fef08a" stroke="#b45309" strokeWidth="1" />
            <text x="50" y="68" textAnchor="middle" fontSize="6.5" fill="#991b1b" fontWeight="900" fontFamily="sans-serif">
              🍗 ASMR
            </text>

            {/* Bucket Rim Lip */}
            <ellipse cx="50" cy="46" rx="28" ry="6" fill="#f8fafc" stroke="#dc2626" strokeWidth="1.8" />
            <ellipse cx="50" cy="46" rx="25" ry="4.5" fill="#fef2f2" />

            {/* Inside Greaseproof Paper */}
            <path d="M 26,45 Q 36,40 50,43 Q 64,39 74,45" stroke="#fef08a" strokeWidth="3" fill="none" opacity="0.8" />

            {/* Pile of Crispy Golden Fried Drumsticks & Wings inside Bucket */}
            <g
              style={{
                opacity: portionFraction,
                transform: `scale(${0.65 + portionFraction * 0.35})`,
                transformOrigin: '50px 46px',
              }}
            >
              {/* Back Drumstick 1 */}
              {portionFraction > 0.4 && (
                <g>
                  {/* Bone handle */}
                  <rect x="22" y="24" width="6" height="15" rx="3" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="0.8" transform="rotate(-28 22 24)" />
                  <circle cx="21" cy="22" r="3" fill="#f8fafc" />
                  {/* Meat head */}
                  <ellipse cx="32" cy="34" rx="10" ry="8" fill="url(#chickenGold)" stroke="#9a3412" strokeWidth="1" />
                  <circle cx="34" cy="32" r="1.5" fill="#fef08a" />
                  <circle cx="30" cy="36" r="1.5" fill="#fef08a" />
                </g>
              )}

              {/* Back Drumstick 2 (Right) */}
              {portionFraction > 0.6 && (
                <g>
                  <rect x="74" y="22" width="6" height="15" rx="3" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="0.8" transform="rotate(32 74 22)" />
                  <circle cx="78" cy="20" r="3" fill="#f8fafc" />
                  <ellipse cx="68" cy="33" rx="10" ry="8" fill="url(#chickenGold)" stroke="#9a3412" strokeWidth="1" />
                  <circle cx="66" cy="31" r="1.5" fill="#fef08a" />
                </g>
              )}

              {/* Central Giant Crispy Fried Drumstick (Front) */}
              <g>
                {/* Bone stem */}
                <rect x="52" y="16" width="6" height="18" rx="3" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" transform="rotate(12 52 16)" />
                <circle cx="56" cy="14" r="3.2" fill="#f8fafc" />
                <circle cx="52" cy="13" r="3.2" fill="#f8fafc" />

                {/* Big Crunchy Golden Batter Meat */}
                <path
                  d="M 38,36 C 36,25 48,22 56,28 C 66,24 72,35 68,44 C 64,48 42,48 38,36 Z"
                  fill="url(#chickenGold)"
                  stroke="#9a3412"
                  strokeWidth="1.2"
                />
                {/* Crispy Crunch Blisters & Flakes */}
                <circle cx="46" cy="32" r="2.5" fill="#ea580c" />
                <circle cx="54" cy="35" r="2.8" fill="#ea580c" />
                <circle cx="62" cy="34" r="2" fill="#fef08a" />
                <circle cx="48" cy="38" r="1.5" fill="#fef08a" />
                {/* Parsley herb flakes */}
                <circle cx="50" cy="30" r="1" fill="#16a34a" />
                <circle cx="58" cy="38" r="1.2" fill="#16a34a" />
              </g>

              {/* Side Ramekin Dish of Honey Mustard / Chili Sauce */}
              <ellipse cx="80" cy="76" rx="9" ry="4" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
              <ellipse cx="80" cy="75" rx="7.5" ry="3" fill="#ef4444" />
              <circle cx="81" cy="74.5" r="1.5" fill="#ffffff" opacity="0.8" />
            </g>

            {/* Rising Hot Crispy Steam */}
            {portionFraction > 0.25 && (
              <g className="animate-steam">
                <path d="M 44,14 Q 40,6 46,2" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.8" />
                <path d="M 58,16 Q 62,8 56,3" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.8" />
              </g>
            )}
          </svg>
        );
      }

      // 2. KOREAN MOZZARELLA POTATO CORN DOG
      if (isCornDog) {
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg overflow-visible">
            {/* Wooden Skewer Stick */}
            <line x1="50" y1="20" x2="50" y2="92" stroke="#d97706" strokeWidth="3.5" strokeLinecap="round" />
            {/* Ceramic Plate Shadow */}
            <ellipse cx="50" cy="85" rx="36" ry="10" fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="1.5" />

            <g
              style={{
                opacity: portionFraction,
                transform: `scale(${0.7 + portionFraction * 0.3})`,
                transformOrigin: '50px 48px',
              }}
            >
              {/* Potato-Crusted Corn Dog Body */}
              <rect x="36" y="22" width="28" height="52" rx="14" fill="#f59e0b" stroke="#b45309" strokeWidth="1.8" />

              {/* Crunchy French Fry Potato Cubes Embedded on Coating */}
              <rect x="38" y="26" width="6" height="6" rx="1.5" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.8" />
              <rect x="52" y="24" width="7" height="6" rx="1.5" fill="#fde047" stroke="#ca8a04" strokeWidth="0.8" />
              <rect x="44" y="34" width="6" height="7" rx="1.5" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.8" />
              <rect x="56" y="38" width="6" height="6" rx="1.5" fill="#fde047" stroke="#ca8a04" strokeWidth="0.8" />
              <rect x="37" y="46" width="7" height="6" rx="1.5" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.8" />
              <rect x="48" y="52" width="6" height="6" rx="1.5" fill="#fde047" stroke="#ca8a04" strokeWidth="0.8" />
              <rect x="42" y="62" width="7" height="6" rx="1.5" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.8" />
              <rect x="54" y="60" width="6" height="6" rx="1.5" fill="#fde047" stroke="#ca8a04" strokeWidth="0.8" />

              {/* Zigzag Ketchup Squiggle */}
              <path
                d="M 40,28 Q 50,34 60,32 Q 40,42 60,44 Q 40,54 60,56 Q 40,66 58,68"
                stroke="#dc2626"
                strokeWidth="2.8"
                strokeLinecap="round"
                fill="none"
              />
              {/* Zigzag Honey Mustard Squiggle */}
              <path
                d="M 42,26 Q 52,32 58,34 Q 42,44 58,46 Q 42,56 58,58 Q 42,64 56,70"
                stroke="#facc15"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />

              {/* Stretchy Mozzarella String Pull */}
              {portionFraction < 0.9 && (
                <path d="M 44,22 Q 38,10 48,2" stroke="#fef08a" strokeWidth="3" fill="none" strokeLinecap="round" className="animate-pulse" />
              )}
            </g>
          </svg>
        );
      }

      // 3. KOREAN CHEESY SPICY TTEOKBOKKI PLATTER
      if (isTteokbokki) {
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg overflow-visible">
            {/* White Ceramic Mukbang Platter Dish */}
            <ellipse cx="50" cy="58" rx="44" ry="20" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2.5" />
            <ellipse cx="50" cy="56" rx="40" ry="17" fill="#ffffff" />

            {/* Thick Fiery Red Gochujang Sauce Layer */}
            <ellipse cx="50" cy="56" rx="36" ry="14" fill="#dc2626" />

            <g
              style={{
                opacity: portionFraction,
                transform: `scale(${0.7 + portionFraction * 0.3})`,
                transformOrigin: '50px 56px',
              }}
            >
              {/* Rice Cakes (Tteok Cylinder Pieces) */}
              <g stroke="#b91c1c" strokeWidth="1">
                {/* Piece 1 */}
                <rect x="24" y="48" width="22" height="7" rx="3.5" fill="#fef2f2" transform="rotate(-15 24 48)" />
                {/* Piece 2 */}
                <rect x="42" y="44" width="22" height="7" rx="3.5" fill="#fee2e2" transform="rotate(8 42 44)" />
                {/* Piece 3 */}
                <rect x="58" y="50" width="20" height="7" rx="3.5" fill="#fef2f2" transform="rotate(-20 58 50)" />
                {/* Piece 4 */}
                <rect x="32" y="56" width="24" height="7" rx="3.5" fill="#fee2e2" transform="rotate(5 32 56)" />
                {/* Piece 5 */}
                <rect x="52" y="58" width="22" height="7" rx="3.5" fill="#fef2f2" transform="rotate(-10 52 58)" />
              </g>

              {/* Melted Cheddar/Mozzarella Cheese Blanket */}
              <path
                d="M 34,44 Q 48,38 64,42 Q 68,52 58,56 Q 44,58 36,52 Z"
                fill="#facc15"
                opacity="0.9"
              />

              {/* Hard Boiled Egg Half */}
              <ellipse cx="68" cy="48" rx="8" ry="6" fill="#ffffff" stroke="#e2e8f0" strokeWidth="0.8" />
              <ellipse cx="68" cy="48" rx="4.5" ry="3.5" fill="#f97316" />

              {/* Fresh Green Scallions & Toasted Sesame */}
              <circle cx="38" cy="50" r="1.8" fill="#16a34a" />
              <circle cx="48" cy="48" r="2" fill="#22c55e" />
              <circle cx="56" cy="54" r="1.8" fill="#16a34a" />
              <circle cx="44" cy="56" r="1" fill="#fef08a" />
              <circle cx="62" cy="58" r="1" fill="#fef08a" />
            </g>
          </svg>
        );
      }

      // 4. BAMBOO STEAMER XIAO LONG BAO DUMPLINGS
      if (isDimSum) {
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg overflow-visible">
            {/* Bamboo Steamer Outer Rim */}
            <ellipse cx="50" cy="58" rx="44" ry="18" fill="#d97706" stroke="#92400e" strokeWidth="2.5" />
            <path d="M 6,58 L 6,68 Q 50,86 94,68 L 94,58 Z" fill="#b45309" stroke="#78350f" strokeWidth="2" />
            <ellipse cx="50" cy="68" rx="44" ry="16" fill="none" stroke="#78350f" strokeWidth="1" />

            {/* Steamer Woven Base & Paper Liner */}
            <ellipse cx="50" cy="56" rx="38" ry="14" fill="#fef3c7" stroke="#fcd34d" strokeWidth="1" />

            <g
              style={{
                opacity: portionFraction,
                transform: `scale(${0.7 + portionFraction * 0.3})`,
                transformOrigin: '50px 56px',
              }}
            >
              {/* 3 Delicate Pleated Soup Dumplings */}
              {/* Left Dumpling */}
              <g transform="translate(30, 48)">
                <ellipse cx="0" cy="0" rx="9" ry="7" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
                <path d="M -6,-2 Q 0,-6 6,-2" stroke="#94a3b8" strokeWidth="1" fill="none" />
                <circle cx="0" cy="-4" r="1.5" fill="#ea580c" />
              </g>

              {/* Right Dumpling */}
              <g transform="translate(70, 48)">
                <ellipse cx="0" cy="0" rx="9" ry="7" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
                <path d="M -6,-2 Q 0,-6 6,-2" stroke="#94a3b8" strokeWidth="1" fill="none" />
                <circle cx="0" cy="-4" r="1.5" fill="#ea580c" />
              </g>

              {/* Center Plump Dumpling */}
              <g transform="translate(50, 56)">
                <ellipse cx="0" cy="0" rx="10" ry="8" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.2" />
                {/* Pleats */}
                <path d="M -7,-2 Q 0,-7 7,-2" stroke="#94a3b8" strokeWidth="1" fill="none" />
                <circle cx="0" cy="-5" r="1.8" fill="#ea580c" />
              </g>

              {/* Dipping Sauce Dish with Ginger */}
              <ellipse cx="50" cy="42" rx="7" ry="3.5" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="0.8" />
              <ellipse cx="50" cy="42" rx="5.5" ry="2.5" fill="#1e1b4b" />
              <line x1="47" y1="42" x2="52" y2="42" stroke="#fef08a" strokeWidth="1" strokeLinecap="round" />
            </g>
          </svg>
        );
      }

      // 5. JAPANESE SUSHI & GIMBAP PLATTER
      if (isSushi) {
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl overflow-visible">
            {/* Black Lacquer Sushi Board Platter */}
            <rect x="12" y="44" width="76" height="34" rx="5" fill="#0f172a" stroke="#334155" strokeWidth="2" />
            <rect x="14" y="46" width="72" height="30" rx="4" fill="#1e293b" />
            <line x1="16" y1="74" x2="84" y2="74" stroke="#94a3b8" strokeWidth="0.8" opacity="0.4" />

            <g
              style={{
                opacity: portionFraction,
                transform: `scale(${0.7 + portionFraction * 0.3})`,
                transformOrigin: '50px 60px',
              }}
            >
              {/* Salmon Nigiri (Left) */}
              <g transform="translate(26, 56)">
                {/* Rice ball */}
                <ellipse cx="0" cy="4" rx="9" ry="5" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="0.8" />
                {/* Glossy Salmon Fish Topping */}
                <ellipse cx="0" cy="2" rx="10" ry="5.5" fill="#f97316" stroke="#ea580c" strokeWidth="1" />
                <line x1="-6" y1="2" x2="6" y2="2" stroke="#ffedd5" strokeWidth="1" />
                <line x1="-4" y1="-0.5" x2="4" y2="-0.5" stroke="#ffedd5" strokeWidth="0.8" />
              </g>

              {/* Gimbap / Nori Rolls (Center) */}
              <g transform="translate(50, 58)">
                <circle cx="0" cy="0" r="7.5" fill="#0f172a" stroke="#000000" strokeWidth="1.2" />
                <circle cx="0" cy="0" r="6" fill="#f8fafc" />
                {/* Fillings: Yellow radish, carrot, avocado, egg */}
                <circle cx="-2" cy="-2" r="1.5" fill="#facc15" />
                <circle cx="2" cy="-2" r="1.5" fill="#ef4444" />
                <circle cx="-1" cy="2" r="1.5" fill="#22c55e" />
                <circle cx="2" cy="2" r="1.5" fill="#d97706" />
              </g>

              {/* Tuna Nigiri (Right) */}
              <g transform="translate(72, 56)">
                <ellipse cx="0" cy="4" rx="9" ry="5" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="0.8" />
                <ellipse cx="0" cy="2" rx="10" ry="5.5" fill="#e11d48" stroke="#be123c" strokeWidth="1" />
                <line x1="-5" y1="2" x2="5" y2="2" stroke="#fda4af" strokeWidth="0.8" />
              </g>

              {/* Fresh Wasabi Dot & Pickled Ginger */}
              <circle cx="34" cy="68" r="2.5" fill="#84cc16" stroke="#65a30d" strokeWidth="0.8" />
              <path d="M 62,67 Q 66,64 68,67 Q 65,70 62,67 Z" fill="#f472b6" opacity="0.9" />
            </g>
          </svg>
        );
      }

      // 6. CAJUN SEAFOOD BOIL PLATTER
      if (isSeafood) {
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl overflow-visible">
            {/* Stainless Steel Oval Boil Platter */}
            <ellipse cx="50" cy="58" rx="44" ry="20" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="2" />
            <ellipse cx="50" cy="56" rx="40" ry="17" fill="#e2e8f0" />
            {/* Cajun Garlic Butter Pool */}
            <ellipse cx="50" cy="56" rx="36" ry="14" fill="#b91c1c" opacity="0.85" />

            <g
              style={{
                opacity: portionFraction,
                transform: `scale(${0.7 + portionFraction * 0.3})`,
                transformOrigin: '50px 56px',
              }}
            >
              {/* Giant Red King Crab Leg */}
              <path
                d="M 22,46 Q 38,34 56,48 Q 72,40 82,32"
                stroke="#dc2626"
                strokeWidth="6"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 22,46 Q 38,34 56,48 Q 72,40 82,32"
                stroke="#fee2e2"
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
                opacity="0.6"
              />

              {/* Jumbo Butter Garlic Shrimp */}
              <path
                d="M 38,54 C 34,46 44,42 48,50 C 52,56 46,62 38,58 Z"
                fill="#f97316"
                stroke="#ea580c"
                strokeWidth="1"
              />

              {/* Sweet Corn on the Cob Piece */}
              <ellipse cx="64" cy="58" rx="7" ry="5" fill="#facc15" stroke="#ca8a04" strokeWidth="1" />
              <rect x="58" y="54" width="12" height="8" rx="2" fill="#facc15" stroke="#ca8a04" strokeWidth="1" />

              {/* Sliced Smoked Sausage */}
              <ellipse cx="32" cy="62" rx="5" ry="3.5" fill="#991b1b" stroke="#7f1d1d" strokeWidth="1" />
              <ellipse cx="32" cy="62" rx="3.5" ry="2.2" fill="#f87171" />

              {/* Lemon Wedge */}
              <path d="M 50,65 Q 56,62 58,68 Z" fill="#fde047" stroke="#eab308" strokeWidth="0.8" />
            </g>
          </svg>
        );
      }

      // 7. CRISPY OCTOPUS TAKOYAKI BOAT
      if (isTakoyaki) {
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md overflow-visible">
            {/* Bamboo Boat Tray */}
            <path
              d="M 16,56 Q 50,72 84,56 L 80,66 Q 50,82 20,66 Z"
              fill="#d97706"
              stroke="#b45309"
              strokeWidth="1.5"
            />
            <ellipse cx="50" cy="56" rx="34" ry="11" fill="#fef3c7" stroke="#fcd34d" strokeWidth="1" />

            <g
              style={{
                opacity: portionFraction,
                transform: `scale(${0.7 + portionFraction * 0.3})`,
                transformOrigin: '50px 56px',
              }}
            >
              {/* 3 Golden Takoyaki Balls */}
              <circle cx="34" cy="52" r="8" fill="#d97706" stroke="#92400e" strokeWidth="1" />
              <circle cx="50" cy="50" r="8.5" fill="#d97706" stroke="#92400e" strokeWidth="1" />
              <circle cx="66" cy="52" r="8" fill="#d97706" stroke="#92400e" strokeWidth="1" />

              {/* Dark Sweet Takoyaki Glaze */}
              <path d="M 28,48 Q 50,44 72,48" stroke="#451a03" strokeWidth="3" strokeLinecap="round" fill="none" />
              {/* Creamy Mayo Stripes */}
              <path d="M 30,52 Q 50,48 70,52" stroke="#fef08a" strokeWidth="2" strokeLinecap="round" fill="none" />

              {/* Green Aonori Powder & Bonito Flakes */}
              <circle cx="34" cy="50" r="1" fill="#16a34a" />
              <circle cx="50" cy="48" r="1.2" fill="#16a34a" />
              <circle cx="66" cy="50" r="1" fill="#16a34a" />
              <rect x="46" y="44" width="4" height="2" rx="0.5" fill="#fed7aa" transform="rotate(15 46 44)" />
              <rect x="54" y="46" width="4" height="2" rx="0.5" fill="#fed7aa" transform="rotate(-20 54 46)" />
            </g>
          </svg>
        );
      }

      // 8. CRISPY FRIED DRUMSTICK ON PLATE
      if (isChickenDrumstick) {
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md overflow-visible">
            {/* Ceramic Plate with Rim */}
            <ellipse cx="50" cy="62" rx="42" ry="18" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2.5" />
            <ellipse cx="50" cy="60" rx="36" ry="14" fill="#ffffff" />
            <ellipse cx="50" cy="60" rx="30" ry="11" fill="#fef2f2" opacity="0.6" />

            <g
              style={{
                opacity: portionFraction,
                transform: `scale(${0.7 + portionFraction * 0.3})`,
                transformOrigin: '50px 58px',
              }}
            >
              {/* Bone Handle */}
              <rect x="22" y="38" width="8" height="18" rx="3.5" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" transform="rotate(-35 22 38)" />
              <circle cx="20" cy="36" r="3.5" fill="#f8fafc" />
              <circle cx="24" cy="33" r="3.5" fill="#f8fafc" />

              {/* Jumbo Crispy Batter Meat */}
              <path
                d="M 34,48 C 30,34 50,28 66,38 C 78,48 76,70 56,70 C 42,70 36,60 34,48 Z"
                fill="#ea580c"
                stroke="#9a3412"
                strokeWidth="2"
              />
              {/* Crackling Golden Flakes */}
              <circle cx="52" cy="46" r="3" fill="#facc15" />
              <circle cx="64" cy="52" r="3.2" fill="#facc15" />
              <circle cx="48" cy="58" r="2.8" fill="#facc15" />
              <circle cx="60" cy="42" r="2" fill="#fef08a" />
              {/* Herbs */}
              <circle cx="56" cy="50" r="1.2" fill="#16a34a" />
            </g>
          </svg>
        );
      }

      // 9. CRISPY FRENCH FRIES IN RED CONTAINER
      if (isFries) {
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md overflow-visible">
            {/* Plate Base */}
            <ellipse cx="50" cy="85" rx="38" ry="10" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1.5" />
            {/* Red Fry Box */}
            <path d="M 28,45 L 24,84 L 76,84 L 72,45 Q 50,55 28,45 Z" fill="#ef4444" stroke="#b91c1c" strokeWidth="1.5" />
            <path d="M 50,60 Q 50,72 50,72" stroke="#fbbf24" strokeWidth="6" strokeLinecap="round" />

            <g
              style={{
                opacity: portionFraction,
                transform: `scaleY(${portionFraction})`,
                transformOrigin: '50px 84px',
              }}
            >
              <rect x="34" y="20" width="6" height="35" rx="2" fill="#facc15" stroke="#ca8a04" strokeWidth="1" transform="rotate(-8 34 20)" />
              <rect x="42" y="14" width="6" height="42" rx="2" fill="#fde047" stroke="#ca8a04" strokeWidth="1" />
              <rect x="52" y="16" width="6" height="40" rx="2" fill="#facc15" stroke="#ca8a04" strokeWidth="1" transform="rotate(6 52 18)" />
              <rect x="60" y="22" width="6" height="34" rx="2" fill="#eab308" stroke="#ca8a04" strokeWidth="1" transform="rotate(12 60 24)" />
              <rect x="46" y="24" width="6" height="32" rx="2" fill="#fde047" stroke="#ca8a04" strokeWidth="1" transform="rotate(-2 46 24)" />
            </g>
          </svg>
        );
      }

      // 10. CRISPY PEPPERONI PIZZA SLICE ON TRAY
      if (isPizza) {
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md overflow-visible">
            {/* Wooden Board Plate */}
            <ellipse cx="50" cy="82" rx="42" ry="12" fill="#fef3c7" stroke="#d97706" strokeWidth="1.5" />
            <g
              style={{
                opacity: portionFraction,
                transform: `scale(${0.65 + portionFraction * 0.35})`,
                transformOrigin: '50px 50px',
              }}
            >
              <path d="M 50,15 L 82,75 Q 50,88 18,75 Z" fill="#facc15" stroke="#b45309" strokeWidth="2.5" />
              <path d="M 18,75 Q 50,88 82,75" stroke="#d97706" strokeWidth="9" fill="none" strokeLinecap="round" />
              {portionFraction > 0.3 && (
                <g>
                  <circle cx="50" cy="50" r="7" fill="#dc2626" stroke="#991b1b" strokeWidth="1.5" />
                  <circle cx="36" cy="65" r="6" fill="#dc2626" stroke="#991b1b" strokeWidth="1.5" />
                  <circle cx="64" cy="65" r="6.5" fill="#dc2626" stroke="#991b1b" strokeWidth="1.5" />
                </g>
              )}
            </g>
          </svg>
        );
      }

      // 11. DELUXE BURGERS ON PORCELAIN PLATE
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg overflow-visible">
          {/* Ceramic Dish Rim */}
          <ellipse cx="50" cy="80" rx="42" ry="14" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
          <ellipse cx="50" cy="78" rx="36" ry="11" fill="#ffffff" />

          <g
            style={{
              opacity: portionFraction,
              transform: `scale(${0.7 + portionFraction * 0.3})`,
              transformOrigin: '50px 58px',
            }}
          >
            {/* Bottom Brioche Bun */}
            <path d="M 22,66 C 22,76 78,76 78,66 Z" fill="#d97706" stroke="#b45309" strokeWidth="1.8" />
            {/* Crisp Curly Green Lettuce */}
            <path d="M 18,63 Q 26,58 34,64 Q 42,58 50,64 Q 58,58 66,64 Q 74,58 82,63" stroke="#22c55e" strokeWidth="5" fill="none" strokeLinecap="round" />
            {/* Juicy Beef Patty */}
            <rect x="20" y="50" width="60" height="11" rx="4" fill="#78350f" stroke="#451a03" strokeWidth="1.5" />
            {/* Melted Cheese Corner Pull */}
            <polygon points="26,51 50,55 74,51 66,61 34,61" fill="#facc15" />
            {/* Ripe Red Tomato Slices */}
            <rect x="24" y="44" width="52" height="6" rx="3" fill="#ef4444" />
            {/* Top Brioche Bun Dome */}
            <path d="M 20,42 C 20,18 80,18 80,42 Z" fill="#f59e0b" stroke="#b45309" strokeWidth="1.8" />
            {/* White Toasted Sesame Seeds on Bun */}
            <circle cx="38" cy="26" r="1.5" fill="#fef08a" />
            <circle cx="50" cy="22" r="1.5" fill="#fef08a" />
            <circle cx="62" cy="26" r="1.5" fill="#fef08a" />
            <circle cx="44" cy="32" r="1.2" fill="#fef08a" />
            <circle cx="56" cy="32" r="1.2" fill="#fef08a" />
          </g>
        </svg>
      );
    }

    // 4. DESSERTS AND SWEETS (Cakes, Cupcakes, Waffles, Donuts)
    if (food.category === 'desserts') {
      const isCupcake = food.id.includes('cupcake');
      const isDonut = food.id.includes('donut');

      if (isCupcake) {
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <ellipse cx="50" cy="85" rx="34" ry="9" fill="#e2e8f0" />
            <g style={{ opacity: portionFraction, transform: `scale(${0.6 + portionFraction * 0.4})`, transformOrigin: '50px 65px' }}>
              <polygon points="30,80 70,80 76,55 24,55" fill="#f472b6" stroke="#db2777" strokeWidth="1.5" />
              <path d="M 22,55 C 18,36 40,30 50,22 C 60,30 82,36 78,55 Z" fill="#fbcfe8" stroke="#ec4899" strokeWidth="2" />
              <circle cx="40" cy="40" r="2" fill="#38bdf8" />
              <circle cx="60" cy="42" r="2" fill="#facc15" />
              <circle cx="50" cy="48" r="2" fill="#a855f7" />
              <polygon points="50,18 52,22 56,23 53,26 54,30 50,28 46,30 47,26 44,23 48,22" fill="#facc15" />
            </g>
          </svg>
        );
      }

      if (isDonut) {
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <ellipse cx="50" cy="80" rx="36" ry="12" fill="#e2e8f0" />
            <g style={{ opacity: portionFraction, transform: `scale(${0.6 + portionFraction * 0.4})`, transformOrigin: '50px 50px' }}>
              <ellipse cx="50" cy="50" rx="36" ry="28" fill="#f59e0b" stroke="#d97706" strokeWidth="2" />
              <path d="M 20,48 C 16,30 84,30 80,48 C 76,64 68,60 60,65 C 50,60 40,66 32,60 C 24,65 20,58 20,48 Z" fill="#fb7185" />
              <ellipse cx="50" cy="50" rx="14" ry="10" fill="#fef2f2" stroke="#d97706" strokeWidth="2" />
              <line x1="32" y1="36" x2="38" y2="38" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
              <line x1="62" y1="36" x2="68" y2="38" stroke="#facc15" strokeWidth="3" strokeLinecap="round" />
            </g>
          </svg>
        );
      }

      // Strawberry Shortcake
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          <ellipse cx="50" cy="85" rx="38" ry="10" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1.5" />
          <g style={{ opacity: portionFraction, transform: `scale(${0.6 + portionFraction * 0.4})`, transformOrigin: '50px 60px' }}>
            <path d="M 24,70 L 76,70 L 68,36 L 32,36 Z" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2" />
            <rect x="28" y="52" width="44" height="6" fill="#ffffff" />
            <path d="M 32,36 C 42,32 58,32 68,36 L 70,42 L 30,42 Z" fill="#ffffff" />
            <path d="M 44,28 C 42,16 58,16 56,28 Z" fill="#e11d48" />
            <polygon points="50,16 46,14 48,18 52,14 54,18" fill="#16a34a" />
          </g>
        </svg>
      );
    }

    // 5. DRINKS & BOBA
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        <ellipse cx="50" cy="88" rx="28" ry="8" fill="#e2e8f0" />
        <path d="M 28,26 L 36,84 Q 50,88 64,84 L 72,26 Z" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" opacity="0.9" />
        <g style={{ opacity: portionFraction, transform: `scaleY(${portionFraction})`, transformOrigin: '50px 84px' }}>
          <path d="M 30,36 L 36,82 Q 50,86 64,82 L 70,36 Z" fill={food.colorTheme} opacity="0.95" />
          {food.id.includes('boba') && (
            <g>
              <circle cx="42" cy="74" r="4" fill="#3b0764" />
              <circle cx="50" cy="78" r="4.5" fill="#f43f5e" />
              <circle cx="58" cy="75" r="4" fill="#eab308" />
              <circle cx="46" cy="68" r="4" fill="#06b6d4" />
              <circle cx="54" cy="70" r="3.5" fill="#3b0764" />
            </g>
          )}
        </g>
        <line x1="56" y1="12" x2="48" y2="78" stroke="#ec4899" strokeWidth="5.5" strokeLinecap="round" />
        <line x1="56" y1="12" x2="48" y2="78" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
        <ellipse cx="50" cy="26" rx="22" ry="6" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="2" />
      </svg>
    );
  };

  return (
    <div className={`relative inline-flex items-center justify-center select-none ${sizeClasses} ${className}`}>
      {renderCategoryGraphic()}
    </div>
  );
};
