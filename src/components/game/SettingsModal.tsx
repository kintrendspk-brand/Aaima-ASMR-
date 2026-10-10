import React, { useState } from 'react';
import { GameSettings } from '../../types/game';
import { soundEngine } from '../../services/soundEngine';
import {
  ArrowLeft,
  Volume2,
  VolumeX,
  Music,
  Flame,
  Sparkles,
  RotateCcw,
  Globe,
  Gauge,
  Smartphone,
} from 'lucide-react';

interface Props {
  settings: GameSettings;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
  onResetProgress: () => void;
  onOpenApkGuide: () => void;
  onBack: () => void;
}

export const SettingsModal: React.FC<Props> = ({
  settings,
  onUpdateSettings,
  onResetProgress,
  onOpenApkGuide,
  onBack,
}) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  return (
    <div className="relative w-full h-full min-h-screen flex flex-col justify-between p-4 select-none overflow-y-auto bg-gradient-to-b from-purple-100 via-pink-50 to-indigo-100">
      {/* Header */}
      <div className="w-full flex items-center justify-between mb-3 z-20">
        <button
          onClick={onBack}
          className="flex items-center gap-1 px-3 py-1.5 bg-white/90 hover:bg-white text-purple-700 text-xs font-bold rounded-full shadow-xs border border-purple-200 transition-all active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="text-center">
          <h2 className="font-['Fredoka'] font-extrabold text-base text-purple-900">
            Game Settings
          </h2>
          <span className="text-[10px] text-pink-600 font-bold">
            Audio & Performance Controls
          </span>
        </div>

        <div className="w-16" />
      </div>

      {/* Main Settings Form */}
      <div className="flex-1 w-full max-w-md mx-auto space-y-3 pb-6">
        {/* Audio Sliders Card */}
        <div className="bg-white/90 rounded-3xl p-4 shadow-sm border border-pink-200 space-y-3.5 backdrop-blur-xs">
          <div className="flex items-center justify-between border-b border-pink-100 pb-2">
            <span className="font-bold text-xs text-purple-900 flex items-center gap-1.5">
              <Volume2 className="w-4 h-4 text-pink-500" />
              <span>Sound & Audio Volumes</span>
            </span>

            {/* Master Mute Toggle */}
            <button
              onClick={() => {
                onUpdateSettings({ masterMute: !settings.masterMute });
                soundEngine.playClick();
              }}
              className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                settings.masterMute
                  ? 'bg-rose-100 text-rose-700 border border-rose-300'
                  : 'bg-emerald-100 text-emerald-700 border border-emerald-300'
              }`}
            >
              {settings.masterMute ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              <span>{settings.masterMute ? 'Muted' : 'Unmuted'}</span>
            </button>
          </div>

          {/* ASMR Volume Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold text-purple-800">
              <span className="flex items-center gap-1">
                <span>🎧</span> ASMR Eating Crunch/Slurp
              </span>
              <span>{Math.round(settings.asmrVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.asmrVolume}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                onUpdateSettings({ asmrVolume: val });
                soundEngine.playCrunchChips();
              }}
              className="w-full accent-pink-500 cursor-pointer"
            />
          </div>

          {/* Cooking Sounds Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold text-purple-800">
              <span className="flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-500" /> Kitchen Cooking Sounds
              </span>
              <span>{Math.round(settings.cookingVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.cookingVolume}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                onUpdateSettings({ cookingVolume: val });
                soundEngine.playChop();
              }}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Music Volume Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold text-purple-800">
              <span className="flex items-center gap-1">
                <Music className="w-3.5 h-3.5 text-purple-500" /> Rainbow Lofi Ambient Music
              </span>
              <span>{Math.round(settings.musicVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.musicVolume}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                onUpdateSettings({ musicVolume: val });
                if (val > 0) soundEngine.startMusic();
                else soundEngine.stopMusic();
              }}
              className="w-full accent-purple-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Performance & Visuals Card */}
        <div className="bg-white/90 rounded-3xl p-4 shadow-sm border border-pink-200 space-y-3 backdrop-blur-xs">
          <span className="font-bold text-xs text-purple-900 flex items-center gap-1.5 border-b border-pink-100 pb-2">
            <Gauge className="w-4 h-4 text-purple-500" />
            <span>Graphics & Performance</span>
          </span>

          {/* FPS Mode */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-purple-900">Target Framerate</div>
              <div className="text-[10px] text-purple-600">Smooth 60 FPS or battery saver</div>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => onUpdateSettings({ fpsMode: '60fps' })}
                className={`px-3 py-1 rounded-xl text-xs font-bold ${
                  settings.fpsMode === '60fps'
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                60 FPS
              </button>
              <button
                onClick={() => onUpdateSettings({ fpsMode: 'battery_saver' })}
                className={`px-3 py-1 rounded-xl text-xs font-bold ${
                  settings.fpsMode === 'battery_saver'
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                Eco
              </button>
            </div>
          </div>

          {/* Sparkles Particle Toggle */}
          <div className="flex items-center justify-between pt-1">
            <div>
              <div className="text-xs font-bold text-purple-900">Floating Sparkles & Stars</div>
              <div className="text-[10px] text-purple-600">Pastel atmosphere particles</div>
            </div>
            <button
              onClick={() => onUpdateSettings({ particlesEnabled: !settings.particlesEnabled })}
              className={`px-3 py-1 rounded-xl text-xs font-bold ${
                settings.particlesEnabled
                  ? 'bg-pink-500 text-white'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {settings.particlesEnabled ? 'Enabled' : 'Disabled'}
            </button>
          </div>

          {/* Language support (prepared for expansion) */}
          <div className="flex items-center justify-between pt-1">
            <div>
              <div className="text-xs font-bold text-purple-900">Language</div>
              <div className="text-[10px] text-purple-600">Prepared for localization</div>
            </div>
            <span className="flex items-center gap-1 text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-xl border border-purple-200">
              <Globe className="w-3.5 h-3.5" /> English (US)
            </span>
          </div>
        </div>

        {/* Android APK Export Guide Link */}
        <div
          onClick={onOpenApkGuide}
          className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-3.5 rounded-3xl shadow-sm flex items-center justify-between cursor-pointer active:scale-95 transition-transform"
        >
          <div className="flex items-center gap-2.5">
            <Smartphone className="w-5 h-5 text-emerald-200" />
            <div>
              <div className="font-bold text-xs">Build Android APK</div>
              <div className="text-[10px] text-emerald-100">Free offline packaging instructions</div>
            </div>
          </div>
          <span className="text-xs font-extrabold bg-white/20 px-2.5 py-1 rounded-full">
            View ➔
          </span>
        </div>

        {/* Reset Progress Section */}
        <div className="bg-rose-50/80 rounded-3xl p-3.5 border border-rose-200 text-center">
          {!showResetConfirm ? (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="text-xs text-rose-600 hover:text-rose-700 font-bold flex items-center justify-center gap-1 mx-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Game Save & Progress</span>
            </button>
          ) : (
            <div className="space-y-2">
              <p className="text-xs font-bold text-rose-700">
                Are you sure? This resets coins, unlocks, and progress!
              </p>
              <div className="flex gap-2 justify-center">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="px-4 py-1.5 bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onResetProgress();
                    setShowResetConfirm(false);
                  }}
                  className="px-4 py-1.5 bg-rose-600 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  Confirm Reset
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
