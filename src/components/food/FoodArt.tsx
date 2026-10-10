import React from 'react';
import { FoodItem } from '../../types/game';

interface Props {
  food: FoodItem;
  bitesRemaining?: number; // e.g. 5 down to 0
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  isCooking?: boolean; // Show raw / in-progress cooking state
  cookingStep?: number;
}

export const FoodArt: React.FC<Props> = ({
  food,
  bitesRemaining,
  size = 'md',
  className = '',
  isCooking = false,
  cookingStep = 0,
}) => {
  const totalBites = food.totalBites || 5;
  const currentBites = bitesRemaining !== undefined ? bitesRemaining : totalBites;
  const portionFraction = Math.max(0, Math.min(1, currentBites / totalBites));

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-28 h-28',
    lg: 'w-48 h-48 sm:w-56 sm:h-56',
  }[size];

  // Render food category graphic
  const renderCategoryGraphic = () => {
    if (portionFraction <= 0) {
      // Empty Plate or Bowl with cute clean sparkle
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
          <ellipse cx="50" cy="65" rx="42" ry="18" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="2.5" />
          <ellipse cx="50" cy="63" rx="34" ry="13" fill="#ffffff" />
          <text x="50" y="66" textAnchor="middle" fontSize="10" fill="#94a3b8" fontWeight="bold">
            ✨ Empty! ✨
          </text>
        </svg>
      );
    }

    // 1. NOODLES & PASTA
    if (food.category === 'noodles') {
      const isRedSpicy = food.id.includes('spicy') || food.id.includes('fire') || food.id.includes('chili');
      const isBrown = food.id.includes('brown') || food.id.includes('sesame');
      const noodleColor = isRedSpicy ? '#ef4444' : isBrown ? '#78350f' : '#f59e0b';
      const brothColor = isRedSpicy ? '#dc2626' : isBrown ? '#451a03' : '#fef08a';

      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          {/* Bowl Back Edge */}
          <ellipse cx="50" cy="50" rx="42" ry="18" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2" />
          {/* Broth Base */}
          <ellipse cx="50" cy="52" rx="38" ry="14" fill={brothColor} opacity="0.85" />

          {/* Wavy Noodles with clip-path based on bitesRemaining */}
          <g style={{ opacity: portionFraction, transform: `scale(${0.7 + portionFraction * 0.3})`, transformOrigin: '50px 55px' }}>
            {/* Wavy noodle strands */}
            <path d="M 22,50 Q 30,38 40,52 Q 50,60 62,48 Q 72,40 78,52" stroke={noodleColor} strokeWidth="5.5" strokeLinecap="round" fill="none" />
            <path d="M 26,55 Q 36,44 48,56 Q 60,62 72,50" stroke={noodleColor} strokeWidth="5.5" strokeLinecap="round" fill="none" />
            <path d="M 32,46 Q 44,58 56,46 Q 66,38 74,48" stroke={noodleColor} strokeWidth="4.5" strokeLinecap="round" fill="none" />

            {/* Toppings: Soft boiled egg or Green Scallions */}
            {portionFraction > 0.4 && (
              <g>
                <ellipse cx="40" cy="46" rx="9" ry="6" fill="#ffffff" />
                <ellipse cx="40" cy="46" rx="5" ry="4" fill="#f97316" />
                {/* Scallion flecks */}
                <circle cx="56" cy="44" r="2" fill="#22c55e" />
                <circle cx="62" cy="50" r="2.5" fill="#22c55e" />
                <circle cx="32" cy="54" r="2" fill="#22c55e" />
              </g>
            )}

            {/* Spicy chili flakes if spicy */}
            {isRedSpicy && (
              <g>
                <circle cx="48" cy="48" r="1.5" fill="#7f1d1d" />
                <circle cx="54" cy="54" r="1.5" fill="#7f1d1d" />
              </g>
            )}
          </g>

          {/* Ceramic Bowl Front */}
          <path d="M 8,50 C 8,78 28,88 50,88 C 72,88 92,78 92,50 C 92,56 72,66 50,66 C 28,66 8,56 8,50 Z" fill="#ec4899" />
          <path d="M 8,50 C 8,78 28,88 50,88 C 72,88 92,78 92,50" fill="none" stroke="#db2777" strokeWidth="2.5" />
          {/* Bowl cute rainbow pattern */}
          <ellipse cx="50" cy="72" rx="14" ry="4" fill="#fbcfe8" opacity="0.8" />

          {/* Steaming hot vapors if warm */}
          {portionFraction > 0.2 && (
            <g className="animate-steam">
              <path d="M 36,36 Q 40,24 38,16" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.7" />
              <path d="M 52,34 Q 48,22 52,14" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.7" />
              <path d="M 64,36 Q 68,26 66,18" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.7" />
            </g>
          )}

          {/* Chopsticks resting on rim */}
          <line x1="16" y1="36" x2="84" y2="44" stroke="#d97706" strokeWidth="3" strokeLinecap="round" />
          <line x1="18" y1="40" x2="86" y2="48" stroke="#b45309" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    }

    // 2. ASMR SNACKS (Chips, Crackers, Popcorn, Jelly, etc.)
    if (food.category === 'snacks') {
      const isJelly = food.id.includes('jelly') || food.id.includes('marshmallow');
      if (isJelly) {
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Cute Glass Plate */}
            <ellipse cx="50" cy="75" rx="42" ry="14" fill="#e0f2fe" stroke="#38bdf8" strokeWidth="2" opacity="0.8" />
            {/* Bouncy Jelly Mold */}
            <g style={{ opacity: portionFraction, transform: `scale(${0.5 + portionFraction * 0.5})`, transformOrigin: '50px 65px' }}>
              <path d="M 28,68 C 24,40 38,32 50,32 C 62,32 76,40 72,68 C 60,74 40,74 28,68 Z" fill={food.colorTheme} />
              {/* Jelly Shimmer highlight */}
              <path d="M 36,44 Q 44,38 52,40" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.8" />
              <circle cx="48" cy="50" r="3" fill="#ffffff" opacity="0.7" />
              {/* Cherry on top */}
              <circle cx="50" cy="30" r="6" fill="#be123c" />
              <path d="M 50,26 Q 56,16 62,18" stroke="#059669" strokeWidth="2" fill="none" strokeLinecap="round" />
            </g>
          </svg>
        );
      }

      // Crispy Snack Bowl / Chips
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          {/* Bowl Back */}
          <ellipse cx="50" cy="56" rx="40" ry="16" fill="#e2e8f0" />
          {/* Stack of Crisps / Popcorn with portionFraction */}
          <g style={{ opacity: portionFraction, transform: `scale(${0.6 + portionFraction * 0.4})`, transformOrigin: '50px 55px' }}>
            {portionFraction > 0.7 && (
              <ellipse cx="50" cy="40" rx="14" ry="8" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" transform="rotate(-15 50 40)" />
            )}
            {portionFraction > 0.5 && (
              <ellipse cx="36" cy="46" rx="13" ry="8" fill="#f59e0b" stroke="#b45309" strokeWidth="1.5" transform="rotate(20 36 46)" />
            )}
            {portionFraction > 0.3 && (
              <ellipse cx="64" cy="46" rx="13" ry="8" fill="#fbbf24" stroke="#ca8a04" strokeWidth="1.5" transform="rotate(-10 64 46)" />
            )}
            <ellipse cx="48" cy="52" rx="15" ry="9" fill="#f59e0b" stroke="#b45309" strokeWidth="1.5" />
          </g>
          {/* Pastel Snack Bowl Front */}
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
            <ellipse cx="50" cy="75" rx="38" ry="12" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="2" />
            <g style={{ opacity: portionFraction, transform: `scale(${0.6 + portionFraction * 0.4})`, transformOrigin: '50px 55px' }}>
              {/* Bone end */}
              <ellipse cx="26" cy="40" rx="4" ry="7" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" transform="rotate(-30 26 40)" />
              <rect x="26" y="38" width="16" height="7" rx="3" fill="#f8fafc" transform="rotate(25 26 38)" />
              {/* Drumstick crispy crust */}
              <path d="M 38,48 C 38,32 58,26 72,40 C 82,52 78,74 58,74 C 44,74 38,62 38,48 Z" fill="#c2410c" stroke="#9a3412" strokeWidth="2" />
              {/* Crunchy crispy bumps */}
              <circle cx="56" cy="44" r="3" fill="#f97316" />
              <circle cx="68" cy="52" r="3.5" fill="#f97316" />
              <circle cx="50" cy="60" r="3" fill="#f97316" />
              <circle cx="62" cy="64" r="2.5" fill="#ea580c" />
            </g>
          </svg>
        );
      }

      if (isFries) {
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* French Fry Box */}
            <path d="M 28,45 L 24,88 L 76,88 L 72,45 Q 50,55 28,45 Z" fill="#ef4444" />
            <path d="M 50,62 Q 50,75 50,75" stroke="#fbbf24" strokeWidth="6" strokeLinecap="round" />
            {/* Golden Fries sticking out */}
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
              {/* Pizza Slice Crust & Cheese */}
              <path d="M 50,15 L 82,75 Q 50,88 18,75 Z" fill="#facc15" stroke="#b45309" strokeWidth="2.5" />
              {/* Crust back */}
              <path d="M 18,75 Q 50,88 82,75" stroke="#d97706" strokeWidth="9" fill="none" strokeLinecap="round" />
              {/* Pepperoni Slices */}
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
            {/* Bottom Bun */}
            <path d="M 22,68 C 22,78 78,78 78,68 Z" fill="#d97706" stroke="#b45309" strokeWidth="2" />
            {/* Lettuce */}
            <path d="M 18,65 Q 26,60 34,66 Q 42,60 50,66 Q 58,60 66,66 Q 74,60 82,65" stroke="#22c55e" strokeWidth="5" fill="none" strokeLinecap="round" />
            {/* Beef Patty */}
            <rect x="20" y="52" width="60" height="11" rx="4" fill="#78350f" stroke="#451a03" strokeWidth="1.5" />
            {/* Melted Cheese */}
            <polygon points="26,53 50,56 74,53 66,61 34,61" fill="#facc15" />
            {/* Tomato Slice */}
            <rect x="24" y="46" width="52" height="6" rx="3" fill="#ef4444" />
            {/* Top Bun */}
            <path d="M 20,44 C 20,20 80,20 80,44 Z" fill="#f59e0b" stroke="#b45309" strokeWidth="2" />
            {/* Sesame Seeds */}
            <circle cx="38" cy="28" r="1.5" fill="#ffffff" />
            <circle cx="50" cy="24" r="1.5" fill="#ffffff" />
            <circle cx="62" cy="28" r="1.5" fill="#ffffff" />
            <circle cx="44" cy="34" r="1.5" fill="#ffffff" />
            <circle cx="56" cy="34" r="1.5" fill="#ffffff" />
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
              {/* Cupcake Paper Wrapper */}
              <polygon points="30,80 70,80 76,55 24,55" fill="#f472b6" stroke="#db2777" strokeWidth="1.5" />
              {/* Swirl Frosting */}
              <path d="M 22,55 C 18,36 40,30 50,22 C 60,30 82,36 78,55 Z" fill="#fbcfe8" stroke="#ec4899" strokeWidth="2" />
              {/* Sprinkles & Star */}
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
              {/* Donut Base */}
              <ellipse cx="50" cy="50" rx="36" ry="28" fill="#f59e0b" stroke="#d97706" strokeWidth="2" />
              {/* Pink Glaze */}
              <path d="M 20,48 C 16,30 84,30 80,48 C 76,64 68,60 60,65 C 50,60 40,66 32,60 C 24,65 20,58 20,48 Z" fill="#fb7185" />
              {/* Donut Hole */}
              <ellipse cx="50" cy="50" rx="14" ry="10" fill="#fef2f2" stroke="#d97706" strokeWidth="2" />
              {/* Sprinkles */}
              <line x1="32" y1="36" x2="38" y2="38" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
              <line x1="62" y1="36" x2="68" y2="38" stroke="#facc15" strokeWidth="3" strokeLinecap="round" />
              <line x1="50" y1="32" x2="52" y2="37" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
            </g>
          </svg>
        );
      }

      // Strawberry Shortcake Slice
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          <ellipse cx="50" cy="85" rx="38" ry="10" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1.5" />
          <g style={{ opacity: portionFraction, transform: `scale(${0.6 + portionFraction * 0.4})`, transformOrigin: '50px 60px' }}>
            {/* Cake Wedge Base */}
            <path d="M 24,70 L 76,70 L 68,36 L 32,36 Z" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2" />
            {/* Cream Middle Layer */}
            <rect x="28" y="52" width="44" height="6" fill="#ffffff" />
            {/* Strawberry Cream Top */}
            <path d="M 32,36 C 42,32 58,32 68,36 L 70,42 L 30,42 Z" fill="#ffffff" />
            {/* Ruby Strawberry on Top */}
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
        {/* Glass Cup Outer */}
        <path d="M 28,26 L 36,84 Q 50,88 64,84 L 72,26 Z" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" opacity="0.9" />
        {/* Liquid level based on bites (sips) remaining */}
        <g style={{ opacity: portionFraction, transform: `scaleY(${portionFraction})`, transformOrigin: '50px 84px' }}>
          <path d="M 30,36 L 36,82 Q 50,86 64,82 L 70,36 Z" fill={food.colorTheme} opacity="0.95" />
          {/* Boba Pearls if Boba */}
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
        {/* Straw */}
        <line x1="56" y1="12" x2="48" y2="78" stroke="#ec4899" strokeWidth="5.5" strokeLinecap="round" />
        <line x1="56" y1="12" x2="48" y2="78" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
        {/* Cup Rim */}
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
