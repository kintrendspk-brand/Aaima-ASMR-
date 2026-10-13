import React from 'react';
import { MukbangMission } from '../../types/game';
import { CREATOR_MILESTONES } from '../../data/tanghuluData';
import { soundEngine } from '../../services/soundEngine';
import { ArrowLeft, CheckCircle2, Gift, Sparkles, Trophy, Users, Coins } from 'lucide-react';

interface Props {
  missions: MukbangMission[];
  subscribers: number;
  onClaimMission: (id: string, rewardCoins: number, rewardSubs: number) => void;
  onBack: () => void;
}

export const ViewerMissionsModal: React.FC<Props> = ({
  missions,
  subscribers,
  onClaimMission,
  onBack,
}) => {
  const currentMilestone =
    CREATOR_MILESTONES.slice()
      .reverse()
      .find((m) => subscribers >= m.subs) || CREATOR_MILESTONES[0];

  const nextMilestone =
    CREATOR_MILESTONES.find((m) => subscribers < m.subs) || null;

  const handleClaim = (mission: MukbangMission) => {
    if (mission.isClaimed) return;
    soundEngine.playFanfare();
    soundEngine.playCoin();
    onClaimMission(mission.id, mission.rewardCoins, mission.rewardSubs);
  };

  return (
    <div className="relative w-full h-full min-h-screen flex flex-col justify-between p-3 select-none overflow-hidden bg-gradient-to-b from-purple-950 via-pink-950 to-slate-900 text-white">
      {/* Top Header */}
      <div className="w-full flex items-center justify-between z-20 pt-1">
        <button
          onClick={onBack}
          className="flex items-center gap-1 px-3 py-1.5 bg-white/15 hover:bg-white/25 text-white text-xs font-bold rounded-full shadow-xs border border-white/20 transition-all active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="text-center">
          <h2 className="font-['Fredoka'] font-extrabold text-sm sm:text-base text-pink-300">
            Viewer Request Orders 💌
          </h2>
          <span className="text-[10px] text-pink-200/80 font-bold">
            Mukbang viewer missions & superchat tips
          </span>
        </div>

        {/* Subs count */}
        <div className="flex items-center gap-1.5 bg-amber-500/90 text-amber-950 px-3 py-1 rounded-full text-xs font-extrabold shadow-sm">
          <Users className="w-3.5 h-3.5" />
          <span>{subscribers.toLocaleString()}</span>
        </div>
      </div>

      {/* Creator Milestone Banner (Silver / Gold / Diamond Play Buttons) */}
      <div className="w-full max-w-md mx-auto my-2 bg-gradient-to-r from-purple-800/80 via-pink-800/80 to-purple-900/80 rounded-2xl p-3 border border-pink-400/40 shadow-lg flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="text-3xl animate-bounce">
            {currentMilestone.badge}
          </div>
          <div>
            <div className="text-xs font-extrabold text-pink-200">
              {currentMilestone.title}
            </div>
            <div className="text-[10px] text-pink-300/80">
              {nextMilestone
                ? `Next: ${nextMilestone.title} at ${nextMilestone.subs.toLocaleString()} subs`
                : 'Highest Creator Tier Achieved! 🏆'}
            </div>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs font-extrabold text-yellow-300 block">
            {subscribers.toLocaleString()}
          </span>
          <span className="text-[9px] text-white/70">Subscribers</span>
        </div>
      </div>

      {/* Missions List */}
      <div className="flex-1 overflow-y-auto w-full max-w-md mx-auto space-y-2 py-1 pb-4">
        {missions.map((mission) => {
          const isDone = mission.currentCount >= mission.targetCount || mission.isCompleted;

          return (
            <div
              key={mission.id}
              className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-2.5 ${
                mission.isClaimed
                  ? 'bg-white/5 border-white/10 opacity-60'
                  : isDone
                  ? 'bg-gradient-to-r from-pink-900/60 to-purple-900/60 border-pink-400 shadow-md ring-1 ring-pink-400/40'
                  : 'bg-white/10 border-white/15'
              }`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-xs text-white">
                    {mission.title}
                  </span>
                  {isDone && !mission.isClaimed && (
                    <span className="text-[9px] bg-rose-500 text-white font-extrabold px-1.5 py-0.5 rounded-full animate-pulse">
                      Ready!
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-pink-200/90 font-medium mt-0.5 line-clamp-1">
                  {mission.description}
                </p>

                {/* Rewards preview */}
                <div className="flex items-center gap-3 mt-1.5 text-[10px] font-bold">
                  <div className="flex items-center gap-1 text-amber-400">
                    <Coins className="w-3 h-3 fill-amber-400" />
                    <span>+{mission.rewardCoins} Coins</span>
                  </div>
                  <div className="flex items-center gap-1 text-pink-300">
                    <Users className="w-3 h-3" />
                    <span>+{mission.rewardSubs} Subs</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div>
                {mission.isClaimed ? (
                  <span className="text-[10px] font-extrabold text-white/50 px-2 py-1 bg-white/10 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Done
                  </span>
                ) : isDone ? (
                  <button
                    onClick={() => handleClaim(mission)}
                    className="py-1.5 px-3 bg-gradient-to-r from-amber-400 to-rose-500 hover:from-amber-500 hover:to-rose-600 text-white font-extrabold text-xs rounded-xl shadow-md active:scale-95 transition-all flex items-center gap-1 animate-bounce"
                  >
                    <Gift className="w-3.5 h-3.5" />
                    <span>Claim</span>
                  </button>
                ) : (
                  <span className="text-[10px] font-bold text-white/60 bg-white/10 px-2 py-1 rounded-full">
                    In Progress
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
