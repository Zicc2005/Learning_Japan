import React, { useState } from 'react';
import { sounds } from '../utils/soundEffects';

export function GrammarPage({ grammarList = [], speak }) {
  const [search, setSearch] = useState('');
  const [selectedParticle, setSelectedParticle] = useState('all');

  const particles = [
    { id: 'all', label: `Tất cả (${grammarList.length} mẫu)` },
    { id: 'は', label: 'Trợ từ は (wa)' },
    { id: 'を', label: 'Trợ từ を (o)' },
    { id: 'で', label: 'Trợ từ で (de)' },
    { id: 'に', label: 'Trợ từ に (ni)' },
    { id: 'へ', label: 'Trợ từ へ (e)' },
    { id: 'て', label: 'Thể て (Te form)' }
  ];

  const filtered = grammarList.filter((item) => {
    const q = search.toLowerCase();
    const title = (item.title || '').toLowerCase();
    const meaning = (item.meaning || '').toLowerCase();
    const matchesParticle =
      selectedParticle === 'all' || (item.particleFocus && item.particleFocus.includes(selectedParticle));

    return matchesParticle && (title.includes(q) || meaning.includes(q));
  });

  const getCardTheme = (idx) => {
    const themes = [
      {
        border: 'border-rose-500/30',
        badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
        cautionBg: 'bg-rose-950/40 border-rose-800/60 text-rose-200',
        cautionIcon: 'text-rose-400',
        highlight: 'text-rose-400'
      },
      {
        border: 'border-cyan-500/30',
        badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
        cautionBg: 'bg-amber-950/40 border-amber-800/60 text-amber-200',
        cautionIcon: 'text-amber-400',
        highlight: 'text-cyan-400'
      },
      {
        border: 'border-emerald-500/30',
        badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
        cautionBg: 'bg-emerald-950/40 border-emerald-800/60 text-emerald-200',
        cautionIcon: 'text-emerald-400',
        highlight: 'text-emerald-400'
      },
      {
        border: 'border-amber-500/30',
        badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
        cautionBg: 'bg-indigo-950/40 border-indigo-800/60 text-indigo-200',
        cautionIcon: 'text-indigo-400',
        highlight: 'text-amber-400'
      }
    ];
    return themes[idx % themes.length];
  };

  return (
    <section className="flex-1 flex flex-col px-4 py-3 space-y-3.5">
      {/* Search Bar */}
      <div className="relative">
        <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-lg">search</span>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm kiếm mẫu ngữ pháp, trợ từ は, を, で..."
          className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
        />
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        {particles.map((p) => {
          const isActive = selectedParticle === p.id;
          return (
            <button
              key={p.id}
              onClick={() => {
                sounds.playClick();
                setSelectedParticle(p.id);
              }}
              className={`px-3 py-1 rounded-full text-xs whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-rose-600 text-white font-bold shadow-md shadow-rose-600/30'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 font-medium'
              }`}
            >
              {p.label}
            </button>
          );
        })}
      </div>

      {/* Grammar Cards List (Responsive 2-Column Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {filtered.map((item, idx) => {
          const theme = getCardTheme(idx);
          const numStr = String(idx + 1).padStart(2, '0');

          return (
            <div
              key={item.id || idx}
              className={`bg-gradient-to-br from-slate-900 to-[#0e1628] rounded-2xl p-3.5 border ${theme.border} shadow-lg transition-all`}
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <span className={`px-2 py-0.5 rounded text-[10px] font-black border ${theme.badge}`}>
                  MẪU {numStr} {item.lesson ? `• BÀI ${item.lesson}` : (item.particleFocus ? `• ${item.particleFocus}` : '')}
                </span>
                <span className="text-[10px] text-amber-400 font-bold">
                  ★ 100% Gặp ở đề thi
                </span>
              </div>

              {/* Title & Meaning */}
              <h3 className="text-sm font-black text-white mt-1.5">
                {item.title} ({item.meaning})
              </h3>
              <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                {item.explanation || `Cấu trúc cơ bản trong ngữ pháp tiếng Nhật N5. Giúp bạn diễn đạt chính xác ngữ nghĩa và sắc thái trong giao tiếp thường ngày.`}
              </p>

              {/* Caution Note */}
              {item.caution ? (
                <div className={`mt-2.5 p-2 rounded-xl border text-[10px] flex items-start gap-2 ${theme.cautionBg}`}>
                  <span className={`material-symbols-outlined text-sm flex-shrink-0 ${theme.cautionIcon}`}>
                    warning
                  </span>
                  <div>
                    <strong className="text-white">Cẩn thận nhầm lẫn:</strong> {item.caution}
                  </div>
                </div>
              ) : (
                <div className={`mt-2.5 p-2 rounded-xl border text-[10px] flex items-start gap-2 ${theme.cautionBg}`}>
                  <span className={`material-symbols-outlined text-sm flex-shrink-0 ${theme.cautionIcon}`}>
                    info
                  </span>
                  <div>
                    <strong className="text-white">Ghi chú ngữ cảnh:</strong> Lưu ý vị trí trợ từ và hình thái chia động từ đi kèm nhé!
                  </div>
                </div>
              )}

              {/* Example Sentences */}
              {item.examples && item.examples.length > 0 && (
                <div className="mt-2.5 space-y-1.5">
                  {item.examples.map((ex, exIdx) => (
                    <div
                      key={exIdx}
                      className="p-2 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-2"
                    >
                      <div className="flex-1">
                        <div className="text-xs font-bold text-white leading-snug">
                          {ex.jp || ex.japanese}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {ex.vn || ex.meaning}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          sounds.playClick();
                          if (speak) speak(ex.jp || ex.japanese);
                        }}
                        className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center hover:text-white active:scale-90 transition-all flex-shrink-0 cursor-pointer"
                        title="Nghe phát âm ví dụ"
                      >
                        <span className="material-symbols-outlined text-xs">volume_up</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
