import React from 'react';
import { sounds } from '../../utils/soundEffects';

export function Header({
  xp,
  streak,
  masteredCount,
  soundMuted,
  toggleSound,
  onOpenQuests
}) {
  return (
    <header className="sticky top-0 z-50 bg-[#090e1d]/95 backdrop-blur-md border-b border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto w-full px-3.5 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between text-xs sm:text-sm font-semibold">
        
        {/* Logo & Mode Badge */}
        <div className="flex items-center gap-2 select-none">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-rose-600 via-rose-500 to-pink-500 flex items-center justify-center font-bold text-white shadow-md shadow-rose-600/40 text-sm">
            漢
          </div>
          <div className="flex flex-col leading-tight">
            <div className="flex items-center gap-1">
              <span className="text-sm font-black tracking-tight text-white">
                Nihon<span className="text-rose-500">Learn</span>
              </span>
              <span className="text-[9px] px-1 py-0.2 rounded bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30">
                N5
              </span>
            </div>
            <span className="text-[8px] text-slate-400 font-medium tracking-wide">
              CHUẨN NÉT BÚT THUẬN
            </span>
          </div>
        </div>

        {/* Gamified Badges */}
        <div className="flex items-center gap-1.5">
          {/* Streak (Click to open Quests) */}
          <button
            onClick={() => {
              sounds.playClick();
              if (onOpenQuests) onOpenQuests();
            }}
            title="Nhiệm vụ & Streak hàng ngày"
            className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 font-semibold text-[11px] cursor-pointer transition-all active:scale-95"
          >
            <span>🔥</span>
            <span>{streak}d</span>
          </button>

          {/* Mastered */}
          <div 
            title={`${masteredCount} ký tự đã thuộc`}
            className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold text-[11px]"
          >
            <span className="material-symbols-outlined text-[13px] text-emerald-400">check_circle</span>
            <span>{masteredCount}</span>
          </div>

          {/* XP */}
          <div 
            title={`${xp} điểm kinh nghiệm`}
            className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-500/15 border border-yellow-500/40 text-yellow-300 font-bold text-[11px] shadow-xs"
          >
            <span>✨</span>
            <span>+{xp}</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => {
              toggleSound();
              sounds.playClick();
            }}
            className="w-7 h-7 rounded-full bg-slate-800/90 border border-slate-700/70 flex items-center justify-center text-slate-300 active:scale-90 transition-all cursor-pointer hover:text-white"
            title={soundMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
          >
            <span className="material-symbols-outlined text-[15px]">
              {soundMuted ? 'volume_off' : 'volume_up'}
            </span>
          </button>
        </div>

      </div>
    </header>
  );
}
