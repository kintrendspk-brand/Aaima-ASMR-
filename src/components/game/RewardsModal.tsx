import React from 'react';
import { DAILY_REWARDS } from '../../data/achievements';
import { soundEngine } from '../../services/soundEngine';
import { ArrowLeft, Gift, Coins, Check, Sparkles } from 'lucide-react';

interface Props {
  dailyDay: number;
  lastDailyClaim: number | null;
  coins: number;
  onClaimDailyReward: () => boolean;
  onBack: () => void;
}

export const RewardsModal: React.FC<Props> = ({
  dailyDay,
  lastDailyClaim,
  coins,
  onClaimDailyReward,
  onBack,
}) => {
  const now = Date.now();
  const canClaim = !lastDailyClaim || now - lastDailyClaim >= 20 * 60 * 60 * 1000;

  const handleClaim = () => {
    if (canClaim) {
      onClaimDailyReward();
    }
  };

  return (
    <div className="relative w-full h-full min-h-screen flex flex-col justify-between p-4 select-none overflow-hidden bg-gradient-to-b from-blue-50 via-indigo-50 to-pink-100">
      {/* Header */}
      <div className="w-full flex items-center justify-between mb-3 z-20">
        <button
          onClick={onBack}
          className="flex items-center gap-1 px-3 py-1.5 bg-white/90 hover:bg-white text-blue-700 text-xs font-bold rounded-full shadow-xs border border-blue-200 transition-all active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="text-center">
          <h2 className="font-['Fredoka'] font-extrabold text-base text-purple-900">
            Daily Rainbow Rewards
          </h2>
          <span className="text-[10px] text-blue-600 font-bold">
            Log in every day for free coins!
          </span>
        </div>

        <div className="flex items-center gap-1.5 bg-white/90 px-3 py-1 rounded-full border border-pink-200 shadow-xs">
          <Coins className="w-4 h-4 text-amber-500 fill-amber-400" />
          <span className="font-extrabold text-xs text-amber-700">{coins}</span>
        </div>
      </div>

      {/* 7-Day Grid */}
      <div className="flex-1 w-full max-w-md mx-auto flex flex-col justify-center my-auto">
        <div className="bg-white/90 rounded-3xl p-4 shadow-lg border-2 border-blue-200 backdrop-blur-xs">
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 mb-3">
            {DAILY_REWARDS.map((reward) => {
              const isToday = reward.day === dailyDay;
              const isPast = reward.day < dailyDay;
              const isDay7 = reward.day === 7;

              return (
                <div
                  key={reward.day}
                  className={`p-3 rounded-2xl border text-center flex flex-col items-center justify-between relative transition-transform ${
                    isDay7 ? 'col-span-3 sm:col-span-2 bg-gradient-to-r from-amber-100 via-pink-100 to-purple-100 border-amber-300' : ''
                  } ${
                    isToday
                      ? 'bg-blue-50 border-blue-400 ring-2 ring-blue-300 shadow-md scale-102'
                      : isPast
                      ? 'bg-slate-50 border-slate-200 opacity-60'
                      : 'bg-white border-blue-100'
                  }`}
                >
                  <span className="text-[10px] font-extrabold uppercase text-purple-700">
                    Day {reward.day}
                  </span>

                  <div className="my-1.5 text-2xl">
                    {isDay7 ? '👑' : isToday ? '🎁' : isPast ? '✅' : '✨'}
                  </div>

                  <div className="flex items-center gap-1 text-amber-700 font-extrabold text-xs">
                    <Coins className="w-3.5 h-3.5 fill-amber-400 text-amber-600" />
                    <span>+{reward.coins}</span>
                  </div>

                  <span className="text-[9px] text-purple-600 font-semibold truncate max-w-full mt-0.5">
                    {reward.bonusTitle}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Claim Button */}
          <button
            onClick={handleClaim}
            disabled={!canClaim}
            className={`w-full py-3.5 rounded-2xl font-extrabold text-sm shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95 ${
              canClaim
                ? 'bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white animate-pulse'
                : 'bg-slate-200 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Gift className="w-4 h-4" />
            <span>{canClaim ? `Claim Day ${dailyDay} Reward!` : 'Already Claimed Today (Come back tomorrow!)'}</span>
          </button>
        </div>
      </div>

      <div className="w-full max-w-md mx-auto text-center pb-2">
        <p className="text-[11px] text-purple-700/70 font-semibold">
          Daily rewards reset every 24 hours. Keep your streak going!
        </p>
      </div>
    </div>
  );
};
