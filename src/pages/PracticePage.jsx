import React, { useState, useEffect, useRef, useMemo } from 'react';
import { sounds } from '../utils/soundEffects';
import confetti from 'canvas-confetti';
import { validateStrokeDrawing, extractStrokeEndpoints } from '../utils/strokeMatcher';
import { KANJI_N5_COMPLETE } from '../data/kanjiN5Complete';
import { RADICALS_214 } from '../data/radicals214';
import { KANA_DAILY_MAP } from '../data/roadmapData';

export function PracticePage({
  hiraganaList = [],
  katakanaList = [],
  kanjiN5List = [],
  masteredChars = new Set(),
  setMasteredChars,
  xp = 300,
  setXp,
  streak = 3,
  soundMuted = false,
  toggleSound,
  speak,
  initialChar,
  onNavigate
}) {
  // 1. Core Category & Active Character State
  const [category, setCategory] = useState('hiragana'); // 'hiragana' | 'katakana' | 'kanji' | 'radicals'
  const [activeTopic, setActiveTopic] = useState('date_number'); // 'all' | 'date_number' | 'nature' | 'school' | 'direction_life'
  const [searchQuery, setSearchQuery] = useState('');

  // Primary dataset consolidation
  const kanjiDataset = useMemo(() => {
    return KANJI_N5_COMPLETE && KANJI_N5_COMPLETE.length > 0 ? KANJI_N5_COMPLETE : kanjiN5List;
  }, [kanjiN5List]);

  // Initial character resolution
  const [selectedChar, setSelectedChar] = useState(() => {
    if (initialChar) return initialChar;
    if (hiraganaList && hiraganaList.length > 0) return hiraganaList[0];
    return { char: 'あ', romaji: 'a', strokeCount: 3 };
  });

  // Handle jumping into practice from other tabs/pages
  useEffect(() => {
    if (initialChar) {
      if (initialChar.kanji) {
        setCategory('kanji');
        setSelectedChar(initialChar);
      } else if (katakanaList.some((k) => k.char === initialChar.char)) {
        setCategory('katakana');
        setSelectedChar(initialChar);
      } else if (hiraganaList.some((h) => h.char === initialChar.char)) {
        setCategory('hiragana');
        setSelectedChar(initialChar);
      } else {
        setSelectedChar(initialChar);
      }
      resetCanvas();
    }
  }, [initialChar]);

  // 2. Active List based on Category & Topic & Search
  const currentList = useMemo(() => {
    let list = [];
    if (category === 'kanji') {
      list = kanjiDataset;
      if (activeTopic !== 'all' && !searchQuery.trim()) {
        list = list.filter((item) => item.topic === activeTopic);
      }
    } else if (category === 'hiragana') {
      list = hiraganaList;
    } else if (category === 'katakana') {
      list = katakanaList;
    } else if (category === 'radicals') {
      list = RADICALS_214;
    }

    if (searchQuery.trim()) {
      const rawQ = searchQuery.toLowerCase().trim();
      const normalize = (str) =>
        (str || '')
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '');
      const q = normalize(rawQ);

      list = list.filter((item) => {
        const char = item.kanji || item.char || item.radical || '';
        const hanviet = item.hanviet || '';
        const romaji = item.romaji || '';
        const meaning = item.meaning || '';
        return (
          char.includes(rawQ) ||
          normalize(hanviet).includes(q) ||
          normalize(romaji).includes(q) ||
          normalize(meaning).includes(q)
        );
      });
    }

    return list;
  }, [category, activeTopic, searchQuery, kanjiDataset, hiraganaList, katakanaList]);

  // Ensure selectedChar is valid for current category / search filter
  useEffect(() => {
    if (currentList.length > 0) {
      const exists = currentList.some(
        (c) => (c.kanji || c.char || c.radical) === (selectedChar?.kanji || selectedChar?.char || selectedChar?.radical)
      );
      if (!exists) {
        setSelectedChar(currentList[0]);
      }
    }
  }, [currentList, selectedChar]);

  // 3. Canvas Drawing & Visual Settings
  const [brushType, setBrushType] = useState('felt'); // 'felt' (Bút Dạ) | 'brush' (Bút Lông Cọ)
  const [brushSize, setBrushSize] = useState('medium'); // 'small' (2px) | 'medium' (5px) | 'large' (9px)
  const [gridType, setGridType] = useState('mizi'); // 'mizi' (Ô Mễ) | 'tian' (Ô Điền)
  const [showFaint, setShowFaint] = useState(true); // Nét Mờ BẬT / TẮT
  const [autoStrokeDetection, setAutoStrokeDetection] = useState(true); // Tự động bắt nét
  const [mobileTab, setMobileTab] = useState('canvas'); // 'canvas' (Bàn vẽ) | 'strokes' (Nét & Mẹo) | 'queue' (Thứ tự luyện)

  // 4. Stroke Progress & Validation States
  const [currentStrokeIdx, setCurrentStrokeIdx] = useState(0);
  const [completedStrokes, setCompletedStrokes] = useState([]);
  const [strokeAccuracy, setStrokeAccuracy] = useState(98.4);
  const [strokeFailCount, setStrokeFailCount] = useState(0); // Đếm số lần vẽ sai liên tiếp trên nét hiện tại
  const [feedbackMsg, setFeedbackMsg] = useState({
    text: 'Sẵn sàng! Đặt bút từ điểm đỏ số 1 theo thứ tự.',
    type: 'info'
  });
  const [shake, setShake] = useState(false);
  const [isReplaying, setIsReplaying] = useState(false);
  const [replayStrokeIdx, setReplayStrokeIdx] = useState(-1);

  // 5. AI Sensei Evaluation Scores
  const [strokeOrderScore, setStrokeOrderScore] = useState(100);
  const [balanceScore, setBalanceScore] = useState(96);
  const [pressureScore, setPressureScore] = useState(94);

  // 6. Character Browser Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalCategory, setModalCategory] = useState('hiragana');
  const [modalSearch, setModalSearch] = useState('');
  const [modalFilter, setModalFilter] = useState('all'); // 'all' | 'mastered' | 'learning' | 'review' | '1-4' | '5-8' | '9+'

  // Canvas Refs & Geometry
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const isDrawingRef = useRef(false);
  const userPointsRef = useRef([]);

  // Character stroke helpers
  const totalStrokes = selectedChar?.strokes || selectedChar?.strokeCount || 1;
  const strokeSvgPaths = selectedChar?.strokeSvgPaths || [];

  // Determine coordinate space (100 for Kanji, 220 for Kana)
  const charBox = useMemo(() => {
    let maxCoord = 0;
    strokeSvgPaths.forEach((p) => {
      const nums = p.match(/[\d.]+/g) || [];
      nums.forEach((n) => {
        const v = parseFloat(n);
        if (v > maxCoord) maxCoord = v;
      });
    });
    const size = maxCoord <= 110 ? 100 : 220;
    return { size, viewBox: `0 0 ${size} ${size}` };
  }, [strokeSvgPaths]);

  // Setup High-DPI Canvas with ResizeObserver
  const setupCanvasDPI = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.style.width = '100%';
    canvas.style.height = '100%';

    const width = rect.width || 400;
    const height = rect.height || 400;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
  };

  useEffect(() => {
    setupCanvasDPI();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ro = new ResizeObserver(() => {
      setupCanvasDPI();
    });
    ro.observe(canvas);
    window.addEventListener('resize', setupCanvasDPI);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', setupCanvasDPI);
    };
  }, [selectedChar]);

  // Clear user canvas
  const clearUserCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  // Reset writing session for current character
  const resetCanvas = () => {
    setCurrentStrokeIdx(0);
    setCompletedStrokes([]);
    setStrokeFailCount(0);
    setFeedbackMsg({
      text: 'Đặt bút tại chấm đỏ số 1 để bắt đầu viết nét.',
      type: 'info'
    });
    setStrokeAccuracy(98.4);
    setIsReplaying(false);
    setReplayStrokeIdx(-1);
    clearUserCanvas();
  };

  // Quick reset with sound feedback
  const handleResetAll = () => {
    sounds.playClick();
    resetCanvas();
  };

  // Handle character switch
  const handleSelectChar = (item) => {
    sounds.playClick();
    setSelectedChar(item);
    setCurrentStrokeIdx(0);
    setCompletedStrokes([]);
    setStrokeFailCount(0);
    setFeedbackMsg({
      text: `Đã chọn chữ ${item.kanji || item.char || item.radical}. Bắt đầu luyện nét nào!`,
      type: 'info'
    });
    clearUserCanvas();
    if (speak) {
      speak(item.kanji || item.char || item.radical);
    }
  };

  // Switch to next character
  const handleNextChar = () => {
    sounds.playClick();
    const idx = currentList.findIndex(
      (c) => (c.kanji || c.char || c.radical) === (selectedChar?.kanji || selectedChar?.char || selectedChar?.radical)
    );
    const nextIdx = idx >= 0 && idx < currentList.length - 1 ? idx + 1 : 0;
    if (currentList[nextIdx]) {
      handleSelectChar(currentList[nextIdx]);
    }
  };

  // Find next character name for CTA button
  const nextCharItem = useMemo(() => {
    const idx = currentList.findIndex(
      (c) => (c.kanji || c.char || c.radical) === (selectedChar?.kanji || selectedChar?.char || selectedChar?.radical)
    );
    const nextIdx = idx >= 0 && idx < currentList.length - 1 ? idx + 1 : 0;
    return currentList[nextIdx] || currentList[0];
  }, [currentList, selectedChar]);

  // Boundary-locked coordinate calculation
  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0, isOutOfBounds: true };
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX;
    const clientY = e.clientY;

    const isOutOfBounds =
      clientX < rect.left || clientX > rect.right || clientY < rect.top || clientY > rect.bottom;

    const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const y = Math.max(0, Math.min(rect.height, clientY - rect.top));

    return { x, y, width: rect.width, height: rect.height, isOutOfBounds };
  };

  // Pointer Down
  const handlePointerDown = (e) => {
    e.preventDefault();
    if (isReplaying) return;

    if (currentStrokeIdx >= totalStrokes) {
      setFeedbackMsg({
        text: 'Đã hoàn thành toàn bộ chữ! Bấm "Tập Lại" để luyện tiếp hoặc chuyển chữ kế tiếp.',
        type: 'success'
      });
      return;
    }

    try {
      e.target.setPointerCapture(e.pointerId);
    } catch (err) {}

    isDrawingRef.current = true;
    const coords = getCoordinates(e);
    userPointsRef.current = [{ x: coords.x, y: coords.y }];

    const sizeMultiplier = brushSize === 'small' ? 0.75 : brushSize === 'large' ? 1.45 : 1.1;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 9.0 * sizeMultiplier;
    ctx.strokeStyle = '#181e29';
  };

  // Pointer Move
  const handlePointerMove = (e) => {
    e.preventDefault();
    if (!isDrawingRef.current || isReplaying) return;

    const coords = getCoordinates(e);
    if (coords.isOutOfBounds) {
      handlePointerUp(e);
      return;
    }

    const pts = userPointsRef.current;
    const last = pts[pts.length - 1];
    if (last && Math.hypot(coords.x - last.x, coords.y - last.y) < 1.5) {
      return;
    }

    pts.push({ x: coords.x, y: coords.y });

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const sizeMultiplier = brushSize === 'small' ? 0.75 : brushSize === 'large' ? 1.45 : 1.1;

    // Smooth stroke width
    ctx.lineWidth = 9.0 * sizeMultiplier;

    // Smooth quadratic curve
    if (pts.length >= 3) {
      const pPrev = pts[pts.length - 2];
      const pMid = {
        x: (pPrev.x + coords.x) / 2,
        y: (pPrev.y + coords.y) / 2
      };
      ctx.quadraticCurveTo(pPrev.x, pPrev.y, pMid.x, pMid.y);
    } else {
      ctx.lineTo(coords.x, coords.y);
    }

    ctx.stroke();
  };

  // Pointer Up & Stroke Validation
  const handlePointerUp = (e) => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;

    if (e && e.target && e.pointerId !== undefined) {
      try {
        e.target.releasePointerCapture(e.pointerId);
      } catch (err) {}
    }

    const points = userPointsRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();

    if (!points || points.length < 3) {
      clearUserCanvas();
      return;
    }

    // Validate drawing
    const expectedSvg = strokeSvgPaths[currentStrokeIdx];
    let result = { isValid: true, accuracy: 98.4 };

    // Fallback: Nếu ký tự không có SVG path (như Bộ Thủ), chấp nhận nét vẽ tự do
    if (!expectedSvg) {
      result = { isValid: true, accuracy: 97.5 };
    } else if (autoStrokeDetection) {
      result = validateStrokeDrawing(points, expectedSvg, rect.width, rect.height, charBox.size);
    }

    if (result.isValid) {
      clearUserCanvas();
      sounds.playCorrectStroke?.();
      setStrokeAccuracy(result.accuracy || 98.4);
      setStrokeFailCount(0); // Reset số lần sai khi viết đúng

      const nextStroke = currentStrokeIdx + 1;
      setCurrentStrokeIdx(nextStroke);
      setCompletedStrokes((prev) => [...prev, currentStrokeIdx]);

      if (nextStroke >= totalStrokes) {
        sounds.playCharacterComplete?.();
        triggerGradingSuccess();
      } else {
        const stepDetail = getStrokeStepDetails(selectedChar, nextStroke);
        setFeedbackMsg({
          text: `Chính xác! Nét ${nextStroke} hoàn thành rất tốt. Tiếp tục nét ${nextStroke + 1}: ${stepDetail.title}`,
          type: 'success'
        });
      }
    } else {
      sounds.playWrongStroke?.();
      setShake(true);
      setTimeout(() => setShake(false), 400);

      const nextFails = strokeFailCount + 1;
      setStrokeFailCount(nextFails);

      if (nextFails >= 3) {
        setFeedbackMsg({
          text: `⚠️ Sai ${nextFails} lần! Mũi tên vuốt hướng dẫn đã kích hoạt: Hãy vuốt bút xuôi từ điểm [${currentStrokeIdx + 1}] theo hướng mũi tên ➔`,
          type: 'warning'
        });
      } else {
        setFeedbackMsg({
          text: result.reason || `Chưa chuẩn nét (${nextFails}/3)! Bắt đầu từ điểm đỏ và đưa nét dứt khoát theo hướng dẫn.`,
          type: 'warning'
        });
      }
      clearUserCanvas();
    }
  };

  const handlePointerCancel = () => {
    isDrawingRef.current = false;
    clearUserCanvas();
  };

  // Trigger grading success with XP reward and confetti
  const triggerGradingSuccess = () => {
    confetti({
      particleCount: 75,
      spread: 60,
      origin: { y: 0.6 }
    });

    if (setXp) {
      setXp((prev) => prev + 30);
    }

    const charKey = selectedChar.kanji || selectedChar.char || selectedChar.radical;
    let nextMastered = masteredChars;
    if (setMasteredChars && charKey) {
      setMasteredChars((prev) => {
        nextMastered = new Set([...prev, charKey]);
        return nextMastered;
      });
    }

    setStrokeOrderScore(100);
    setBalanceScore(98);
    setPressureScore(96);

    // Check if user completed 5 characters of the current day curriculum!
    const plan = KANA_DAILY_MAP.find((p) => p.targetChars && p.targetChars.includes(charKey));
    let isDayCompletedNow = false;
    if (plan && plan.targetChars) {
      const currentMasteredCount = plan.targetChars.filter(
        (c) => c === charKey || (masteredChars instanceof Set ? masteredChars.has(c) : false)
      ).length;
      if (currentMasteredCount >= plan.targetChars.length) {
        isDayCompletedNow = true;
        try {
          const raw = localStorage.getItem('nihon_v2_completed_days');
          const savedDays = raw ? JSON.parse(raw) : [];
          if (!savedDays.includes(plan.day)) {
            savedDays.push(plan.day);
            localStorage.setItem('nihon_v2_completed_days', JSON.stringify(savedDays));
          }
        } catch (e) {}

        if (setXp) {
          setXp((prev) => prev + 70); // 30 + 70 = 100 XP milestone
        }
        sounds.playLevelUp?.();
      }
    }

    if (isDayCompletedNow && plan) {
      setFeedbackMsg({
        text: `🎉 Xuất sắc! Bạn đã học đủ 5/5 chữ của Ngày ${plan.day}: [${plan.targetChars.join(', ')}]! Bản đồ lộ trình đã được tích xanh ✅ (+100 XP)`,
        type: 'success'
      });
    } else {
      setFeedbackMsg({
        text: `Xuất sắc! Bạn đã viết hoàn chỉnh chữ "${charKey}" chuẩn 100%! (+30 XP)`,
        type: 'success'
      });
    }
  };

  // Action 1: Xem Mẫu (Animated sample replay)
  const handleAutoReplay = () => {
    sounds.playClick();
    resetCanvas();
    setIsReplaying(true);

    let sIdx = 0;
    const interval = setInterval(() => {
      if (sIdx >= totalStrokes) {
        clearInterval(interval);
        setTimeout(() => {
          setIsReplaying(false);
          setReplayStrokeIdx(-1);
          setFeedbackMsg({
            text: 'Mẫu đã phát xong. Bây giờ đến lượt bạn viết nhé!',
            type: 'info'
          });
        }, 600);
        return;
      }
      setReplayStrokeIdx(sIdx);
      sounds.playCorrectStroke?.();
      sIdx++;
    }, 850);
  };

  // Action 2: Hoàn Tác (Undo last stroke)
  const handleUndo = () => {
    sounds.playClick();
    if (currentStrokeIdx > 0) {
      const prevIdx = currentStrokeIdx - 1;
      setCurrentStrokeIdx(prevIdx);
      setCompletedStrokes((prev) => prev.filter((i) => i !== prevIdx));
      clearUserCanvas();
      setFeedbackMsg({
        text: `Đã hoàn tác nét ${currentStrokeIdx}. Bạn có thể viết lại nét này.`,
        type: 'info'
      });
    }
  };

  // Action 3: Chấm Điểm Nét (Enter CTA)
  const handleGrade = () => {
    sounds.playClick();
    if (currentStrokeIdx >= totalStrokes) {
      triggerGradingSuccess();
    } else {
      setFeedbackMsg({
        text: `Sensei đánh giá: Đã hoàn thành ${currentStrokeIdx}/${totalStrokes} nét (Độ chuẩn hiện tại: ${strokeAccuracy}%). Hãy viết tiếp để chấm điểm hoàn tất!`,
        type: 'info'
      });
    }
  };

  // Keyboard shortcuts (Space = Replay, Z = Undo, Enter = Grade, Esc = Modal)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isModalOpen) {
        if (e.key === 'Escape') setIsModalOpen(false);
        return;
      }
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.code === 'Space') {
        e.preventDefault();
        handleAutoReplay();
      } else if (e.code === 'KeyZ') {
        e.preventDefault();
        handleUndo();
      } else if (e.code === 'Enter') {
        e.preventDefault();
        handleGrade();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, currentStrokeIdx, totalStrokes, strokeAccuracy]);

  // Stroke step details resolver
  function getStrokeStepDetails(item, idx) {
    if (item?.strokeRules && item.strokeRules[idx]) {
      const raw = item.strokeRules[idx];
      const parts = raw.split(/[:\.]\s*/);
      if (parts.length >= 2) {
        return {
          title: `Nét ${idx + 1}: ${parts[1] || 'Nét chính'}`,
          desc: parts[2] || parts[1] || 'Đưa bút dứt khoát'
        };
      }
      return {
        title: `Nét ${idx + 1}: ${raw.replace(/^\d+[\.\:]\s*/, '')}`,
        desc: 'Đưa bút từ điểm xuất phát theo hướng chuẩn'
      };
    }

    const defaultTitles = [
      { title: 'Nét mở đầu', desc: 'Sổ thẳng đứng từ trên xuống' },
      { title: 'Ngang gập móc', desc: 'Ngang phải rồi gập thẳng xuống' },
      { title: 'Ngang giữa', desc: 'Ngang ngắn ở giữa ngăn cách' },
      { title: 'Khóa đáy', desc: 'Ngang đáy đóng hoàn tất chữ' },
      { title: 'Nét phẩy trái', desc: 'Phẩy nhẹ từ trên xuống sang trái' },
      { title: 'Nét mác phải', desc: 'Đưa nét thanh thoát sang phải' }
    ];
    const def = defaultTitles[idx % defaultTitles.length];
    return {
      title: `Nét ${idx + 1}: ${def.title}`,
      desc: def.desc
    };
  }

  // Dynamic Sensei Advice
  const senseiAdvice = useMemo(() => {
    const char = selectedChar?.kanji || selectedChar?.char || selectedChar?.radical;
    if (char === '日') {
      return 'Gập nét 2 dứt khoát vuông 90 độ, nét 3 đừng chạm vào cạnh phải để giữ đúng phong cách thư pháp cổ điển!';
    }
    if (char === '月') {
      return 'Nét 1 hơi cong nhẹ sang trái, nét 2 móc nhọn dứt khoát ở đáy để tạo thế vững chãi!';
    }
    if (char === '火') {
      return 'Hai nét chấm hai bên viết trước, nét phẩy giữa vươn dài thanh thoát, nét mác phải thu gọn tạo thế cân đối!';
    }
    if (char === '水') {
      return 'Nét sổ móc ở giữa là trục chính, các nét phẩy và mác hai bên phải viết thật đăng đối!';
    }
    return `Căn chỉnh nét viết nằm ngay tâm ô Mễ, giữ khoảng cách đều giữa các nét để chữ "${char}" trông vuông vắn và thanh nhã!`;
  }, [selectedChar]);

  // Modal filtered characters
  const modalFilteredList = useMemo(() => {
    let list = [];
    if (modalCategory === 'kanji') list = kanjiDataset;
    else if (modalCategory === 'hiragana') list = hiraganaList;
    else if (modalCategory === 'katakana') list = katakanaList;
    else if (modalCategory === 'radicals') list = RADICALS_214;

    if (modalSearch.trim()) {
      const q = modalSearch.toLowerCase().trim();
      list = list.filter((item) => {
        const char = item.kanji || item.char || item.radical || '';
        const hanviet = item.hanviet || '';
        const romaji = item.romaji || '';
        const meaning = item.meaning || '';
        return (
          char.includes(q) ||
          hanviet.toLowerCase().includes(q) ||
          romaji.toLowerCase().includes(q) ||
          meaning.toLowerCase().includes(q)
        );
      });
    }

    if (modalFilter === 'mastered') {
      list = list.filter((item) =>
        masteredChars.has(item.kanji || item.char || item.radical)
      );
    } else if (modalFilter === 'learning') {
      list = list.filter(
        (item) =>
          (item.kanji || item.char || item.radical) ===
          (selectedChar?.kanji || selectedChar?.char || selectedChar?.radical)
      );
    } else if (modalFilter === 'review') {
      list = list.filter(
        (item) =>
          !masteredChars.has(item.kanji || item.char || item.radical)
      );
    } else if (modalFilter === '1-4') {
      list = list.filter((item) => (item.strokes || item.strokeCount || 1) <= 4);
    } else if (modalFilter === '5-8') {
      list = list.filter((item) => {
        const s = item.strokes || item.strokeCount || 1;
        return s >= 5 && s <= 8;
      });
    } else if (modalFilter === '9+') {
      list = list.filter((item) => (item.strokes || item.strokeCount || 1) >= 9);
    }

    return list;
  }, [modalCategory, modalSearch, modalFilter, kanjiDataset, hiraganaList, katakanaList, masteredChars, selectedChar]);

  // Active character details
  const activeCharName = selectedChar?.kanji || selectedChar?.char || selectedChar?.radical || '日';
  const activeHanviet = selectedChar?.hanviet || (selectedChar?.romaji ? selectedChar.romaji.toUpperCase() : 'NHẬT');
  const activeMeaning = selectedChar?.meaning || (selectedChar?.romaji ? `Phát âm: ${selectedChar.romaji}` : 'Mặt trời, ngày');

  const isKanjiChar = category === 'kanji' || (selectedChar && selectedChar.kanji);
  const isRadicalChar = category === 'radicals' || (selectedChar && selectedChar.radical);
  const isKanaChar = category === 'hiragana' || category === 'katakana' || (!isKanjiChar && !isRadicalChar);

  const activeOnyomi = useMemo(() => {
    if (!isKanjiChar) {
      if (selectedChar?.pinyin) return `Pinyin: ${selectedChar.pinyin}`;
      return `Romaji: [${selectedChar?.romaji || '--'}]`;
    }
    if (selectedChar?.onyomi) {
      return Array.isArray(selectedChar.onyomi) ? selectedChar.onyomi.join(', ') : selectedChar.onyomi;
    }
    return 'ニチ, ジツ';
  }, [selectedChar, isKanjiChar]);

  const activeKunyomi = useMemo(() => {
    if (!isKanjiChar) {
      if (isRadicalChar) return `Bộ #${selectedChar?.num || '--'}`;
      return `Bảng: ${category === 'hiragana' ? 'Hiragana' : 'Katakana'}`;
    }
    if (selectedChar?.kunyomi) {
      return Array.isArray(selectedChar.kunyomi) ? selectedChar.kunyomi.join(', ') : selectedChar.kunyomi;
    }
    return 'ひ, -び, -か';
  }, [selectedChar, isKanjiChar, isRadicalChar, category]);

  // Safe Mnemonic extractor: ensures result is ALWAYS a string, never an Object!
  const activeMnemonic = useMemo(() => {
    if (!selectedChar) return '';
    const m = selectedChar.mnemonicStory || selectedChar.mnemonic;
    if (typeof m === 'object' && m !== null) {
      const title = m.title ? `${m.title}: ` : '';
      const story = m.story || '';
      return `${title}${story}`.trim() || `Hình ảnh trực quan sinh động của chữ ${activeCharName}.`;
    }
    if (typeof m === 'string' && m.trim()) {
      return m.trim();
    }
    if (selectedChar.meaning) {
      return `Chữ "${activeCharName}" mang ý nghĩa: ${selectedChar.meaning}. Thể hiện vẻ đẹp thư pháp chuẩn mực.`;
    }
    return `Chữ ${activeCharName} mô phỏng hình ảnh trực quan sinh động theo phong cách thư pháp chuẩn Nhật.`;
  }, [selectedChar, activeCharName]);

  // Active compounds (from dataset or everyday Kana/Kanji dictionary)
  const activeCompounds = useMemo(() => {
    if (selectedChar?.compounds && selectedChar.compounds.length > 0) {
      return selectedChar.compounds;
    }
    if (selectedChar?.examples && selectedChar.examples.length > 0) {
      return selectedChar.examples.map((ex) => ({
        word: ex.word || ex.kana,
        hanviet: ex.romaji || '',
        meaning: ex.meaning || ''
      }));
    }

    const KANA_VOCAB_MAP = {
      'あ': [{ word: '朝 (あさ)', hanviet: 'asa', meaning: 'Buổi sáng' }, { word: '雨 (あめ)', hanviet: 'ame', meaning: 'Cơn mưa / Kẹo ngọt' }, { word: 'ありがとう', hanviet: 'arigatou', meaning: 'Cảm ơn' }],
      'い': [{ word: '犬 (いぬ)', hanviet: 'inu', meaning: 'Con chó' }, { word: '家 (いえ)', hanviet: 'ie', meaning: 'Ngôi nhà' }, { word: '今 (いま)', hanviet: 'ima', meaning: 'Bây giờ' }],
      'う': [{ word: '海 (うみ)', hanviet: 'umi', meaning: 'Biển cả' }, { word: '上 (うえ)', hanviet: 'ue', meaning: 'Phía trên' }, { word: '歌 (うた)', hanviet: 'uta', meaning: 'Bài hát' }],
      'え': [{ word: '駅 (えき)', hanviet: 'eki', meaning: 'Nhà ga' }, { word: '絵 (え)', hanviet: 'e', meaning: 'Bức tranh' }, { word: '映画 (えいが)', hanviet: 'eiga', meaning: 'Bộ phim' }],
      'お': [{ word: '男 (おとこ)', hanviet: 'otoko', meaning: 'Đàn ông' }, { word: 'お茶 (おちゃ)', hanviet: 'ocha', meaning: 'Trà xanh' }, { word: '音楽 (おんがく)', hanviet: 'ongaku', meaning: 'Âm nhạc' }],
      'か': [{ word: '傘 (かさ)', hanviet: 'kasa', meaning: 'Cái ô dù' }, { word: '川 (かわ)', hanviet: 'kawa', meaning: 'Con sông' }, { word: '顔 (かお)', hanviet: 'kao', meaning: 'Khuôn mặt' }],
      'き': [{ word: '木 (き)', hanviet: 'ki', meaning: 'Cây cối' }, { word: '切手 (きって)', hanviet: 'kitte', meaning: 'Con tem' }, { word: '今日 (きょう)', hanviet: 'kyou', meaning: 'Hôm nay' }],
      'く': [{ word: '車 (くるま)', hanviet: 'kuruma', meaning: 'Xe ô tô' }, { word: '口 (くち)', hanviet: 'kuchi', meaning: 'Cái miệng' }, { word: '靴 (くつ)', hanviet: 'kutsu', meaning: 'Đôi giày' }],
      'け': [{ word: '警察 (けいさつ)', hanviet: 'keisatsu', meaning: 'Cảnh sát' }, { word: '今朝 (けさ)', hanviet: 'kesa', meaning: 'Sáng nay' }],
      'こ': [{ word: '子供 (こども)', hanviet: 'kodomo', meaning: 'Trẻ em' }, { word: '声 (こえ)', hanviet: 'koe', meaning: 'Giọng nói' }],
      'さ': [{ word: '魚 (さかな)', hanviet: 'sakana', meaning: 'Con cá' }, { word: '桜 (さくら)', hanviet: 'sakura', meaning: 'Hoa anh đào' }],
      'し': [{ word: '島 (しま)', hanviet: 'shima', meaning: 'Hòn đảo' }, { word: '白 (しろ)', hanviet: 'shiro', meaning: 'Màu trắng' }, { word: '新聞 (しんぶん)', hanviet: 'shinbun', meaning: 'Báo chí' }],
      'す': [{ word: '寿司 (すし)', hanviet: 'sushi', meaning: 'Món Sushi' }, { word: 'すずめ', hanviet: 'suzume', meaning: 'Chim sẻ' }],
      'せ': [{ word: '先生 (せんせい)', hanviet: 'sensei', meaning: 'Thầy cô giáo' }, { word: '世界 (せかい)', hanviet: 'sekai', meaning: 'Thế giới' }],
      'そ': [{ word: '空 (そら)', hanviet: 'sora', meaning: 'Bầu trời' }, { word: '外 (そと)', hanviet: 'soto', meaning: 'Bên ngoài' }],
      'た': [{ word: '卵 (たまご)', hanviet: 'tamago', meaning: 'Quả trứng' }, { word: '食べる (たべる)', hanviet: 'taberu', meaning: 'Ăn uống' }],
      'ち': [{ word: '地図 (ちず)', hanviet: 'chizu', meaning: 'Bản đồ' }, { word: '地下鉄 (ちかてつ)', hanviet: 'chikatetsu', meaning: 'Tàu điện ngầm' }],
      'つ': [{ word: '月 (つき)', hanviet: 'tsuki', meaning: 'Mặt trăng' }, { word: '机 (つくえ)', hanviet: 'tsukue', meaning: 'Bàn học' }],
      'て': [{ word: '手 (て)', hanviet: 'te', meaning: 'Bàn tay' }, { word: '手紙 (てがみ)', hanviet: 'tegami', meaning: 'Lá thư' }],
      'と': [{ word: '友達 (ともだち)', hanviet: 'tomodachi', meaning: 'Bạn bè' }, { word: '時計 (とけい)', hanviet: 'tokei', meaning: 'Đồng hồ' }],
      'な': [{ word: '夏 (なつ)', hanviet: 'natsu', meaning: 'Mùa hè' }, { word: '名前 (なまえ)', hanviet: 'namae', meaning: 'Tên họ' }],
      'に': [{ word: '肉 (にく)', hanviet: 'niku', meaning: 'Thịt' }, { word: '日本 (にほん)', hanviet: 'nihon', meaning: 'Nhật Bản' }],
      'ぬ': [{ word: '沼 (ぬま)', hanviet: 'numa', meaning: 'Đầm lầy' }, { word: 'ぬいぐるみ', hanviet: 'nuigurumi', meaning: 'Thú bông' }],
      'ね': [{ word: '猫 (ねこ)', hanviet: 'neko', meaning: 'Con mèo' }, { word: '熱 (ねつ)', hanviet: 'netsu', meaning: 'Cơn sốt' }],
      'の': [{ word: '飲み物 (のみもの)', hanviet: 'nomimono', meaning: 'Đồ uống' }, { word: 'ノート', hanviet: 'no-to', meaning: 'Quyển vở' }],
      'は': [{ word: '花 (はな)', hanviet: 'hana', meaning: 'Bông hoa' }, { word: '春 (はる)', hanviet: 'haru', meaning: 'Mùa xuân' }],
      'ひ': [{ word: '人 (ひと)', hanviet: 'hito', meaning: 'Con người' }, { word: '光 (ひかり)', hanviet: 'hikari', meaning: 'Ánh sáng' }],
      'ふ': [{ word: '冬 (ふゆ)', hanviet: 'fuyu', meaning: 'Mùa đông' }, { word: '船 (ふね)', hanviet: 'fune', meaning: 'Con thuyền' }],
      'へ': [{ word: '部屋 (へや)', hanviet: 'heya', meaning: 'Căn phòng' }, { word: '下手 (へた)', hanviet: 'heta', meaning: 'Vụng về' }],
      'ほ': [{ word: '本 (ほん)', hanviet: 'hon', meaning: 'Quyển sách' }, { word: '星 (ほし)', hanviet: 'hoshi', meaning: 'Ngôi sao' }],
      'ま': [{ word: '町 (まち)', hanviet: 'machi', meaning: 'Thị trấn' }, { word: '窓 (まど)', hanviet: 'mado', meaning: 'Cửa sổ' }],
      'み': [{ word: '水 (みず)', hanviet: 'mizu', meaning: 'Nước uống' }, { word: '道 (みち)', hanviet: 'michi', meaning: 'Con đường' }],
      'む': [{ word: '虫 (むし)', hanviet: 'mushi', meaning: 'Côn trùng' }, { word: '村 (むら)', hanviet: 'mura', meaning: 'Ngôi làng' }],
      'め': [{ word: '目 (め)', hanviet: 'me', meaning: 'Đôi mắt' }, { word: '眼鏡 (めがね)', hanviet: 'megane', meaning: 'Kính mắt' }],
      'も': [{ word: '森 (もり)', hanviet: 'mori', meaning: 'Khu rừng' }, { word: '物 (もの)', hanviet: 'mono', meaning: 'Đồ vật' }],
      'や': [{ word: '山 (やま)', hanviet: 'yama', meaning: 'Ngọn núi' }, { word: '野菜 (やさい)', hanviet: 'yasai', meaning: 'Rau xanh' }],
      'ゆ': [{ word: '雪 (ゆき)', hanviet: 'yuki', meaning: 'Tuyết trắng' }, { word: '夢 (ゆめ)', hanviet: 'yume', meaning: 'Giấc mơ' }],
      'よ': [{ word: '夜 (よる)', hanviet: 'yoru', meaning: 'Ban đêm' }, { word: '洋服 (ようふく)', hanviet: 'youfuku', meaning: 'Quần áo' }],
      'ら': [{ word: '来週 (らいしゅう)', hanviet: 'raishuu', meaning: 'Tuần sau' }, { word: 'ラジオ', hanviet: 'rajio', meaning: 'Đài Radio' }],
      'り': [{ word: '林檎 (りんご)', hanviet: 'ringo', meaning: 'Quả táo' }, { word: '料理 (りょうり)', hanviet: 'ryouri', meaning: 'Món ăn' }],
      'る': [{ word: '留守 (るす)', hanviet: 'rusu', meaning: 'Vắng nhà' }, { word: 'ルール', hanviet: 'ru-ru', meaning: 'Quy tắc' }],
      'れ': [{ word: '歴史 (れきし)', hanviet: 'rekishi', meaning: 'Lịch sử' }, { word: '冷蔵庫 (れいぞうこ)', hanviet: 'reizouko', meaning: 'Tủ lạnh' }],
      'ろ': [{ word: '蝋燭 (ろうそく)', hanviet: 'rousoku', meaning: 'Cây nến' }, { word: '六 (ろく)', hanviet: 'roku', meaning: 'Số 6' }],
      'わ': [{ word: '私 (わたし)', hanviet: 'watashi', meaning: 'Tôi' }, { word: '和食 (わしょく)', hanviet: 'washoku', meaning: 'Ẩm thực Nhật' }],
      'を': [{ word: '本を読む (ほんをよむ)', hanviet: 'hon o yomu', meaning: 'Đọc sách (trợ từ)' }],
      'ん': [{ word: '音楽 (おんがく)', hanviet: 'ongaku', meaning: 'Âm nhạc' }, { word: '便利 (べんり)', hanviet: 'benri', meaning: 'Tiện lợi' }]
    };

    if (KANA_VOCAB_MAP[activeCharName]) {
      return KANA_VOCAB_MAP[activeCharName];
    }

    return [
      { word: '日本 (にほん)', hanviet: 'Nhật Bản', meaning: 'Nước Nhật' },
      { word: '日曜日 (にちようび)', hanviet: 'Nhật Diệu Nhật', meaning: 'Chủ nhật' },
      { word: '毎日 (まいにち)', hanviet: 'Mỗi Nhật', meaning: 'Mỗi ngày' },
      { word: '休日 (きゅうじつ)', hanviet: 'Hưu Nhật', meaning: 'Ngày nghỉ' }
    ];
  }, [selectedChar, activeCharName]);

  const activeRomaji = selectedChar?.romaji || '';

  const activeReadingGuide = useMemo(() => {
    if (selectedChar?.soundGuide) return selectedChar.soundGuide;
    if (isKanaChar) {
      const char = activeCharName;
      const guides = {
        'あ': 'Mở miệng tự nhiên, phát âm "a" tròn và dứt khoát',
        'い': 'Môi kéo sang hai bên, phát âm "i" nhẹ nhàng',
        'う': 'Môi hơi chu nhẹ về trước, không tròn môi như tiếng Việt',
        'え': 'Khẩu hình mở vừa phải giữa "e" và "ê"',
        'お': 'Môi tròn nhẹ, phát âm "o" sâu từ cổ họng',
        'か': 'Âm "k" bật nhẹ kết hợp "a", rõ ràng',
        'き': 'Âm "k" kết hợp "i", cười nhẹ hai khóe môi',
        'く': 'Âm "k" kết hợp "u", môi thả lỏng',
        'け': 'Âm "k" kết hợp "e"',
        'こ': 'Âm "k" kết hợp "o"',
        'さ': 'Âm "s" xát nhẹ qua kẽ răng kết hợp "a"',
        'し': 'Âm "sh" nhẹ như "xi" tiếng Việt, đầu lưỡi sát vòm trên',
        'す': 'Âm "s" kết hợp "u", không chu môi quá mức',
        'せ': 'Âm "s" kết hợp "e"',
        'そ': 'Âm "s" kết hợp "o"',
        'た': 'Âm "t" bật rõ kết hợp "a"',
        'ち': 'Âm "ch" trong "chi", phát âm dứt khoát',
        'つ': 'Âm "ts" bật hơi qua đầu lưỡi và răng cửa',
        'て': 'Âm "t" kết hợp "e"',
        'と': 'Âm "t" kết hợp "o"',
        'な': 'Âm "n" mềm từ vòm họng',
        'に': 'Âm "n" kết hợp "i"',
        'ぬ': 'Âm "n" kết hợp "u"',
        'ね': 'Âm "n" kết hợp "e"',
        'の': 'Âm "n" kết hợp "o"',
        'は': 'Âm "h" thở nhẹ',
        'ひ': 'Âm "h" xát qua vòm cứng miệng',
        'ふ': 'Thổi hơi nhẹ qua hai môi hé mở, không chạm răng như âm "ph"',
        'へ': 'Âm "h" kết hợp "e"',
        'ほ': 'Âm "h" kết hợp "o"',
        'ま': 'Hai môi khép nhẹ bật âm "m"',
        'み': 'Âm "m" kết hợp "i"',
        'む': 'Âm "m" kết hợp "u"',
        'め': 'Âm "m" kết hợp "e"',
        'も': 'Âm "m" kết hợp "o"',
        'や': 'Âm lướt "y" sang "a" nhanh chóng',
        'ゆ': 'Âm lướt "y" sang "u"',
        'よ': 'Âm lướt "y" sang "o"',
        'ら': 'Đầu lưỡi chạm nhẹ vòm họng trên bật ra',
        'り': 'Đầu lưỡi gõ nhẹ kết hợp "i"',
        'る': 'Đầu lưỡi gõ nhẹ kết hợp "u"',
        'れ': 'Đầu lưỡi gõ nhẹ kết hợp "e"',
        'ろ': 'Đầu lưỡi gõ nhẹ kết hợp "o"',
        'わ': 'Môi tròn lướt nhẹ sang "a"',
        'を': 'Đọc giống "o", dùng làm trợ từ ngữ pháp',
        'ん': 'Âm mũi "n/ng", ngậm môi hoặc chạm vòm'
      };
      return guides[char] || `Phát âm chuẩn Tokyo theo âm [${activeRomaji || char}]`;
    }
    return `Hán-Việt: ${activeHanviet} • Âm đọc chuẩn JLPT N5`;
  }, [selectedChar, activeCharName, isKanaChar, activeRomaji, activeHanviet]);

  // Everyday Vocabulary Examples for the Large Card (addresses User Request 3)
  const charExamples = useMemo(() => {
    if (activeCompounds && activeCompounds.length > 0) {
      return activeCompounds.map(c => ({
        word: c.word,
        reading: c.reading || c.hanviet || '',
        meaning: c.meaning || ''
      }));
    }
    return [
      { word: activeCharName, reading: activeRomaji || activeHanviet, meaning: activeMeaning }
    ];
  }, [activeCompounds, activeCharName, activeRomaji, activeHanviet, activeMeaning]);

  const currentStepInfo = getStrokeStepDetails(selectedChar, currentStrokeIdx);

  // Active Stroke endpoints calculation for dynamic guide line and beacon
  const currentEndpoints = useMemo(() => {
    const p = strokeSvgPaths[currentStrokeIdx];
    return extractStrokeEndpoints(p);
  }, [strokeSvgPaths, currentStrokeIdx]);

  // Vertical character queue list ref
  const queueListRef = useRef(null);

  // Dynamic Kanji topics with live counts
  const kanjiTopics = useMemo(() => {
    const counts = { date_number: 0, nature: 0, direction_life: 0 };
    kanjiDataset.forEach((k) => {
      if (counts[k.topic] !== undefined) counts[k.topic]++;
    });
    return [
      { id: 'all', label: 'Tất cả', icon: '✦', count: kanjiDataset.length },
      { id: 'date_number', label: 'Ngày & Số', icon: '📅', count: counts.date_number },
      { id: 'nature', label: 'Tự Nhiên', icon: '🌄', count: counts.nature },
      { id: 'direction_life', label: 'Phương Hướng & Đời Sống', icon: '🧭', count: counts.direction_life }
    ];
  }, [kanjiDataset]);

  // Current Day Plan in Kana Curriculum (5 characters per day)
  const currentDayPlan = useMemo(() => {
    return KANA_DAILY_MAP.find((plan) => plan.targetChars && plan.targetChars.includes(activeCharName));
  }, [activeCharName]);

  // Day progress check (e.g. 5/5 completed characters with green tick)
  const dayProgress = useMemo(() => {
    if (!currentDayPlan) return null;
    const mSet = masteredChars instanceof Set ? masteredChars : new Set(masteredChars || []);
    const completedCount = currentDayPlan.targetChars.filter((c) => mSet.has(c)).length;
    return {
      day: currentDayPlan.day,
      title: currentDayPlan.title,
      targetChars: currentDayPlan.targetChars,
      completedCount,
      total: currentDayPlan.targetChars.length,
      isDone: completedCount >= currentDayPlan.targetChars.length
    };
  }, [currentDayPlan, masteredChars]);

  // Switch category safely and select initial item
  const handleCategoryChange = (newCat) => {
    sounds.playClick();
    setCategory(newCat);
    setSearchQuery('');
    if (newCat === 'kanji') {
      if (kanjiDataset.length > 0) handleSelectChar(kanjiDataset[0]);
    } else if (newCat === 'hiragana') {
      if (hiraganaList.length > 0) handleSelectChar(hiraganaList[0]);
    } else if (newCat === 'katakana') {
      if (katakanaList.length > 0) handleSelectChar(katakanaList[0]);
    } else if (newCat === 'radicals') {
      if (RADICALS_214.length > 0) handleSelectChar(RADICALS_214[0]);
    }
  };

  // Switch topic safely
  const handleTopicChange = (topicId) => {
    sounds.playClick();
    setActiveTopic(topicId);
    let filtered = kanjiDataset;
    if (topicId !== 'all') {
      filtered = kanjiDataset.filter((k) => k.topic === topicId);
    }
    if (filtered.length > 0 && !filtered.some((k) => k.kanji === selectedChar?.kanji)) {
      handleSelectChar(filtered[0]);
    }
  };

  // Auto scroll active character item into view at top of vertical queue list
  useEffect(() => {
    if (queueListRef.current && activeCharName) {
      const activeEl = queueListRef.current.querySelector(`[data-char="${activeCharName}"]`);
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [activeCharName, category, activeTopic]);

  // Global shortcut: Press 'F' to open full character browser modal
  useEffect(() => {
    const handleGlobalKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        setModalCategory(category);
        setIsModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, [category]);

  return (
    <div className="min-h-screen w-full bg-[#0a0e18] text-slate-200 antialiased flex flex-col font-sans select-none overflow-x-hidden">
      {/* ================= TOP MAIN HEADER ================= */}
      <header
        className="h-14 w-full bg-[#0f131d] border-b border-slate-800/80 px-3 sm:px-4 lg:px-6 flex items-center justify-between flex-shrink-0 z-30 shadow-md"
        data-purpose="app-top-header"
      >
        <div className="w-full max-w-[1560px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Back to Roadmap button */}
            {onNavigate && (
              <button
                onClick={() => onNavigate('roadmap')}
                className="px-2.5 py-1 rounded-xl bg-[#171b26] hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 flex items-center gap-1.5 text-xs font-semibold transition cursor-pointer"
                title="Quay lại Bản Đồ Lộ Trình N5"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
                </svg>
                <span className="hidden sm:inline">Lộ Trình</span>
              </button>
            )}

            {/* App Brand Logo */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#ff2d55] to-rose-400 flex items-center justify-center shadow-md shadow-rose-950/60 text-white font-bold text-base font-kanji">
                {activeCharName}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-sm font-extrabold tracking-tight text-white flex items-center gap-1.5">
                    Luyện Viết Bút Thuận
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold tracking-wide uppercase bg-rose-500/15 text-rose-300 border border-rose-500/30 leading-normal">
                    Thư Pháp Chuẩn Nhật
                  </span>
                </div>
                <p className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium leading-none mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Cảm biến nhận diện nét thư pháp AI • Độ chuẩn {strokeAccuracy}%
                </p>
              </div>
            </div>
          </div>

          {/* Center Mode / Status Pill */}
          <div className="hidden md:flex items-center gap-2 bg-[#171b26] px-3 py-1 rounded-full border border-slate-800 text-xs">
            <span className="text-slate-400">Đang luyện tập:</span>
            <span className="font-bold text-rose-400 font-kanji">
              {activeCharName} ({activeHanviet})
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-300">
              Nét {Math.min(currentStrokeIdx + 1, totalStrokes)}/{totalStrokes}
            </span>
            <button
              onClick={() => setAutoStrokeDetection((prev) => !prev)}
              className={`px-1.5 py-0.2 text-[10px] rounded font-semibold cursor-pointer transition ${
                autoStrokeDetection
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}
              title="Nhấn để Bật/Tắt tự động nhận diện nét"
            >
              {autoStrokeDetection ? 'Tự động bắt nét ON' : 'Tự do vẽ OFF'}
            </button>
          </div>

          {/* Gamification & Stats & Settings */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold text-xs">
              <span>🔥 Streak {streak}d</span>
              <span className="text-amber-500/40">|</span>
              <span>{masteredChars.size}/103 Đạt</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r from-rose-950/50 to-indigo-950/40 border border-rose-500/30 text-rose-300 font-bold text-xs">
              <span className="text-yellow-400">★</span>
              <span>+{xp} XP</span>
            </div>
            <button
              onClick={() => {
                if (speak) speak(activeCharName);
                else if (toggleSound) toggleSound();
              }}
              className="w-8 h-8 rounded-lg bg-[#171b26] hover:bg-slate-800 text-slate-300 border border-slate-800 flex items-center justify-center transition cursor-pointer"
              title={`Phát âm chữ "${activeCharName}"`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* ================= SUB-HEADER: GLOBAL CHARACTER NAVIGATION SUITE ================= */}
      <section
        className="w-full bg-[#0d111c]/95 backdrop-blur-md border-b border-slate-800/80 px-3 sm:px-4 py-2 flex-shrink-0 z-20 shadow-lg"
        data-purpose="character-navigation-suite"
      >
        {/* Tier 1: Category Switcher, Topic Filters & Global Search Actions */}
        <div className="w-full max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5 pb-1">
          {/* 1. Category Switch Tabs (Segmented Control - Vuốt ngang mượt trên mobile) */}
          <div className="flex items-center overflow-x-auto scrollbar-none w-full md:w-auto bg-[#070a13] p-1 rounded-xl border border-slate-800/90 shadow-inner flex-shrink-0 gap-1">
            {/* 1. Hiragana Tab (Chặng 1) */}
            <button
              id="hiragana-tab-btn"
              onClick={() => handleCategoryChange('hiragana')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer select-none whitespace-nowrap flex-shrink-0 ${
                category === 'hiragana'
                  ? 'bg-gradient-to-r from-[#ff2d55] to-rose-600 text-white shadow-md shadow-rose-950/60 ring-1 ring-rose-400/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
              title="Bảng Chữ Mềm Hiragana (46 chữ)"
            >
              <span className="text-sm font-kanji leading-none">あ</span>
              <span>Hiragana</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                  category === 'hiragana' ? 'bg-black/35 text-rose-100' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {hiraganaList.length || 46}
              </span>
            </button>

            {/* 2. Katakana Tab (Chặng 2) */}
            <button
              id="katakana-tab-btn"
              onClick={() => handleCategoryChange('katakana')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer select-none whitespace-nowrap flex-shrink-0 ${
                category === 'katakana'
                  ? 'bg-gradient-to-r from-[#ff2d55] to-rose-600 text-white shadow-md shadow-rose-950/60 ring-1 ring-rose-400/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
              title="Bảng Chữ Cứng Katakana (46 chữ)"
            >
              <span className="text-sm font-kanji leading-none">ア</span>
              <span>Katakana</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                  category === 'katakana' ? 'bg-black/35 text-rose-100' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {katakanaList.length || 46}
              </span>
            </button>

            {/* 3. Kanji N5 Tab (Chặng 3) */}
            <button
              id="kanji-n5-tab-btn"
              onClick={() => handleCategoryChange('kanji')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer select-none whitespace-nowrap flex-shrink-0 ${
                category === 'kanji'
                  ? 'bg-gradient-to-r from-[#ff2d55] to-rose-600 text-white shadow-md shadow-rose-950/60 ring-1 ring-rose-400/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
              title="Kanji Chuẩn N5 (103 chữ Hán cốt lõi)"
            >
              <span className="text-sm font-kanji leading-none">漢</span>
              <span>Kanji N5</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                  category === 'kanji' ? 'bg-black/35 text-rose-100' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {kanjiDataset.length}
              </span>
            </button>

            {/* 4. 214 Radicals Tab (Tùy chọn) */}
            <button
              id="radicals-tab-btn"
              onClick={() => handleCategoryChange('radicals')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer select-none whitespace-nowrap flex-shrink-0 ${
                category === 'radicals'
                  ? 'bg-gradient-to-r from-[#ff2d55] to-rose-600 text-white shadow-md shadow-rose-950/60 ring-1 ring-rose-400/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
              title="214 Bộ Thủ Khang Hy (Học bổ trợ tùy chọn)"
            >
              <span className="text-sm font-kanji leading-none">部</span>
              <span>214 Bộ Thủ</span>
              <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                Tùy chọn
              </span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                  category === 'radicals' ? 'bg-black/35 text-rose-100' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {RADICALS_214.length || 214}
              </span>
            </button>
          </div>

          {/* 2. Topic Filter Chips (Kanji) or Informative Category Status */}
          <div className="hidden lg:flex items-center gap-1.5 flex-1 min-w-0 px-2 justify-center">
            {category === 'kanji' ? (
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mr-0.5 flex-shrink-0">
                  Chủ đề:
                </span>
                {kanjiTopics.map((topic) => {
                  const isActive = activeTopic === topic.id;
                  return (
                    <button
                      key={topic.id}
                      onClick={() => handleTopicChange(topic.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs transition-all duration-150 cursor-pointer flex items-center gap-1.5 flex-shrink-0 select-none ${
                        isActive
                          ? 'bg-rose-500/15 text-rose-300 font-bold border border-rose-500/40 shadow-sm'
                          : 'bg-[#101422] text-slate-400 hover:text-slate-200 border border-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      <span>{topic.icon}</span>
                      <span>{topic.label}</span>
                      <span
                        className={`text-[10px] font-mono px-1 rounded ${
                          isActive ? 'bg-rose-500/25 text-rose-200' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {topic.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : category === 'hiragana' ? (
              <div className="flex items-center gap-2 text-xs text-slate-400 bg-[#070a13] px-3 py-1 rounded-xl border border-slate-800/70">
                <span className="text-rose-400 font-bold">あいうえお</span>
                <span className="text-slate-600">•</span>
                <span>Bảng chữ mềm cơ bản Gojuon • 46 âm tiết tiêu chuẩn Nhật Bản</span>
              </div>
            ) : category === 'katakana' ? (
              <div className="flex items-center gap-2 text-xs text-slate-400 bg-[#070a13] px-3 py-1 rounded-xl border border-slate-800/70">
                <span className="text-rose-400 font-bold">アイウエオ</span>
                <span className="text-slate-600">•</span>
                <span>Bảng chữ cứng Katakana • Dùng cho từ mượn quốc tế & phiên âm</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs text-slate-400 bg-[#070a13] px-3 py-1 rounded-xl border border-slate-800/70">
                <span className="text-rose-400 font-bold">一丨丶丿乙亅</span>
                <span className="text-slate-600">•</span>
                <span>214 Bộ Thủ Khang Hy cổ điển • Gốc rễ tạo chữ Hán tự N5 - N1</span>
              </div>
            )}
          </div>

          {/* 3. Global Search & Full Catalog Modal Trigger */}
          <div className="w-full md:w-auto flex items-center justify-between md:justify-end gap-2 flex-shrink-0">
            <div className="relative flex-1 sm:w-56 xl:w-64">
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 bg-[#070a13] border border-slate-800/90 rounded-xl pl-10 pr-8 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500/30 transition shadow-inner"
                placeholder="Tìm Kanji, Hán Việt, Romaji..."
                type="text"
              />
              <svg
                className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
              </svg>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer w-4.5 h-4.5 flex items-center justify-center rounded-full bg-slate-800 text-[10px]"
                  title="Xóa tìm kiếm"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Progress indicator badge */}
            <div className="hidden sm:flex items-center gap-1.5 bg-[#070a13] px-2.5 py-1 rounded-xl border border-slate-800/90 text-xs font-mono text-slate-400 flex-shrink-0">
              <span className="text-rose-400 font-bold font-kanji text-sm">{activeCharName}</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-300 font-semibold">
                #{Math.max(1, currentList.findIndex((c) => (c.kanji || c.char || c.radical) === activeCharName) + 1)}
                /{currentList.length}
              </span>
            </div>

            <button
              onClick={() => {
                sounds.playClick();
                setModalCategory(category);
                setIsModalOpen(true);
              }}
              className="h-9 px-3 bg-gradient-to-r from-slate-900 to-[#141926] hover:from-slate-800 hover:to-[#1d2334] text-slate-200 hover:text-white border border-slate-700/80 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm transition cursor-pointer active:scale-95 flex-shrink-0"
              title="Mở Bảng Tra Cứu Toàn Bộ Chữ (Phím F)"
              id="open-kanji-browser-btn"
            >
              <svg className="w-3.5 h-3.5 text-rose-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              <span>Bảng Chữ</span>
              <kbd className="hidden xl:inline text-[9px] bg-slate-800 text-slate-400 px-1 py-0.2 rounded border border-slate-700">
                F
              </kbd>
            </button>
          </div>
        </div>
      </section>

      {/* ================= MAIN STUDIO WORKSPACE (3-COLUMN BALANCED DESKTOP LAYOUT) ================= */}
      <main
        className="flex-1 w-full max-w-[1600px] mx-auto px-3 sm:px-4 lg:px-6 py-2 sm:py-3.5 flex flex-col justify-start"
        data-purpose="kanji-studio-body"
      >
        {/* Mobile Navigation Tabs (Chỉ hiện trên mobile/màn hình nhỏ) */}
        <div className="lg:hidden w-full max-w-[500px] mx-auto mb-2.5 bg-[#0f131d] p-1 rounded-xl border border-slate-800/90 flex items-center gap-1 shadow-md flex-shrink-0">
          <button
            onClick={() => setMobileTab('canvas')}
            className={`flex-1 py-2 px-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              mobileTab === 'canvas'
                ? 'bg-gradient-to-r from-[#ff2d55] to-rose-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>✍️</span>
            <span>Bàn Vẽ</span>
          </button>
          <button
            onClick={() => setMobileTab('queue')}
            className={`flex-1 py-2 px-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              mobileTab === 'queue'
                ? 'bg-gradient-to-r from-[#ff2d55] to-rose-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>📚</span>
            <span>Chữ Tiếp Theo</span>
          </button>
          <button
            onClick={() => setMobileTab('strokes')}
            className={`flex-1 py-2 px-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              mobileTab === 'strokes'
                ? 'bg-gradient-to-r from-[#ff2d55] to-rose-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>📋</span>
            <span>Nét &amp; Mẹo</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 lg:gap-4 xl:gap-6 items-start">
          {/* ================= COL 1: CHARACTER IDENTITY & STROKE BREAKDOWN (3 COLS) ================= */}
          <section
            className={`col-span-1 lg:col-span-3 xl:col-span-3 ${
              mobileTab !== 'strokes' ? 'hidden lg:flex' : 'flex'
            } flex-col gap-3 min-w-0 order-3 lg:order-1`}
            data-purpose="character-info-panel"
          >
            {/* 1. Kanji Top Identity Card */}
            <div className="bg-[#0f131d] border border-slate-800/90 rounded-2xl p-3 sm:p-3.5 relative overflow-hidden shadow-lg flex-shrink-0">
              <div className="absolute -right-3 -bottom-6 text-8xl font-kanji text-slate-800/15 pointer-events-none select-none">
                {activeCharName}
              </div>
              <div className="flex items-start gap-3 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#ff2d55]/20 to-indigo-950/50 border border-rose-500/40 flex items-center justify-center text-3xl font-bold font-kanji text-rose-400 shadow-md relative flex-shrink-0">
                  {activeCharName}
                  <button
                    onClick={() => speak && speak(activeCharName)}
                    className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#171b26] hover:bg-[#ff2d55] border border-rose-500/40 text-rose-300 hover:text-white flex items-center justify-center text-[10px] transition shadow cursor-pointer"
                    title={`Nghe phát âm chuẩn chữ ${activeCharName}`}
                  >
                    🔊
                  </button>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-base sm:text-lg font-black text-white tracking-wide truncate">
                      {activeHanviet}
                    </span>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <span className="px-2.5 py-0.5 rounded-md bg-[#171b26] text-[11px] text-rose-300 font-mono font-bold border border-slate-700/80 leading-normal">
                        {totalStrokes} Nét
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 line-clamp-2 break-words" title={activeMeaning}>
                    Nghĩa: {activeMeaning}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className="px-2 py-0.5 text-[10px] rounded-md bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 font-bold">
                      JLPT N5
                    </span>
                    <span className="px-2 py-0.5 text-[10px] rounded-md bg-indigo-950/80 border border-indigo-700/60 text-indigo-300 font-medium truncate">
                      {selectedChar?.radical ? `Bộ: ${selectedChar.radical}` : isKanaChar ? 'Kana' : 'Thư pháp'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Phonetics Readings Grid */}
              <div className="grid grid-cols-2 gap-2 mt-2.5 pt-2.5 border-t border-slate-800/80 text-xs">
                <div className="bg-[#0a0e18] p-2 rounded-xl border border-slate-800/70 min-w-0">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5 truncate">
                    {isKanjiChar ? 'Onyomi (Âm On)' : 'Phiên Âm Romaji'}
                  </span>
                  <span className="text-rose-300 font-semibold font-mono text-xs truncate block" title={activeOnyomi}>
                    {activeOnyomi}
                  </span>
                </div>
                <div className="bg-[#0a0e18] p-2 rounded-xl border border-slate-800/70 min-w-0">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5 truncate">
                    {isKanjiChar ? 'Kunyomi (Âm Kun)' : 'Phân Loại'}
                  </span>
                  <span className="text-cyan-300 font-semibold font-mono text-xs truncate block" title={activeKunyomi}>
                    {activeKunyomi}
                  </span>
                </div>
              </div>

              {/* Tokyo Pronunciation Guide */}
              <div className="mt-2 p-2 rounded-xl bg-[#0a0e18] border border-slate-800/70 text-[11px] text-slate-300">
                <span className="text-slate-400 font-semibold">Khẩu hình: </span>
                <strong className="text-amber-300 font-medium">{activeReadingGuide}</strong>
              </div>
            </div>

            {/* 2. Stroke Order Step Breakdown */}
            <div className="bg-[#0f131d] border border-slate-800/90 rounded-2xl p-3 sm:p-3.5 flex flex-col overflow-hidden shadow-lg flex-shrink-0">
              <div className="flex items-center justify-between mb-2 flex-shrink-0">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  Sơ đồ {totalStrokes} nét bút thuận
                </h2>
                <span className="text-[11px] text-rose-400 font-mono font-bold">
                  Nét {Math.min(currentStrokeIdx + 1, totalStrokes)} / {totalStrokes}
                </span>
              </div>

              {/* Sequence List */}
              <div className="space-y-1.5 overflow-y-auto max-h-[160px] sm:max-h-[180px] pr-1 text-xs">
                {Array.from({ length: totalStrokes }).map((_, sIdx) => {
                  const step = getStrokeStepDetails(selectedChar, sIdx);
                  const isDone = sIdx < currentStrokeIdx;
                  const isActive = sIdx === currentStrokeIdx;

                  if (isDone) {
                    return (
                      <div
                        key={`step-${sIdx}`}
                        className="flex items-center justify-between p-2 rounded-xl bg-[#0a0e18] border border-emerald-500/30"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                            {sIdx + 1}
                          </div>
                          <div className="min-w-0">
                            <span className="font-bold text-slate-200 block truncate">{step.title}</span>
                            <p className="text-[10px] text-slate-400 truncate">{step.desc}</p>
                          </div>
                        </div>
                        <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5 flex-shrink-0 ml-1">
                          ✓ Đã vẽ
                        </span>
                      </div>
                    );
                  }

                  if (isActive) {
                    return (
                      <div
                        key={`step-${sIdx}`}
                        className="flex items-center justify-between p-2 rounded-xl bg-gradient-to-r from-rose-950/70 to-[#1e1327] border-2 border-[#ff2d55] neon-glow-pink"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-5 h-5 rounded-full bg-[#ff2d55] text-white flex items-center justify-center font-bold text-[10px] animate-pulse flex-shrink-0">
                            {sIdx + 1}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-white truncate">{step.title}</span>
                              <span className="px-1 py-0.2 bg-[#ff2d55] text-[9px] rounded text-white uppercase font-bold flex-shrink-0">
                                Hiện tại
                              </span>
                            </div>
                            <p className="text-[10px] text-rose-200/80 truncate">{step.desc}</p>
                          </div>
                        </div>
                        <span className="text-[10px] text-rose-300 font-semibold animate-pulse flex-shrink-0 ml-1">
                          Đang viết...
                        </span>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={`step-${sIdx}`}
                      className="flex items-center justify-between p-2 rounded-xl bg-[#0a0e18]/60 border border-slate-800 text-slate-500"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-5 h-5 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                          {sIdx + 1}
                        </div>
                        <div className="min-w-0">
                          <span className="font-medium text-slate-400 block truncate">{step.title}</span>
                          <p className="text-[10px] text-slate-600 truncate">{step.desc}</p>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-600 flex-shrink-0 ml-1">Chờ vẽ</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. Kanji Visual Mnemonic Hint */}
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5 flex-shrink-0">
              <span className="text-lg leading-none">💡</span>
              <div className="min-w-0 flex-1">
                <h3 className="text-xs font-bold text-amber-300">
                  Mẹo nhớ chữ {activeCharName}:
                </h3>
                <p className="text-[11px] text-amber-200/90 leading-snug mt-0.5 break-words line-clamp-3" title={activeMnemonic}>
                  {activeMnemonic}
                </p>
              </div>
            </div>
          </section>

          {/* ================= COL 2: MAIN EXPANSIVE PRACTICE CANVAS (6 COLS) ================= */}
          <section
            className={`col-span-1 lg:col-span-6 xl:col-span-6 ${
              mobileTab !== 'canvas' ? 'hidden lg:flex' : 'flex'
            } flex-col items-center gap-2.5 order-1 lg:order-2 w-full`}
            data-purpose="canvas-studio-center"
          >
            {/* Canvas Top Toolbar Ribbon - Clean, Focused & Minimalist */}
            <div
              className="w-full max-w-[520px] bg-[#0f131d] border border-slate-800/90 rounded-2xl px-3 sm:px-3.5 py-2 flex items-center justify-between gap-2 sm:gap-3 shadow-lg flex-shrink-0"
              data-purpose="canvas-toolbar"
            >
              {/* Stroke Thickness Picker */}
              <div className="flex items-center gap-2 bg-[#0a0e18] px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Cỡ nét:
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      sounds.playClick();
                      setBrushSize('small');
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer border ${
                      brushSize === 'small'
                        ? 'bg-rose-500/20 border-2 border-[#ff2d55] text-white shadow-sm'
                        : 'border-slate-800/80 hover:border-slate-700 hover:bg-slate-800 text-slate-400'
                    }`}
                    title="Nét Mảnh (6px)"
                  >
                    <div className={`w-1.5 h-1.5 rounded-full ${brushSize === 'small' ? 'bg-[#ff2d55]' : 'bg-slate-400'}`}></div>
                    <span>Mảnh</span>
                  </button>
                  <button
                    onClick={() => {
                      sounds.playClick();
                      setBrushSize('medium');
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer border ${
                      brushSize === 'medium'
                        ? 'bg-rose-500/20 border-2 border-[#ff2d55] text-white shadow-sm'
                        : 'border-slate-800/80 hover:border-slate-700 hover:bg-slate-800 text-slate-400'
                    }`}
                    title="Nét Tiêu Chuẩn (9px)"
                  >
                    <div className={`w-2.5 h-2.5 rounded-full ${brushSize === 'medium' ? 'bg-[#ff2d55]' : 'bg-slate-400'}`}></div>
                    <span>Vừa</span>
                  </button>
                  <button
                    onClick={() => {
                      sounds.playClick();
                      setBrushSize('large');
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer border ${
                      brushSize === 'large'
                        ? 'bg-rose-500/20 border-2 border-[#ff2d55] text-white shadow-sm'
                        : 'border-slate-800/80 hover:border-slate-700 hover:bg-slate-800 text-slate-400'
                    }`}
                    title="Nét Đậm (13px)"
                  >
                    <div className={`w-3.5 h-3.5 rounded-full ${brushSize === 'large' ? 'bg-[#ff2d55]' : 'bg-slate-400'}`}></div>
                    <span>Đậm</span>
                  </button>
                </div>
              </div>

              {/* Guide Trace & Clear Canvas Controls */}
              <div className="flex items-center gap-2">
                {/* Toggle Switch Nét Mờ Gợi Ý */}
                <button
                  onClick={() => {
                    sounds.playClick();
                    setShowFaint((prev) => !prev);
                  }}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 shadow-sm transition cursor-pointer group ${
                    showFaint
                      ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/50'
                      : 'bg-slate-900/60 border-slate-700 text-slate-400 hover:bg-slate-800'
                  }`}
                  title="Nhấn để Bật/Tắt đường nét mờ chỉ dẫn mẫu"
                >
                  <svg
                    className={`w-3.5 h-3.5 flex-shrink-0 group-hover:scale-110 transition-transform ${
                      showFaint ? 'text-emerald-400' : 'text-slate-500'
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    <path
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  </svg>
                  <span>Nét Mờ:</span>
                  <span
                    className={`px-1.5 py-0.2 rounded text-[10px] font-extrabold uppercase border ${
                      showFaint
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {showFaint ? 'BẬT' : 'TẮT'}
                  </span>
                </button>

                {/* Clear Canvas Quick Button */}
                <button
                  onClick={handleResetAll}
                  className="p-1.5 rounded-xl bg-[#0a0e18] hover:bg-slate-800 text-slate-400 hover:text-rose-400 border border-slate-800 transition cursor-pointer"
                  title="Xóa viết lại từ đầu"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                </button>
              </div>
            </div>

            {/* The Canvas Frame: Dáng ban đầu vuông vức, cân đối */}
            <div
              ref={containerRef}
              className={`relative w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] md:w-[380px] md:h-[380px] lg:w-[390px] lg:h-[390px] xl:w-[410px] xl:h-[410px] max-w-[92vw] aspect-square bg-[#0f131d] rounded-3xl p-2 sm:p-3 border border-slate-800/90 shadow-2xl flex items-center justify-center overflow-hidden transition-transform mx-auto ${
                shake ? 'animate-shake' : ''
              }`}
            >
              {/* Indicator Badge Top-Left */}
              <div className="absolute top-5 left-5 z-20 flex items-center gap-2 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-slate-700/70 text-xs font-semibold text-white shadow-md">
                <span className="w-2 h-2 rounded-full bg-[#ff2d55] animate-ping"></span>
                <span className="truncate max-w-[200px]">
                  Nét {Math.min(currentStrokeIdx + 1, totalStrokes)} / {totalStrokes}: {currentStepInfo.title}
                </span>
              </div>

              {/* Quick Canvas Control Top-Right */}
              <div className="absolute top-5 right-5 z-20 flex items-center gap-1.5 bg-black/80 backdrop-blur-md border border-slate-700/70 px-2.5 py-1 rounded-full text-xs text-slate-300 shadow-md">
                <span className="text-cyan-400 font-mono">Sens: {strokeAccuracy}%</span>
              </div>

              {/* Traditional Japanese Rice Paper Sheet with Quadrant Grid */}
              <div
                className={`w-full h-full bg-[#fdfdfc] rounded-2xl ${
                  gridType === 'mizi' ? 'canvas-mizi-grid' : 'canvas-tian-grid'
                } relative flex items-center justify-center overflow-hidden shadow-inner cursor-crosshair group select-none`}
              >
                {/* 3-Fail Prominent Alert Badge */}
                {strokeFailCount >= 3 && (
                  <div className="absolute top-12 inset-x-4 sm:inset-x-8 z-30 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600/95 text-white font-bold text-xs shadow-lg animate-bounce border border-rose-300 pointer-events-none">
                    <span>👆 Mũi tên vuốt hướng dẫn đang bật</span>
                    <span className="text-white/90 font-normal hidden sm:inline">• Vuốt xuôi từ số {currentStrokeIdx + 1} theo chiều mũi tên</span>
                  </div>
                )}

                {/* Synchronized 1:1 Drawing Viewport (Exact same square for both SVG and Canvas) */}
                <div className="relative w-full h-full p-4 sm:p-6 lg:p-7 flex items-center justify-center">
                  <div className="relative w-full h-full aspect-square flex items-center justify-center">
                    {/* SVG Stroke Vector Layer */}
                    <svg
                      viewBox={charBox.viewBox}
                      className="absolute inset-0 w-full h-full pointer-events-none select-none z-0"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {/* SVG Arrow Marker Definition for Directional Swipe */}
                      <defs>
                        <marker
                          id="swipeArrowMarker"
                          markerUnits="userSpaceOnUse"
                          viewBox="0 0 10 10"
                          refX="5"
                          refY="5"
                          markerWidth={charBox.size === 100 ? 7 : 14}
                          markerHeight={charBox.size === 100 ? 7 : 14}
                          orient="auto-start-reverse"
                        >
                          <path d="M 1 2 L 8 5 L 1 8 L 3 5 Z" fill="#ff2d55" />
                        </marker>
                      </defs>

                      {/* 1. Completed Strokes (Crisp Sumi ink - rendered first) */}
                      {strokeSvgPaths.map((path, idx) => {
                        const isDrawn = idx < currentStrokeIdx;
                        const isReplayingActive = idx === replayStrokeIdx;
                        if (!isDrawn && !isReplayingActive) return null;

                        return (
                          <path
                            key={`completed-${idx}`}
                            d={path}
                            fill="none"
                            stroke={isReplayingActive ? '#ff2d55' : '#181e29'}
                            strokeWidth={charBox.size === 100 ? 7.5 : 16}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        );
                      })}

                      {/* 2. Future Pending Strokes (NÉT LIỀN - Solid Faint Line, Không Nét Đứt) */}
                      {showFaint &&
                        strokeSvgPaths.map((path, idx) => {
                          if (idx <= currentStrokeIdx) return null;
                          return (
                            <path
                              key={`faint-${idx}`}
                              d={path}
                              fill="none"
                              stroke="#94a3b8"
                              strokeOpacity={0.35}
                              strokeWidth={charBox.size === 100 ? 5.5 : 12}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          );
                        })}

                      {/* 3. Active Current Stroke with Teacher Guide Line (NÉT LIỀN - Solid Line) */}
                      {showFaint && currentStrokeIdx < totalStrokes && strokeSvgPaths[currentStrokeIdx] && (
                        <g key={`current-stroke-guide-${currentStrokeIdx}`}>
                          {/* Active Stroke Path - Solid line */}
                          <path
                            d={strokeSvgPaths[currentStrokeIdx]}
                            fill="none"
                            stroke="#ff2d55"
                            strokeOpacity={0.85}
                            strokeWidth={charBox.size === 100 ? 6.0 : 13}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />

                          {/* Direction Ping at Destination */}
                          {currentEndpoints.end && (
                            <>
                              <circle
                                cx={currentEndpoints.end.x}
                                cy={currentEndpoints.end.y}
                                r={charBox.size === 100 ? 5 : 12}
                                fill="#ff2d55"
                                className="animate-ping opacity-80"
                              />
                              <circle
                                cx={currentEndpoints.end.x}
                                cy={currentEndpoints.end.y}
                                r={charBox.size === 100 ? 3.5 : 8}
                                fill="#ff2d55"
                              />
                            </>
                          )}

                          {/* Start Beacon at Start Coordinate */}
                          {currentEndpoints.start && (
                            <g>
                              <circle
                                cx={currentEndpoints.start.x}
                                cy={currentEndpoints.start.y}
                                r={charBox.size === 100 ? 4.5 : 11}
                                fill="#ff2d55"
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

                      {/* 4. Animated Directional Swipe Guide on 3rd Fail (Mũi Tên Vuốt Chuyển Động) */}
                      {strokeFailCount >= 3 && currentStrokeIdx < totalStrokes && strokeSvgPaths[currentStrokeIdx] && (
                        <g key={`swipe-arrow-guide-${currentStrokeIdx}`}>
                          {/* Glowing halo along the stroke path */}
                          <path
                            d={strokeSvgPaths[currentStrokeIdx]}
                            fill="none"
                            stroke="#ff2d55"
                            strokeWidth={charBox.size === 100 ? 12 : 26}
                            strokeOpacity={0.25}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="animate-pulse"
                          />

                          {/* Directional swipe path with arrow head at destination */}
                          <path
                            d={strokeSvgPaths[currentStrokeIdx]}
                            fill="none"
                            stroke="#ff2d55"
                            strokeWidth={charBox.size === 100 ? 5.5 : 12}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            markerEnd="url(#swipeArrowMarker)"
                          />

                          {/* Moving bead sliding along the path from start to end */}
                          <circle
                            r={charBox.size === 100 ? 4 : 9}
                            fill="#ffffff"
                            stroke="#ff2d55"
                            strokeWidth={charBox.size === 100 ? 2 : 4}
                          >
                            <animateMotion
                              path={strokeSvgPaths[currentStrokeIdx]}
                              dur="1.5s"
                              repeatCount="indefinite"
                            />
                          </circle>

                          {/* Expanding beacon ring following the bead */}
                          <circle
                            r={charBox.size === 100 ? 7 : 16}
                            fill="none"
                            stroke="#ff2d55"
                            strokeWidth={charBox.size === 100 ? 1.5 : 3}
                            opacity={0.7}
                          >
                            <animateMotion
                              path={strokeSvgPaths[currentStrokeIdx]}
                              dur="1.5s"
                              repeatCount="indefinite"
                            />
                          </circle>
                        </g>
                      )}

                      {/* 5. Fallback Calligraphy Watermark Guide for Radicals / Chars without SVG paths */}
                      {strokeSvgPaths.length === 0 && (
                        <g className="pointer-events-none select-none">
                          {showFaint && (
                            <text
                              x="50"
                              y="58"
                              textAnchor="middle"
                              dominantBaseline="middle"
                              fontSize="58"
                              fontFamily="'Noto Serif JP', 'Noto Sans JP', serif"
                              fill="#94a3b8"
                              fillOpacity={0.28}
                              fontWeight="bold"
                            >
                              {activeCharName}
                            </text>
                          )}
                        </g>
                      )}
                    </svg>

                    {/* HTML5 Touch / Mouse Drawing Canvas (100% Synchronized 1:1 coordinate matching) */}
                    <canvas
                      ref={canvasRef}
                      onPointerDown={handlePointerDown}
                      onPointerMove={handlePointerMove}
                      onPointerUp={handlePointerUp}
                      onPointerCancel={handlePointerCancel}
                      onPointerLeave={handlePointerUp}
                      className="absolute inset-0 w-full h-full cursor-crosshair touch-none select-none z-10"
                    />
                  </div>
                </div>

                {/* Bottom Floating Guidance Banner inside Canvas */}
                <div className="absolute bottom-3 inset-x-3 bg-[#0a0e18]/90 backdrop-blur-md border border-slate-700/80 px-3 py-1.5 rounded-xl flex items-center justify-between text-xs z-20 shadow-lg">
                  <div
                    className={`flex items-center gap-2 font-medium text-[11px] min-w-0 ${
                      feedbackMsg.type === 'warning'
                        ? 'text-amber-400'
                        : feedbackMsg.type === 'success'
                        ? 'text-emerald-400'
                        : 'text-slate-200'
                    }`}
                  >
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
                    </svg>
                    <span className="truncate">{feedbackMsg.text}</span>
                  </div>
                  <span className="text-[10px] text-cyan-300 font-mono bg-cyan-950/60 border border-cyan-800/60 px-1.5 py-0.5 rounded flex-shrink-0 ml-2">
                    AI Stroke: {strokeAccuracy}%
                  </span>
                </div>
              </div>
            </div>

            {/* Canvas Action Controls Bar (Xem mẫu, Hoàn tác, Tập lại, Chấm điểm) */}
            <div
              className="w-full max-w-[520px] flex items-center justify-between gap-2.5 flex-shrink-0 mx-auto"
              data-purpose="canvas-action-controls"
            >
              {/* Nút 1: Xem Mẫu Nét */}
              <button
                onClick={handleAutoReplay}
                className="flex-1 py-2 px-3 rounded-xl bg-[#0f131d] hover:bg-[#171b26] border border-cyan-800/60 hover:border-cyan-400 text-xs font-bold text-slate-100 flex items-center justify-center gap-1.5 transition shadow-sm cursor-pointer group active:scale-95"
                title="Xem hoạt hình mô phỏng chuyển động từng nét [Phím tắt: Space]"
              >
                <div className="w-5 h-5 rounded-full bg-cyan-950/60 flex items-center justify-center text-cyan-400 border border-cyan-800/60 group-hover:scale-110 transition-transform">
                  <svg className="w-3 h-3 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4.518 4.257A1 1 0 016 3.424l9.996 6.576a1 1 0 010 1.664L6 18.24A1 1 0 014.518 17.41V4.257z" />
                  </svg>
                </div>
                <span>Xem Mẫu</span>
                <kbd className="px-1 py-0.2 text-[9px] rounded bg-slate-800 text-slate-400 font-mono hidden sm:inline border border-slate-700">
                  Space
                </kbd>
              </button>

              {/* Nút 2: Hoàn Tác */}
              <button
                onClick={handleUndo}
                className="flex-1 py-2 px-3 rounded-xl bg-[#0f131d] hover:bg-[#171b26] border border-slate-800 hover:border-slate-600 text-xs font-bold text-slate-200 flex items-center justify-center gap-1.5 transition shadow-sm cursor-pointer group active:scale-95"
                title="Hủy bỏ nét vừa viết gần nhất [Phím tắt: Z]"
              >
                <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 group-hover:text-white group-hover:scale-110 transition-transform">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
                  </svg>
                </div>
                <span>Hoàn Tác</span>
                <kbd className="px-1 py-0.2 text-[9px] rounded bg-slate-800 text-slate-400 font-mono hidden sm:inline border border-slate-700">
                  Z
                </kbd>
              </button>

              {/* Nút 3: Tập Lại */}
              <button
                onClick={() => {
                  sounds.playClick();
                  resetCanvas();
                }}
                className="flex-1 py-2 px-3 rounded-xl bg-[#0f131d] hover:bg-[#171b26] border border-amber-500/30 hover:border-amber-400 text-xs font-bold text-amber-300 flex items-center justify-center gap-1.5 transition shadow-sm cursor-pointer group active:scale-95"
                title="Xóa toàn bộ nét đã vẽ để luyện viết lại từ đầu"
              >
                <div className="w-5 h-5 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400 border border-amber-500/30 group-hover:scale-110 transition-transform">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                    />
                  </svg>
                </div>
                <span>Tập Lại</span>
              </button>

              {/* Nút 4: Chấm Điểm Nét */}
              <button
                onClick={handleGrade}
                className="flex-1 py-2 px-4 rounded-xl bg-gradient-to-r from-[#ff2d55] to-rose-600 hover:from-rose-600 hover:to-rose-700 border border-rose-300 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-950/80 neon-glow-pink transition transform active:scale-95 cursor-pointer group"
                title="Gửi nét vẽ lên AI Sensei để chấm điểm độ chuẩn xác [Phím tắt: Enter]"
              >
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-white group-hover:rotate-12 transition-transform">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
                  </svg>
                </div>
                <span className="tracking-wide">Chấm Điểm Nét</span>
                <kbd className="px-1.5 py-0.2 text-[9px] rounded bg-black/40 text-white font-mono hidden sm:inline border border-white/20 font-bold">
                  Enter ↵
                </kbd>
              </button>
            </div>
          </section>

          {/* ================= COL 3: AI SENSEI EVALUATION & VOCABULARY MATRIX (3 COLS) ================= */}
          <section
            className={`col-span-1 lg:col-span-3 xl:col-span-3 ${
              mobileTab !== 'queue' ? 'hidden lg:flex' : 'flex'
            } flex-col gap-3 min-w-0 order-2 lg:order-3`}
            data-purpose="ai-eval-vocabulary-panel"
          >
            {/* 1. Real-Time AI Sensei Accuracy Card */}
            <div className="bg-[#0f131d] border border-slate-800/90 rounded-2xl p-3 shadow-lg flex-shrink-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Đánh Giá AI Sensei
                  </h2>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 font-bold text-xs border border-emerald-500/30">
                  Chuẩn {strokeAccuracy}%
                </span>
              </div>

              {/* Accuracy Metrics */}
              <div className="space-y-1.5 text-xs">
                <div>
                  <div className="flex justify-between text-slate-400 mb-1 text-[11px]">
                    <span>Thứ tự các nét (Stroke Order)</span>
                    <span className="text-emerald-400 font-bold font-mono">{strokeOrderScore}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#0a0e18] rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400 rounded-full transition-all duration-300" style={{ width: `${strokeOrderScore}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-slate-400 mb-1 text-[11px]">
                    <span>Cân đối góc &amp; Tỉ lệ khung ô</span>
                    <span className="text-cyan-400 font-bold font-mono">{balanceScore}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#0a0e18] rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-400 rounded-full transition-all duration-300" style={{ width: `${balanceScore}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-slate-400 mb-1 text-[11px]">
                    <span>Lực nhấn &amp; Tốc độ đưa bút</span>
                    <span className="text-rose-400 font-bold font-mono">{pressureScore}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#0a0e18] rounded-full overflow-hidden">
                    <div className="h-full bg-[#ff2d55] rounded-full transition-all duration-300" style={{ width: `${pressureScore}%` }}></div>
                  </div>
                </div>
              </div>

              {/* AI Feedback Advice Note */}
              <div className="mt-2.5 p-2 rounded-xl bg-[#0a0e18] border border-slate-800 text-[11px] text-slate-300 flex items-start gap-2">
                <span className="text-indigo-400 text-sm flex-shrink-0">🤖</span>
                <p className="leading-snug break-words line-clamp-3" title={senseiAdvice}>
                  <strong className="text-white">Sensei nhắc bạn:</strong> {senseiAdvice}
                </p>
              </div>
            </div>

            {/* 2. Compound Vocabulary Matrix (Compact) */}
            {activeCompounds.length > 0 && (
              <div className="bg-[#0f131d] border border-slate-800/90 rounded-2xl p-3 flex flex-col overflow-hidden shadow-lg flex-shrink-0 max-h-[145px]">
                <div className="flex items-center justify-between mb-1.5 flex-shrink-0">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      />
                    </svg>
                    Từ Ghép Thường Gặp
                  </h2>
                  <span className="text-[10px] text-slate-400 font-mono bg-slate-800/70 px-2 py-0.5 rounded-full border border-slate-700/60 font-semibold">
                    {activeCompounds.length} Từ Vựng
                  </span>
                </div>

                {/* Vocabulary Cards List */}
                <div className="space-y-1.5 overflow-y-auto max-h-[95px] pr-1 scrollbar-thin scrollbar-thumb-slate-700">
                  {activeCompounds.map((cp, idx) => (
                    <div
                      key={`compound-${idx}`}
                      className="p-1.5 rounded-xl bg-[#0a0e18] hover:bg-[#171b26] border border-slate-800/80 flex items-center justify-between transition group"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="text-sm font-bold font-kanji text-white group-hover:text-rose-400 transition flex-shrink-0">
                          {cp.word.split(' ')[0]}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-slate-200 flex items-center gap-1 min-w-0">
                            <span className="truncate">{cp.word.split(' ')[1] || cp.word}</span>
                            {cp.hanviet && (
                              <span className="text-[10px] text-slate-500 font-mono flex-shrink-0">({cp.hanviet})</span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400 truncate" title={cp.meaning}>{cp.meaning}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          if (speak) {
                            const wordToSpeak = cp.word.replace(/\s*\(.*?\)/, '');
                            speak(wordToSpeak);
                          }
                        }}
                        className="w-6 h-6 rounded-lg bg-[#171b26] hover:bg-[#ff2d55] border border-slate-700/80 hover:border-rose-400 text-slate-300 hover:text-white flex items-center justify-center text-xs transition shadow-sm cursor-pointer group-hover:border-rose-500/40 active:scale-90 flex-shrink-0 ml-1"
                        title={`Phát âm từ "${cp.word}"`}
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. Vertical Character Queue (Hiển thị 5 chữ tiếp theo, lăn chuột xuống để xem tiếp) */}
            <div className="bg-[#0f131d] border border-slate-800/90 rounded-2xl p-3 flex flex-col overflow-hidden shadow-lg flex-shrink-0">
              {/* Queue Header */}
              <div className="flex items-center justify-between mb-2 flex-shrink-0">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                  <span>Thứ Tự Luyện Viết</span>
                </h2>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/60 px-1.5 py-0.5 rounded-md border border-emerald-500/30 font-bold">
                    ✓ {currentList.filter((c) => masteredChars.has(c.kanji || c.char || c.radical)).length} thuộc
                  </span>
                  <span className="text-[10px] text-cyan-300 font-medium bg-cyan-950/60 px-1.5 py-0.5 rounded-md border border-cyan-800/50 flex items-center gap-1">
                    <span>Lăn chuột</span>
                    <span className="animate-bounce">↓</span>
                  </span>
                </div>
              </div>

              {/* Queue Items List with 5 visible items height & smooth wheel scroll */}
              <div
                ref={queueListRef}
                className="space-y-1.5 overflow-y-auto h-[215px] max-h-[215px] pr-1 scrollbar-thin scrollbar-thumb-slate-700 select-none"
                data-purpose="vertical-character-queue"
                title="Dùng chuột lăn lên/xuống để xem các chữ tiếp theo"
              >
                {currentList.length === 0 ? (
                  <div className="w-full text-center py-6 text-xs text-slate-500 italic">
                    Không tìm thấy chữ nào khớp với "{searchQuery}".
                  </div>
                ) : (
                  currentList.map((item, idx) => {
                    const char = item.kanji || item.char || item.radical;
                    const isSelected = char === activeCharName;
                    const isMastered = masteredChars.has(char);
                    const isNext = (nextCharItem?.kanji || nextCharItem?.char || nextCharItem?.radical) === char && !isSelected;
                    const strokes = item.strokes || item.strokeCount || 1;

                    return (
                      <div
                        key={`queue-${char}-${idx}`}
                        data-char={char}
                        onClick={() => handleSelectChar(item)}
                        className={`p-2 rounded-xl flex items-center justify-between transition-all duration-150 cursor-pointer group ${
                          isSelected
                            ? 'bg-gradient-to-r from-rose-950/80 via-[#1e1422] to-[#171b26] border-2 border-rose-500/90 shadow-md shadow-rose-950/50 ring-1 ring-rose-400/30'
                            : isMastered
                            ? 'bg-emerald-950/25 hover:bg-emerald-900/40 border border-emerald-500/40 text-emerald-300'
                            : isNext
                            ? 'bg-teal-950/25 hover:bg-teal-900/35 border border-teal-500/40 text-teal-200'
                            : 'bg-[#0a0e18] hover:bg-[#151a28] border border-slate-800/80 hover:border-slate-700 text-slate-300'
                        }`}
                      >
                        {/* Left: STT + Kanji + Details */}
                        <div className="flex items-center gap-2.5 min-w-0">
                          {/* Order Index */}
                          <span
                            className={`font-mono text-[10px] w-5 flex-shrink-0 text-center font-bold ${
                              isSelected
                                ? 'text-rose-400'
                                : isMastered
                                ? 'text-emerald-400'
                                : 'text-slate-500'
                            }`}
                          >
                            #{idx + 1}
                          </span>

                          {/* Large Kanji Character */}
                          <span
                            className={`font-kanji text-xl sm:text-2xl font-bold leading-none w-8 text-center flex-shrink-0 drop-shadow-sm transition group-hover:scale-105 ${
                              isSelected
                                ? 'text-white'
                                : isMastered
                                ? 'text-emerald-300'
                                : 'text-slate-100'
                            }`}
                          >
                            {char}
                          </span>

                          {/* Kanji Information */}
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 truncate">
                              <span
                                className={`text-xs font-bold uppercase truncate ${
                                  isSelected
                                    ? 'text-white'
                                    : isMastered
                                    ? 'text-emerald-200'
                                    : 'text-slate-200'
                                }`}
                              >
                                {item.hanviet || item.romaji?.toUpperCase() || char}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono flex-shrink-0">
                                • {strokes}n
                              </span>
                            </div>
                            <p
                              className={`text-[10px] truncate max-w-[140px] sm:max-w-[170px] ${
                                isSelected ? 'text-rose-200/80' : 'text-slate-400'
                              }`}
                              title={item.meaning || (item.romaji ? `Âm: ${item.romaji}` : '')}
                            >
                              {item.meaning || (item.romaji ? `Âm: ${item.romaji}` : '')}
                            </p>
                          </div>
                        </div>

                        {/* Right: Status Pill */}
                        <div className="flex-shrink-0 ml-1.5">
                          {isSelected ? (
                            <span className="px-2 py-0.5 rounded-md bg-rose-500/30 text-rose-300 border border-rose-500/50 text-[10px] font-black flex items-center gap-1 animate-pulse shadow-sm">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                              Đang luyện
                            </span>
                          ) : isMastered ? (
                            <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-black flex items-center gap-0.5 shadow-sm">
                              <span>✓</span> Thuộc
                            </span>
                          ) : isNext ? (
                            <span className="px-1.5 py-0.5 rounded-md bg-teal-500/20 text-teal-300 border border-teal-500/40 text-[9px] font-bold flex items-center gap-0.5">
                              <span>Tiếp</span> ➔
                            </span>
                          ) : (
                            <span className="text-slate-600 font-mono text-[10px] group-hover:text-slate-400 transition">
                              {strokes} nét
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Scroll hint footer */}
              <div className="mt-1.5 pt-1.5 border-t border-slate-800/70 flex items-center justify-between text-[10px] text-slate-400 select-none">
                <span className="flex items-center gap-1 text-slate-400">
                  <span className="text-cyan-400 font-mono">↕</span> Lăn chuột để xem các chữ tiếp
                </span>
                <span className="font-mono text-slate-500">{currentList.length} chữ</span>
              </div>
            </div>

            {/* 4. Bottom Hero Action Next Lesson CTA & Daily 5-Char Milestone Card */}
            <div className="flex-shrink-0 space-y-2">
              {/* Daily 5-Character Milestone Status */}
              {dayProgress && (
                <div
                  className={`p-2.5 rounded-2xl border transition-all ${
                    dayProgress.isDone
                      ? 'bg-gradient-to-r from-emerald-950/80 to-[#0c1a17] border-emerald-500/60 shadow-lg shadow-emerald-950/40'
                      : 'bg-[#0a0e18] border-slate-800/90'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs flex-shrink-0 shadow-sm ${
                          dayProgress.isDone
                            ? 'bg-emerald-500 text-slate-950 animate-bounce'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {dayProgress.isDone ? '✓' : `${dayProgress.completedCount}/${dayProgress.total}`}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs font-bold text-white truncate">
                            Ngày {dayProgress.day}: {dayProgress.title}
                          </span>
                          {dayProgress.isDone && (
                            <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-extrabold border border-emerald-500/40 flex items-center gap-0.5">
                              <span>✓</span> ĐÃ HOÀN THÀNH
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                          Mục tiêu: [{dayProgress.targetChars.join(', ')}] •{' '}
                          <span className={dayProgress.isDone ? 'text-emerald-300 font-bold' : 'text-amber-400 font-medium'}>
                            {dayProgress.isDone
                              ? 'Đã học đủ 5/5 chữ, tích xanh lộ trình!'
                              : `Đã hoàn thành ${dayProgress.completedCount}/5 chữ`}
                          </span>
                        </div>
                      </div>
                    </div>

                    {onNavigate && (
                      <button
                        onClick={() => {
                          sounds.playClick();
                          onNavigate('roadmap');
                        }}
                        className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1 flex-shrink-0 active:scale-95 ${
                          dayProgress.isDone
                            ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black shadow-md'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                        }`}
                        title="Mở Lộ Trình 14 Ngày để xem huy hiệu tích xanh"
                      >
                        <span>{dayProgress.isDone ? 'Xem Lộ Trình ✓' : 'Lộ Trình'}</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* UPGRADED HERO ACTION: Next Character CTA Button */}
              <button
                id="next-lesson-btn"
                onClick={handleNextChar}
                className="w-full h-14 min-h-[56px] py-2.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 border border-emerald-400/50 shadow-xl shadow-emerald-950/60 flex items-center justify-between transition-all duration-200 cursor-pointer group active:scale-[0.98]"
                title={`Chuyển sang luyện chữ tiếp theo: ${nextCharItem.kanji || nextCharItem.char || nextCharItem.radical}`}
              >
                {/* Left: Tag + Large Character + Details */}
                <div className="flex items-center gap-3 min-w-0">
                  {/* Next Badge */}
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-950/70 border border-emerald-300/40 text-emerald-200 text-[10px] font-black uppercase tracking-wider flex-shrink-0 shadow-sm leading-normal">
                    KẾ TIẾP
                  </span>

                  {/* Character Kanji */}
                  <span className="text-2xl font-black font-kanji text-white drop-shadow-sm flex-shrink-0">
                    {nextCharItem.kanji || nextCharItem.char || nextCharItem.radical}
                  </span>

                  {/* Information Details */}
                  <div className="min-w-0 text-left">
                    <div className="text-xs sm:text-sm font-black text-white uppercase truncate flex items-center gap-1.5 leading-tight">
                      <span>{nextCharItem.hanviet || nextCharItem.romaji || ''}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-900/60 text-emerald-200 font-mono font-bold flex-shrink-0">
                        • {nextCharItem.strokes || nextCharItem.strokeCount || 4} Nét
                      </span>
                    </div>
                    <span className="text-[10px] text-emerald-100/80 truncate block">
                      {nextCharItem.meaning || 'Nhấn để bắt đầu luyện viết nét bút'}
                    </span>
                  </div>
                </div>

                {/* Right: Slide Arrow Icon Button */}
                <div className="w-9 h-9 rounded-xl bg-emerald-950/50 border border-emerald-300/40 flex items-center justify-center text-white group-hover:translate-x-1.5 transition-transform duration-200 shadow-inner flex-shrink-0 ml-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
                  </svg>
                </div>
              </button>
            </div>
          </section>
        </div>
      </main>

      {/* ================= COMPACT DESKTOP FOOTER ================= */}
      <footer
        className="h-8 w-full px-4 bg-[#080c14] border-t border-slate-800/90 text-[11px] text-slate-500 flex items-center justify-between flex-shrink-0"
        data-purpose="app-footer"
      >
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ff2d55]"></span>
          <span>NihonLearn Stroke Engine v2.5 • Chuẩn bút cảm ứng Apple Pencil, Wacom &amp; Touchscreen</span>
        </div>
        <div className="flex items-center gap-3">
          <span>
            Phím tắt: <kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">[Z]</kbd> Hoàn tác •{' '}
            <kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">[Space]</kbd> Mẫu •{' '}
            <kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">[Enter]</kbd> Chấm điểm
          </span>
        </div>
      </footer>

      {/* ================= CHARACTER BROWSER MODAL (BẢNG TRA CỨU) ================= */}
      <div
        id="character-browser-modal"
        className={`fixed inset-0 z-50 items-center justify-center p-3 lg:p-6 bg-black/75 backdrop-blur-md transition-opacity duration-200 ${
          isModalOpen ? 'flex opacity-100' : 'hidden opacity-0 pointer-events-none'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div
          id="modal-backdrop-layer"
          className="absolute inset-0 z-10 cursor-pointer"
          onClick={() => setIsModalOpen(false)}
        ></div>

        <div
          id="character-browser-card"
          className="w-full max-w-5xl max-h-[90vh] bg-[#0f131d] border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden transform transition-transform duration-200 relative z-20 scale-100"
        >
          {/* Top Modal Navigation & Header */}
          <div className="px-5 py-3.5 border-b border-slate-800 bg-[#0a0e18] flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
                <h3 id="modal-title" className="text-sm font-extrabold text-white tracking-tight flex items-center gap-2">
                  Bảng Tra Cứu &amp; Chọn Nhanh Ký Tự
                  <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/40 uppercase tracking-wide leading-normal">
                    Bút Thuận Chuẩn
                  </span>
                </h3>
              </div>
            </div>

            {/* Switch Tabs in Modal */}
            <div className="flex items-center bg-[#171b26] p-1 rounded-xl border border-slate-700/70 text-xs">
              <button
                onClick={() => setModalCategory('hiragana')}
                className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                  modalCategory === 'hiragana' ? 'bg-[#ff2d55] text-white font-bold shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Hiragana (46)
              </button>
              <button
                onClick={() => setModalCategory('katakana')}
                className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                  modalCategory === 'katakana' ? 'bg-[#ff2d55] text-white font-bold shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Katakana (46)
              </button>
              <button
                onClick={() => setModalCategory('kanji')}
                className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                  modalCategory === 'kanji' ? 'bg-[#ff2d55] text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Kanji N5 ({kanjiDataset.length})
              </button>
              <button
                onClick={() => setModalCategory('radicals')}
                className={`px-2.5 py-1 rounded-lg transition cursor-pointer hidden sm:inline ${
                  modalCategory === 'radicals' ? 'bg-[#ff2d55] text-white font-bold shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                214 Bộ Thủ (Tùy chọn)
              </button>
            </div>

            <button
              id="close-browser-modal-btn"
              onClick={() => setIsModalOpen(false)}
              className="w-8 h-8 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
              title="Đóng (ESC)"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Quick Filter & Search Bar */}
          <div className="px-5 py-3 border-b border-slate-800/80 bg-[#0f131d] flex flex-wrap items-center justify-between gap-3 flex-shrink-0">
            <div className="flex items-center gap-2 flex-1 min-w-[260px]">
              <div className="relative w-full max-w-xs">
                <input
                  type="text"
                  value={modalSearch}
                  onChange={(e) => setModalSearch(e.target.value)}
                  placeholder="Tìm theo Hán-Việt, Romaji, Kanji..."
                  className="w-full h-8.5 bg-[#0a0e18] border border-slate-700/70 rounded-xl pl-9.5 pr-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#ff2d55] transition"
                />
                <svg
                  className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div className="flex items-center gap-1 overflow-x-auto scrollbar-none text-xs">
                <button
                  onClick={() => setModalFilter('all')}
                  className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] transition cursor-pointer ${
                    modalFilter === 'all'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : 'bg-[#171b26] hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  Tất cả ({modalFilteredList.length})
                </button>
                <button
                  onClick={() => setModalFilter('mastered')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] transition cursor-pointer ${
                    modalFilter === 'mastered'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : 'bg-[#171b26] hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  ✓ Đã thuộc
                </button>
                <button
                  onClick={() => setModalFilter('learning')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] transition cursor-pointer ${
                    modalFilter === 'learning'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : 'bg-[#171b26] hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  ✏️ Đang học
                </button>
                <button
                  onClick={() => setModalFilter('review')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] transition cursor-pointer ${
                    modalFilter === 'review'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : 'bg-[#171b26] hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  🔄 Cần ôn
                </button>
                <span className="text-slate-600 px-1">|</span>
                <button
                  onClick={() => setModalFilter('1-4')}
                  className={`px-2 py-0.5 rounded-md text-[10px] transition cursor-pointer ${
                    modalFilter === '1-4'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : 'bg-[#171b26] hover:bg-slate-800 text-slate-400'
                  }`}
                >
                  1-4 nét
                </button>
                <button
                  onClick={() => setModalFilter('5-8')}
                  className={`px-2 py-0.5 rounded-md text-[10px] transition cursor-pointer ${
                    modalFilter === '5-8'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : 'bg-[#171b26] hover:bg-slate-800 text-slate-400'
                  }`}
                >
                  5-8 nét
                </button>
                <button
                  onClick={() => setModalFilter('9+')}
                  className={`px-2 py-0.5 rounded-md text-[10px] transition cursor-pointer ${
                    modalFilter === '9+'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : 'bg-[#171b26] hover:bg-slate-800 text-slate-400'
                  }`}
                >
                  9+ nét
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-400 flex-shrink-0">
              <span className="flex items-center gap-1 font-mono text-[11px]">
                <span className="text-white font-bold">{modalFilteredList.length}</span> Ký tự
              </span>
              <span className="text-slate-700">•</span>
              <span className="flex items-center gap-1 font-mono text-[11px] text-emerald-400 font-semibold">
                TB: 97.4%
              </span>
              <span className="text-slate-700">•</span>
              <span className="text-amber-400 font-mono text-[11px] font-bold">
                🔥 Streak {streak}d
              </span>
            </div>
          </div>

          {/* Character Grid (Rich Cards) */}
          <div className="p-5 overflow-y-auto flex-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {modalFilteredList.map((item, idx) => {
              const char = item.kanji || item.char || item.radical;
              const isCurrent = char === activeCharName;
              const isMastered = masteredChars.has(char);
              const strokes = item.strokes || item.strokeCount || 1;
              const hv = item.hanviet || item.romaji || '';
              const mean = item.meaning || '';
              const onkun = item.onyomi ? (Array.isArray(item.onyomi) ? item.onyomi.join(', ') : item.onyomi) : item.romaji || '';

              if (isCurrent) {
                return (
                  <div
                    key={`modal-card-${char}-${idx}`}
                    onClick={() => {
                      setCategory(modalCategory);
                      handleSelectChar(item);
                      setIsModalOpen(false);
                    }}
                    className="p-3 rounded-2xl bg-gradient-to-b from-[#ff2d55]/20 to-[#1e1327] border-2 border-[#ff2d55] neon-glow-pink relative flex flex-col justify-between cursor-pointer group shadow-lg hover:scale-105 transition"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-1.5 py-0.5 rounded text-[9px] bg-[#ff2d55] text-white font-mono font-bold">
                        {strokes} Nét
                      </span>
                      <span className="px-1.5 py-0.2 rounded-full bg-rose-500/30 text-rose-300 text-[9px] font-bold uppercase animate-pulse">
                        Đang Học
                      </span>
                    </div>
                    <div className="my-2 text-center">
                      <div className="text-4xl font-black font-kanji text-white group-hover:scale-110 transition transform">
                        {char}
                      </div>
                      <div className="text-xs font-bold text-rose-300 mt-1">{hv}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{mean}</div>
                    </div>
                    <div className="pt-2 border-t border-rose-500/30 flex items-center justify-between text-[10px]">
                      <span className="text-slate-400 font-mono truncate max-w-[70px]">{onkun}</span>
                      <span className="text-emerald-400 font-bold font-mono">98%</span>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={`modal-card-${char}-${idx}`}
                  onClick={() => {
                    setCategory(modalCategory);
                    handleSelectChar(item);
                    setIsModalOpen(false);
                  }}
                  className={`p-3 rounded-2xl bg-[#0a0e18] hover:bg-[#171b26] border relative flex flex-col justify-between cursor-pointer group shadow transition hover:scale-102 ${
                    isMastered
                      ? 'border-emerald-500/40 hover:border-emerald-400'
                      : 'border-slate-800/90 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="px-1.5 py-0.5 rounded text-[9px] bg-[#171b26] text-slate-400 font-mono font-medium">
                      {strokes} Nét
                    </span>
                    {isMastered ? (
                      <span className="w-2 h-2 rounded-full bg-emerald-400" title="Đã thuộc"></span>
                    ) : (
                      <span className="text-[9px] text-slate-500 font-medium">Chưa học</span>
                    )}
                  </div>
                  <div className="my-2 text-center">
                    <div
                      className={`text-4xl font-bold font-kanji transition transform group-hover:scale-110 ${
                        isMastered ? 'text-slate-100 group-hover:text-emerald-300' : 'text-slate-300 group-hover:text-white'
                      }`}
                    >
                      {char}
                    </div>
                    <div className="text-xs font-bold text-slate-200 mt-1">{hv}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{mean}</div>
                  </div>
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px]">
                    <span className="text-slate-500 font-mono truncate max-w-[70px]">{onkun || '--'}</span>
                    <span className="text-slate-600 font-mono">{isMastered ? '98%' : '--'}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Modal Footer Controls */}
          <div className="px-5 py-3 border-t border-slate-800 bg-[#0a0e18] flex items-center justify-between flex-shrink-0 text-xs">
            <div className="flex items-center gap-2 text-slate-400">
              <span>💡 Mẹo: Nhấn vào bất kỳ chữ nào để vào ngay phòng luyện tập nét thư pháp</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                id="close-browser-modal-bottom-btn"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition cursor-pointer"
              >
                Đóng Lại
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
