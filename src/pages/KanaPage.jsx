import React, { useState } from 'react';
import { sounds } from '../utils/soundEffects';

export function KanaPage({ hiraganaList, katakanaList, speak, onNavigatePractice }) {
  const [kanaType, setKanaType] = useState('hiragana'); // 'hiragana' | 'katakana'
  const [flippedCards, setFlippedCards] = useState(new Set());
  const [selectedRow, setSelectedRow] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);

  const baseList = kanaType === 'hiragana' ? hiraganaList : katakanaList;

  const rows = [
    { id: 'all', label: `Tất cả (${baseList.length})` },
    { id: 'a', label: 'Hàng A (a, i, u, e, o)', chars: ['あ', 'い', 'う', 'え', 'お', 'ア', 'イ', 'ウ', 'エ', 'オ'] },
    { id: 'ka', label: 'Hàng Ka (k)', chars: ['か', 'き', 'く', 'け', 'こ', 'カ', 'キ', 'ク', 'ケ', 'コ'] },
    { id: 'sa', label: 'Hàng Sa (s)', chars: ['さ', 'し', 'す', 'せ', 'そ', 'サ', 'シ', 'ス', 'セ', 'ソ'] },
    { id: 'ta', label: 'Hàng Ta (t)', chars: ['た', 'ち', 'つ', 'て', 'と', 'タ', 'チ', 'ツ', 'テ', 'ト'] },
    { id: 'na', label: 'Hàng Na (n)', chars: ['な', 'に', 'ぬ', 'ね', 'の', 'ナ', 'ニ', 'ヌ', 'ネ', 'ノ'] },
    { id: 'ha', label: 'Hàng Ha (h)', chars: ['は', 'ひ', 'ふ', 'へ', 'ほ', 'ハ', 'ヒ', 'フ', 'ヘ', 'ホ'] },
    { id: 'ma', label: 'Hàng Ma (m)', chars: ['ま', 'み', 'む', 'め', 'も', 'マ', 'ミ', 'ム', 'メ', 'モ'] },
    { id: 'ya', label: 'Hàng Ya (y)', chars: ['や', 'ゆ', 'よ', 'ヤ', 'ユ', 'ヨ'] },
    { id: 'ra', label: 'Hàng Ra (r)', chars: ['ら', 'り', 'る', 'れ', 'ろ', 'ラ', 'リ', 'ル', 'レ', 'ロ'] },
    { id: 'wa', label: 'Hàng Wa / N', chars: ['わ', 'を', 'ん', 'ワ', 'ヲ', 'ン'] },
  ];

  const currentList = baseList.filter((item) => {
    if (selectedRow === 'all') return true;
    const targetRow = rows.find((r) => r.id === selectedRow);
    return targetRow ? targetRow.chars.includes(item.char) : true;
  });

  const handleFlipCard = (char, item) => {
    sounds.playClick();
    setSelectedItem(item);
    setFlippedCards((prev) => {
      const next = new Set(prev);
      if (next.has(char)) {
        next.delete(char);
      } else {
        next.add(char);
      }
      return next;
    });
  };

  const isHira = kanaType === 'hiragana';

  return (
    <section className="tab-screen flex-1 flex flex-col px-4 py-3 space-y-3.5 pb-24" id="screen-tab-kana">
      {/* Top Switcher: Hiragana vs Katakana */}
      <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-900 border border-slate-800">
        <button
          onClick={() => { sounds.playClick(); setKanaType('hiragana'); }}
          className={`py-1.5 rounded-lg font-black text-xs shadow transition-all cursor-pointer ${
            isHira
              ? 'bg-gradient-to-r from-rose-600 to-red-500 text-white'
              : 'text-slate-400 hover:text-white font-semibold'
          }`}
          id="kanaTypeHiragana"
        >
          Hiragana (46 chữ mềm)
        </button>
        <button
          onClick={() => { sounds.playClick(); setKanaType('katakana'); }}
          className={`py-1.5 rounded-lg font-black text-xs shadow transition-all cursor-pointer ${
            !isHira
              ? 'bg-gradient-to-r from-cyan-600 to-blue-500 text-white'
              : 'text-slate-400 hover:text-white font-semibold'
          }`}
          id="kanaTypeKatakana"
        >
          Katakana (46 chữ cứng)
        </button>
      </div>

      {/* Row Filters */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        {rows.map((r) => {
          const isSelected = selectedRow === r.id;
          return (
            <button
              key={r.id}
              onClick={() => { sounds.playClick(); setSelectedRow(r.id); }}
              className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-black'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 font-medium'
              }`}
            >
              {r.label}
            </button>
          );
        })}
      </div>

      {/* Tip Banner */}
      <div className="text-[11px] text-slate-400 flex items-center justify-between px-1">
        <span>💡 Chạm vào thẻ để <strong className="text-rose-400">lật 3D xem mẹo nhớ & từ vựng</strong></span>
        <span className="text-cyan-400 font-semibold">🔊 Chạm loa nghe âm</span>
      </div>

      {/* Quick Selection Hero Banner (Instant Practice Action without scrolling) */}
      {selectedItem && (
        <div className="sticky top-16 z-30 bg-slate-900/95 backdrop-blur-md p-3 sm:p-4 rounded-2xl border-2 border-rose-500/60 shadow-2xl shadow-rose-950/40 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-rose-700 text-white flex items-center justify-center text-2xl font-black shadow-md shadow-rose-600/30">
              {selectedItem.char}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-white">/ {selectedItem.romaji} /</span>
                <span className="text-[10px] px-2.5 py-0.5 rounded-md bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30 leading-normal">
                  {selectedItem.strokeCount || 2} Nét bút
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 truncate max-w-[180px] sm:max-w-xs">
                Mẫu: <strong className="text-amber-300">{selectedItem.examples?.[0]?.word || selectedItem.char}</strong> ({selectedItem.examples?.[0]?.meaning || selectedItem.examples?.[0]?.reading || 'Từ vựng mẫu'})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sounds.playClick();
                speak(selectedItem.char);
              }}
              className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center transition-all cursor-pointer active:scale-90"
              title="Nghe phát âm"
            >
              <span className="material-symbols-outlined text-base">volume_up</span>
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                if (onNavigatePractice) onNavigatePractice(selectedItem);
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:brightness-110 text-white font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-lg shadow-rose-600/30 active:scale-95 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">edit</span>
              <span>Luyện Chữ Này Ngay</span>
            </button>
          </div>
        </div>
      )}

      {/* Grid of Interactive 3D Flip Flashcards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 sm:gap-4" id="kanaCardsGrid">
        {currentList.map((item, idx) => {
          const char = item.char;
          const isFlipped = flippedCards.has(char);
          const isSelected = selectedItem?.char === char;

          return (
            <div
              key={idx}
              onClick={() => handleFlipCard(char, item)}
              className={`flip-card h-48 perspective-1000 cursor-pointer select-none transition-transform hover:-translate-y-0.5 ${
                isSelected ? 'ring-2 ring-rose-400 rounded-2xl' : ''
              }`}
            >
              <div className={`flip-card-inner relative w-full h-full transition-transform duration-500 transform-style-3d ${
                isFlipped ? 'rotate-y-180' : ''
              }`}>
                
                {/* MẶT TRƯỚC */}
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-[#0e1628] rounded-2xl border border-rose-500/30 p-3 flex flex-col justify-between backface-hidden shadow-lg hover:border-rose-400/60 transition-colors">
                  {/* Top Bar: Stroke Count + Audio */}
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 text-[10px] font-bold border border-rose-500/30">
                      {item.strokeCount || 2} Nét
                    </span>
                    <button
                      className="w-7 h-7 rounded-lg bg-slate-800/90 text-slate-300 flex items-center justify-center hover:text-white hover:bg-slate-700 cursor-pointer active:scale-90 transition-all"
                      onClick={(e) => {
                        e.stopPropagation();
                        sounds.playClick();
                        speak(char);
                      }}
                      title="Nghe âm"
                    >
                      <span className="material-symbols-outlined text-sm">volume_up</span>
                    </button>
                  </div>

                  {/* Character & Romaji Center */}
                  <div className="text-center my-auto">
                    <span className="text-5xl font-black text-white font-sans">{char}</span>
                    <div className="text-sm font-black text-rose-400 tracking-wider mt-0.5">
                      / {item.romaji} /
                    </div>
                  </div>

                  {/* Direct Practice Button & Flip action directly on card */}
                  <div className="pt-1.5 border-t border-slate-800/80 flex items-center justify-between gap-1.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        sounds.playClick();
                        if (onNavigatePractice) onNavigatePractice(item);
                      }}
                      className="flex-1 py-1.5 px-2 rounded-lg bg-rose-600/90 hover:bg-rose-500 text-white font-black text-[11px] shadow-sm flex items-center justify-center gap-1 active:scale-95 transition-all cursor-pointer"
                      title="Luyện viết chữ này"
                    >
                      <span className="material-symbols-outlined text-xs">draw</span>
                      <span>Luyện viết</span>
                    </button>
                    <span 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFlipCard(char, item);
                      }}
                      className="px-2 py-1.5 text-[10px] text-amber-300 hover:text-amber-200 font-bold cursor-pointer rounded-lg bg-amber-500/10 hover:bg-amber-500/20 transition-colors shrink-0"
                      title="Xem mẹo nhớ"
                    >
                      Mẹo ↻
                    </span>
                  </div>
                </div>

                {/* MẶT SAU */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#181126] to-[#0d1424] rounded-2xl border border-purple-500/40 p-3 flex flex-col justify-between rotate-y-180 backface-hidden shadow-lg text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-purple-300 uppercase tracking-wide">💡 Mẹo nhớ</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {isHira ? 'Hiragana' : 'Katakana'} #{idx + 1}
                    </span>
                  </div>

                  <div className="text-center my-auto">
                    <span className="text-2xl">{item.mnemonic?.icon || '💡'}</span>
                    <p className="text-xs text-slate-200 mt-1 font-semibold leading-tight line-clamp-2">
                      {item.mnemonic?.title || item.mnemonic?.story || 'Hình ảnh liên tưởng dễ nhớ'}
                    </p>
                    <div className="mt-1 text-[10px] text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-md inline-block truncate max-w-full">
                      Ví dụ: {item.examples?.[0]?.word} ({item.examples?.[0]?.meaning || item.examples?.[0]?.reading})
                    </div>
                  </div>

                  {/* Direct Practice Button on Back Face */}
                  <div className="pt-1.5 border-t border-purple-900/50 flex items-center gap-1.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        sounds.playClick();
                        if (onNavigatePractice) onNavigatePractice(item);
                      }}
                      className="flex-1 py-1.5 px-2 rounded-lg bg-gradient-to-r from-rose-600 to-rose-500 hover:brightness-110 text-white font-black text-[11px] shadow-sm flex items-center justify-center gap-1 active:scale-95 transition-all cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-xs">edit</span>
                      <span>Luyện viết ngay</span>
                    </button>
                    <span 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFlipCard(char, item);
                      }}
                      className="px-2 py-1.5 text-[10px] text-purple-300 hover:text-purple-200 font-bold cursor-pointer rounded-lg bg-purple-500/20 shrink-0"
                    >
                      Quay lại ↻
                    </span>
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Sticky Fallback Action */}
      <button
        onClick={() => {
          sounds.playClick();
          if (onNavigatePractice) {
            onNavigatePractice(selectedItem || currentList[0]);
          }
        }}
        className="w-full py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-500 font-black text-sm text-white shadow-xl shadow-rose-600/30 flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer hover:brightness-110"
      >
        <span className="material-symbols-outlined text-base">draw</span>
        <span>Luyện Viết Bút Thuận Chữ Này Ngay ({selectedItem?.char || currentList[0]?.char})</span>
      </button>
    </section>
  );
}
