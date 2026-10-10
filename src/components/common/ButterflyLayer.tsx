import React, { useState } from 'react';
import { soundEngine } from '../../services/soundEngine';

interface ButterflyData {
  id: number;
  initialX: number;
  initialY: number;
  color1: string;
  color2: string;
  size: number;
  speed: number;
  delay: number;
}

const DEFAULT_BUTTERFLIES: ButterflyData[] = [
  { id: 1, initialX: 8, initialY: 16, color1: '#f472b6', color2: '#fb7185', size: 38, speed: 13, delay: 0 },
  { id: 2, initialX: 78, initialY: 26, color1: '#38bdf8', color2: '#818cf8', size: 34, speed: 17, delay: 2 },
  { id: 3, initialX: 38, initialY: 58, color1: '#fbbf24', color2: '#f472b6', size: 30, speed: 15, delay: 4 },
  { id: 4, initialX: 82, initialY: 68, color1: '#c084fc', color2: '#ec4899', size: 32, speed: 19, delay: 1 },
  { id: 5, initialX: 18, initialY: 80, color1: '#4ade80', color2: '#2dd4bf', size: 28, speed: 16, delay: 3 },
];

export const ButterflyLayer: React.FC = () => {
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number }[]>([]);

  const handleButterflyClick = (e: React.MouseEvent) => {
    soundEngine.playClick();
    const rect = e.currentTarget.getBoundingClientRect();
    const newSparkle = {
      id: Date.now(),
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
    setSparkles((prev) => [...prev.slice(-6), newSparkle]);
    setTimeout(() => {
      setSparkles((prev) => prev.filter((s) => s.id !== newSparkle.id));
    }, 850);
  };

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-20">
      {DEFAULT_BUTTERFLIES.map((bf) => (
        <div
          key={bf.id}
          className="pointer-events-auto absolute cursor-pointer transition-transform hover:scale-125"
          style={{
            left: `${bf.initialX}%`,
            top: `${bf.initialY}%`,
            animation: `butterflyFly ${bf.speed}s ease-in-out infinite alternate`,
            animationDelay: `${bf.delay}s`,
          }}
          onClick={handleButterflyClick}
          title="Cute Butterfly! Tap me!"
        >
          <div
            style={{
              width: `${bf.size}px`,
              height: `${bf.size}px`,
              animation: 'wingFlap 0.32s ease-in-out infinite alternate',
            }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
              <defs>
                <linearGradient id={`bfGrad_${bf.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
                  <stop offset="40%" stopColor={bf.color1} />
                  <stop offset="100%" stopColor={bf.color2} />
                </linearGradient>
              </defs>

              {/* Upper Left Wing */}
              <path
                d="M 50,50 C 32,8 6,14 12,46 C 18,62 44,56 50,50 Z"
                fill={`url(#bfGrad_${bf.id})`}
                stroke="#ffffff"
                strokeWidth="1.5"
              />
              {/* Lower Left Wing */}
              <path
                d="M 50,50 C 28,56 16,82 34,90 C 46,92 48,66 50,50 Z"
                fill={bf.color2}
                stroke="#ffffff"
                strokeWidth="1.5"
              />
              {/* Upper Right Wing */}
              <path
                d="M 50,50 C 68,8 94,14 88,46 C 82,62 56,56 50,50 Z"
                fill={`url(#bfGrad_${bf.id})`}
                stroke="#ffffff"
                strokeWidth="1.5"
              />
              {/* Lower Right Wing */}
              <path
                d="M 50,50 C 72,56 84,82 66,90 C 54,92 52,66 50,50 Z"
                fill={bf.color2}
                stroke="#ffffff"
                strokeWidth="1.5"
              />

              {/* Delicate Wing Patterns / Veins */}
              <path d="M 50,50 Q 30,30 20,40" stroke="#ffffff" strokeWidth="1" fill="none" opacity="0.8" />
              <path d="M 50,50 Q 70,30 80,40" stroke="#ffffff" strokeWidth="1" fill="none" opacity="0.8" />
              <circle cx="30" cy="35" r="3.5" fill="#ffffff" opacity="0.9" />
              <circle cx="70" cy="35" r="3.5" fill="#ffffff" opacity="0.9" />
              <circle cx="36" cy="72" r="2.5" fill="#ffffff" opacity="0.8" />
              <circle cx="64" cy="72" r="2.5" fill="#ffffff" opacity="0.8" />

              {/* Slender Body & Antennae */}
              <ellipse cx="50" cy="50" rx="3" ry="17" fill="#334155" />
              <path d="M 49,35 Q 42,20 36,18" stroke="#334155" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              <path d="M 51,35 Q 58,20 64,18" stroke="#334155" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      ))}

      {/* Touch Sparkles */}
      {sparkles.map((sp) => (
        <div
          key={sp.id}
          className="pointer-events-none fixed -translate-x-1/2 -translate-y-1/2 animate-ping"
          style={{ left: sp.x, top: sp.y }}
        >
          <span className="text-2xl drop-shadow-md">✨</span>
        </div>
      ))}
    </div>
  );
};
