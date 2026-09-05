import React from 'react';
import { Volume2, CheckCircle2, Layers, Lightbulb, BookOpen } from 'lucide-react';
import { sounds } from '../../utils/soundEffects';

export function StrokeCompanionPanel({
  selectedChar,
  currentStrokeIdx,
  totalStrokes,
  masteredChars,
  onSpeak
}) {
  const currentCharTitle = selectedChar.char || selectedChar.kanji;
  const isMastered = masteredChars.has(currentCharTitle);
  const strokeSvgPaths = selectedChar.strokeSvgPaths || [];

  // Determine coordinate space (100 for Kanji, 220 for Kana)
  let maxCoord = 0;
  strokeSvgPaths.forEach((p) => {
    const nums = p.match(/[\d.]+/g) || [];
    nums.forEach((n) => {
      const v = parseFloat(n);
      if (v > maxCoord) maxCoord = v;
    });
  });
  const boxSize = maxCoord <= 110 ? 100 : 220;
  const viewBox = `0 0 ${boxSize} ${boxSize}`;
  const strokeScale = boxSize === 100 ? 1 : 2.2;

  return (
    <div className="bg-white dark:bg-[#131d2e] rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl flex flex-col justify-start gap-5 transition-colors min-h-full">
      
      {/* 1. Large Model Character Hero Card (Phóng to sắc nét) */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-4">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-rose-50 via-rose-100/40 to-amber-50 dark:from-slate-800 dark:to-slate-900 border-2 border-rose-200 dark:border-rose-500/40 flex items-center justify-center text-6xl sm:text-7xl jp-font font-black text-rose-600 dark:text-rose-400 shadow-xs shrink-0">
            {currentCharTitle}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                {selectedChar.hanviet ? `[ ${selectedChar.hanviet} ]` : selectedChar.romaji}
              </span>
              <button
                onClick={() => { sounds.playClick(); onSpeak(currentCharTitle); }}
                className="p-2 rounded-xl bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 transition-colors cursor-pointer"
                title="Nghe phát âm chuẩn"
              >
                <Volume2 className="w-4 h-4" />
              </button>
              {isMastered && (
                <span className="bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-500/30 flex items-center gap-1 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Đã thuộc
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1.5 font-medium">
              {selectedChar.meaning ? `Nghĩa: ${selectedChar.meaning}` : `Âm: /${selectedChar.romaji}/`}
              {selectedChar.radical && ` • Bộ: ${selectedChar.radical}`}
            </p>

            {/* Onyomi & Kunyomi Badges for Kanji */}
            {selectedChar.onyomi && selectedChar.onyomi.length > 0 && (
              <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-lg bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-300 text-xs font-bold border border-rose-200/80 dark:border-rose-500/30">
                  On: {selectedChar.onyomi.join(', ')}
                </span>
                {selectedChar.kunyomi && selectedChar.kunyomi.length > 0 && (
                  <span className="px-2.5 py-0.5 rounded-lg bg-amber-50 dark:bg-amber-500/10 text-amber-800 dark:text-amber-300 text-xs font-bold border border-amber-200/80 dark:border-amber-500/30">
                    Kun: {selectedChar.kunyomi.join(', ')}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="text-right shrink-0">
          <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">Tổng nét:</span>
          <span className="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-400">{totalStrokes} nét</span>
        </div>
      </div>

      {/* 2. Stroke Decomposition Gallery (Phóng to các nét rời rạc, hoàn toàn tĩnh, KHÔNG NHẤP NHÁY) */}
      <div className="bg-slate-50 dark:bg-[#0b1120] rounded-3xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center justify-between mb-3.5">
          <span className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-rose-500" />
            Sơ đồ từng nét rời rạc (Dễ quan sát):
          </span>
          <span className="text-xs text-rose-600 dark:text-rose-400 font-black bg-rose-50 dark:bg-rose-500/10 px-2.5 py-0.5 rounded-lg border border-rose-200 dark:border-rose-500/30">
            Đang viết: Nét {Math.min(currentStrokeIdx + 1, totalStrokes)} / {totalStrokes}
          </span>
        </div>

        {/* Big Thumbnail Cards for Individual Strokes (No blinking, centered) */}
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2.5 mb-4">
          {strokeSvgPaths.map((path, idx) => {
            const isDone = idx < currentStrokeIdx;
            const isCurrent = idx === currentStrokeIdx;

            const coords = path.match(/M\s*([\d.]+)\s*([\d.]+)/i);
            const startX = coords ? parseFloat(coords[1]) : 0;
            const startY = coords ? parseFloat(coords[2]) : 0;
            const markerRadius = boxSize === 100 ? 6.5 : 15;

            return (
              <div
                key={idx}
                className={`relative rounded-2xl p-2 sm:p-2.5 flex flex-col items-center justify-center transition-colors ${
                  isCurrent
                    ? 'bg-rose-50/90 dark:bg-rose-950/60 border-2 border-rose-500 shadow-xs'
                    : isDone
                    ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-500/30'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 opacity-65'
                }`}
              >
                {/* Scaled Thumbnail SVG */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 relative">
                  <svg viewBox={viewBox} className="w-full h-full p-1">
                    {/* All strokes faint background */}
                    {strokeSvgPaths.map((otherPath, oIdx) => (
                      <path
                        key={`bg-${oIdx}`}
                        d={otherPath}
                        fill="none"
                        stroke="rgba(203, 213, 225, 0.45)"
                        strokeWidth={4 * strokeScale}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    ))}
                    {/* Active stroke */}
                    <path
                      d={path}
                      fill="none"
                      stroke={isCurrent ? '#e11d48' : isDone ? '#059669' : '#475569'}
                      strokeWidth={5.5 * strokeScale}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {/* Start dot */}
                    {coords && (
                      <circle
                        cx={startX}
                        cy={startY}
                        r={markerRadius}
                        fill={isCurrent ? '#e11d48' : isDone ? '#059669' : '#64748b'}
                      />
                    )}
                  </svg>
                </div>

                <div className="text-[11px] font-black mt-1.5 flex items-center gap-1">
                  <span className={isCurrent ? 'text-rose-600 dark:text-rose-400' : isDone ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}>
                    Nét {idx + 1}
                  </span>
                  {isDone && <CheckCircle2 className="w-3 h-3 text-emerald-500" />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Stroke Rules List (Tĩnh, KHÔNG NHẤP NHÁY) */}
        <div className="space-y-2 text-xs sm:text-sm max-h-56 overflow-y-auto pr-1">
          {(selectedChar.strokeRules || []).map((rule, idx) => {
            const isDone = idx < currentStrokeIdx;
            const isCurrent = idx === currentStrokeIdx;

            return (
              <div
                key={idx}
                className={`p-3 rounded-2xl flex items-center justify-between transition-colors ${
                  isDone
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 font-medium'
                    : isCurrent
                    ? 'bg-rose-50 dark:bg-rose-500/20 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-500 font-bold'
                    : 'bg-white dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
                }`}
              >
                <span>{rule}</span>
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 ml-1.5" />
                ) : isCurrent ? (
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0 ml-1.5" />
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Mnemonic Memory Card (Mẹo Nhớ Siêu Tốc - Phóng to rõ chữ) */}
      {(selectedChar.mnemonic || selectedChar.mnemonicStory) && (
        <div className="bg-amber-50/80 dark:bg-amber-500/10 p-4 sm:p-5 rounded-3xl border border-amber-200 dark:border-amber-500/25">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span className="text-xs sm:text-sm font-bold text-amber-900 dark:text-amber-300">
              Mẹo nhớ: {selectedChar.mnemonic?.title || 'Câu chuyện liên tưởng'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-amber-950/85 dark:text-slate-300 leading-relaxed font-medium">
            {selectedChar.mnemonic?.story || selectedChar.mnemonicStory}
          </p>
        </div>
      )}

      {/* 4. Context Vocabulary (Từ Ghép N5 Thông Dụng - Thẻ to, đầy đặn không để trống đáy) */}
      {(selectedChar.examples || selectedChar.compounds) && (
        <div>
          <h4 className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 mb-2.5 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-rose-500" />
            Từ vựng mẫu thông dụng:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {(selectedChar.examples || selectedChar.compounds || []).slice(0, 4).map((ex, i) => (
              <div
                key={i}
                className="bg-slate-50 dark:bg-[#0b1120] p-3 sm:p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between hover:border-rose-300 dark:hover:border-rose-500/40 transition-colors"
              >
                <div>
                  <div className="font-bold text-sm text-slate-900 dark:text-amber-300 jp-font">{ex.word}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {ex.hanviet ? `[${ex.hanviet}] ` : ''}
                    {ex.meaning}
                  </div>
                </div>
                <button
                  onClick={() => { sounds.playClick(); onSpeak(ex.word); }}
                  className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-xl transition-colors cursor-pointer shrink-0 ml-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                  title="Nghe phát âm"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
