import React, { useState } from "react";
import { KANA_LIST } from "../data/kanaStitchData";
import { playChime, speakJapanese } from "../utils/audio";

export const KanaStudioScreen = ({
  onSelectKanaForPractice,
  onAddXP,
  user
}) => {
  const [script, setScript] = useState("hiragana"); // 'hiragana' | 'katakana'
  const [activeRow, setActiveRow] = useState("all");
  const [allFlipped, setAllFlipped] = useState(false);
  const [flippedCards, setFlippedCards] = useState({});
  const [kanaList, setKanaList] = useState(KANA_LIST);
  const [spotlightId, setSpotlightId] = useState("a");

  const spotlightChar = kanaList.find((k) => k.id === spotlightId) || kanaList[0];

  const filteredKana = kanaList.filter((k) => {
    if (activeRow === "all") return true;
    return k.row === activeRow;
  });

  const rowFilters = [
    { id: "all", label: "Tất cả", count: 46 },
    { id: "a", label: "Hàng A (あ・い・う...)" },
    { id: "ka", label: "Hàng Ka (か)" },
    { id: "sa", label: "Hàng Sa (さ)" },
    { id: "ta", label: "Hàng Ta (た)" },
    { id: "na", label: "Hàng Na (な)" },
    { id: "ha", label: "Hàng Ha (は)" },
    { id: "ma", label: "Hàng Ma (ま)" },
    { id: "ya", label: "Hàng Ya (や)" },
    { id: "ra", label: "Hàng Ra (ら)" },
    { id: "wa", label: "Hàng Wa / N (わ・ん)" }
  ];

  const handleToggleFlip = (id) => {
    playChime("wood");
    setFlippedCards((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleToggleFlipAll = () => {
    playChime("bell");
    const nextState = !allFlipped;
    setAllFlipped(nextState);
    const newRecord = {};
    kanaList.forEach((k) => {
      newRecord[k.id] = nextState;
    });
    setFlippedCards(newRecord);
  };

  const handleToggleStatus = (id, e) => {
    e.stopPropagation();
    setKanaList((prev) =>
      prev.map((k) => {
        if (k.id === id) {
          const nextStatus =
            k.status === "learned"
              ? "reviewing"
              : k.status === "reviewing"
              ? "unlearned"
              : "learned";
          if (nextStatus === "learned") {
            playChime("success");
            if (onAddXP) onAddXP(15);
          } else {
            playChime("wood");
          }
          return { ...k, status: nextStatus };
        }
        return k;
      })
    );
  };

  const learnedCount = kanaList.filter((k) => k.status === "learned").length;
  const isHiragana = script === "hiragana";
  const currentGlyph = isHiragana ? spotlightChar.hiragana : spotlightChar.katakana;

  return (
    <div className="max-w-md md:max-w-5xl mx-auto px-4 pt-2 pb-28 flex flex-col gap-5">
      {/* 1. Bộ chuyển đổi bảng chữ cái (Hiragana / Katakana) - Chuẩn Mobile Stitch */}
      <div className="bg-surface-container-low p-1.5 rounded-2xl border border-surface-container flex gap-1 shadow-inner">
        <button
          onClick={() => {
            setScript("hiragana");
            playChime("wood");
          }}
          className={`flex-1 py-2.5 px-3 rounded-xl font-headline font-semibold text-sm shadow-sm flex items-center justify-center gap-2 border transition-all cursor-pointer ${
            isHiragana
              ? "bg-pure-white dark:bg-charcoal text-primary border-primary/20 shadow-sm font-bold"
              : "text-on-surface-variant hover:bg-surface/60 border-transparent"
          }`}
        >
          <span className="text-base font-jp font-bold">あ</span>
          <span>Hiragana</span>
          <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-bold">
            46
          </span>
        </button>

        <button
          onClick={() => {
            setScript("katakana");
            playChime("wood");
          }}
          className={`flex-1 py-2.5 px-3 rounded-xl font-headline font-semibold text-sm shadow-sm flex items-center justify-center gap-2 border transition-all cursor-pointer ${
            !isHiragana
              ? "bg-pure-white dark:bg-charcoal text-primary border-primary/20 shadow-sm font-bold"
              : "text-on-surface-variant hover:bg-surface/60 border-transparent"
          }`}
        >
          <span className="text-base font-jp font-bold">ア</span>
          <span>Katakana</span>
          <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-surface-container-high text-secondary font-bold">
            46
          </span>
        </button>
      </div>

      {/* 2. Thanh lọc hàng âm cuộn ngang & Nút Lật thẻ - Chuẩn Mobile Stitch */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
            Chọn Hàng Âm (Gyou)
          </span>
          <button
            onClick={handleToggleFlipAll}
            className="text-xs font-semibold text-primary flex items-center gap-1 hover:underline active:opacity-75 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[15px]">flip</span>
            <span>{allFlipped ? "Lật mặt chữ" : "Lật tất cả mẹo"}</span>
          </button>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 -mx-4 px-4 scroll-smooth">
          {rowFilters.map((rf) => (
            <button
              key={rf.id}
              onClick={() => {
                setActiveRow(rf.id);
                playChime("wood");
              }}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeRow === rf.id
                  ? "bg-primary text-on-primary shadow-xs"
                  : "bg-pure-white dark:bg-charcoal text-on-surface hover:bg-surface-container border border-surface-container-high font-medium"
              }`}
            >
              {rf.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Thẻ tiêu điểm ký tự (Hero Spotlight) - Chuẩn Mobile Stitch */}
      <section className="bg-gradient-to-br from-pure-white via-surface-container-lowest to-surface-container-low dark:from-charcoal dark:via-[#202428] dark:to-[#1a1d20] rounded-3xl p-5 border border-surface-container-high shadow-md relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 w-36 h-36 bg-primary-fixed/30 dark:bg-primary/10 rounded-full blur-2xl pointer-events-none" />

        {/* Badge & Action Row */}
        <div className="flex items-center justify-between relative z-10 mb-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span>Tiêu Điểm Hôm Nay</span>
          </div>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {spotlightChar.strokeCount} Nét vẽ ・ Cơ bản
          </span>
        </div>

        {/* Main Character Presentation */}
        <div className="flex items-center gap-5 mt-2">
          {/* Big Kana Display with 3D Effect */}
          <div
            onClick={() => speakJapanese(currentGlyph)}
            className="w-24 h-28 rounded-2xl bg-gradient-to-b from-white to-surface-container-low dark:from-[#2a2e34] dark:to-charcoal border border-outline-variant/60 shadow-[0_8px_16px_-4px_rgba(152,50,36,0.12)] flex flex-col items-center justify-center relative group cursor-pointer hover:scale-105 transition-transform shrink-0"
            title="Nhấn để nghe phát âm"
          >
            <span className="font-jp text-6xl font-bold text-primary tracking-tight transform group-hover:scale-105 transition-transform">
              {currentGlyph}
            </span>
            <span className="text-[11px] font-bold text-on-surface-variant tracking-wider uppercase mt-1">
              {script.toUpperCase()}
            </span>
          </div>

          {/* Pronunciation & Mnemonic Info */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-headline font-extrabold text-on-surface">
                / {spotlightChar.romaji} /
              </span>
              <button
                onClick={() => speakJapanese(currentGlyph)}
                aria-label="Phát âm"
                className="w-9 h-9 rounded-full bg-primary/10 hover:bg-primary/20 text-primary flex items-center justify-center transition-transform active:scale-90 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">volume_up</span>
              </button>
            </div>

            {/* Mnemonic Graphic & Story */}
            <div className="mt-2 bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-700/50 rounded-xl p-2.5 flex items-start gap-2">
              <span className="text-lg leading-none">
                {spotlightChar.id === "a" ? "🍎" : spotlightChar.id === "i" ? "🥢" : spotlightChar.id === "u" ? "👴" : "💡"}
              </span>
              <div className="text-xs leading-relaxed text-amber-950 dark:text-amber-200 font-medium">
                <strong className="text-primary font-bold">Mẹo nhớ:</strong> {spotlightChar.mnemonicDesc}
              </div>
            </div>
          </div>
        </div>

        {/* Example Word & Action CTA */}
        <div className="mt-4 pt-3 border-t border-surface-container flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-on-surface-variant">Từ ví dụ:</span>
            <span className="font-jp font-bold text-sm text-on-surface">
              {spotlightChar.exampleWord} ({spotlightChar.exampleReading})
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate max-w-[110px] sm:max-w-none">
              - {spotlightChar.exampleMeaning}
            </span>
          </div>

          <button
            onClick={() => {
              if (onSelectKanaForPractice) {
                onSelectKanaForPractice(spotlightChar.id, script);
              }
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary hover:bg-vermilion text-on-primary text-xs font-semibold shadow-sm shadow-primary/30 active:scale-95 transition-all cursor-pointer shrink-0"
          >
            <span className="material-symbols-outlined text-[15px]">edit</span>
            <span>Luyện viết</span>
          </button>
        </div>
      </section>

      {/* 4. Lưới thẻ nhớ 3D Kana (Flashcard Grid) - Chuẩn Mobile Stitch */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-headline font-bold text-base text-on-surface">
              Lưới Thẻ Nhớ 3D Kana
            </h2>
            <span className="text-xs font-medium text-slate-400">• Chạm thẻ để lật mẹo</span>
          </div>
          <span className="text-xs font-semibold text-tertiary">
            Đã thuộc {learnedCount}/{kanaList.length}
          </span>
        </div>

        {/* Grid Container 2-col (Mobile) & responsive 3-col on Tablet */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 card-3d-wrap">
          {filteredKana.map((item) => {
            const isFlipped = !!flippedCards[item.id];
            const charGlyph = isHiragana ? item.hiragana : item.katakana;

            return (
              <div
                key={item.id}
                onClick={() => {
                  setSpotlightId(item.id);
                  handleToggleFlip(item.id);
                }}
                className="perspective-800 h-44 cursor-pointer select-none"
              >
                <div
                  className={`relative w-full h-full duration-500 preserve-3d rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.04)] border transition-all ${
                    item.status === "learned"
                      ? "border-emerald-300/60 dark:border-emerald-700/60"
                      : "border-surface-container-high"
                  } ${isFlipped ? "rotate-y-180" : ""}`}
                >
                  {/* FRONT FACE */}
                  <div className="absolute inset-0 w-full h-full backface-hidden bg-pure-white dark:bg-charcoal rounded-2xl p-3.5 flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <button
                        onClick={(e) => handleToggleStatus(item.id, e)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold transition-transform hover:scale-105 ${
                          item.status === "learned"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400"
                            : item.status === "reviewing"
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400"
                            : "bg-surface-container text-slate-600 dark:text-slate-400"
                        }`}
                        title="Chạm để chuyển: Đã thuộc / Đang ôn / Chưa thuộc"
                      >
                        {item.status === "learned"
                          ? "Đã thuộc"
                          : item.status === "reviewing"
                          ? "Đang ôn"
                          : "Chưa thuộc"}
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          speakJapanese(charGlyph);
                        }}
                        className="w-7 h-7 rounded-full text-slate-400 hover:text-primary hover:bg-surface-container flex items-center justify-center transition-colors"
                        title="Phát âm"
                      >
                        <span className="material-symbols-outlined text-[16px]">volume_up</span>
                      </button>
                    </div>

                    <div className="py-1 text-center">
                      <span
                        className={`font-jp text-4xl font-bold block leading-tight ${
                          item.status === "learned" ? "text-primary" : "text-on-surface"
                        }`}
                      >
                        {charGlyph}
                      </span>
                      <span className="font-headline font-bold text-sm text-on-surface">
                        {item.romaji}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-surface-container-high flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                      <span>{item.strokeCount} nét</span>
                      <span className="text-amber-700 dark:text-amber-400 font-medium truncate max-w-[90px]">
                        {item.mnemonicTitle}
                      </span>
                    </div>
                  </div>

                  {/* BACK FACE (MNEMONIC STORY) */}
                  <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-gradient-to-br from-amber-50 to-white dark:from-charcoal dark:to-[#222529] rounded-2xl p-3 flex flex-col justify-between border-2 border-primary">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-jp text-base font-bold text-primary">{charGlyph}</span>
                        <span className="text-xs font-bold text-primary">/{item.romaji}/</span>
                      </div>
                      <p className="text-[11px] text-on-surface-variant mt-1.5 leading-relaxed line-clamp-3">
                        {item.mnemonicDesc}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-amber-200/60 dark:border-amber-800/40 flex items-center justify-between text-[10px]">
                      <span className="text-slate-500 dark:text-slate-400 truncate max-w-[90px]">
                        {item.exampleWord}
                      </span>
                      <span className="text-primary font-bold">Lật lại ↺</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
