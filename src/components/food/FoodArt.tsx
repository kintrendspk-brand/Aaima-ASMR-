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

    // 3. FAST FOOD (Burgers, Fries, Chicken, Pizza)
    if (food.category === 'fastfood') {
      const isChicken = food.id.includes('chicken');
      const isFries = food.id.includes('fries');
      const isPizza = food.id.includes('pizza');

      if (isChicken) {
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <ellipse cx="50" cy="76" rx="38" ry="12" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="2" />
            <g style={{ opacity: portionFraction, transform: `scale(${0.6 + portionFraction * 0.4})`, transformOrigin: '50px 55px' }}>
              <ellipse cx="26" cy="40" rx="4" ry="7" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" transform="rotate(-30 26 40)" />
              <rect x="26" y="38" width="16" height="7" rx="3" fill="#f8fafc" transform="rotate(25 26 38)" />
              <path d="M 38,48 C 38,32 58,26 72,40 C 82,52 78,74 58,74 C 44,74 38,62 38,48 Z" fill="#c2410c" stroke="#9a3412" strokeWidth="2" />
              <circle cx="56" cy="44" r="3" fill="#f97316" />
              <circle cx="68" cy="52" r="3.5" fill="#f97316" />
              <circle cx="50" cy="60" r="3" fill="#f97316" />
            </g>
          </svg>
        );
      }

      if (isFries) {
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <path d="M 28,45 L 24,88 L 76,88 L 72,45 Q 50,55 28,45 Z" fill="#ef4444" />
            <path d="M 50,62 Q 50,75 50,75" stroke="#fbbf24" strokeWidth="6" strokeLinecap="round" />
            <g style={{ opacity: portionFraction, transform: `scaleY(${portionFraction})`, transformOrigin: '50px 88px' }}>
              <rect x="34" y="20" width="6" height="35" rx="2" fill="#facc15" stroke="#ca8a04" strokeWidth="1" transform="rotate(-8 34 20)" />
              <rect x="42" y="16" width="6" height="40" rx="2" fill="#fde047" stroke="#ca8a04" strokeWidth="1" />
              <rect x="52" y="18" width="6" height="38" rx="2" fill="#facc15" stroke="#ca8a04" strokeWidth="1" transform="rotate(6 52 18)" />
              <rect x="60" y="24" width="6" height="32" rx="2" fill="#eab308" stroke="#ca8a04" strokeWidth="1" transform="rotate(12 60 24)" />
            </g>
          </svg>
        );
      }

      if (isPizza) {
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <g style={{ opacity: portionFraction, transform: `scale(${0.6 + portionFraction * 0.4})`, transformOrigin: '50px 50px' }}>
              <path d="M 50,15 L 82,75 Q 50,88 18,75 Z" fill="#facc15" stroke="#b45309" strokeWidth="2.5" />
              <path d="M 18,75 Q 50,88 82,75" stroke="#d97706" strokeWidth="9" fill="none" strokeLinecap="round" />
              {portionFraction > 0.4 && (
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

      // Deluxe Burger
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          <ellipse cx="50" cy="85" rx="38" ry="10" fill="#e2e8f0" />
          <g style={{ opacity: portionFraction, transform: `scale(${0.7 + portionFraction * 0.3})`, transformOrigin: '50px 60px' }}>
            <path d="M 22,68 C 22,78 78,78 78,68 Z" fill="#d97706" stroke="#b45309" strokeWidth="2" />
            <path d="M 18,65 Q 26,60 34,66 Q 42,60 50,66 Q 58,60 66,66 Q 74,60 82,65" stroke="#22c55e" strokeWidth="5" fill="none" strokeLinecap="round" />
            <rect x="20" y="52" width="60" height="11" rx="4" fill="#78350f" stroke="#451a03" strokeWidth="1.5" />
            <polygon points="26,53 50,56 74,53 66,61 34,61" fill="#facc15" />
            <rect x="24" y="46" width="52" height="6" rx="3" fill="#ef4444" />
            <path d="M 20,44 C 20,20 80,20 80,44 Z" fill="#f59e0b" stroke="#b45309" strokeWidth="2" />
            <circle cx="38" cy="28" r="1.5" fill="#ffffff" />
            <circle cx="50" cy="24" r="1.5" fill="#ffffff" />
            <circle cx="62" cy="28" r="1.5" fill="#ffffff" />
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
