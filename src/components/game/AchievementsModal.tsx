import React from 'react';
import { Achievement } from '../../types/game';
import { soundEngine } from '../../services/soundEngine';
import { ArrowLeft, Trophy, Coins, Check, Gift } from 'lucide-react';

interface Props {
  achievements: Achievement[];
  coins: number;
  onClaimAchievement: (id: string) => void;
  onBack: () => void;
}

export const AchievementsModal: React.FC<Props> = ({
  achievements,
  coins,
  onClaimAchievement,
  onBack,
}) => {
  const completedCount = achievements.filter((a) => a.isCompleted).length;

  return (
    <div className="relative w-full h-full min-h-screen flex flex-col justify-between p-4 select-none overflow-hidden bg-gradient-to-b from-yellow-50 via-amber-50 to-pink-100">
      {/* Header */}
      <div className="w-full flex items-center justify-between mb-3 z-20">
        <button
          onClick={onBack}
          className="flex items-center gap-1 px-3 py-1.5 bg-white/90 hover:bg-white text-yellow-800 text-xs font-bold rounded-full shadow-xs border border-yellow-200 transition-all active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="text-center">
          <h2 className="font-['Fredoka'] font-extrabold text-base text-purple-900">
            Achievements
          </h2>
          <span className="text-[10px] text-amber-700 font-bold">
            {completedCount} / {achievements.length} Badges Completed
          </span>
        </div>

        <div className="flex items-center gap-1.5 bg-white/90 px-3 py-1 rounded-full border border-pink-200 shadow-xs">
          <Coins className="w-4 h-4 text-amber-500 fill-amber-400" />
          <span className="font-extrabold text-xs text-amber-700">{coins}</span>
        </div>
      </div>

      {/* Achievement list */}
      <div className="flex-1 overflow-y-auto w-full max-w-md mx-auto space-y-2.5 pb-6">
        {achievements.map((ach) => {
          const progressPercent = Math.min(
            100,
            Math.round((ach.currentProgress / ach.targetProgress) * 100)
          );

          return (
            <div
              key={ach.id}
              className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 shadow-xs transition-all ${
                ach.isClaimed
                  ? 'bg-slate-50 border-slate-200 opacity-75'
                  : ach.isCompleted
                  ? 'bg-amber-50/95 border-amber-300 ring-1 ring-amber-300'
                  : 'bg-white/90 border-yellow-100'
              }`}
            >
              {/* Badge Icon */}
              <div className="w-11 h-11 rounded-2xl bg-amber-100 flex items-center justify-center text-xl shrink-0 shadow-inner">
                <span>{ach.icon}</span>
              </div>

              {/* Info & Progress */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-purple-900 truncate">
                    {ach.title}
                  </h4>
                  <span className="text-[10px] font-bold text-amber-700 flex items-center gap-0.5">
                    <Coins className="w-3 h-3 fill-amber-400 text-amber-600 inline" /> +{ach.rewardCoins}
                  </span>
                </div>

                <p className="text-[11px] text-purple-700/70 mt-0.5 line-clamp-1">
                  {ach.description}
                </p>

                {/* Progress bar */}
                <div className="w-full mt-1.5">
                  <div className="w-full h-1.5 bg-amber-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full transition-all"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[9px] text-purple-600 font-bold mt-0.5">
                    <span>Progress</span>
                    <span>
                      {ach.currentProgress} / {ach.targetProgress}
                    </span>
                  </div>
                </div>
              </div>

              {/* Claim Button */}
              <div className="shrink-0">
                {ach.isClaimed ? (
                  <div className="p-2 bg-slate-100 text-slate-500 rounded-xl">
                    <Check className="w-4 h-4" />
                  </div>
                ) : ach.isCompleted ? (
                  <button
                    onClick={() => onClaimAchievement(ach.id)}
                    className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-extrabold text-xs rounded-xl shadow-xs flex items-center gap-1 active:scale-95 transition-transform animate-bounce"
                  >
                    <Gift className="w-3.5 h-3.5" />
                    <span>Claim</span>
                  </button>
                ) : (
                  <div className="text-[10px] text-slate-400 font-bold px-2 py-1 bg-slate-50 rounded-lg">
                    In Progress
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
