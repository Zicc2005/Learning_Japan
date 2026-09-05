import React from 'react';
import { Volume2, CheckCircle2, Layers, Lightbulb, BookOpen } from 'lucide-react';
import { sounds } from '../../utils/soundEffects';

export function CharacterDetail({
  selectedChar,
  currentStrokeIdx,
  totalStrokes,
  masteredChars,
  onSpeak
}) {
  const currentCharTitle = selectedChar.char || selectedChar.kanji;
  const isMastered = masteredChars.has(currentCharTitle);

  return (
    <div className="bg-white dark:bg-[#131d2e] rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl flex flex-col gap-4 transition-colors">
      
      {/* Top Header Card */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-[#0b1120] border-2 border-rose-200 dark:border-rose-500/40 flex items-center justify-center text-4xl jp-font font-black text-rose-600 dark:text-rose-400 shadow-xs">
            {currentCharTitle}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xl font-black text-slate-900 dark:text-white">
                {selectedChar.hanviet ? `[ ${selectedChar.hanviet} ]` : selectedChar.romaji}
              </span>
              <button
                onClick={() => { sounds.playClick(); onSpeak(currentCharTitle); }}
                className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 transition-colors cursor-pointer"
                title="Nghe phát âm chuẩn"
              >
                <Volume2 className="w-4 h-4" />
              </button>
              {isMastered && (
                <span className="bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-[11px] px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-500/30 flex items-center gap-1 font-bold">
                  <CheckCircle2 className="w-3 h-3" /> Đã thuộc
                </span>
              )}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              {selectedChar.meaning ? `Nghĩa: ${selectedChar.meaning}` : `Phát âm: /${selectedChar.romaji}/`}
              {selectedChar.radical && ` • Bộ thủ: ${selectedChar.radical}`}
            </p>
          </div>
        </div>

        <div className="text-right shrink-0">
          <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">Số nét chuẩn:</span>
          <span className="text-lg font-black text-rose-600 dark:text-rose-400">{totalStrokes} nét</span>
        </div>
      </div>

      {/* Trật tự nét trực tiếp (Live Stroke List) */}
      <div className="bg-slate-50 dark:bg-[#0b1120] rounded-2xl p-3.5 border border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-rose-500" />
            Trật tự nét trực tiếp (Stroke Guide):
          </span>
          <span className="text-[11px] text-rose-600 dark:text-rose-400 font-bold">
            Đang viết nét: {Math.min(currentStrokeIdx + 1, totalStrokes)} / {totalStrokes}
          </span>
        </div>

        <div className="space-y-1.5 text-xs max-h-44 overflow-y-auto pr-1">
          {(selectedChar.strokeRules || []).map((rule, idx) => {
            const isDone = idx < currentStrokeIdx;
            const isCurrent = idx === currentStrokeIdx;

            return (
              <div
                key={idx}
                className={`p-2.5 rounded-xl flex items-center justify-between transition-all ${
                  isDone
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30'
                    : isCurrent
                    ? 'bg-rose-50 dark:bg-rose-500/20 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-500 font-bold shadow-2xs'
                    : 'bg-white dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
                }`}
              >
                <span>{rule}</span>
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 ml-2" />
                ) : isCurrent ? (
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping shrink-0 ml-2" />
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mẹo Nhớ Siêu Tốc (Mnemonic Story) */}
      {(selectedChar.mnemonic || selectedChar.mnemonicStory) && (
        <div className="bg-amber-50/80 dark:bg-amber-500/10 p-3.5 rounded-2xl border border-amber-200 dark:border-amber-500/25">
          <div className="flex items-center gap-2 mb-1.5">
            <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span className="text-xs font-bold text-amber-900 dark:text-amber-300">
              Mẹo nhớ siêu tốc: {selectedChar.mnemonic?.title || 'Câu chuyện chữ Hán'}
            </span>
          </div>
          <p className="text-xs text-amber-950/80 dark:text-slate-300 leading-relaxed font-normal">
            {selectedChar.mnemonic?.story || selectedChar.mnemonicStory}
          </p>
        </div>
      )}

      {/* Từ vựng ghép thông dụng (Context Vocabulary) */}
      {(selectedChar.examples || selectedChar.compounds) && (
        <div>
          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-rose-500" />
            Từ vựng ghép thông dụng (Ví dụ):
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {(selectedChar.examples || selectedChar.compounds || []).map((ex, i) => (
              <div
                key={i}
                className="bg-slate-50 dark:bg-[#0b1120] p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
              >
                <div>
                  <div className="font-bold text-sm text-slate-900 dark:text-amber-300 jp-font">{ex.word}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    {ex.hanviet ? `[${ex.hanviet}] ` : ''}
                    {ex.meaning}
                  </div>
                </div>
                <button
                  onClick={() => { sounds.playClick(); onSpeak(ex.word); }}
                  className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                  title="Nghe phát âm"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
