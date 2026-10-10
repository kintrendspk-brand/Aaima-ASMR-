import React from 'react';

interface Props {
  wallpaperId?: string;
  children?: React.ReactNode;
}

export const RainbowBackground: React.FC<Props> = ({ wallpaperId = 'wall_rainbow_dream', children }) => {
  const getGradient = () => {
    switch (wallpaperId) {
      case 'wall_strawberry_bakery':
        return 'from-pink-100 via-rose-100 to-amber-50';
      case 'wall_starlight_galaxy':
        return 'from-purple-200 via-indigo-100 to-pink-100';
      case 'wall_rainbow_dream':
      default:
        return 'from-pink-100 via-purple-100 to-sky-100';
    }
  };

  return (
    <div className={`relative w-full h-full min-h-screen overflow-hidden bg-gradient-to-b ${getGradient()} select-none`}>
      {/* Decorative Rainbow Arch */}
      <div className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 w-[140%] max-w-[700px] aspect-[2/1] opacity-75">
        <svg viewBox="0 0 500 250" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="rainbowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f472b6" stopOpacity="0.75" />
              <stop offset="20%" stopColor="#fb923c" stopOpacity="0.75" />
              <stop offset="40%" stopColor="#facc15" stopOpacity="0.75" />
              <stop offset="60%" stopColor="#4ade80" stopOpacity="0.75" />
              <stop offset="80%" stopColor="#38bdf8" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#c084fc" stopOpacity="0.75" />
            </linearGradient>
            <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {/* Concentric Rainbow bands */}
          <path d="M 30,250 A 220,220 0 0,1 470,250" fill="none" stroke="#f43f5e" strokeWidth="12" strokeOpacity="0.65" />
          <path d="M 42,250 A 208,208 0 0,1 458,250" fill="none" stroke="#fb923c" strokeWidth="12" strokeOpacity="0.65" />
          <path d="M 54,250 A 196,196 0 0,1 446,250" fill="none" stroke="#facc15" strokeWidth="12" strokeOpacity="0.65" />
          <path d="M 66,250 A 184,184 0 0,1 434,250" fill="none" stroke="#4ade80" strokeWidth="12" strokeOpacity="0.65" />
          <path d="M 78,250 A 172,172 0 0,1 422,250" fill="none" stroke="#38bdf8" strokeWidth="12" strokeOpacity="0.65" />
          <path d="M 90,250 A 160,160 0 0,1 410,250" fill="none" stroke="#a855f7" strokeWidth="12" strokeOpacity="0.65" />
        </svg>
      </div>

      {/* Floating Dreamy Pastel Clouds */}
      <div className="pointer-events-none absolute top-10 -left-12 w-48 h-20 bg-white/70 rounded-full blur-xs shadow-sm animate-float opacity-80" />
      <div className="pointer-events-none absolute top-28 -right-8 w-56 h-22 bg-white/75 rounded-full blur-xs shadow-sm animate-float [animation-delay:1.5s] opacity-80" />
      <div className="pointer-events-none absolute top-4 left-1/3 w-36 h-16 bg-pink-100/60 rounded-full blur-sm animate-float [animation-delay:0.8s]" />

      {/* Twinkling Tiny Stars and Sparkles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[
          { top: '12%', left: '15%', size: '18px', color: '#facc15', delay: '0s' },
          { top: '22%', left: '82%', size: '22px', color: '#ec4899', delay: '0.7s' },
          { top: '45%', left: '8%', size: '16px', color: '#38bdf8', delay: '1.2s' },
          { top: '65%', left: '90%', size: '20px', color: '#a855f7', delay: '0.4s' },
          { top: '78%', left: '18%', size: '15px', color: '#f59e0b', delay: '1.8s' },
          { top: '35%', left: '92%', size: '18px', color: '#4ade80', delay: '1.5s' },
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
              animationDuration: '2.5s',
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
