import React, { useState } from 'react';
import { GirlCharacter } from '../../types/game';
import { CuteGirl } from '../character/CuteGirl';
import { soundEngine } from '../../services/soundEngine';
import { ArrowLeft, Check, Lock, Sparkles, Coins, Shirt } from 'lucide-react';

interface Props {
  characters: GirlCharacter[];
  selectedCharacter: GirlCharacter;
  coins: number;
  onSelectCharacter: (id: string) => void;
  onUnlockCharacter: (id: string) => boolean;
  onSelectOutfit: (charId: string, outfitId: string) => void;
  onUnlockOutfit: (charId: string, outfitId: string) => boolean;
  onBack: () => void;
}

export const CharacterSelector: React.FC<Props> = ({
  characters,
  selectedCharacter,
  coins,
  onSelectCharacter,
  onUnlockCharacter,
  onSelectOutfit,
  onUnlockOutfit,
  onBack,
}) => {
  const [activeCharId, setActiveCharId] = useState<string>(selectedCharacter.id);
  const currentChar = characters.find((c) => c.id === activeCharId) || characters[0];

  const handleSelectCharCard = (char: GirlCharacter) => {
    setActiveCharId(char.id);
    soundEngine.playClick();
  };

  const handleEquipChar = () => {
    if (currentChar.isUnlocked) {
      onSelectCharacter(currentChar.id);
    } else {
      onUnlockCharacter(currentChar.id);
    }
  };

  const isCurrentActive = selectedCharacter.id === currentChar.id;

  return (
    <div className="relative w-full h-full min-h-screen flex flex-col justify-between p-4 select-none overflow-y-auto bg-gradient-to-b from-purple-100 via-pink-100 to-rose-100">
      {/* Header */}
      <div className="w-full flex items-center justify-between mb-2">
        <button
          onClick={onBack}
          className="flex items-center gap-1 px-3 py-1.5 bg-white/90 hover:bg-white text-purple-700 text-xs font-bold rounded-full shadow-xs border border-purple-200 transition-all active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="text-center">
          <h2 className="font-['Fredoka'] font-extrabold text-base text-purple-900">
            Choose Your Girl
          </h2>
          <span className="text-[10px] text-pink-600 font-bold">
            6 Adorable Characters & Outfits
          </span>
        </div>

        {/* Coin Pill */}
        <div className="flex items-center gap-1.5 bg-white/90 px-3 py-1 rounded-full border border-pink-200 shadow-xs">
          <Coins className="w-4 h-4 text-amber-500 fill-amber-400" />
          <span className="font-extrabold text-xs text-amber-700">{coins}</span>
        </div>
      </div>

      {/* Main Character Showcase Preview Card */}
      <div className="w-full max-w-sm mx-auto bg-white/90 rounded-3xl p-4 shadow-lg border-2 border-pink-200 flex flex-col items-center relative mb-3">
        {/* Girl Vector Preview */}
        <div className="my-1">
          <CuteGirl character={currentChar} expression="idle" size="xl" />
        </div>

        {/* Character Title & Bio */}
        <div className="text-center mt-2">
          <div className="flex items-center justify-center gap-1.5">
            <h3 className="font-['Fredoka'] text-xl font-extrabold text-purple-900">
              {currentChar.name}
            </h3>
            <span className="text-xs font-bold text-pink-600 bg-pink-100 px-2 py-0.5 rounded-full">
              {currentChar.title}
            </span>
          </div>
          <p className="text-xs text-purple-700/80 font-medium mt-1 px-4 leading-relaxed">
            {currentChar.description}
          </p>
        </div>

        {/* Outfit Wardrobe Selection */}
        <div className="w-full mt-3 pt-3 border-t border-pink-100">
          <div className="flex items-center gap-1.5 text-xs font-bold text-purple-800 mb-2">
            <Shirt className="w-4 h-4 text-pink-500" />
            <span>Outfits & Dresses</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {currentChar.outfits.map((outfit) => {
              const isOutfitSelected = currentChar.selectedOutfitId === outfit.id;
              return (
                <div
                  key={outfit.id}
                  onClick={() => {
                    if (outfit.isUnlocked) {
                      onSelectOutfit(currentChar.id, outfit.id);
                    } else {
                      onUnlockOutfit(currentChar.id, outfit.id);
                    }
                  }}
                  className={`p-2 rounded-xl border text-center cursor-pointer transition-all active:scale-95 ${
                    isOutfitSelected
                      ? 'bg-pink-100 border-pink-400 shadow-xs'
                      : outfit.isUnlocked
                      ? 'bg-white border-slate-200 hover:border-pink-200'
                      : 'bg-slate-50 border-slate-200 opacity-80'
                  }`}
                >
                  <div
                    className="w-5 h-5 mx-auto rounded-full border mb-1"
                    style={{ backgroundColor: outfit.dressColor }}
                  />
                  <div className="text-[11px] font-bold text-purple-900 truncate">
                    {outfit.name}
                  </div>
                  <div className="text-[10px] mt-0.5">
                    {isOutfitSelected ? (
                      <span className="text-pink-600 font-extrabold">Wearing</span>
                    ) : outfit.isUnlocked ? (
                      <span className="text-emerald-600 font-bold">Equip</span>
                    ) : (
                      <span className="text-amber-600 font-bold flex items-center justify-center gap-0.5">
                        <Coins className="w-3 h-3 inline" /> {outfit.price}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Equip / Unlock Character Button */}
        <div className="w-full mt-4">
          {currentChar.isUnlocked ? (
            <button
              onClick={handleEquipChar}
              disabled={isCurrentActive}
              className={`w-full py-3 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 transition-transform active:scale-95 ${
                isCurrentActive
                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                  : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-md'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>{isCurrentActive ? 'Active Companion' : 'Choose This Girl'}</span>
            </button>
          ) : (
            <button
              onClick={handleEquipChar}
              disabled={coins < currentChar.price}
              className="w-full py-3 rounded-2xl font-extrabold text-sm bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95 disabled:opacity-50"
            >
              <Lock className="w-4 h-4" />
              <span>Unlock for {currentChar.price} Coins</span>
            </button>
          )}
        </div>
      </div>

      {/* Horizontal Carousel Thumbnails of all 6 characters */}
      <div className="w-full max-w-md mx-auto">
        <span className="text-xs font-bold text-purple-800 mb-1.5 block">
          Select Character:
        </span>
        <div className="grid grid-cols-6 gap-2">
          {characters.map((char) => {
            const isSelected = char.id === activeCharId;
            return (
              <div
                key={char.id}
                onClick={() => handleSelectCharCard(char)}
                className={`relative p-1.5 rounded-2xl flex flex-col items-center cursor-pointer transition-all active:scale-95 ${
                  isSelected
                    ? 'bg-white border-2 border-pink-500 shadow-md scale-105'
                    : 'bg-white/70 border border-pink-200 hover:bg-white'
                }`}
              >
                <div className="w-10 h-14 overflow-hidden">
                  <CuteGirl character={char} expression="idle" size="sm" />
                </div>
                <span className="text-[10px] font-bold text-purple-900 mt-0.5 truncate w-full text-center">
                  {char.name}
                </span>

                {!char.isUnlocked && (
                  <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-slate-900/60 flex items-center justify-center text-white text-[9px]">
                    <Lock className="w-2.5 h-2.5" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
