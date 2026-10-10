import React from 'react';

interface Props {
  wallpaperId?: string;
  children?: React.ReactNode;
}

export const RainbowBackground: React.FC<Props> = ({ wallpaperId = 'wall_rainbow_dream', children }) => {
  const getGradient = () => {
    switch (wallpaperId) {
      case 'wall_strawberry_bakery':
        return 'from-rose-100 via-pink-100 to-amber-50';
      case 'wall_starlight_galaxy':
        return 'from-purple-200 via-indigo-100 to-pink-100';
      case 'wall_rainbow_dream':
      default:
        return 'from-sky-100 via-pink-100 to-purple-100';
    }
  };

  return (
    <div className={`relative w-full h-full min-h-screen overflow-hidden bg-gradient-to-b ${getGradient()} select-none`}>
      {/* 1. Luminous Realistic Rainbow Arch */}
      <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 w-[150%] max-w-[760px] aspect-[2.2/1] opacity-85">
        <svg viewBox="0 0 600 300" className="w-full h-full overflow-visible">
          <defs>
            <filter id="rainbowBloom" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="rainbowSkyShimmer" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.75" />
              <stop offset="18%" stopColor="#fb923c" stopOpacity="0.75" />
              <stop offset="36%" stopColor="#facc15" stopOpacity="0.75" />
              <stop offset="54%" stopColor="#22c55e" stopOpacity="0.75" />
              <stop offset="72%" stopColor="#38bdf8" stopOpacity="0.75" />
              <stop offset="90%" stopColor="#a855f7" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#ec4899" stopOpacity="0.75" />
            </linearGradient>
          </defs>

          {/* Smooth multi-band rainbow arc with bloom filter */}
          <g filter="url(#rainbowBloom)">
            <path d="M 40,300 A 260,260 0 0,1 560,300" fill="none" stroke="#f43f5e" strokeWidth="11" strokeOpacity="0.7" />
            <path d="M 51,300 A 249,249 0 0,1 549,300" fill="none" stroke="#fb923c" strokeWidth="11" strokeOpacity="0.7" />
            <path d="M 62,300 A 238,238 0 0,1 538,300" fill="none" stroke="#facc15" strokeWidth="11" strokeOpacity="0.7" />
            <path d="M 73,300 A 227,227 0 0,1 527,300" fill="none" stroke="#4ade80" strokeWidth="11" strokeOpacity="0.7" />
            <path d="M 84,300 A 216,216 0 0,1 516,300" fill="none" stroke="#38bdf8" strokeWidth="11" strokeOpacity="0.7" />
            <path d="M 95,300 A 205,205 0 0,1 505,300" fill="none" stroke="#a855f7" strokeWidth="11" strokeOpacity="0.7" />
            <path d="M 106,300 A 194,194 0 0,1 494,300" fill="none" stroke="#f472b6" strokeWidth="11" strokeOpacity="0.7" />
          </g>

          {/* Golden Sun Light Aura behind arch */}
          <circle cx="300" cy="180" r="140" fill="#fef08a" opacity="0.18" filter="url(#rainbowBloom)" />
        </svg>
      </div>

      {/* 2. Layered Fluffy Pastel Clouds */}
      <div className="pointer-events-none absolute top-12 -left-16 w-52 h-24 bg-white/80 rounded-full blur-xs shadow-sm animate-float opacity-85" />
      <div className="pointer-events-none absolute top-32 -right-12 w-60 h-28 bg-white/85 rounded-full blur-xs shadow-sm animate-float [animation-delay:2s] opacity-85" />
      <div className="pointer-events-none absolute top-6 left-1/3 w-40 h-16 bg-pink-100/70 rounded-full blur-sm animate-float [animation-delay:1s]" />

      {/* 3. Drifting Sakura / Flower Petals */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[
          { left: '10%', delay: '0s', duration: '9s', size: 14, color: '#fbcfe8' },
          { left: '25%', delay: '2.5s', duration: '11s', size: 16, color: '#f472b6' },
          { left: '55%', delay: '1s', duration: '10s', size: 12, color: '#ffe4e6' },
          { left: '75%', delay: '4s', duration: '8.5s', size: 15, color: '#fbcfe8' },
          { left: '90%', delay: '3s', duration: '12s', size: 13, color: '#fda4af' },
        ].map((petal, idx) => (
          <div
            key={idx}
            className="absolute"
            style={{
              left: petal.left,
              top: '-20px',
              animation: `fallingPetal ${petal.duration} linear infinite`,
              animationDelay: petal.delay,
            }}
          >
            <svg width={petal.size} height={petal.size} viewBox="0 0 30 30">
              <path
                d="M15,0 C22,6 26,14 22,22 C18,28 10,28 6,22 C2,14 8,6 15,0 Z"
                fill={petal.color}
                opacity="0.75"
              />
            </svg>
          </div>
        ))}
      </div>

      {/* 4. Twinkling Magical Sparkles & Tiny Stars */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[
          { top: '10%', left: '16%', size: '18px', color: '#facc15', delay: '0s' },
          { top: '22%', left: '84%', size: '22px', color: '#ec4899', delay: '0.8s' },
          { top: '44%', left: '6%', size: '16px', color: '#38bdf8', delay: '1.4s' },
          { top: '62%', left: '92%', size: '20px', color: '#a855f7', delay: '0.5s' },
          { top: '78%', left: '14%', size: '15px', color: '#f59e0b', delay: '2s' },
          { top: '32%', left: '94%', size: '17px', color: '#4ade80', delay: '1.2s' },
        ].map((sparkle, idx) => (
          <div
            key={idx}
            className="absolute animate-pulse"
            style={{
              top: sparkle.top,
              left: sparkle.left,
              width: sparkle.size,
              height: sparkle.size,
              animationDelay: sparkle.delay,
              animationDuration: '2.4s',
            }}
          >
            <svg viewBox="0 0 24 24" fill={sparkle.color} className="w-full h-full drop-shadow-xs">
              <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
            </svg>
          </div>
        ))}
      </div>

      {/* Content wrapper */}
      <div className="relative z-10 w-full h-full flex flex-col">{children}</div>
    </div>
  );
};
