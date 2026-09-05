import React, { useState } from 'react';
import { sounds } from '../utils/soundEffects';

export function KanjiPage({ kanjiN5List = [], speak, onJumpToPractice }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [masteredIds, setMasteredIds] = useState(() => {
    try {
      const saved = localStorage.getItem('nihon_mastered_kanji');
      return saved ? JSON.parse(saved) : ['日', '月', '火', '水', '木', '金', '土', '人', '山', '川', '一', '二'];
    } catch {
      return ['日', '月', '火', '水', '木', '金', '土', '人', '山', '川', '一', '二'];
    }
  });

  const toggleMastered = (kanji) => {
    setMasteredIds((prev) => {
      const updated = prev.includes(kanji)
        ? prev.filter((k) => k !== kanji)
        : [...prev, kanji];
      try {
        localStorage.setItem('nihon_mastered_kanji', JSON.stringify(updated));
      } catch {}
      sounds.playSuccess?.();
      return updated;
    });
  };

  const filtered = kanjiN5List.filter((item) => {
    const q = searchTerm.toLowerCase();
    const kanji = item.kanji || '';
    const hanviet = item.hanviet || '';
    const meaning = item.meaning || '';
    const onyomi = (item.onyomi || []).join(' ');
    const kunyomi = (item.kunyomi || []).join(' ');

    return (
      kanji.includes(q) ||
      hanviet.toLowerCase().includes(q) ||
      meaning.toLowerCase().includes(q) ||
      onyomi.toLowerCase().includes(q) ||
      kunyomi.toLowerCase().includes(q)
    );
  });

  // Border & accent color rotator for aesthetic harmony
  const getCardStyle = (idx) => {
    const styles = [
      {
        border: 'border-rose-500/30',
        text: 'text-rose-400',
        bgBox: 'bg-rose-500/10 border-rose-500/40',
        btnBg: 'bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border-rose-500/30',
        highlight: 'text-rose-400'
      },
      {
        border: 'border-cyan-500/30',
        text: 'text-cyan-300',
        bgBox: 'bg-cyan-500/10 border-cyan-500/40',
        btnBg: 'bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-400 border-cyan-500/30',
        highlight: 'text-cyan-300'
      },
      {
        border: 'border-amber-500/30',
        text: 'text-amber-400',
        bgBox: 'bg-amber-500/10 border-amber-500/40',
        btnBg: 'bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 border-amber-500/30',
        highlight: 'text-amber-400'
      },
      {
        border: 'border-emerald-500/30',
        text: 'text-emerald-400',
        bgBox: 'bg-emerald-500/10 border-emerald-500/40',
        btnBg: 'bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border-emerald-500/30',
        highlight: 'text-emerald-400'
      },
      {
        border: 'border-purple-500/30',
        text: 'text-purple-300',
        bgBox: 'bg-purple-500/10 border-purple-500/40',
        btnBg: 'bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border-purple-500/30',
        highlight: 'text-purple-300'
      }
    ];
    return styles[idx % styles.length];
  };

  return (
    <section className="flex-1 flex flex-col px-4 py-3 space-y-3.5">
      {/* Search Bar */}
      <div className="relative">
        <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-lg">search</span>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Tìm theo chữ Hán, Hán-Việt (NHẬT, NGUYỆT...)"
          className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
        />
      </div>

      {/* Kanji Level & Count Badge */}
      <div className="flex items-center justify-between text-xs px-1">
        <div className="flex items-center gap-1.5">
          <span className="font-extrabold text-white">{kanjiN5List.length || 103} Kanji Chuẩn JLPT N5</span>
          <span className="px-1.5 py-0.2 bg-rose-500/20 text-rose-400 font-bold text-[10px] rounded border border-rose-500/30">
            Chắc chắn thi
          </span>
        </div>
        <span className="text-[11px] text-slate-400">
          Đã thuộc: <strong className="text-emerald-400">{masteredIds.length}</strong>/{kanjiN5List.length || 103}
        </span>
      </div>

      {/* Kanji Cards List (Responsive Grid on Tablet/Desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {filtered.map((item, idx) => {
          const style = getCardStyle(idx);
          const isMastered = masteredIds.includes(item.kanji);

          return (
            <div
              key={idx}
              className={`bg-gradient-to-br from-slate-900 via-[#0e1628] to-slate-900 rounded-2xl p-3.5 border ${style.border} shadow-md transition-all`}
            >
              {/* Top Row: Character, Info & Action */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-14 h-14 rounded-2xl ${style.bgBox} border-2 flex items-center justify-center text-3xl font-black ${style.text} shadow-sm font-sans cursor-pointer active:scale-95 transition-transform`}
                    onClick={() => {
                      sounds.playClick();
                      if (speak) speak(item.kanji);
                    }}
                    title="Chạm để nghe âm"
                  >
                    {item.kanji}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-white">{item.hanviet || 'HÁN TỰ'}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-mono">
                        {item.strokes || 4} Nét {item.radical ? `• Bộ: ${item.radical}` : ''}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      Nghĩa: {item.meaning || 'Ý nghĩa chữ Hán'}
                    </p>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      <span className="text-cyan-400 font-semibold">On:</span>{' '}
                      {(item.onyomi && item.onyomi.length > 0) ? item.onyomi.join(', ') : '---'}{' '}
                      &nbsp;|&nbsp;{' '}
                      <span className="text-amber-400 font-semibold">Kun:</span>{' '}
                      {(item.kunyomi && item.kunyomi.length > 0) ? item.kunyomi.join(', ') : '---'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => toggleMastered(item.kanji)}
                    className={`p-1.5 rounded-lg border text-xs transition-all active:scale-95 ${
                      isMastered
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                        : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-white'
                    }`}
                    title={isMastered ? 'Đã thuộc' : 'Đánh dấu đã thuộc'}
                  >
                    <span className="material-symbols-outlined text-base">
                      {isMastered ? 'check_circle' : 'radio_button_unchecked'}
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      sounds.playClick();
                      if (onJumpToPractice) {
                        onJumpToPractice(item);
                      }
                    }}
                    className={`p-1.5 rounded-lg border ${style.btnBg} active:scale-95 transition-all cursor-pointer`}
                    title="Luyện viết chữ này"
                  >
                    <span className="material-symbols-outlined text-base">draw</span>
                  </button>
                </div>
              </div>

              {/* Mẹo nhớ (Mnemonic) */}
              {item.mnemonic ? (
                <div className="mt-2.5 p-2 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[10px] text-slate-300 flex items-start gap-2">
                  <span className="text-amber-400 text-sm">💡</span>
                  <div>
                    <strong className="text-white">Mẹo nhớ:</strong> {item.mnemonic}
                  </div>
                </div>
              ) : (
                <div className="mt-2.5 p-2 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[10px] text-slate-300 flex items-start gap-2">
                  <span className="text-amber-400 text-sm">💡</span>
                  <div>
                    <strong className="text-white">Mẹo nhớ:</strong> Hãy hình dung cấu tạo các bộ thủ kết hợp để khắc sâu nghĩa của chữ {item.kanji}.
                  </div>
                </div>
              )}

              {/* Từ ghép N5 (Examples) */}
              {item.examples && item.examples.length > 0 && (
                <div className="mt-2.5 pt-2 border-t border-slate-800/70">
                  <span className="text-[10px] font-bold uppercase text-slate-400">
                    Từ ghép xuất hiện trong đề N5:
                  </span>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {item.examples.map((ex, exIdx) => (
                      <span
                        key={exIdx}
                        onClick={() => {
                          sounds.playClick();
                          if (speak) speak(ex.word);
                        }}
                        className="px-2 py-0.5 rounded-lg bg-slate-800/90 border border-slate-700 text-[10px] text-slate-200 cursor-pointer hover:border-slate-500 transition-colors"
                        title="Nghe phát âm từ ghép"
                      >
                        <strong className={style.highlight}>{ex.word}</strong>{' '}
                        <span>({ex.reading || ex.hiragana} - {ex.meaning})</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quick Kanji Grid Mini Pills */}
      <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
        <div className="text-[10px] font-bold text-slate-400 mb-2 uppercase">
          Kanji kế tiếp theo lộ trình:
        </div>
        <div className="grid grid-cols-6 sm:grid-cols-12 gap-2 text-center">
          {kanjiN5List.slice(0, 12).map((k, i) => (
            <div
              key={i}
              onClick={() => {
                sounds.playClick();
                if (onJumpToPractice) onJumpToPractice(k);
              }}
              className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-base font-bold text-rose-300 cursor-pointer hover:bg-rose-500/20 hover:border-rose-400 transition-all active:scale-90"
              title={`${k.kanji} - ${k.hanviet}`}
            >
              {k.kanji}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
