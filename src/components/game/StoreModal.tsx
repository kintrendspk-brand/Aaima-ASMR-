import React, { useState } from 'react';
import { StoreItem } from '../../types/game';
import { soundEngine } from '../../services/soundEngine';
import { ArrowLeft, Coins, Check, Lock, Sparkles, Store } from 'lucide-react';

interface Props {
  storeItems: StoreItem[];
  coins: number;
  onBuyItem: (itemId: string) => boolean;
  onBack: () => void;
}

export const StoreModal: React.FC<Props> = ({
  storeItems,
  coins,
  onBuyItem,
  onBack,
}) => {
  const [tab, setTab] = useState<'all' | 'kitchen_decor' | 'table_decor' | 'wallpaper'>('all');

  const filteredItems = storeItems.filter(
    (item) => tab === 'all' || item.category === tab
  );

  const handleBuy = (item: StoreItem) => {
    if (!item.isUnlocked) {
      onBuyItem(item.id);
    }
  };

  return (
    <div className="relative w-full h-full min-h-screen flex flex-col justify-between p-4 select-none overflow-hidden bg-gradient-to-b from-emerald-50 via-teal-50 to-pink-100">
      {/* Header */}
      <div className="w-full flex items-center justify-between mb-3 z-20">
        <button
          onClick={onBack}
          className="flex items-center gap-1 px-3 py-1.5 bg-white/90 hover:bg-white text-emerald-700 text-xs font-bold rounded-full shadow-xs border border-emerald-200 transition-all active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="text-center">
          <h2 className="font-['Fredoka'] font-extrabold text-base text-purple-900">
            My Store & Upgrades
          </h2>
          <span className="text-[10px] text-emerald-600 font-bold">
            Cookware, Table Decor & Wallpapers
          </span>
        </div>

        {/* Coin counter */}
        <div className="flex items-center gap-1.5 bg-white/90 px-3 py-1 rounded-full border border-pink-200 shadow-xs">
          <Coins className="w-4 h-4 text-amber-500 fill-amber-400" />
          <span className="font-extrabold text-xs text-amber-700">{coins}</span>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="w-full max-w-md mx-auto flex gap-1.5 mb-3">
        {[
          { id: 'all', label: 'All Items' },
          { id: 'kitchen_decor', label: 'Kitchen' },
          { id: 'table_decor', label: 'Table Decor' },
          { id: 'wallpaper', label: 'Wallpapers' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => {
              setTab(t.id as any);
              soundEngine.playClick();
            }}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
              tab === t.id
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white/80 text-purple-800 hover:bg-white border border-emerald-100'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Store Item Cards */}
      <div className="flex-1 overflow-y-auto w-full max-w-md mx-auto space-y-2.5 pb-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 shadow-sm transition-all ${
              item.isUnlocked
                ? 'bg-white/95 border-emerald-200'
                : 'bg-white/80 border-slate-200'
            }`}
          >
            {/* Icon & Color Badge */}
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-inner shrink-0 border"
              style={{ backgroundColor: `${item.previewColor}33`, borderColor: item.previewColor }}
            >
              <span>{item.icon}</span>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h4 className="font-bold text-xs text-purple-900 truncate">
                  {item.name}
                </h4>
                {item.isUnlocked && (
                  <span className="text-[9px] bg-emerald-100 text-emerald-700 font-extrabold px-1.5 py-0.2 rounded-full">
                    Owned
                  </span>
                )}
              </div>
              <p className="text-[11px] text-purple-700/70 mt-0.5 line-clamp-2 leading-tight">
                {item.description}
              </p>
            </div>

            {/* Buy / Owned button */}
            <div className="shrink-0">
              {item.isUnlocked ? (
                <div className="px-3 py-1.5 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-xl flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>Equipped</span>
                </div>
              ) : (
                <button
                  onClick={() => handleBuy(item)}
                  disabled={coins < item.price}
                  className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-extrabold text-xs rounded-xl shadow-xs flex items-center gap-1 active:scale-95 transition-transform disabled:opacity-50"
                >
                  <Coins className="w-3.5 h-3.5" />
                  <span>{item.price}</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
