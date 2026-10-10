import React, { useState, useEffect } from 'react';
import { CuteGirl } from '../character/CuteGirl';
import { GirlCharacter } from '../../types/game';
import { soundEngine } from '../../services/soundEngine';
import { ButterflyLayer } from '../common/ButterflyLayer';
import { Sparkles, Play, Music, VolumeX } from 'lucide-react';

interface Props {
  character: GirlCharacter;
  onStartGame: () => void;
  musicEnabled: boolean;
  onToggleMusic: () => void;
}

export const OpeningSequence: React.FC<Props> = ({
  character,
  onStartGame,
  musicEnabled,
  onToggleMusic,
}) => {
  const [stage, setStage] = useState<number>(1);

  // Progressive intro animation steps
  useEffect(() => {
    const t1 = setTimeout(() => setStage(2), 700);  // Rainbow expands
    const t2 = setTimeout(() => setStage(3), 1600); // Title & sparkles appear
    const t3 = setTimeout(() => setStage(4), 2500); // Girl waves and Play button appears
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const handlePlayClick = () => {
    soundEngine.playClick();
    soundEngine.playGirlGiggle();
    if (musicEnabled) {
      soundEngine.startMusic();
    }
    onStartGame();
  };

  return (
    <div className="relative w-full h-full min-h-screen flex flex-col items-center justify-between p-6 select-none overflow-hidden bg-gradient-to-b from-pink-200 via-purple-100 to-sky-100">
      <ButterflyLayer />

      {/* Top Controls: Skip Intro & Music */}
      <div className="w-full flex justify-between items-center z-30 pt-2">
        <button
          onClick={onToggleMusic}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white/80 hover:bg-white text-purple-700 text-xs font-semibold rounded-full shadow-xs backdrop-blur-xs transition-all active:scale-95"
        >
          {musicEnabled ? <Music className="w-4 h-4 text-pink-500" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          <span>{musicEnabled ? 'Music On' : 'Muted'}</span>
        </button>

        <button
          onClick={handlePlayClick}
          className="px-4 py-1.5 bg-white/80 hover:bg-white text-pink-600 text-xs font-bold rounded-full shadow-xs backdrop-blur-xs transition-all active:scale-95"
        >
          Skip Intro ➔
        </button>
      </div>

      {/* Middle Animated Centerpiece */}
      <div className="flex-1 flex flex-col items-center justify-center text-center z-20 my-auto w-full max-w-sm">
        {/* Animated Rainbow Arch */}
        <div
          className={`w-full max-w-[280px] transition-all duration-1000 ${
            stage >= 2 ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-75 -translate-y-4'
          }`}
        >
          <svg viewBox="0 0 240 100" className="w-full h-auto overflow-visible">
            <path d="M 20,95 A 100,75 0 0,1 220,95" fill="none" stroke="#f43f5e" strokeWidth="8" strokeOpacity="0.8" />
            <path d="M 28,95 A 92,69 0 0,1 212,95" fill="none" stroke="#fb923c" strokeWidth="8" strokeOpacity="0.8" />
            <path d="M 36,95 A 84,63 0 0,1 204,95" fill="none" stroke="#facc15" strokeWidth="8" strokeOpacity="0.8" />
            <path d="M 44,95 A 76,57 0 0,1 196,95" fill="none" stroke="#4ade80" strokeWidth="8" strokeOpacity="0.8" />
            <path d="M 52,95 A 68,51 0 0,1 188,95" fill="none" stroke="#38bdf8" strokeWidth="8" strokeOpacity="0.8" />
            <path d="M 60,95 A 60,45 0 0,1 180,95" fill="none" stroke="#c084fc" strokeWidth="8" strokeOpacity="0.8" />
          </svg>
        </div>

        {/* Title Presentation */}
        <div
          className={`mt-2 transition-all duration-700 ${
            stage >= 3 ? 'opacity-100 scale-100' : 'opacity-0 scale-90 translate-y-4'
          }`}
        >
          <div className="inline-flex items-center gap-1 text-xs font-bold text-pink-600 bg-pink-100/90 px-3 py-1 rounded-full border border-pink-300 shadow-xs mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
            <span>Magical Rainbow Kitchen</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight rainbow-text drop-shadow-sm font-['Fredoka']">
            Aaima ASMR
          </h1>
          <h2 className="text-xl sm:text-2xl font-bold text-purple-700 tracking-wide font-['Fredoka'] -mt-1">
            Eating Store
          </h2>
          <p className="text-xs text-purple-600/80 font-medium mt-1">
            Cook Delicious Dishes • Slurp & Crunch ASMR
          </p>
        </div>

        {/* Cute Hostess Girl Waving */}
        <div
          className={`mt-4 transition-all duration-700 ${
            stage >= 4 ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-80 translate-y-6'
          }`}
        >
          <div className="relative">
            <CuteGirl
              character={character}
              expression="waving"
              size="lg"
              className="hover:scale-105 transition-transform"
            />
            {/* Friendly Greeting Speech Bubble */}
            <div className="absolute -top-3 -right-2 bg-white text-pink-600 text-xs font-bold px-3 py-1.5 rounded-2xl rounded-bl-none shadow-md border border-pink-200 animate-float">
              Welcome, friend! 💕
            </div>
          </div>
        </div>
      </div>

      {/* Big Beautiful Play Button */}
      <div
        className={`w-full max-w-xs z-30 pb-4 transition-all duration-500 ${
          stage >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <button
          onClick={handlePlayClick}
          className="w-full py-4 px-6 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-lg rounded-3xl shadow-lg hover:shadow-pink-300/50 flex items-center justify-center gap-3 transition-transform active:scale-95 border-2 border-white/50"
        >
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
            <Play className="w-5 h-5 fill-white ml-0.5 text-white" />
          </div>
          <span>Start Playing!</span>
          <Sparkles className="w-5 h-5 text-amber-300 fill-amber-300 animate-spin [animation-duration:6s]" />
        </button>

        <p className="text-center text-[11px] text-purple-700/70 font-semibold mt-2.5">
          100% Free • Relaxing Audio • Offline Playable
        </p>
      </div>
    </div>
  );
};
