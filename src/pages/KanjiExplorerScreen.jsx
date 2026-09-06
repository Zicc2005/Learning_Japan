import React, { useState, useMemo } from "react";
import { KANJI_LIST } from "../data/kanjiStitchData";
import { playChime, speakJapanese } from "../utils/audio";

export const KanjiExplorerScreen = ({
  onSelectKanjiForPractice,
  onAddXP
}) => {
  const [kanjiList, setKanjiList] = useState(KANJI_LIST);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentFilter, setCurrentFilter] = useState("all");
  const [isGridView, setIsGridView] = useState(false);
  const [highlightedId, setHighlightedId] = useState(null);

  // Stroke Order Modal State
  const [modalKanji, setModalKanji] = useState(null);
  const [modalStrokeStep, setModalStrokeStep] = useState(1);
  const [isReplaying, setIsReplaying] = useState(false);

  // Stats calculation
  const masteredCount = useMemo(
    () => kanjiList.filter((k) => k.status === "learned").length,
    [kanjiList]
  );
  const learningCount = useMemo(
    () => kanjiList.filter((k) => k.status === "learning").length,
    [kanjiList]
  );
  const totalCount = kanjiList.length;
  const progressPct = Math.round((masteredCount / totalCount) * 100);

  // Category & search filtering
  const filteredKanji = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return kanjiList.filter((k) => {
      // Search matching
      const matchesSearch =
        q === "" ||
        k.kanji.toLowerCase().includes(q) ||
        k.hanViet.toLowerCase().includes(q) ||
        k.meaning.toLowerCase().includes(q) ||
        (k.onyomi && k.onyomi.some((o) => o.toLowerCase().includes(q))) ||
        (k.kunyomi && k.kunyomi.some((u) => u.toLowerCase().includes(q)));

      // Filter matching
      let matchesFilter = true;
      if (currentFilter === "mastered") {
        matchesFilter = k.status === "learned";
      } else if (currentFilter === "learning") {
        matchesFilter = k.status !== "learned";
      } else if (currentFilter === "nature") {
        matchesFilter = k.category === "nature" || ["日", "月", "火", "水", "木", "金", "土", "山", "川", "田", "雨", "天", "気", "花"].includes(k.kanji);
      } else if (currentFilter === "number") {
        matchesFilter = k.category === "number" || ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "百", "千", "万", "円", "年", "時", "分", "半", "今"].includes(k.kanji);
      } else if (currentFilter === "human") {
        matchesFilter = k.category === "human" || ["人", "男", "女", "子", "父", "母", "友", "目", "耳", "口", "手", "足"].includes(k.kanji);
      }

      return matchesSearch && matchesFilter;
    });
  }, [kanjiList, searchQuery, currentFilter]);

  // Toggle mastery
  const handleToggleMastery = (id, e) => {
    e.stopPropagation();
    setKanjiList((prev) =>
      prev.map((k) => {
        if (k.id === id) {
          const isNowMastered = k.status !== "learned";
          if (isNowMastered) {
            playChime("success");
            onAddXP?.(20);
          } else {
            playChime("wood");
          }
          return {
            ...k,
            status: isNowMastered ? "learned" : "learning"
          };
        }
        return k;
      })
    );
  };

  // Random practice
  const handleRandomPractice = () => {
    playChime("bell");
    const candidates = filteredKanji.length > 0 ? filteredKanji : kanjiList;
    const randomItem = candidates[Math.floor(Math.random() * candidates.length)];
    if (!randomItem) return;

    setHighlightedId(randomItem.id);
    speakJapanese(randomItem.kanji);

    const el = document.getElementById(`kanji-card-${randomItem.id}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => {
        setHighlightedId(null);
      }, 2500);
    }
  };

  // Open Stroke Order Modal
  const handleOpenStrokeModal = (item, e) => {
    e.stopPropagation();
    playChime("wood");
    setModalKanji(item);
    setModalStrokeStep(1);
    setIsReplaying(false);
  };

  const handleReplayStroke = () => {
    playChime("wood");
    setIsReplaying(true);
    setTimeout(() => {
      setIsReplaying(false);
    }, 400);
  };

  return (
    <div className="w-full min-h-screen bg-surface dark:bg-[#131518] text-on-surface dark:text-gray-100 flex flex-col antialiased">
      <div className="max-w-md md:max-w-4xl lg:max-w-6xl mx-auto px-4 md:px-6 py-4 pb-28 md:pb-16 flex flex-col gap-4 w-full">
        {/* 1. Interactive Header Card: Visual Progress & Random Practice */}
        <section className="flex flex-col w-full bg-surface-container-lowest dark:bg-[#1e2126] rounded-2xl p-4 shadow-sm gap-3 border border-surface-container-high/60 dark:border-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[24px]">auto_stories</span>
              </div>
              <div className="flex flex-col">
                <span className="font-headline text-base font-bold text-on-surface dark:text-white tracking-tight">
                  Tiến Độ N5
                </span>
                <span className="text-xs text-secondary dark:text-gray-400 font-medium">
                  {masteredCount} / {totalCount} chữ đã thành thạo
                </span>
              </div>
            </div>
            <button
              onClick={handleRandomPractice}
              className="flex items-center gap-1.5 bg-primary hover:bg-vermilion text-on-primary px-3.5 py-2 rounded-full shadow-sm active:scale-95 transition-all text-xs font-semibold"
            >
              <span className="material-symbols-outlined text-[18px]">shuffle</span>
              <span>Ôn ngẫu nhiên</span>
            </button>
          </div>

          {/* Editorial Progress Bar */}
          <div className="flex flex-col gap-1 mt-1">
            <div className="flex justify-between items-center text-xs text-on-surface-variant dark:text-gray-400">
              <span className="font-medium">Mục tiêu cấp tốc N5</span>
              <span className="font-bold text-primary">{progressPct}%</span>
            </div>
            <div className="w-full h-2.5 bg-surface-container-high dark:bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </section>

        {/* 2. Sticky Search Bar & View Mode Toggle */}
        <div className="sticky top-0 z-30 flex items-center gap-2 bg-surface/95 dark:bg-[#131518]/95 backdrop-blur-md py-2">
          <div className="relative flex-1 flex items-center">
            <span className="material-symbols-outlined absolute left-3.5 text-secondary dark:text-gray-400 text-[20px] pointer-events-none">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm Kanji, Hán Việt, Onyomi, nghĩa..."
              className="w-full h-11 pl-10 pr-9 bg-surface-container-lowest dark:bg-[#1e2126] text-on-surface dark:text-white rounded-full text-xs placeholder:text-secondary dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm transition-all border border-surface-container-high/60 dark:border-white/5"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 w-6 h-6 flex items-center justify-center rounded-full text-secondary hover:text-on-surface dark:hover:text-white"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
          </div>
          <button
            onClick={() => setIsGridView(!isGridView)}
            className="w-11 h-11 shrink-0 bg-surface-container-lowest dark:bg-[#1e2126] text-on-surface-variant dark:text-gray-300 rounded-full flex items-center justify-center shadow-sm active:scale-95 transition-transform border border-surface-container-high/60 dark:border-white/5"
            title="Đổi kiểu hiển thị"
          >
            <span className="material-symbols-outlined text-[20px]">
              {isGridView ? "view_agenda" : "grid_view"}
            </span>
          </button>
        </div>

        {/* 3. Filter Chips (Horizontal Scrollable) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 -mx-4 px-4">
          {[
            { id: "all", label: `Tất cả (${totalCount})` },
            { id: "mastered", label: `Đã thuộc (${masteredCount})` },
            { id: "learning", label: `Đang học (${totalCount - masteredCount})` },
            { id: "nature", label: "🌱 Thiên nhiên" },
            { id: "number", label: "🔢 Số đếm & Thời gian" },
            { id: "human", label: "👤 Con người & Đời sống" }
          ].map((chip) => {
            const isActive = currentFilter === chip.id;
            return (
              <button
                key={chip.id}
                onClick={() => {
                  setCurrentFilter(chip.id);
                  playChime("wood");
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 whitespace-nowrap ${
                  isActive
                    ? "bg-primary text-on-primary shadow-sm"
                    : "bg-surface-container dark:bg-[#1e2126] text-on-surface-variant dark:text-gray-300 hover:bg-surface-container-high dark:hover:bg-white/10"
                }`}
              >
                {chip.label}
              </button>
            );
          })}
        </div>

        {/* 4. Kanji Dynamic Grid (1-Col or 2-Col View) */}
        {filteredKanji.length > 0 ? (
          <div
            className={`w-full transition-all ${
              isGridView
                ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
                : "grid grid-cols-1 md:grid-cols-2 gap-4"
            }`}
          >
            {filteredKanji.map((item) => {
              const isMastered = item.status === "learned";
              const isHighlighted = highlightedId === item.id;

              if (isGridView) {
                // Compact 2-Col Card
                return (
                  <article
                    key={item.id}
                    id={`kanji-card-${item.id}`}
                    onClick={() => speakJapanese(item.kanji)}
                    className={`bg-surface-container-lowest dark:bg-[#1e2126] rounded-2xl p-3.5 shadow-sm border transition-all flex flex-col justify-between cursor-pointer relative group ${
                      isHighlighted
                        ? "border-primary ring-2 ring-primary/40 scale-[1.02]"
                        : "border-surface-container-high/60 dark:border-white/5 hover:border-primary/30"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isMastered
                            ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400"
                            : "bg-surface-container dark:bg-white/10 text-secondary dark:text-gray-400"
                        }`}
                      >
                        {isMastered ? "Đã thuộc" : "Đang học"}
                      </span>
                      <button
                        onClick={(e) => handleToggleMastery(item.id, e)}
                        className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
                          isMastered
                            ? "bg-primary text-on-primary shadow-xs"
                            : "bg-surface-container-high dark:bg-white/10 text-transparent"
                        }`}
                        title="Đánh dấu đã thuộc"
                      >
                        <span className="material-symbols-outlined text-[15px]">check</span>
                      </button>
                    </div>

                    <div className="py-2 text-center">
                      <span className="font-jp text-4xl font-bold text-primary block leading-tight group-hover:scale-105 transition-transform">
                        {item.kanji}
                      </span>
                      <span className="font-headline font-bold text-sm text-on-surface dark:text-white">
                        {item.hanViet}
                      </span>
                      <span className="text-[11px] text-secondary dark:text-gray-400 block line-clamp-1 mt-0.5">
                        {item.meaning}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-surface-container-high/60 dark:border-white/10 flex items-center justify-between text-[11px] text-secondary dark:text-gray-400">
                      <span>{item.strokeCount} nét</span>
                      <button
                        onClick={(e) => handleOpenStrokeModal(item, e)}
                        className="text-primary hover:underline font-semibold flex items-center gap-0.5"
                      >
                        <span className="material-symbols-outlined text-[13px]">draw</span>
                        <span>Nét</span>
                      </button>
                    </div>
                  </article>
                );
              }

              // Detailed 1-Col Card (Standard Stitch Mobile)
              return (
                <article
                  key={item.id}
                  id={`kanji-card-${item.id}`}
                  className={`bg-surface-container-lowest dark:bg-[#1e2126] rounded-2xl p-4 shadow-sm border transition-all flex flex-col gap-3 relative overflow-hidden ${
                    isHighlighted
                      ? "border-primary ring-2 ring-primary/40 scale-[1.01]"
                      : "border-surface-container-high/60 dark:border-white/5 hover:border-primary/30"
                  }`}
                >
                  {/* Top Row: Character Button, Han-Viet, Meaning & Mastery Checkbox */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => speakJapanese(item.kanji)}
                        className="w-16 h-16 rounded-2xl bg-surface-container-low dark:bg-white/5 flex flex-col items-center justify-center text-primary active:scale-95 transition-transform border border-outline-variant/30"
                        title="Nghe phát âm"
                      >
                        <span className="font-headline text-3xl leading-none font-bold select-none text-primary">
                          {item.kanji}
                        </span>
                        <span className="material-symbols-outlined text-[14px] text-secondary dark:text-gray-400 opacity-70 mt-0.5">
                          volume_up
                        </span>
                      </button>

                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-headline text-base font-bold text-on-surface dark:text-white tracking-wide">
                            {item.hanViet}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-surface-container-high dark:bg-white/10 text-on-surface-variant dark:text-gray-300 text-[11px] font-semibold">
                            {item.strokeCount} nét
                          </span>
                        </div>
                        <span className="text-xs text-secondary dark:text-gray-400 font-medium mt-0.5 line-clamp-1">
                          {item.meaning}
                        </span>
                      </div>
                    </div>

                    {/* Mastery Checkbox */}
                    <button
                      onClick={(e) => handleToggleMastery(item.id, e)}
                      className="cursor-pointer select-none p-1"
                      title={isMastered ? "Đã thuộc" : "Đánh dấu đã thuộc"}
                    >
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors shadow-sm ${
                          isMastered
                            ? "bg-primary text-on-primary"
                            : "bg-surface-container-high dark:bg-white/10 text-transparent"
                        }`}
                      >
                        <span className="material-symbols-outlined text-[16px]">check</span>
                      </div>
                    </button>
                  </div>

                  {/* Readings (On / Kun) */}
                  <div className="grid grid-cols-2 gap-2 bg-surface-container-low dark:bg-white/5 p-2.5 rounded-xl text-xs">
                    <div className="flex flex-col">
                      <span className="text-[11px] text-secondary dark:text-gray-400 font-medium">
                        Âm On (Katakana)
                      </span>
                      <span className="font-semibold text-primary font-jp text-xs">
                        {item.onyomi && item.onyomi.length > 0 ? item.onyomi.join(", ") : "—"}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] text-secondary dark:text-gray-400 font-medium">
                        Âm Kun (Hiragana)
                      </span>
                      <span className="font-semibold text-on-surface dark:text-gray-200 font-jp text-xs">
                        {item.kunyomi && item.kunyomi.length > 0 ? item.kunyomi.join(", ") : "—"}
                      </span>
                    </div>
                  </div>

                  {/* Compound Words */}
                  {item.examples && item.examples.length > 0 && (
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[11px] font-medium text-secondary dark:text-gray-400">
                        Từ vựng ghép tiêu biểu:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {item.examples.slice(0, 2).map((ex, idx) => (
                          <div
                            key={idx}
                            onClick={() => speakJapanese(ex.word)}
                            className="flex items-center gap-1 bg-surface-container dark:bg-white/10 px-2.5 py-1 rounded-lg cursor-pointer hover:bg-surface-container-high transition-colors"
                          >
                            <span className="font-bold font-jp text-xs text-primary">{ex.word}</span>
                            <span className="text-[11px] text-secondary dark:text-gray-400">
                              {ex.reading} ({ex.meaning})
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Stroke Order Visual Trigger Action */}
                  <div className="flex items-center justify-between pt-2 border-t border-surface-container-high/50 dark:border-white/10 mt-1">
                    <span className="text-xs text-secondary dark:text-gray-400 italic">
                      {item.radical || "Bộ thủ chuẩn N5"}
                    </span>
                    <button
                      onClick={(e) => handleOpenStrokeModal(item, e)}
                      className="flex items-center gap-1 text-primary hover:text-vermilion text-xs font-semibold active:scale-95 transition-transform"
                    >
                      <span className="material-symbols-outlined text-[16px]">draw</span>
                      <span>Bút thuận</span>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          /* Empty Search Result State */
          <div className="flex flex-col items-center justify-center p-8 text-center bg-surface-container-lowest dark:bg-[#1e2126] rounded-2xl shadow-sm my-4 border border-surface-container-high/60 dark:border-white/5">
            <div className="w-16 h-16 rounded-full bg-surface-container dark:bg-white/10 flex items-center justify-center text-secondary dark:text-gray-400 mb-3">
              <span className="material-symbols-outlined text-[32px]">manage_search</span>
            </div>
            <h3 className="font-headline text-base font-bold text-on-surface dark:text-white">
              Không tìm thấy chữ Hán nào
            </h3>
            <p className="text-xs text-secondary dark:text-gray-400 max-w-xs mt-1 leading-relaxed">
              Hãy thử tìm với từ khóa Hán Việt (như "nhật", "nguyệt"), chữ kanji hoặc phiên âm romaji.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setCurrentFilter("all");
              }}
              className="mt-4 px-4 py-2 bg-primary text-on-primary rounded-full text-xs font-semibold hover:bg-vermilion transition-colors"
            >
              Xóa bộ lọc tìm kiếm
            </button>
          </div>
        )}

        {/* 5. Practice Summary Daily Goal Toast Banner */}
        <div className="flex items-center justify-between p-3.5 bg-surface-container-lowest dark:bg-[#1e2126] rounded-2xl shadow-sm border border-surface-container-high/60 dark:border-white/5">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-primary text-[22px]">verified</span>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-on-surface dark:text-white">Mục tiêu hôm nay</span>
              <span className="text-[11px] text-secondary dark:text-gray-400">
                Học thêm 5 chữ mới để nâng cấp Lv.5
              </span>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-surface-container dark:bg-white/10 flex items-center justify-center text-primary font-bold text-xs">
            +5
          </div>
        </div>
      </div>

      {/* 6. Stroke Order Modal Sheet (Bottom Drawer on Mobile) */}
      {modalKanji && (
        <div
          className="fixed inset-0 z-50 bg-charcoal/60 backdrop-blur-sm flex flex-col justify-end md:justify-center md:items-center p-0 md:p-4 animate-in fade-in duration-200"
          onClick={() => setModalKanji(null)}
        >
          <div
            className="bg-surface-container-lowest dark:bg-[#1e2126] rounded-t-3xl md:rounded-3xl p-5 max-w-md w-full mx-auto shadow-2xl flex flex-col gap-4 border border-surface-container-high/60 dark:border-white/10 animate-in slide-in-from-bottom duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[20px]">gesture</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-headline text-base font-bold text-on-surface dark:text-white">
                    Luyện Bút Thuận
                  </span>
                  <span className="text-xs text-secondary dark:text-gray-400">
                    {modalKanji.hanViet} ({modalKanji.meaning}) • {modalKanji.strokeCount} nét
                  </span>
                </div>
              </div>
              <button
                onClick={() => setModalKanji(null)}
                className="w-8 h-8 rounded-full bg-surface-container-low dark:bg-white/10 flex items-center justify-center text-secondary dark:text-gray-400 hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Canvas Simulation Area with Mi Zi Ge Grid */}
            <div className="w-full aspect-square max-h-64 bg-surface-container-low dark:bg-[#15171b] rounded-2xl flex flex-col items-center justify-center relative overflow-hidden border border-outline-variant/30">
              {/* Watermark Guide Grid */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-current opacity-20 text-slate-gray" fill="none" viewBox="0 0 100 100">
                <rect x="4" y="4" width="92" height="92" strokeDasharray="2,2" strokeWidth="0.8" />
                <line x1="50" y1="0" x2="50" y2="100" strokeDasharray="3,3" strokeWidth="0.8" />
                <line x1="0" y1="50" x2="100" y2="50" strokeDasharray="3,3" strokeWidth="0.8" />
                <line x1="0" y1="0" x2="100" y2="100" strokeDasharray="2,4" strokeWidth="0.6" />
                <line x1="100" y1="0" x2="0" y2="100" strokeDasharray="2,4" strokeWidth="0.6" />
              </svg>

              {/* Character Display with Replay Bounce */}
              <span
                className={`text-[120px] font-bold font-jp text-primary select-none leading-none transition-all duration-300 ${
                  isReplaying ? "scale-75 opacity-50" : "scale-100 opacity-100"
                }`}
              >
                {modalKanji.kanji}
              </span>

              {/* Stroke rule pill */}
              <div className="absolute bottom-3 flex items-center gap-1.5 bg-surface/90 dark:bg-[#1e2126]/90 px-3 py-1 rounded-full shadow-sm text-xs font-medium text-on-surface-variant dark:text-gray-300">
                <span className="material-symbols-outlined text-primary text-[16px]">touch_app</span>
                <span>
                  {modalKanji.strokeRules && modalKanji.strokeRules[modalStrokeStep - 1]
                    ? modalKanji.strokeRules[modalStrokeStep - 1]
                    : `Nét ${modalStrokeStep} / ${modalKanji.strokeCount}: Khởi bút từ trên xuống`}
                </span>
              </div>
            </div>

            {/* Animation Control Actions */}
            <div className="flex items-center justify-between gap-3">
              <button
                onClick={handleReplayStroke}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-surface-container dark:bg-white/10 text-on-surface dark:text-white text-xs font-semibold rounded-xl active:scale-95 transition-transform"
              >
                <span className="material-symbols-outlined text-[18px]">replay</span>
                <span>Phát lại</span>
              </button>
              <button
                onClick={() => {
                  const id = modalKanji.id;
                  setModalKanji(null);
                  onSelectKanjiForPractice(id);
                }}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-primary text-on-primary text-xs font-semibold rounded-xl active:scale-95 transition-transform shadow-sm hover:bg-vermilion"
              >
                <span className="material-symbols-outlined text-[18px]">draw</span>
                <span>Vào Bàn Viết</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
