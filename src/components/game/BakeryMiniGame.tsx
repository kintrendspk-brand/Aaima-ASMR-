import React, { useState, useEffect } from 'react';
import { BAKERY_PASTRIES, BakeryOrder } from '../../data/tanghuluData';
import { soundEngine } from '../../services/soundEngine';
import confetti from 'canvas-confetti';
import { ArrowLeft, Clock, Coins, Sparkles, Trophy, RotateCcw } from 'lucide-react';

interface Props {
  onEarnCoins: (amount: number) => void;
  onBack: () => void;
}

export const BakeryMiniGame: React.FC<Props> = ({ onEarnCoins, onBack }) => {
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [coinsEarned, setCoinsEarned] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [currentOrder, setCurrentOrder] = useState<BakeryOrder>(BAKERY_PASTRIES[0]);
  const [customerEmoji, setCustomerEmoji] = useState<string>('🐰');
  const [feedback, setFeedback] = useState<string | null>(null);

  const customerPool = ['🐰', '🐱', '🐻', '🐼', '🦊', '🐶', '👧', '🐹'];

  const getRandomOrder = () => {
    const randomIndex = Math.floor(Math.random() * BAKERY_PASTRIES.length);
    return BAKERY_PASTRIES[randomIndex];
  };

  const getRandomCustomer = () => {
    return customerPool[Math.floor(Math.random() * customerPool.length)];
  };

  // Start shift
  useEffect(() => {
    setCurrentOrder(getRandomOrder());
    setCustomerEmoji(getRandomCustomer());
  }, []);

  // Timer loop
  useEffect(() => {
    if (isGameOver) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          finishShift();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isGameOver, score]);

  const handleSelectPastry = (pastry: BakeryOrder) => {
    if (isGameOver) return;

    if (pastry.id === currentOrder.id) {
      // Correct order!
      soundEngine.playCoin();
      const newCombo = combo + 1;
      setCombo(newCombo);
      const points = 10 + newCombo * 2;
      setScore((prev) => prev + points);

      setFeedback('PERFECT! ✨');
      setTimeout(() => setFeedback(null), 500);

      // Next customer
      setCurrentOrder(getRandomOrder());
      setCustomerEmoji(getRandomCustomer());
    } else {
      // Wrong pastry!
      soundEngine.playClick();
      setCombo(0);
      setFeedback('Oops! Wrong pastry ❌');
      setTimeout(() => setFeedback(null), 600);
    }
  };

  const finishShift = () => {
    setIsGameOver(true);
    const finalSalary = Math.max(25, Math.floor(score * 0.45));
    setCoinsEarned(finalSalary);
    onEarnCoins(finalSalary);
    soundEngine.playFanfare();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const restartShift = () => {
    setTimeLeft(30);
    setScore(0);
    setCombo(0);
    setCoinsEarned(0);
    setIsGameOver(false);
    setCurrentOrder(getRandomOrder());
    setCustomerEmoji(getRandomCustomer());
    soundEngine.playClick();
  };

  return (
    <div className="relative w-full h-full min-h-screen flex flex-col justify-between p-3 select-none overflow-hidden bg-gradient-to-b from-amber-100 via-orange-50 to-pink-100">
      {/* Top Header */}
      <div className="w-full flex items-center justify-between z-20 pt-1">
        <button
          onClick={onBack}
          className="flex items-center gap-1 px-3 py-1.5 bg-white/90 hover:bg-white text-amber-900 text-xs font-bold rounded-full shadow-xs border border-amber-200 transition-all active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Shop</span>
        </button>

        <div className="text-center">
          <h2 className="font-['Fredoka'] font-extrabold text-sm sm:text-base text-amber-950">
            Bakery Part-Time Shift 🥐
          </h2>
          <span className="text-[10px] text-amber-700 font-bold">
            Match orders to earn fast coins!
          </span>
        </div>

        {/* Shift Timer Pill */}
        <div
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold shadow-sm border ${
            timeLeft <= 5
              ? 'bg-rose-500 text-white animate-pulse border-rose-600'
              : 'bg-white/90 text-amber-900 border-amber-200'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>{timeLeft}s</span>
        </div>
      </div>

      {/* Main Shift Stage */}
      <div className="flex-1 flex flex-col items-center justify-center my-auto w-full max-w-md mx-auto relative z-10">
        {!isGameOver ? (
          <div className="w-full flex flex-col items-center">
            {/* Score & Combo Bar */}
            <div className="w-full flex justify-between items-center px-4 mb-2">
              <div className="flex items-center gap-1 bg-white/80 px-3 py-1 rounded-full border border-amber-200 shadow-xs text-xs font-bold text-amber-900">
                <Trophy className="w-3.5 h-3.5 text-amber-500" />
                <span>Score: {score}</span>
              </div>
              {combo > 1 && (
                <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-3 py-1 rounded-full text-xs font-extrabold animate-bounce shadow-sm">
                  🔥 {combo}x COMBO!
                </div>
              )}
            </div>

            {/* Customer Counter Scene */}
            <div className="relative w-full bg-white/90 rounded-3xl p-4 shadow-xl border-2 border-amber-300 flex flex-col items-center my-2">
              {/* Customer Emoji */}
              <div className="text-6xl mb-1 animate-pulse">
                {customerEmoji}
              </div>

              {/* Order Bubble */}
              <div className="bg-amber-50 border-2 border-amber-400 rounded-2xl px-4 py-2 shadow-md flex items-center gap-2 animate-bounce">
                <span className="text-xs font-bold text-amber-900">"I'd like a</span>
                <span className="text-2xl">{currentOrder.icon}</span>
                <span className="text-xs font-extrabold text-amber-950 underline">
                  {currentOrder.name}
                </span>
                <span className="text-xs font-bold text-amber-900">please!"</span>
              </div>

              {/* Feedback Pop */}
              {feedback && (
                <div className="absolute top-2 right-4 text-xs font-extrabold text-pink-600 animate-bounce">
                  {feedback}
                </div>
              )}
            </div>

            {/* Pastry Tray Buttons (Tap the matching one!) */}
            <div className="w-full mt-3">
              <span className="text-xs font-extrabold text-amber-900 mb-1.5 block text-center">
                Tap the matching pastry from your bakery counter:
              </span>
              <div className="grid grid-cols-3 gap-2">
                {BAKERY_PASTRIES.map((pastry) => (
                  <button
                    key={pastry.id}
                    onClick={() => handleSelectPastry(pastry)}
                    className="p-3 bg-white/95 hover:bg-amber-50 rounded-2xl border-2 border-amber-200 shadow-sm flex flex-col items-center active:scale-95 transition-all group hover:border-amber-400"
                  >
                    <span className="text-3xl group-hover:scale-110 transition-transform">
                      {pastry.icon}
                    </span>
                    <span className="text-[10px] font-bold text-amber-950 mt-1 truncate w-full text-center">
                      {pastry.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Game Over / Salary Summary */
          <div className="w-full bg-white/95 rounded-3xl p-6 shadow-2xl border-2 border-amber-400 text-center flex flex-col items-center animate-fade-in">
            <span className="text-5xl mb-2">🎉</span>
            <h3 className="font-['Fredoka'] font-extrabold text-xl text-amber-950">
              Shift Complete!
            </h3>
            <p className="text-xs text-amber-700 font-medium mt-1">
              Thank you for helping out at the bakery!
            </p>

            <div className="my-4 bg-amber-50 rounded-2xl p-4 border border-amber-200 w-full flex items-center justify-around">
              <div>
                <span className="text-[10px] text-amber-600 font-bold block">Final Score</span>
                <span className="text-lg font-extrabold text-amber-950">{score}</span>
              </div>
              <div className="h-8 w-px bg-amber-300" />
              <div>
                <span className="text-[10px] text-amber-600 font-bold block">Salary Earned</span>
                <div className="flex items-center gap-1 text-lg font-extrabold text-amber-600">
                  <Coins className="w-4 h-4 fill-amber-500 text-amber-700" />
                  <span>+{coinsEarned} Coins</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 w-full">
              <button
                onClick={restartShift}
                className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 active:scale-95 transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Work Again</span>
              </button>
              <button
                onClick={onBack}
                className="flex-1 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 active:scale-95 transition-all"
              >
                <span>Back to Store ➔</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
