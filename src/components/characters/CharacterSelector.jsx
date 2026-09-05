import React from 'react';
import { Search, CheckCircle2 } from 'lucide-react';
import { sounds } from '../../utils/soundEffects';

export function CharacterSelector({
  category,
  setCategory,
  searchQuery,
  setSearchQuery,
  filteredList,
  selectedChar,
  onSelectCharacter,
  hiraganaCount,
  katakanaCount,
  kanjiCount,
  masteredChars
}) {
  const handleItemClick = (item) => {
    sounds.playClick();
    onSelectCharacter(item);
  };

  const currentCharTitle = selectedChar.char || selectedChar.kanji;

  return (
    <div className="bg-white dark:bg-[#131d2e] rounded-3xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl flex flex-col gap-3.5 transition-colors">
      
      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm ký tự, Romaji hoặc Hán-Việt..."
          className="w-full bg-slate-50 dark:bg-[#0b1120] text-xs sm:text-sm text-slate-800 dark:text-slate-100 pl-9 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700/80 focus:outline-none focus:border-rose-500 dark:focus:border-rose-500 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors"
        />
      </div>

      {/* Category Filter Tabs */}
      <div className="grid grid-cols-3 gap-1 bg-slate-100 dark:bg-[#0b1120] p-1 rounded-2xl border border-slate-200/80 dark:border-slate-800">
        <button
          onClick={() => { sounds.playClick(); setCategory('hiragana'); }}
          className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            category === 'hiragana'
              ? 'bg-rose-500 text-white shadow-xs font-black'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Hiragana ({hiraganaCount})
        </button>

        <button
          onClick={() => { sounds.playClick(); setCategory('katakana'); }}
          className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            category === 'katakana'
              ? 'bg-rose-500 text-white shadow-xs font-black'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Katakana ({katakanaCount})
        </button>

        <button
          onClick={() => { sounds.playClick(); setCategory('kanji'); }}
          className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            category === 'kanji'
              ? 'bg-rose-500 text-white shadow-xs font-black'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Kanji N5 ({kanjiCount})
        </button>
      </div>

      {/* Character Grid */}
      <div>
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2 font-medium">
          <span>Danh sách ({filteredList.length} chữ):</span>
          <span className="text-rose-600 dark:text-rose-400 text-[11px] font-semibold">Chạm để chọn & nghe đọc</span>
        </div>

        <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-7 gap-1.5 sm:gap-2 max-h-56 overflow-y-auto pr-1">
          {filteredList.map((item, idx) => {
            const char = item.char || item.kanji;
            const isSelected = char === currentCharTitle;
            const isMastered = masteredChars.has(char);

            return (
              <button
                key={idx}
                onClick={() => handleItemClick(item)}
                className={`relative aspect-square rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-rose-500 text-white font-black shadow-md shadow-rose-500/25 scale-105 ring-2 ring-rose-300 dark:ring-rose-500/50'
                    : 'bg-slate-50 dark:bg-[#1a273e] hover:bg-slate-100 dark:hover:bg-[#223352] text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700/60'
                }`}
              >
                <span className="text-base sm:text-lg jp-font font-extrabold">{char}</span>
                <span className="text-[9px] opacity-85 -mt-0.5 truncate max-w-[85%] font-medium">
                  {item.romaji || item.hanviet}
                </span>

                {isMastered && (
                  <div className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full ring-1 ring-white dark:ring-[#131d2e] shadow-2xs" />
                )}
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}
