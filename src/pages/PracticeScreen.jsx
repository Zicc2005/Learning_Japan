import React, { useRef, useState, useEffect, useMemo, useCallback } from "react";
import hiraganaList from "../../data/kana/hiragana.json";
import katakanaList from "../../data/kana/katakana.json";
import { KANJI_N5_COMPLETE } from "../data/kanjiN5Complete";
import { RADICALS_214 } from "../data/radicals214";
import { sounds } from "../utils/soundEffects";
import { speakJapanese } from "../utils/audio";
import {
  validateStrokeDrawing,
  extractStrokeEndpoints,
  sampleSvgPath
} from "../utils/strokeMatcher";
import confetti from "canvas-confetti";

export const PracticeScreen = ({
  onAddXP,
  selectedKanjiId = "kanji-1",
  onNavigate
}) => {
  // Dynamic Dark Mode Observer
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof document !== "undefined") {
      return document.documentElement.classList.contains("dark");
    }
    return false;
  });

  useEffect(() => {
    const checkTheme = () => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"]
    });
    return () => observer.disconnect();
  }, []);

  // 1. Script Category & Topic Selection
  const [activeScript, setActiveScript] = useState("hiragana"); // 'hiragana' | 'katakana' | 'kanji' | 'radicals'
  const [kanjiTopic, setKanjiTopic] = useState("all"); // 'all' | 'date_number' | 'nature' | 'direction_life'
  const [searchQuery, setSearchQuery] = useState("");

  // Indices for each tab
  const [currentKanjiIndex, setCurrentKanjiIndex] = useState(0);
  const [currentHiraIndex, setCurrentHiraIndex] = useState(5); // Default to 'か' (#6, index 5)
  const [currentKataIndex, setCurrentKataIndex] = useState(0);
  const [currentRadicalIndex, setCurrentRadicalIndex] = useState(0);

  // Track Mastered Characters (backed by localStorage)
  const [masteredChars, setMasteredChars] = useState(() => {
    try {
      const saved = localStorage.getItem("nihon_mastered_chars");
      if (saved) {
        return new Set(JSON.parse(saved));
      }
    } catch {}
    return new Set(["あ", "い", "う", "え", "お"]);
  });

  const markCharMastered = useCallback((char) => {
    setMasteredChars((prev) => {
      const next = new Set(prev);
      next.add(char);
      try {
        localStorage.setItem("nihon_mastered_chars", JSON.stringify([...next]));
      } catch {}
      return next;
    });
  }, []);

  // Synchronize when selectedKanjiId changes
  useEffect(() => {
    if (selectedKanjiId) {
      const cleanId = String(selectedKanjiId).replace(/^kanji-/, "");
      const idx = KANJI_N5_COMPLETE.findIndex(
        (k) => k.kanji === cleanId || `kanji-${k.kanji}` === selectedKanjiId
      );
      if (idx !== -1) {
        setActiveScript("kanji");
        setCurrentKanjiIndex(idx);
      }
    }
  }, [selectedKanjiId]);

  // Filtered lists
  const currentList = useMemo(() => {
    let list = [];
    if (activeScript === "kanji") {
      list = kanjiTopic === "all" ? KANJI_N5_COMPLETE : KANJI_N5_COMPLETE.filter((k) => k.topic === kanjiTopic);
    } else if (activeScript === "hiragana") {
      list = hiraganaList;
    } else if (activeScript === "katakana") {
      list = katakanaList;
    } else {
      list = RADICALS_214;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(
        (item) =>
          (item.char && item.char.includes(q)) ||
          (item.kanji && item.kanji.includes(q)) ||
          (item.radical && item.radical.includes(q)) ||
          (item.romaji && item.romaji.toLowerCase().includes(q)) ||
          (item.hanviet && item.hanviet.toLowerCase().includes(q)) ||
          (item.meaning && item.meaning.toLowerCase().includes(q))
      );
    }
    return list;
  }, [activeScript, kanjiTopic, searchQuery]);

  // Current Active Character Object Normalized
  const currentCharData = useMemo(() => {
    if (activeScript === "kanji") {
      const list = currentList.length > 0 ? currentList : KANJI_N5_COMPLETE;
      const safeIdx = Math.min(currentKanjiIndex, list.length - 1);
      const k = list[safeIdx] || list[0] || KANJI_N5_COMPLETE[0];
      return {
        id: `kanji-${k.kanji}`,
        char: k.kanji,
        hanViet: k.hanviet,
        codeLabel: `Kanji N5 #${safeIdx + 1}`,
        typeLabel: "Chữ Hán N5",
        strokeCount: k.strokes || (k.strokeSvgPaths ? k.strokeSvgPaths.length : 4),
        radical: k.radical || "Bộ thủ",
        meaning: k.meaning,
        onyomi: k.onyomi || [],
        kunyomi: k.kunyomi || [],
        romaji: (k.onyomi && k.onyomi[0]) || (k.kunyomi && k.kunyomi[0]) || k.hanviet,
        mouthShape: `Âm Hán: ${k.hanviet}. Đọc On: ${(k.onyomi || []).join(", ") || "—"}`,
        mnemonic: k.mnemonicStory || "Tập trung nét bút thuận từ trên xuống dưới, từ trái sang phải.",
        examples: (k.compounds || []).map((cp) => ({
          word: cp.word,
          hanviet: cp.hanviet || "",
          meaning: cp.meaning
        })),
        strokeSvgPaths: k.strokeSvgPaths || [
          "M 30 25 L 30 85",
          "M 30 25 L 75 25 L 75 85",
          "M 30 55 L 75 55",
          "M 30 85 L 75 85"
        ],
        strokeRules: k.strokeRules || [
          "Nét 1: Sổ thẳng bên trái",
          "Nét 2: Ngang gập sang phải và sổ xuống",
          "Nét 3: Ngang giữa",
          "Nét 4: Ngang đóng đáy"
        ]
      };
    } else if (activeScript === "hiragana") {
      const list = currentList.length > 0 ? currentList : hiraganaList;
      const safeIdx = Math.min(currentHiraIndex, list.length - 1);
      const item = list[safeIdx] || list[0] || hiraganaList[0];
      return {
        id: `hira-${item.romaji}`,
        char: item.char,
        hanViet: item.romaji.toUpperCase(),
        codeLabel: `JLPT N5 Kana`,
        typeLabel: "Bảng: Hiragana",
        strokeCount: item.strokeCount || (item.strokeSvgPaths ? item.strokeSvgPaths.length : 1),
        radical: "Bảng âm chuẩn",
        meaning: `Phát âm: ${item.romaji}`,
        onyomi: [item.romaji],
        kunyomi: [item.romaji],
        romaji: item.romaji,
        mouthShape: `Âm "${item.romaji[0] || "a"}" bật nhẹ kết hợp "${item.romaji.slice(-1)}", rõ ràng`,
        mnemonic:
          item.mnemonic?.story ||
          item.mnemonic?.title ||
          `Chữ ${item.char} (${item.romaji}): Hãy nhớ hình dáng uốn lượn đặc trưng của nét bút mềm.`,
        examples: (item.examples || []).map((ex) => ({
          word: ex.word,
          hanviet: ex.hanviet || "",
          meaning: ex.meaning
        })),
        strokeSvgPaths: item.strokeSvgPaths || [],
        strokeRules:
          item.strokeRules || (item.strokeSvgPaths || []).map((_, i) => `Nét ${i + 1}: Nét vuốt thứ ${i + 1}`)
      };
    } else if (activeScript === "katakana") {
      const list = currentList.length > 0 ? currentList : katakanaList;
      const safeIdx = Math.min(currentKataIndex, list.length - 1);
      const item = list[safeIdx] || list[0] || katakanaList[0];
      return {
        id: `kata-${item.romaji}`,
        char: item.char,
        hanViet: item.romaji.toUpperCase(),
        codeLabel: `JLPT N5 Kana`,
        typeLabel: "Bảng: Katakana",
        strokeCount: item.strokeCount || (item.strokeSvgPaths ? item.strokeSvgPaths.length : 1),
        radical: "Bảng chữ cứng",
        meaning: `Phát âm: ${item.romaji}`,
        onyomi: [item.romaji],
        kunyomi: [item.romaji],
        romaji: item.romaji,
        mouthShape: `Âm ngắt gọn, rõ ràng theo bảng chữ Katakana`,
        mnemonic:
          item.mnemonic?.story ||
          item.mnemonic?.title ||
          `Chữ ${item.char} (${item.romaji}): Các đường nét thẳng, gãy khúc dứt khoát.`,
        examples: (item.examples || []).map((ex) => ({
          word: ex.word,
          hanviet: ex.hanviet || "",
          meaning: ex.meaning
        })),
        strokeSvgPaths: item.strokeSvgPaths || [],
        strokeRules:
          item.strokeRules || (item.strokeSvgPaths || []).map((_, i) => `Nét ${i + 1}: Nét gãy dứt khoát ${i + 1}`)
      };
    } else {
      const list = currentList.length > 0 ? currentList : RADICALS_214;
      const safeIdx = Math.min(currentRadicalIndex, list.length - 1);
      const r = list[safeIdx] || list[0] || RADICALS_214[0];
      return {
        id: `radical-${r.num}`,
        char: r.radical,
        hanViet: r.hanviet,
        codeLabel: `Bộ #${r.num}`,
        typeLabel: "214 Bộ Thủ",
        strokeCount: r.strokes,
        radical: `${r.strokes} nét`,
        meaning: r.meaning,
        onyomi: [r.romaji || ""],
        kunyomi: [r.pinyin || ""],
        romaji: r.romaji || r.hanviet,
        mouthShape: `Bộ thủ hình thành chữ Hán: ${r.meaning}`,
        mnemonic: `Bộ thủ ${r.hanviet}: ${r.meaning}. Thành tố cấu tạo nên hàng trăm chữ Hán N5.`,
        examples: [{ word: r.radical, hanviet: r.hanviet, meaning: r.meaning }],
        strokeSvgPaths: [],
        strokeRules: [`1. Viết tự do đè lên chữ mẫu mờ của bộ ${r.hanviet}`]
      };
    }
  }, [activeScript, kanjiTopic, currentList, currentKanjiIndex, currentHiraIndex, currentKataIndex, currentRadicalIndex]);

  // Next Character Object for the Big Green CTA Button
  const nextCharItem = useMemo(() => {
    let list = [];
    let nextIdx = 0;
    if (activeScript === "kanji") {
      list = currentList.length > 0 ? currentList : KANJI_N5_COMPLETE;
      nextIdx = (currentKanjiIndex + 1) % list.length;
    } else if (activeScript === "hiragana") {
      list = currentList.length > 0 ? currentList : hiraganaList;
      nextIdx = (currentHiraIndex + 1) % list.length;
    } else if (activeScript === "katakana") {
      list = currentList.length > 0 ? currentList : katakanaList;
      nextIdx = (currentKataIndex + 1) % list.length;
    } else {
      list = currentList.length > 0 ? currentList : RADICALS_214;
      nextIdx = (currentRadicalIndex + 1) % list.length;
    }
    const item = list[nextIdx] || list[0];
    return {
      char: item.kanji || item.char || item.radical,
      romaji: item.romaji || item.hanviet || "",
      strokes: item.strokes || item.strokeCount || (item.strokeSvgPaths ? item.strokeSvgPaths.length : 3),
      index: nextIdx
    };
  }, [activeScript, currentList, currentKanjiIndex, currentHiraIndex, currentKataIndex, currentRadicalIndex]);

  // Coordinate Space: 100 for Kanji, 220 for Kana
  const charBox = useMemo(() => {
    const paths = currentCharData.strokeSvgPaths || [];
    if (paths.length === 0) {
      return { size: 100, viewBox: "0 0 100 100" };
    }
    let maxCoord = 0;
    paths.forEach((p) => {
      const nums = p.match(/[\d.]+/g) || [];
      nums.forEach((n) => {
        const v = parseFloat(n);
        if (v > maxCoord) maxCoord = v;
      });
    });
    if (maxCoord <= 110) {
      return { size: 100, viewBox: "0 0 100 100" };
    } else {
      return { size: 220, viewBox: "0 14 220 220" };
    }
  }, [currentCharData]);

  // Canvas & Tools State
  const canvasRef = useRef(null);
  const queueListRef = useRef(null);
  const isDrawingRef = useRef(false);
  const userPointsRef = useRef([]);

  const [brushType, setBrushType] = useState("felt"); // 'felt' | 'brush'
  const [brushSize, setBrushSize] = useState("medium"); // 'small' | 'medium' | 'large'
  const [isGhostVisible, setIsGhostVisible] = useState(true);
  const [currentStrokeIdx, setCurrentStrokeIdx] = useState(0);
  const [completedStrokes, setCompletedStrokes] = useState([]);
  const [accuracyScore, setAccuracyScore] = useState(96);
  const [strokeFailCount, setStrokeFailCount] = useState(0);
  const [statusFeedback, setStatusFeedback] = useState("Sẵn sàng! Vuốt nét theo chỉ dẫn.");
  const [shakeCanvas, setShakeCanvas] = useState(false);
  const [isDemoPlaying, setIsDemoPlaying] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  // Active expected SVG path and endpoints for current stroke
  const currentExpectedSvg = useMemo(() => {
    const paths = currentCharData.strokeSvgPaths || [];
    if (!paths || paths.length === 0) return null;
    return paths[currentStrokeIdx] || null;
  }, [currentCharData, currentStrokeIdx]);

  const currentEndpoints = useMemo(() => {
    if (!currentExpectedSvg) return { start: null, end: null };
    return extractStrokeEndpoints(currentExpectedSvg);
  }, [currentExpectedSvg]);

  // Clear Canvas
  const clearUserCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, []);

  // Setup High-DPI Canvas
  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.width = Math.round((rect.width || 420) * dpr);
    canvas.height = Math.round((rect.height || 420) * dpr);
    ctx.scale(dpr, dpr);
    clearUserCanvas();
  }, [clearUserCanvas]);

  useEffect(() => {
    setupCanvas();
    window.addEventListener("resize", setupCanvas);
    return () => window.removeEventListener("resize", setupCanvas);
  }, [setupCanvas]);

  // Reset when character or dark mode changes
  useEffect(() => {
    setCurrentStrokeIdx(0);
    setCompletedStrokes([]);
    setStrokeFailCount(0);
    userPointsRef.current = [];
    clearUserCanvas();
    const rule1 =
      currentCharData.strokeRules && currentCharData.strokeRules[0]
        ? currentCharData.strokeRules[0]
        : "Vuốt nét 1 từ điểm bắt đầu";
    setStatusFeedback(`Nét 1/${currentCharData.strokeCount}: ${rule1}`);

    if (queueListRef.current) {
      const activeEl = queueListRef.current.querySelector(`[data-char="${currentCharData.char}"]`);
      if (activeEl) {
        activeEl.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    }
  }, [currentCharData.id, currentCharData.char, currentCharData.strokeCount, currentCharData.strokeRules, clearUserCanvas]);

  // Clear user canvas on theme change to prevent artifacts
  useEffect(() => {
    clearUserCanvas();
  }, [isDarkMode, clearUserCanvas]);

  // Coordinate helper strictly within canvas bounds
  const getCoords = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0, time: Date.now() };
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX ?? (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
    const clientY = e.clientY ?? (e.touches && e.touches[0] ? e.touches[0].clientY : 0);
    return {
      x: Math.max(0, Math.min(rect.width, clientX - rect.left)),
      y: Math.max(0, Math.min(rect.height, clientY - rect.top)),
      time: Date.now()
    };
  };

  // Drawing Handlers
  const handlePointerDown = (e) => {
    if (isDemoPlaying) return;
    e.preventDefault();
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (_) {}

    sounds.init();

    const canvas = canvasRef.current;
    if (!canvas) return;
    isDrawingRef.current = true;

    const pt = getCoords(e);
    userPointsRef.current = [pt];

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.beginPath();
    ctx.moveTo(pt.x, pt.y);
  };

  const handlePointerMove = (e) => {
    if (!isDrawingRef.current || isDemoPlaying) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const pt = getCoords(e);
    const pts = userPointsRef.current;
    const last = pts[pts.length - 1];
    if (last && Math.hypot(pt.x - last.x, pt.y - last.y) < 1.5) {
      return;
    }

    pts.push(pt);

    // Dynamic stroke ink: white on dark canvas, traditional Sumi ink (#1A1D20) on light washi canvas
    ctx.strokeStyle = isDarkMode ? "#ffffff" : "#1A1D20";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    const baseWidth = brushSize === "small" ? 6 : brushSize === "large" ? 13 : 9;

    if (brushType === "felt") {
      ctx.lineWidth = baseWidth;
    } else {
      const prev = pts[pts.length - 2] || pt;
      const dist = Math.hypot(pt.x - prev.x, pt.y - prev.y);
      const timeDiff = Math.max(pt.time - prev.time, 1);
      const speed = dist / timeDiff;
      ctx.lineWidth = Math.max(baseWidth * 0.5, Math.min(baseWidth * 1.6, baseWidth * 1.3 - speed * 2.5));
    }

    if (pts.length >= 3) {
      const pPrev = pts[pts.length - 2];
      const pMid = {
        x: (pPrev.x + pt.x) / 2,
        y: (pPrev.y + pt.y) / 2
      };
      ctx.quadraticCurveTo(pPrev.x, pPrev.y, pMid.x, pMid.y);
    } else {
      ctx.lineTo(pt.x, pt.y);
    }
    ctx.stroke();
  };

  const handlePointerUp = (e) => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (_) {}

    const canvas = canvasRef.current;
    if (!canvas) return;

    const points = [...userPointsRef.current];

    if (points.length >= 3 && currentExpectedSvg) {
      const rect = canvas.getBoundingClientRect();
      const validation = validateStrokeDrawing(
        points,
        currentExpectedSvg,
        rect.width,
        rect.height,
        charBox.size
      );

      if (validation.isValid) {
        clearUserCanvas();
        sounds.playCorrectStroke();
        if (typeof navigator !== "undefined" && navigator.vibrate) {
          navigator.vibrate([40]);
        }
        setStrokeFailCount(0);

        const earnedAcc = Math.max(92, Math.min(100, Math.round(validation.accuracy || 96)));
        setAccuracyScore(earnedAcc);

        const nextCompleted = [...completedStrokes, currentStrokeIdx];
        setCompletedStrokes(nextCompleted);

        if (nextCompleted.length >= currentCharData.strokeCount) {
          sounds.playCharacterComplete();
          if (typeof navigator !== "undefined" && navigator.vibrate) {
            navigator.vibrate([100, 50, 150]);
          }
          confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
          setStatusFeedback(
            `✓ Xuất sắc! Bạn đã viết hoàn chỉnh chữ "${currentCharData.char}" chuẩn 100%... AI Stroke: ${earnedAcc}%`
          );
          markCharMastered(currentCharData.char);
          onAddXP?.(35);
        } else {
          const nextIdx = currentStrokeIdx + 1;
          setCurrentStrokeIdx(nextIdx);
          const nextRule =
            currentCharData.strokeRules && currentCharData.strokeRules[nextIdx]
              ? currentCharData.strokeRules[nextIdx]
              : `Tiếp tục nét ${nextIdx + 1}`;
          setStatusFeedback(`✓ Nét ${currentStrokeIdx + 1} chuẩn xác (${earnedAcc}%)! ${nextRule}`);
        }
      } else {
        clearUserCanvas();
        sounds.playWrongStroke();
        if (typeof navigator !== "undefined" && navigator.vibrate) {
          navigator.vibrate([80, 50, 80]);
        }
        setShakeCanvas(true);
        setTimeout(() => setShakeCanvas(false), 400);

        const nextFails = strokeFailCount + 1;
        setStrokeFailCount(nextFails);

        if (nextFails >= 3) {
          setStatusFeedback(
            `⚠️ Sai ${nextFails} lần! Mũi tên vuốt hướng dẫn đã kích hoạt: Vuốt theo vệt sáng từ điểm [${currentStrokeIdx + 1}]!`
          );
        } else {
          setStatusFeedback(validation.reason || "Nét vẽ chưa khớp mẫu. Hãy đưa bút từ điểm đỏ tròn!");
        }
      }
    } else if (points.length >= 3 && !currentExpectedSvg) {
      clearUserCanvas();
      sounds.playCorrectStroke();
      const nextCompleted = [...completedStrokes, currentStrokeIdx];
      setCompletedStrokes(nextCompleted);
      setAccuracyScore(96);

      if (nextCompleted.length >= currentCharData.strokeCount) {
        sounds.playCharacterComplete();
        confetti({ particleCount: 75, spread: 65, origin: { y: 0.6 } });
        setStatusFeedback(`✓ Xuất sắc! Hoàn tất luyện tập bộ thủ ${currentCharData.char}!`);
        markCharMastered(currentCharData.char);
        onAddXP?.(25);
      } else {
        const nextIdx = currentStrokeIdx + 1;
        setCurrentStrokeIdx(nextIdx);
        setStatusFeedback(`✓ Nét ${nextIdx}/${currentCharData.strokeCount} đã viết.`);
      }
    } else {
      clearUserCanvas();
    }
    userPointsRef.current = [];
  };

  // Play Sensei Stroke Demo Animation
  const playSenseiDemo = () => {
    if (isDemoPlaying || !currentExpectedSvg) return;
    setIsDemoPlaying(true);
    sounds.playClick();

    const sample = sampleSvgPath(currentExpectedSvg, 36);
    if (!sample || !sample.points || sample.points.length < 2) {
      setIsDemoPlaying(false);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) {
      setIsDemoPlaying(false);
      return;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setIsDemoPlaying(false);
      return;
    }

    const rect = canvas.getBoundingClientRect();
    let step = 0;
    clearUserCanvas();

    const interval = setInterval(() => {
      if (step >= sample.points.length - 1) {
        clearInterval(interval);
        setTimeout(() => {
          clearUserCanvas();
          setIsDemoPlaying(false);
          setStatusFeedback("Đến lượt bạn! Hãy đưa bút từ điểm tròn đỏ theo đường mẫu.");
        }, 500);
        return;
      }

      const p1 = sample.points[step];
      const p2 = sample.points[step + 1];
      const c1 = {
        x: (p1.x / charBox.size) * rect.width,
        y: (p1.y / charBox.size) * rect.height
      };
      const c2 = {
        x: (p2.x / charBox.size) * rect.width,
        y: (p2.y / charBox.size) * rect.height
      };

      ctx.strokeStyle = "#ff2d55";
      ctx.lineWidth = 10;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(c1.x, c1.y);
      ctx.lineTo(c2.x, c2.y);
      ctx.stroke();

      step++;
    }, 22);
  };

  // Navigation & Actions
  const handleClear = () => {
    sounds.playClick();
    userPointsRef.current = [];
    setCurrentStrokeIdx(0);
    setCompletedStrokes([]);
    setStrokeFailCount(0);
    clearUserCanvas();
    const rule1 =
      currentCharData.strokeRules && currentCharData.strokeRules[0]
        ? currentCharData.strokeRules[0]
        : "Vuốt nét 1 từ điểm bắt đầu";
    setStatusFeedback(`Đã xóa sạch! Nét 1/${currentCharData.strokeCount}: ${rule1}`);
  };

  const handleUndo = () => {
    sounds.playClick();
    if (completedStrokes.length > 0) {
      setCompletedStrokes((prev) => prev.slice(0, -1));
      const prevIdx = Math.max(0, currentStrokeIdx - 1);
      setCurrentStrokeIdx(prevIdx);
      const rule =
        currentCharData.strokeRules && currentCharData.strokeRules[prevIdx]
          ? currentCharData.strokeRules[prevIdx]
          : `Nét ${prevIdx + 1}`;
      setStatusFeedback(`Đã hoàn tác! Nét ${prevIdx + 1}/${currentCharData.strokeCount}: ${rule}`);
    }
    clearUserCanvas();
  };

  const handleSelectChar = (item) => {
    sounds.playClick();
    if (activeScript === "kanji") {
      const idx = KANJI_N5_COMPLETE.findIndex((k) => k.kanji === (item.kanji || item.char));
      if (idx !== -1) setCurrentKanjiIndex(idx);
    } else if (activeScript === "hiragana") {
      const idx = hiraganaList.findIndex((h) => h.char === (item.char || item.kanji));
      if (idx !== -1) setCurrentHiraIndex(idx);
    } else if (activeScript === "katakana") {
      const idx = katakanaList.findIndex((k) => k.char === (item.char || item.kanji));
      if (idx !== -1) setCurrentKataIndex(idx);
    } else {
      const idx = RADICALS_214.findIndex((r) => r.radical === (item.radical || item.char));
      if (idx !== -1) setCurrentRadicalIndex(idx);
    }
  };

  const handleNextChar = () => {
    sounds.playClick();
    if (activeScript === "kanji") {
      const list = currentList.length > 0 ? currentList : KANJI_N5_COMPLETE;
      setCurrentKanjiIndex((prev) => (prev + 1) % list.length);
    } else if (activeScript === "hiragana") {
      const list = currentList.length > 0 ? currentList : hiraganaList;
      setCurrentHiraIndex((prev) => (prev + 1) % list.length);
    } else if (activeScript === "katakana") {
      const list = currentList.length > 0 ? currentList : katakanaList;
      setCurrentKataIndex((prev) => (prev + 1) % list.length);
    } else {
      const list = currentList.length > 0 ? currentList : RADICALS_214;
      setCurrentRadicalIndex((prev) => (prev + 1) % list.length);
    }
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      if (e.code === "Space") {
        e.preventDefault();
        playSenseiDemo();
      } else if (e.code === "KeyZ" || (e.ctrlKey && e.code === "KeyZ")) {
        e.preventDefault();
        handleUndo();
      } else if (e.code === "Enter") {
        e.preventDefault();
        if (completedStrokes.length >= currentCharData.strokeCount) {
          handleNextChar();
        } else {
          sounds.playClick();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  // Calculate Roadmap Mini Progress
  const roadmapDayInfo = useMemo(() => {
    const char = currentCharData.char;
    let day = 1;
    let title = "Ngày 1: Khai Môn 5 Nguyên Âm [あ, い, う, え, お]";
    let targetChars = ["あ", "い", "う", "え", "お"];

    if (["か", "き", "く", "け", "こ"].includes(char)) {
      day = 2;
      title = "Ngày 2: Hàng Ka か・き・く・け・こ";
      targetChars = ["か", "き", "く", "け", "こ"];
    } else if (["さ", "し", "す", "せ", "そ"].includes(char)) {
      day = 3;
      title = "Ngày 3: Hàng Sa さ・し・す・せ・そ";
      targetChars = ["さ", "し", "す", "せ", "そ"];
    } else if (["た", "ち", "つ", "て", "と"].includes(char)) {
      day = 4;
      title = "Ngày 4: Hàng Ta た・ち・つ・て・と";
      targetChars = ["た", "ち", "つ", "て", "と"];
    }

    const completedInDay = targetChars.filter((c) => masteredChars.has(c)).length;
    const isDayDone = completedInDay >= targetChars.length;

    return {
      day,
      title,
      targetChars,
      completedInDay,
      isDayDone
    };
  }, [currentCharData.char, masteredChars]);

  // Colors for completed strokes: Sumi black in light mode, crisp white in dark mode
  const completedStrokeColor = isDarkMode ? "#ffffff" : "#1A1D20";
  const pendingGhostColor = isDarkMode ? "#64748b" : "#94a3b8";

  return (
    <div className="w-full min-h-screen bg-[#f8f9fd] text-[#191c1f] dark:bg-[#070a11] dark:text-slate-100 flex flex-col antialiased selection:bg-rose-500 selection:text-white transition-colors duration-300">
      {/* ================= 1. TOP HEADER NAVIGATION RIBBON ================= */}
      <header className="w-full border-b border-slate-200/90 dark:border-slate-800/80 bg-white/90 dark:bg-[#0a0e18]/90 backdrop-blur-md px-3 lg:px-6 py-2.5 flex flex-wrap lg:flex-nowrap items-center justify-between gap-3 sticky top-0 z-30 shadow-sm transition-colors duration-300">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {[
            { id: "hiragana", label: "Hiragana 46" },
            { id: "katakana", label: "Katakana 46" },
            { id: "kanji", label: "Kanji N5 53" },
            { id: "radicals", label: "214 Bộ Thủ Tùy chọn 212" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                sounds.playClick();
                setActiveScript(tab.id);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeScript === tab.id
                  ? "bg-[#ff2d55] text-white shadow-md shadow-rose-950/30 border border-rose-400/50"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 dark:bg-[#101522] dark:text-slate-400 dark:hover:text-white dark:border-slate-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Center Subtitle Banner */}
        <div className="hidden xl:flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 truncate font-medium">
          <span className="text-rose-500 dark:text-rose-400 font-jp font-bold">
            {activeScript === "hiragana"
              ? "あいうえお"
              : activeScript === "katakana"
              ? "アイウエオ"
              : activeScript === "kanji"
              ? "一二三四五"
              : "一部二部"}
          </span>
          <span>•</span>
          <span className="text-slate-600 dark:text-slate-300 truncate">
            {activeScript === "hiragana"
              ? "Bảng chữ mềm cơ bản Gojuon • 46 âm tiết tiêu chuẩn Nhật Bản"
              : activeScript === "katakana"
              ? "Bảng chữ cứng Katakana • Dành cho từ mượn quốc tế"
              : activeScript === "kanji"
              ? "103 Chữ Hán N5 cốt lõi • Đầy đủ bút thuận và bộ thủ"
              : "214 Bộ Thủ Khang Hy • Gốc rễ tạo dựng toàn bộ Hán tự"}
          </span>
        </div>

        {/* Right Search Input & Quick Picker Modal Button */}
        <div className="flex items-center gap-2 ml-auto">
          <div className="relative">
            <span className="material-symbols-outlined text-[16px] text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm Kanji, Hán Việt, Romaji..."
              className="w-44 sm:w-56 pl-8 pr-3 py-1 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 dark:bg-[#101522] dark:border-slate-800 dark:text-slate-200 dark:placeholder-slate-500 focus:outline-none focus:border-rose-500"
            />
          </div>

          <button
            onClick={() => {
              sounds.playClick();
              setShowPicker(true);
            }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 dark:bg-[#171d2b] dark:hover:bg-[#20283b] dark:border-slate-700 dark:text-slate-200 text-xs font-bold transition cursor-pointer"
            title="Mở bảng tra cứu ký tự"
          >
            <span className="material-symbols-outlined text-[15px] text-rose-500 dark:text-rose-400">grid_view</span>
            <span className="text-rose-600 dark:text-rose-300 font-mono">
              #{activeScript === "hiragana"
                ? currentHiraIndex + 1
                : activeScript === "katakana"
                ? currentKataIndex + 1
                : activeScript === "kanji"
                ? currentKanjiIndex + 1
                : currentRadicalIndex + 1}
              /{currentList.length}
            </span>
            <span className="hidden sm:inline">Bảng Chữ</span>
          </button>
        </div>
      </header>

      {/* ================= 2. MAIN 3-COLUMN DESKTOP PRACTICE STUDIO ================= */}
      <main className="w-full flex-1 max-w-[1640px] mx-auto p-3 lg:p-4 pb-24 md:pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-start">
          {/* ================= COL 1: IDENTITY & STROKE BREAKDOWN (3 COLS) ================= */}
          <section className="lg:col-span-3 flex flex-col gap-3" data-purpose="character-identity-column">
            {/* 1. Character Identity Card */}
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-sm dark:bg-[#0f131d] dark:border-slate-800/90 dark:shadow-xl flex flex-col gap-3 transition-colors duration-300">
              <div className="flex items-center gap-3">
                {/* Large Character Box with Audio Synthesis */}
                <button
                  onClick={() => {
                    sounds.playClick();
                    speakJapanese(currentCharData.char);
                  }}
                  className="w-16 h-16 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-700 dark:bg-gradient-to-br dark:from-rose-950/70 dark:to-[#181122] dark:border-rose-500/80 dark:text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-transform group relative cursor-pointer shadow-sm"
                  title="Bấm để nghe phát âm Sensei chuẩn"
                >
                  <span className="font-jp text-4xl font-bold leading-none">{currentCharData.char}</span>
                  <span className="material-symbols-outlined text-[14px] text-rose-500 dark:text-rose-300 opacity-70 group-hover:opacity-100 transition-opacity absolute bottom-1">
                    volume_up
                  </span>
                </button>

                {/* Character Title & Badges */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl font-black text-slate-900 dark:text-white truncate font-headline tracking-tight">
                      {currentCharData.hanViet}
                    </h1>
                    <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:border dark:border-rose-500/40 text-[10px] font-bold dark:text-rose-300 uppercase">
                      {currentCharData.codeLabel}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">{currentCharData.meaning}</div>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                    <span className="text-rose-500 dark:text-rose-400 font-bold">{currentCharData.strokeCount} Nét</span>
                    <span>•</span>
                    <span>{currentCharData.radical}</span>
                  </div>
                </div>
              </div>

              {/* Sub-details: Romaji, Classification, Mouth Shape */}
              <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-800/80 text-xs">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                  <span className="font-semibold text-slate-400 dark:text-slate-500 uppercase text-[10px] tracking-wider">
                    Phiên âm Romaji
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">Romaji: [{currentCharData.romaji}]</span>
                </div>
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                  <span className="font-semibold text-slate-400 dark:text-slate-500 uppercase text-[10px] tracking-wider">Phân loại</span>
                  <span className="text-slate-700 dark:text-slate-300 font-medium">{currentCharData.typeLabel}</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-600 dark:bg-[#090d16] dark:border-slate-800/80 dark:text-slate-400 text-[11px] leading-snug">
                  <strong className="text-slate-800 dark:text-slate-300 font-semibold">Khẩu hình: </strong>
                  {currentCharData.mouthShape}
                </div>
              </div>
            </div>

            {/* 2. Sơ Đồ Nét Bút Thuận */}
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-sm dark:bg-[#0f131d] dark:border-slate-800/90 dark:shadow-xl flex flex-col gap-2.5 transition-colors duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    Sơ Đồ {currentCharData.strokeCount} Nét Bút Thuận
                  </h3>
                </div>
                <span className="text-xs font-mono font-bold text-rose-500 dark:text-rose-400">
                  Nét {Math.min(currentStrokeIdx + 1, currentCharData.strokeCount)} / {currentCharData.strokeCount}
                </span>
              </div>

              {/* Stroke Step List */}
              <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
                {Array.from({ length: currentCharData.strokeCount }).map((_, sIdx) => {
                  const isDrawn = sIdx < currentStrokeIdx;
                  const isActive = sIdx === currentStrokeIdx;
                  const ruleText =
                    (currentCharData.strokeRules && currentCharData.strokeRules[sIdx]) ||
                    `Nét ${sIdx + 1}: Nét bút thứ ${sIdx + 1}`;

                  if (isDrawn) {
                    return (
                      <div
                        key={`stroke-${sIdx}`}
                        className="flex items-center justify-between p-2 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 dark:bg-emerald-950/30 dark:border-emerald-500/40 dark:text-emerald-300 text-xs"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-5 h-5 rounded-full bg-emerald-200 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400 flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                            {sIdx + 1}
                          </div>
                          <span className="font-medium truncate">{ruleText}</span>
                        </div>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5 flex-shrink-0 ml-1">
                          ✓ Đã vẽ
                        </span>
                      </div>
                    );
                  }

                  if (isActive) {
                    return (
                      <div
                        key={`stroke-${sIdx}`}
                        className="flex items-center justify-between p-2 rounded-xl bg-rose-50 border-2 border-rose-500 text-rose-900 shadow-sm dark:bg-gradient-to-r dark:from-rose-950/70 dark:to-[#1e1327] dark:border-[#ff2d55] neon-glow-pink dark:text-white text-xs"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center font-bold text-[10px] animate-pulse flex-shrink-0">
                            {sIdx + 1}
                          </div>
                          <span className="font-bold truncate">{ruleText}</span>
                        </div>
                        <span className="text-[10px] text-rose-600 dark:text-rose-300 font-semibold animate-pulse flex-shrink-0 ml-1">
                          Đang viết...
                        </span>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={`stroke-${sIdx}`}
                      className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 dark:bg-[#090d16] dark:border-slate-800 dark:text-slate-500 text-xs"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400 flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                          {sIdx + 1}
                        </div>
                        <span className="font-medium truncate">{ruleText}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 dark:text-slate-600 flex-shrink-0 ml-1">Chờ vẽ</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. Mẹo Nhớ Chữ */}
            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-300/80 text-amber-900 shadow-sm dark:bg-amber-500/10 dark:border-amber-500/30 dark:text-amber-200/90 dark:shadow-md flex items-start gap-2.5 transition-colors duration-300">
              <span className="text-lg leading-none">💡</span>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-amber-800 dark:text-amber-300">Mẹo nhớ chữ {currentCharData.char}:</h4>
                <p className="text-[11px] leading-relaxed mt-1">{currentCharData.mnemonic}</p>
              </div>
            </div>
          </section>

          {/* ================= COL 2: MAIN EXPANSIVE PRACTICE CANVAS (6 COLS) ================= */}
          <section className="lg:col-span-6 flex flex-col items-center gap-3 w-full" data-purpose="canvas-studio-center">
            {/* Top Toolbar Ribbon */}
            <div className="w-full max-w-[500px] bg-white border border-slate-200/90 shadow-sm dark:bg-[#0f131d] dark:border-slate-800 rounded-2xl px-3 py-1.5 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 transition-colors duration-300">
              {/* Pen Type Switcher */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-[#0a0e18] p-1 rounded-xl border border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => {
                    sounds.playClick();
                    setBrushType("felt");
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition cursor-pointer ${
                    brushType === "felt"
                      ? "bg-[#ff2d55] text-white font-bold shadow-md shadow-rose-950/20 border border-rose-400/50"
                      : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  }`}
                  title="Bút Dạ: Nét đều, căn bản"
                >
                  <span>Bút Dạ</span>
                  <span className="px-1 py-0.2 rounded bg-black/10 dark:bg-black/40 text-[9px] font-mono text-rose-700 dark:text-rose-200 font-semibold">
                    Đều nét
                  </span>
                </button>
                <button
                  onClick={() => {
                    sounds.playClick();
                    setBrushType("brush");
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition cursor-pointer ${
                    brushType === "brush"
                      ? "bg-[#ff2d55] text-white font-bold shadow-md shadow-rose-950/20 border border-rose-400/50"
                      : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  }`}
                  title="Bút Lông Thư Pháp: Đậm nhạt theo lực đưa cọ"
                >
                  <span>Bút Lông Cọ</span>
                  <span className="px-1 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-[9px] font-mono text-slate-600 dark:text-slate-400">
                    Nhấn nhả
                  </span>
                </button>
              </div>

              {/* Stroke Size Controls */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-[#0a0e18] px-2.5 py-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mr-1">CỠ NÉT:</span>
                {[
                  { id: "small", label: "Mảnh" },
                  { id: "medium", label: "Vừa" },
                  { id: "large", label: "Đậm" }
                ].map((sz) => (
                  <button
                    key={sz.id}
                    onClick={() => {
                      sounds.playClick();
                      setBrushSize(sz.id);
                    }}
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold transition cursor-pointer ${
                      brushSize === sz.id
                        ? "bg-rose-100 text-rose-700 font-bold dark:bg-rose-500/30 dark:text-rose-300"
                        : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                    }`}
                  >
                    {sz.label}
                  </button>
                ))}
              </div>

              {/* Ghost Guide Toggle & Clear Icon */}
              <div className="flex items-center gap-1.5 ml-auto">
                <button
                  onClick={() => {
                    sounds.playClick();
                    setIsGhostVisible(!isGhostVisible);
                  }}
                  className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                    isGhostVisible
                      ? "bg-rose-50 border-rose-300 text-rose-700 dark:bg-rose-500/20 dark:border-rose-500/40 dark:text-rose-300"
                      : "bg-slate-100 border-slate-200 text-slate-600 dark:bg-[#0a0e18] dark:border-slate-800 dark:text-slate-400 dark:hover:text-white"
                  }`}
                  title="Bật/Tắt nét mờ hướng dẫn"
                >
                  <span className="material-symbols-outlined text-[14px]">
                    {isGhostVisible ? "visibility" : "visibility_off"}
                  </span>
                  <span>Nét Mờ: {isGhostVisible ? "BẬT" : "TẮT"}</span>
                </button>

                <button
                  onClick={handleClear}
                  className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-rose-50 border border-slate-200 hover:border-rose-300 text-slate-600 hover:text-rose-600 dark:bg-[#0a0e18] dark:hover:bg-rose-950/50 dark:border-slate-800 dark:hover:border-rose-500/50 dark:text-slate-400 dark:hover:text-rose-400 flex items-center justify-center transition cursor-pointer"
                  title="Xóa viết lại từ đầu"
                >
                  <span className="material-symbols-outlined text-[18px]">refresh</span>
                </button>
              </div>
            </div>

            {/* Centered Square Canvas Studio */}
            <div
              className={`w-full max-w-[500px] aspect-square relative rounded-3xl border-2 shadow-xl overflow-hidden transition-all select-none ${
                isDarkMode
                  ? "bg-[#0c1017] border-slate-800 hover:border-slate-700"
                  : "bg-[#faf8f5] border-slate-300 hover:border-slate-400 shadow-md"
              } ${
                shakeCanvas
                  ? "border-rose-500 animate-shake neon-glow-pink"
                  : ""
              }`}
              style={{ touchAction: "none" }}
            >
              {/* Calligraphy Red Mễ Grid Background Layer */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                {/* Outer frame */}
                <rect
                  x="2"
                  y="2"
                  width="96"
                  height="96"
                  fill="none"
                  stroke={isDarkMode ? "#ff2d55" : "#e11d48"}
                  strokeWidth="0.8"
                  strokeOpacity={isDarkMode ? "0.4" : "0.35"}
                />
                {/* Horizontal & Vertical Crosshairs */}
                <line
                  x1="0"
                  y1="50"
                  x2="100"
                  y2="50"
                  stroke={isDarkMode ? "#ff2d55" : "#e11d48"}
                  strokeWidth="0.6"
                  strokeDasharray="2,2"
                  strokeOpacity={isDarkMode ? "0.6" : "0.45"}
                />
                <line
                  x1="50"
                  y1="0"
                  x2="50"
                  y2="100"
                  stroke={isDarkMode ? "#ff2d55" : "#e11d48"}
                  strokeWidth="0.6"
                  strokeDasharray="2,2"
                  strokeOpacity={isDarkMode ? "0.6" : "0.45"}
                />
                {/* Diagonal Star Lines (Mễ Tự) */}
                <line
                  x1="0"
                  y1="0"
                  x2="100"
                  y2="100"
                  stroke={isDarkMode ? "#ff2d55" : "#e11d48"}
                  strokeWidth="0.4"
                  strokeDasharray="3,3"
                  strokeOpacity={isDarkMode ? "0.3" : "0.25"}
                />
                <line
                  x1="100"
                  y1="0"
                  x2="0"
                  y2="100"
                  stroke={isDarkMode ? "#ff2d55" : "#e11d48"}
                  strokeWidth="0.4"
                  strokeDasharray="3,3"
                  strokeOpacity={isDarkMode ? "0.3" : "0.25"}
                />
              </svg>

              {/* In-Canvas Top Overlay Chips */}
              <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10 pointer-events-none">
                <div className="px-2.5 py-1 rounded-lg bg-white/85 dark:bg-black/70 border border-slate-300 dark:border-slate-700/80 backdrop-blur-sm text-[11px] font-bold text-slate-800 dark:text-slate-200 shadow-sm">
                  Nét {Math.min(currentStrokeIdx + 1, currentCharData.strokeCount)} / {currentCharData.strokeCount}:{" "}
                  <span className="text-rose-600 dark:text-rose-400 font-normal">
                    {currentCharData.strokeRules && currentCharData.strokeRules[currentStrokeIdx]
                      ? currentCharData.strokeRules[currentStrokeIdx].replace(/^Nét \d+:\s*/, "")
                      : "Chuẩn bị viết"}
                  </span>
                </div>
                <div className="px-2.5 py-1 rounded-lg bg-white/85 dark:bg-black/70 border border-slate-300 dark:border-slate-700/80 backdrop-blur-sm text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400 shadow-sm">
                  Sens: 90%
                </div>
              </div>

              {/* Teacher Guide SVG Layer */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox={charBox.viewBox}
                preserveAspectRatio="xMidYMid meet"
              >
                <defs>
                  <marker
                    id="swipeArrowMarker"
                    viewBox="0 0 10 10"
                    refX="5"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#ff2d55" />
                  </marker>
                </defs>

                {/* 1. Completed Strokes (Crisp Sumi black in Light mode, Crisp White in Dark mode) */}
                {currentCharData.strokeSvgPaths &&
                  currentCharData.strokeSvgPaths.map((path, idx) => {
                    if (idx < currentStrokeIdx) {
                      return (
                        <path
                          key={`done-stroke-${idx}`}
                          d={path}
                          fill="none"
                          stroke={completedStrokeColor}
                          strokeWidth={charBox.size === 100 ? 7.5 : 16}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      );
                    }
                    return null;
                  })}

                {/* 2. Pending Future Strokes (Solid Faint Line when Ghost Guide is On) */}
                {isGhostVisible &&
                  currentCharData.strokeSvgPaths &&
                  currentCharData.strokeSvgPaths.map((path, idx) => {
                    if (idx > currentStrokeIdx) {
                      return (
                        <path
                          key={`ghost-stroke-${idx}`}
                          d={path}
                          fill="none"
                          stroke={pendingGhostColor}
                          strokeOpacity={isDarkMode ? 0.25 : 0.35}
                          strokeWidth={charBox.size === 100 ? 5.5 : 12}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      );
                    }
                    return null;
                  })}

                {/* 3. Active Current Stroke with Red Guide & Start Beacon */}
                {isGhostVisible && currentExpectedSvg && currentStrokeIdx < currentCharData.strokeCount && (
                  <g key={`active-guide-${currentStrokeIdx}`}>
                    {/* Active Stroke Solid Path */}
                    <path
                      d={currentExpectedSvg}
                      fill="none"
                      stroke="#ff2d55"
                      strokeOpacity={0.8}
                      strokeWidth={charBox.size === 100 ? 6.0 : 13}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* Destination Ping */}
                    {currentEndpoints.end && (
                      <>
                        <circle
                          cx={currentEndpoints.end.x}
                          cy={currentEndpoints.end.y}
                          r={charBox.size === 100 ? 5 : 11}
                          fill="#ff2d55"
                          className="animate-ping opacity-75"
                        />
                        <circle
                          cx={currentEndpoints.end.x}
                          cy={currentEndpoints.end.y}
                          r={charBox.size === 100 ? 3.5 : 7.5}
                          fill="#ff2d55"
                        />
                      </>
                    )}

                    {/* Start Beacon with Number Indicator */}
                    {currentEndpoints.start && (
                      <g>
                        <circle
                          cx={currentEndpoints.start.x}
                          cy={currentEndpoints.start.y}
                          r={charBox.size === 100 ? 5 : 11}
                          fill="#ff2d55"
                          stroke="#ffffff"
                          strokeWidth={charBox.size === 100 ? 1 : 2}
                        />
                        <text
                          x={currentEndpoints.start.x}
                          y={currentEndpoints.start.y + (charBox.size === 100 ? 1.8 : 4)}
                          fill="white"
                          fontSize={charBox.size === 100 ? 5.5 : 12}
                          fontWeight="bold"
                          textAnchor="middle"
                        >
                          {currentStrokeIdx + 1}
                        </text>
                      </g>
                    )}
                  </g>
                )}

                {/* 4. Animated Directional Swipe Guide on 3rd Fail */}
                {strokeFailCount >= 3 && currentExpectedSvg && currentStrokeIdx < currentCharData.strokeCount && (
                  <g key={`swipe-guide-${currentStrokeIdx}`}>
                    <path
                      d={currentExpectedSvg}
                      fill="none"
                      stroke="#ff2d55"
                      strokeWidth={charBox.size === 100 ? 5.5 : 12}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      markerEnd="url(#swipeArrowMarker)"
                    />
                    <circle
                      r={charBox.size === 100 ? 4 : 9}
                      fill="#ffffff"
                      stroke="#ff2d55"
                      strokeWidth={charBox.size === 100 ? 2 : 4}
                    >
                      <animateMotion path={currentExpectedSvg} dur="1.4s" repeatCount="indefinite" />
                    </circle>
                  </g>
                )}

                {/* 5. Fallback Watermark for Chars without SVG Paths */}
                {(!currentCharData.strokeSvgPaths || currentCharData.strokeSvgPaths.length === 0) && (
                  <text
                    x="50"
                    y="58"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="58"
                    fontFamily="'Noto Serif JP', serif"
                    fill={isDarkMode ? "#94a3b8" : "#64748b"}
                    fillOpacity={isDarkMode ? 0.25 : 0.2}
                    fontWeight="bold"
                  >
                    {currentCharData.char}
                  </text>
                )}
              </svg>

              {/* User Drawing HTML5 Canvas Layer */}
              <canvas
                ref={canvasRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                className="absolute inset-0 w-full h-full cursor-crosshair z-20"
                style={{ touchAction: "none" }}
              />

              {/* In-Canvas Bottom Status Feedback Chip */}
              <div className="absolute bottom-3 inset-x-3 z-30 pointer-events-none flex justify-center">
                <div
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold shadow-md backdrop-blur-md transition-all text-center max-w-[95%] truncate ${
                    completedStrokes.length >= currentCharData.strokeCount
                      ? "bg-emerald-100 border border-emerald-400 text-emerald-900 dark:bg-emerald-950/90 dark:border-emerald-500 dark:text-emerald-200 neon-glow-emerald"
                      : shakeCanvas || strokeFailCount > 0
                      ? "bg-rose-100 border border-rose-400 text-rose-900 dark:bg-rose-950/90 dark:border-rose-500 dark:text-rose-200"
                      : "bg-white/95 border border-slate-300 text-slate-800 dark:bg-black/75 dark:border-slate-700 dark:text-slate-200"
                  }`}
                >
                  {statusFeedback}
                </div>
              </div>
            </div>

            {/* Bottom Studio Action Buttons */}
            <div className="w-full max-w-[500px] flex items-center justify-between gap-2">
              <button
                onClick={playSenseiDemo}
                disabled={isDemoPlaying || !currentExpectedSvg}
                className="flex-1 py-2.5 px-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 dark:bg-[#0f131d] dark:hover:bg-[#1a2133] dark:border-slate-800 dark:hover:border-slate-700 text-xs font-bold dark:text-slate-300 dark:hover:text-white flex items-center justify-center gap-1 transition cursor-pointer shadow-sm disabled:opacity-50"
                title="Xem Sensei vẽ nét mẫu (Space)"
              >
                <span className="material-symbols-outlined text-[16px] text-sky-500">play_arrow</span>
                <span>Xem Mẫu</span>
                <kbd className="hidden sm:inline px-1 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-500 font-mono">
                  Space
                </kbd>
              </button>

              <button
                onClick={handleUndo}
                className="flex-1 py-2.5 px-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 dark:bg-[#0f131d] dark:hover:bg-[#1a2133] dark:border-slate-800 dark:hover:border-slate-700 text-xs font-bold dark:text-slate-300 dark:hover:text-white flex items-center justify-center gap-1 transition cursor-pointer shadow-sm"
                title="Hoàn tác nét vừa viết (Z)"
              >
                <span className="material-symbols-outlined text-[16px] text-amber-500">undo</span>
                <span>Hoàn Tác</span>
                <kbd className="hidden sm:inline px-1 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-500 font-mono">
                  Z
                </kbd>
              </button>

              <button
                onClick={handleClear}
                className="flex-1 py-2.5 px-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 dark:bg-[#0f131d] dark:hover:bg-[#1a2133] dark:border-slate-800 dark:hover:border-slate-700 text-xs font-bold dark:text-slate-300 dark:hover:text-white flex items-center justify-center gap-1 transition cursor-pointer shadow-sm"
                title="Tập lại từ nét đầu"
              >
                <span className="material-symbols-outlined text-[16px] text-rose-500">refresh</span>
                <span>Tập Lại</span>
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  if (completedStrokes.length >= currentCharData.strokeCount) {
                    handleNextChar();
                  }
                }}
                className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white border border-rose-400/50 text-xs font-black flex items-center justify-center gap-1 transition cursor-pointer shadow-md shadow-rose-950/20 active:scale-95"
                title="Chấm điểm nét (Enter)"
              >
                <span>Chấm Điểm Nét</span>
                <kbd className="px-1 py-0.2 rounded bg-black/30 text-[10px] font-mono text-rose-100">Enter</kbd>
              </button>
            </div>
          </section>

          {/* ================= COL 3: AI SENSEI & QUEUE & NEXT HERO (3 COLS) ================= */}
          <section className="lg:col-span-3 flex flex-col gap-3" data-purpose="ai-sensei-queue-column">
            {/* 1. Đánh Giá AI Sensei Card */}
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-sm dark:bg-[#0f131d] dark:border-slate-800/90 dark:shadow-xl flex flex-col gap-2.5 transition-colors duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">Đánh Giá AI Sensei</h3>
                </div>
                <span className="px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:border dark:border-emerald-500/40 text-[11px] font-extrabold dark:text-emerald-300 font-mono">
                  Chuẩn {accuracyScore}%
                </span>
              </div>

              {/* Progress Bars */}
              <div className="space-y-2 pt-1 text-xs">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                    <span>Thứ tự các nét (Stroke Order)</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">100%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-[#0a0e18] overflow-hidden border border-slate-200 dark:border-slate-800">
                    <div className="h-full bg-emerald-500 rounded-full w-full" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                    <span>Cân đối góc &amp; Tỉ lệ khung ô</span>
                    <span className="font-bold text-teal-600 dark:text-teal-400 font-mono">{Math.max(88, accuracyScore - 2)}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-[#0a0e18] overflow-hidden border border-slate-200 dark:border-slate-800">
                    <div
                      className="h-full bg-teal-500 rounded-full"
                      style={{ width: `${Math.max(88, accuracyScore - 2)}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                    <span>Lực nhấn &amp; Tốc độ đưa bút</span>
                    <span className="font-bold text-cyan-600 dark:text-cyan-400 font-mono">{accuracyScore}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-[#0a0e18] overflow-hidden border border-slate-200 dark:border-slate-800">
                    <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${accuracyScore}%` }} />
                  </div>
                </div>
              </div>

              {/* Sensei Advice Box */}
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-600 dark:bg-[#090d16] dark:border-slate-800/80 dark:text-slate-400 text-[11px] leading-relaxed mt-0.5">
                <span className="font-bold text-slate-800 dark:text-slate-200">Sensei nhắc bạn: </span>
                Căn chỉnh nét viết nằm ngay tâm ô Mễ, giữ khoảng cách đều giữa các nét để chữ "{currentCharData.char}" trông vuông vắn và thanh nhã!
              </div>
            </div>

            {/* 2. Từ Ghép Thường Gặp */}
            <div className="p-3 rounded-2xl bg-white border border-slate-200/90 shadow-sm dark:bg-[#0f131d] dark:border-slate-800/90 dark:shadow-xl flex flex-col gap-2 transition-colors duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-amber-500">menu_book</span>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">Từ Ghép Thường Gặp</h3>
                </div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono bg-slate-100 dark:bg-slate-800/60 px-2 py-0.5 rounded-md">
                  {currentCharData.examples.length} Từ Vựng
                </span>
              </div>

              {/* Vocabulary List */}
              <div className="space-y-1.5 max-h-[100px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
                {currentCharData.examples.map((cp, idx) => (
                  <div
                    key={`cp-${idx}`}
                    className="p-1.5 px-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 dark:bg-[#0a0e18] dark:hover:bg-[#141a27] dark:border-slate-800 dark:text-slate-200 flex items-center justify-between transition group"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-jp text-sm font-bold group-hover:text-rose-500 transition flex-shrink-0">
                        {cp.word.split(" ")[0]}
                      </span>
                      <div className="min-w-0">
                        <div className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 truncate">
                          {cp.word.split(" ")[1] || cp.word}
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{cp.meaning}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        sounds.playClick();
                        speakJapanese(cp.word.split(" ")[0]);
                      }}
                      className="w-6 h-6 rounded-lg bg-slate-200 hover:bg-rose-500 text-slate-700 hover:text-white dark:bg-[#151b28] dark:hover:bg-rose-600 dark:text-slate-300 flex items-center justify-center transition cursor-pointer ml-1 flex-shrink-0"
                      title="Nghe phát âm"
                    >
                      <span className="material-symbols-outlined text-[13px]">volume_up</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Thứ Tự Luyện Viết (Scrollable Character List with Wheel) */}
            <div className="p-3 rounded-2xl bg-white border border-slate-200/90 shadow-sm dark:bg-[#0f131d] dark:border-slate-800/90 dark:shadow-xl flex flex-col gap-2 transition-colors duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-rose-500">format_list_bulleted</span>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">Thứ Tự Luyện Viết</h3>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-emerald-700 bg-emerald-100 dark:text-emerald-400 font-mono dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-500/30 font-bold">
                    ✓ {currentList.filter((c) => masteredChars.has(c.kanji || c.char || c.radical)).length} thuộc
                  </span>
                  <span className="text-[10px] text-cyan-700 bg-cyan-100 dark:text-cyan-300 font-medium dark:bg-cyan-950/60 px-1.5 py-0.5 rounded-md border border-cyan-200 dark:border-cyan-800/50 flex items-center gap-1">
                    <span>Lăn chuột</span>
                    <span className="animate-bounce">↓</span>
                  </span>
                </div>
              </div>

              {/* Scrollable Character Queue */}
              <div
                ref={queueListRef}
                className="space-y-1.5 overflow-y-auto h-[215px] max-h-[215px] pr-1 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 select-none"
                title="Dùng chuột lăn lên/xuống để duyệt toàn bộ bảng chữ cái"
              >
                {currentList.map((item, idx) => {
                  const char = item.kanji || item.char || item.radical;
                  const isSelected = char === currentCharData.char;
                  const isMastered = masteredChars.has(char);
                  const isNext = nextCharItem.char === char && !isSelected;
                  const strokes = item.strokes || item.strokeCount || 3;
                  const romaji = item.romaji || item.hanviet || "";

                  return (
                    <div
                      key={`queue-${char}-${idx}`}
                      data-char={char}
                      onClick={() => handleSelectChar(item)}
                      className={`p-2 rounded-xl flex items-center justify-between transition-all cursor-pointer group ${
                        isSelected
                          ? "bg-rose-50 border-2 border-rose-500 text-rose-900 shadow-sm dark:bg-gradient-to-r dark:from-rose-950/80 dark:to-[#1b1224] dark:border-rose-500/90 dark:shadow-md dark:shadow-rose-950/50"
                          : isMastered
                          ? "bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 dark:bg-emerald-950/25 dark:hover:bg-emerald-900/40 dark:border-emerald-500/40 dark:text-emerald-300"
                          : isNext
                          ? "bg-teal-50 hover:bg-teal-100 border border-teal-300 text-teal-800 dark:bg-teal-950/30 dark:hover:bg-teal-900/45 dark:border-teal-500/50 dark:text-teal-200"
                          : "bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 dark:bg-[#090d16] dark:hover:bg-[#131926] dark:border-slate-800/90 dark:text-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {/* Order Index */}
                        <span
                          className={`font-mono text-[10px] w-5 text-center font-bold flex-shrink-0 ${
                            isSelected ? "text-rose-600 dark:text-rose-400" : isMastered ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400 dark:text-slate-500"
                          }`}
                        >
                          #{idx + 1}
                        </span>

                        {/* Large Glyph */}
                        <span
                          className={`font-jp text-xl font-bold leading-none w-7 text-center flex-shrink-0 ${
                            isSelected ? "text-rose-900 dark:text-white" : isMastered ? "text-emerald-700 dark:text-emerald-300" : "text-slate-800 dark:text-slate-100"
                          }`}
                        >
                          {char}
                        </span>

                        {/* Title & Romaji */}
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 leading-tight">
                            <span className="font-mono">{romaji.toUpperCase()}</span>
                            <span className="text-[10px] text-slate-400 font-normal">• {strokes}n</span>
                          </div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">Âm: {romaji}</div>
                        </div>
                      </div>

                      {/* Status Tag */}
                      <div className="flex items-center flex-shrink-0 ml-1">
                        {isSelected ? (
                          <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white font-bold text-[9px] uppercase shadow-sm">
                            ● Đang luyện
                          </span>
                        ) : isMastered ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-500/20 dark:border-emerald-400/40 dark:text-emerald-300 font-bold text-[9px]">
                            ✓ Thuộc
                          </span>
                        ) : isNext ? (
                          <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 border border-teal-300 dark:bg-teal-500/20 dark:border-teal-400/40 dark:text-teal-300 font-bold text-[9px]">
                            Tiếp ➔
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">{strokes} nét</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footnote */}
              <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 px-1 pt-1 border-t border-slate-200 dark:border-slate-800/80">
                <span className="flex items-center gap-1">
                  <span className="text-cyan-600 dark:text-cyan-400 font-bold animate-pulse">↑</span>
                  <span>Lăn chuột để xem các chữ tiếp</span>
                </span>
                <span className="font-mono text-slate-500 dark:text-slate-400">{currentList.length} chữ</span>
              </div>
            </div>

            {/* 4. Mini Roadmap Progress Card */}
            <div className="p-3 rounded-2xl bg-white border border-slate-200/90 shadow-sm dark:bg-[#0f131d] dark:border-slate-800/90 dark:shadow-xl flex items-center justify-between gap-3 transition-colors duration-300">
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                    roadmapDayInfo.isDayDone
                      ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-950/20"
                      : "bg-slate-100 text-emerald-700 border border-emerald-300 dark:bg-[#182030] dark:text-emerald-400 dark:border-emerald-500/30"
                  }`}
                >
                  {roadmapDayInfo.isDayDone ? "✓" : `${roadmapDayInfo.completedInDay}/5`}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{roadmapDayInfo.title}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    Mục tiêu: [{roadmapDayInfo.targetChars.join(", ")}] •{" "}
                    {roadmapDayInfo.isDayDone
                      ? "Đã hoàn thành xuất sắc!"
                      : `Đã hoàn thành ${roadmapDayInfo.completedInDay}/5 chữ`}
                  </div>
                </div>
              </div>

              {onNavigate && (
                <button
                  onClick={() => {
                    sounds.playClick();
                    onNavigate("roadmap");
                  }}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex-shrink-0 ${
                    roadmapDayInfo.isDayDone
                      ? "bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black shadow-md"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300"
                  }`}
                  title="Mở Lộ Trình 14 Ngày"
                >
                  {roadmapDayInfo.isDayDone ? "Xem Lộ Trình ✓" : "Lộ Trình"}
                </button>
              )}
            </div>

            {/* 5. NÚT KẾ TIẾP TO VÀ RÕ (HERO NEXT CTA BUTTON) */}
            <button
              id="next-lesson-btn"
              onClick={handleNextChar}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 border-2 border-emerald-400/60 shadow-xl shadow-emerald-950/30 flex items-center justify-between transition-all duration-200 cursor-pointer group active:scale-[0.98]"
              title={`Chuyển sang luyện chữ tiếp theo: ${nextCharItem.char}`}
            >
              {/* Left: KẾ TIẾP badge + Big glyph + details */}
              <div className="flex items-center gap-3 min-w-0">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-300/50 text-emerald-200 text-[10px] font-black uppercase tracking-wider flex-shrink-0 shadow-sm leading-normal">
                  KẾ TIẾP
                </span>

                <span className="text-3xl font-black font-jp text-white drop-shadow-sm flex-shrink-0">
                  {nextCharItem.char}
                </span>

                <div className="min-w-0 text-left">
                  <div className="text-xs sm:text-sm font-black text-white uppercase truncate flex items-center gap-1.5 leading-tight">
                    <span>{nextCharItem.romaji}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-900/70 text-emerald-200 font-mono font-bold flex-shrink-0">
                      • {nextCharItem.strokes} NÉT
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-100/90 truncate block">
                    Nhấn để bắt đầu luyện viết nét bút
                  </span>
                </div>
              </div>

              {/* Right: Circle Slide Arrow */}
              <div className="w-10 h-10 rounded-xl bg-emerald-950/60 border border-emerald-300/50 flex items-center justify-center text-white group-hover:translate-x-1.5 transition-transform duration-200 shadow-inner flex-shrink-0 ml-2">
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </div>
            </button>
          </section>
        </div>
      </main>

      {/* ================= 3. CHARACTER BROWSER MODAL ================= */}
      {showPicker && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 lg:p-6 bg-black/60 dark:bg-black/80 backdrop-blur-md transition-opacity"
          role="dialog"
          aria-modal="true"
        >
          <div className="absolute inset-0 cursor-pointer" onClick={() => setShowPicker(false)} />

          <div className="w-full max-w-5xl max-h-[88vh] bg-white border border-slate-300 shadow-2xl dark:bg-[#0f131d] dark:border-slate-700/80 rounded-2xl flex flex-col overflow-hidden relative z-10 transition-colors duration-300">
            {/* Modal Header */}
            <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0a0e18] flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                <h3 className="text-sm font-black text-slate-900 dark:text-white tracking-tight">
                  Bảng Tra Cứu &amp; Chọn Nhanh Ký Tự
                </h3>
              </div>

              {/* Category Pills inside Modal */}
              <div className="flex items-center bg-slate-200 dark:bg-[#171b26] p-1 rounded-xl border border-slate-300 dark:border-slate-700/70 text-xs">
                {[
                  { id: "hiragana", label: "Hiragana (46)" },
                  { id: "katakana", label: "Katakana (46)" },
                  { id: "kanji", label: "Kanji N5 (53)" },
                  { id: "radicals", label: "214 Bộ Thủ" }
                ].map((tb) => (
                  <button
                    key={tb.id}
                    onClick={() => {
                      sounds.playClick();
                      setActiveScript(tb.id);
                    }}
                    className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                      activeScript === tb.id
                        ? "bg-[#ff2d55] text-white shadow"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    {tb.label}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowPicker(false)}
                className="w-7 h-7 rounded-lg bg-slate-200 hover:bg-rose-500 text-slate-700 hover:text-white dark:bg-slate-800 dark:hover:bg-rose-600 dark:text-slate-300 flex items-center justify-center transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Character Grid */}
            <div className="p-4 overflow-y-auto max-h-[70vh] grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2.5">
              {currentList.map((item, idx) => {
                const char = item.kanji || item.char || item.radical;
                const isSelected = char === currentCharData.char;
                const isMastered = masteredChars.has(char);
                const strokes = item.strokes || item.strokeCount || 3;
                const romaji = item.romaji || item.hanviet || "";

                return (
                  <button
                    key={`modal-picker-${char}-${idx}`}
                    onClick={() => {
                      handleSelectChar(item);
                      setShowPicker(false);
                    }}
                    className={`p-2 rounded-xl flex flex-col items-center justify-center gap-0.5 border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-rose-100 border-rose-500 text-rose-900 ring-2 ring-rose-400/40 dark:bg-rose-950/80 dark:border-rose-500 dark:text-white"
                        : isMastered
                        ? "bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-950/25 dark:border-emerald-500/40 dark:text-emerald-300 dark:hover:bg-emerald-900/40"
                        : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800 dark:bg-[#090d16] dark:hover:bg-[#151b27] dark:border-slate-800 dark:text-slate-200"
                    }`}
                  >
                    <span className="font-jp text-2xl font-bold">{char}</span>
                    <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400 uppercase truncate max-w-full">
                      {romaji}
                    </span>
                    <span className="text-[9px] text-slate-400 dark:text-slate-500">{strokes}n</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
