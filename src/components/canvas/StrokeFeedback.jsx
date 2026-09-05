import React from 'react';
import { Play, PenTool, RotateCcw, CheckCircle2, AlertCircle } from 'lucide-react';
import { sounds } from '../../utils/soundEffects';

export function StrokeFeedback({
  strokeAccuracy,
  currentStrokeIdx,
  totalStrokes,
  feedbackMsg,
  isReplaying,
  onAutoReplay,
  onReset
}) {
  return (
    <div className="w-full flex flex-col items-center gap-3.5 transition-colors">
      
      {/* Progress & Live Alert */}
      <div className="w-full flex flex-col items-center gap-2">
        <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
          <span>Tiến độ nét:</span>
          <div className="flex items-center gap-1.5 flex-wrap justify-center">
            {Array.from({ length: totalStrokes }).map((_, i) => (
              <span
                key={i}
                className={`w-4 h-4 rounded-full transition-colors flex items-center justify-center text-[10px] font-black ${
                  i < currentStrokeIdx
                    ? 'bg-emerald-500 text-white shadow-xs'
                    : i === currentStrokeIdx
                    ? 'bg-rose-500 text-white ring-2 ring-rose-300 dark:ring-rose-500/50'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-300 dark:border-slate-700'
                }`}
              >
                {i + 1}
              </span>
            ))}
          </div>
          <strong className="text-rose-600 dark:text-rose-400 font-bold ml-1">
            {currentStrokeIdx} / {totalStrokes} nét
          </strong>
        </div>

        {/* Live Feedback Alert Banner */}
        <div
          className={`text-xs px-4 py-2 rounded-full font-bold flex items-center gap-2 transition-colors shadow-2xs ${
            feedbackMsg.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/40'
              : feedbackMsg.type === 'warning'
              ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-500/40'
              : 'bg-slate-100 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
          }`}
        >
          {feedbackMsg.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          )}
          <span>{feedbackMsg.text}</span>
        </div>
      </div>

      {/* 3 Main Action Buttons */}
      <div className="w-full grid grid-cols-3 gap-2 sm:gap-3">
        {/* Button 1: Xem Nét Mẫu */}
        <button
          onClick={() => { sounds.playClick(); onAutoReplay(); }}
          disabled={isReplaying}
          className="py-2.5 sm:py-3 px-2 sm:px-4 rounded-2xl bg-white dark:bg-[#0b1120] hover:bg-slate-50 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xs disabled:opacity-50 cursor-pointer"
        >
          <Play className="w-4 h-4 text-rose-500 fill-rose-500" />
          <span className="hidden sm:inline">{isReplaying ? 'Đang chiếu mẫu...' : 'Xem Nét Mẫu'}</span>
          <span className="sm:hidden">{isReplaying ? 'Chiếu...' : 'Mẫu'}</span>
        </button>

        {/* Button 2: Tập Viết Lại */}
        <button
          onClick={() => { sounds.playClick(); onReset(); }}
          className="py-2.5 sm:py-3 px-2 sm:px-4 rounded-2xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white text-xs font-black flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md shadow-rose-500/25 cursor-pointer"
        >
          <PenTool className="w-4 h-4 text-white" />
          <span className="hidden sm:inline">Tập Viết Lại</span>
          <span className="sm:hidden">Viết Lại</span>
        </button>

        {/* Button 3: Đặt Lại Canvas */}
        <button
          onClick={() => { sounds.playClick(); onReset(); }}
          className="py-2.5 sm:py-3 px-2 sm:px-4 rounded-2xl bg-white dark:bg-[#0b1120] hover:bg-slate-50 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xs cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 text-slate-500" />
          <span>Đặt Lại</span>
        </button>
      </div>

    </div>
  );
}
