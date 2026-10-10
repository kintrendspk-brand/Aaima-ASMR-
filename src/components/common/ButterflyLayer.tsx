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
  { id: 1, initialX: 10, initialY: 18, color1: '#f472b6', color2: '#fb7185', size: 36, speed: 14, delay: 0 },
  { id: 2, initialX: 75, initialY: 28, color1: '#38bdf8', color2: '#818cf8', size: 32, speed: 18, delay: 2 },
  { id: 3, initialX: 40, initialY: 60, color1: '#fbbf24', color2: '#f472b6', size: 28, speed: 16, delay: 4 },
  { id: 4, initialX: 85, initialY: 72, color1: '#c084fc', color2: '#ec4899', size: 30, speed: 20, delay: 1 },
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
    setSparkles((prev) => [...prev.slice(-8), newSparkle]);
    setTimeout(() => {
      setSparkles((prev) => prev.filter((s) => s.id !== newSparkle.id));
    }, 900);
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
              animation: 'wingFlap 0.35s ease-in-out infinite alternate',
            }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm filter">
              {/* Left Top Wing */}
              <path
                d="M 50,50 C 35,10 10,15 15,45 C 20,60 45,55 50,50 Z"
                fill={bf.color1}
                stroke="#ffffff"
                strokeWidth="2"
              />
              {/* Left Bottom Wing */}
              <path
                d="M 50,50 C 30,55 20,80 35,88 C 45,90 48,65 50,50 Z"
                fill={bf.color2}
                stroke="#ffffff"
                strokeWidth="2"
              />
              {/* Right Top Wing */}
              <path
                d="M 50,50 C 65,10 90,15 85,45 C 80,60 55,55 50,50 Z"
                fill={bf.color1}
                stroke="#ffffff"
                strokeWidth="2"
              />
              {/* Right Bottom Wing */}
              <path
                d="M 50,50 C 70,55 80,80 65,88 C 55,90 52,65 50,50 Z"
                fill={bf.color2}
                stroke="#ffffff"
                strokeWidth="2"
              />
              {/* Wing Inner Dots */}
              <circle cx="32" cy="35" r="4" fill="#ffffff" opacity="0.9" />
              <circle cx="68" cy="35" r="4" fill="#ffffff" opacity="0.9" />
              <circle cx="38" cy="72" r="3" fill="#ffffff" opacity="0.8" />
              <circle cx="62" cy="72" r="3" fill="#ffffff" opacity="0.8" />
              {/* Butterfly Body & Antennae */}
              <ellipse cx="50" cy="50" rx="3.5" ry="16" fill="#475569" />
              <path d="M 49,36 Q 44,22 38,20" stroke="#475569" strokeWidth="2" fill="none" strokeLinecap="round" />
              <path d="M 51,36 Q 56,22 62,20" stroke="#475569" strokeWidth="2" fill="none" strokeLinecap="round" />
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
