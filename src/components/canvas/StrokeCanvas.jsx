import React, { useRef, useState, useEffect } from 'react';
import { validateStrokeDrawing } from '../../utils/strokeMatcher';
import { sounds } from '../../utils/soundEffects';

export function StrokeCanvas({
  selectedChar,
  gridType,
  brushType,
  brushSize = 'medium',
  brushColor,
  showFaint,
  currentStrokeIdx,
  setCurrentStrokeIdx,
  completedStrokes,
  setCompletedStrokes,
  setStrokeAccuracy,
  setFeedbackMsg,
  isReplaying,
  replayStrokeIdx,
  onCharacterComplete
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const isDrawingRef = useRef(false);
  const userPointsRef = useRef([]);
  const [shake, setShake] = useState(false);

  const totalStrokes = selectedChar.strokeCount || selectedChar.strokes || 1;
  const strokeSvgPaths = selectedChar.strokeSvgPaths || [];

  // Determine coordinate space (100 for Kanji, 220 for Kana) to center perfectly in canvas
  const getCharBox = (paths) => {
    let maxCoord = 0;
    paths.forEach((p) => {
      const nums = p.match(/[\d.]+/g) || [];
      nums.forEach((n) => {
        const v = parseFloat(n);
        if (v > maxCoord) maxCoord = v;
      });
    });
    const size = maxCoord <= 110 ? 100 : 220;
    return { size, viewBox: `0 0 ${size} ${size}` };
  };

  const { size: boxSize, viewBox } = getCharBox(strokeSvgPaths);

  // Setup High-DPI canvas
  const setupCanvasDPI = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.style.width = '100%';
    canvas.style.height = '100%';

    const width = rect.width || 420;
    const height = rect.height || 420;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
  };

  useEffect(() => {
    setupCanvasDPI();
    window.addEventListener('resize', setupCanvasDPI);
    return () => window.removeEventListener('resize', setupCanvasDPI);
  }, [selectedChar]);

  // Clear canvas drawing when character or stroke changes
  useEffect(() => {
    clearUserCanvas();
  }, [selectedChar, currentStrokeIdx]);

  const clearUserCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  // Determine touch/mouse position strictly within Canvas bounds
  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0, isOutOfBounds: true };
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX;
    const clientY = e.clientY;

    const isOutOfBounds =
      clientX < rect.left ||
      clientX > rect.right ||
      clientY < rect.top ||
      clientY > rect.bottom;

    const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const y = Math.max(0, Math.min(rect.height, clientY - rect.top));

    return {
      x,
      y,
      width: rect.width,
      height: rect.height,
      isOutOfBounds
    };
  };

  // POINTER EVENTS WITH BOUNDARY LOCK (Strictly prevents stray corner lines)
  const handlePointerDown = (e) => {
    e.preventDefault();
    if (isReplaying) return;

    if (currentStrokeIdx >= totalStrokes) {
      setFeedbackMsg({
        text: 'Đã hoàn thành toàn bộ chữ! Bấm "Tập Viết Lại" để luyện tiếp.',
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

    const sizeMultiplier = brushSize === 'small' ? 0.75 : brushSize === 'large' ? 1.35 : 1.0;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = (brushType === 'felt' ? 6.5 : 8.0) * sizeMultiplier;
    ctx.strokeStyle = brushColor;
  };

  const handlePointerMove = (e) => {
    e.preventDefault();
    if (!isDrawingRef.current || isReplaying) return;

    const coords = getCoordinates(e);

    // If pointer crosses the canvas border, finish stroke immediately so it doesn't draw corner spikes
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
    const sizeMultiplier = brushSize === 'small' ? 0.75 : brushSize === 'large' ? 1.35 : 1.0;

    // Dynamic calligraphy brush width (soft, smooth, authentic)
    if (brushType === 'calligraphy' && pts.length > 2) {
      const p1 = pts[pts.length - 2];
      const p2 = pts[pts.length - 1];
      const speed = Math.hypot(p2.x - p1.x, p2.y - p1.y);
      const baseW = 8.5 * sizeMultiplier;
      ctx.lineWidth = Math.max(baseW * 0.6, Math.min(baseW * 1.35, baseW * 1.35 - speed * 0.35));
    } else {
      ctx.lineWidth = 6.5 * sizeMultiplier;
    }

    // Smooth bezier curve
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

    // Validate with boxSize matching the character coordinate space
    const expectedSvg = strokeSvgPaths[currentStrokeIdx];
    const result = validateStrokeDrawing(points, expectedSvg, rect.width, rect.height, boxSize);

    if (result.isValid) {
      clearUserCanvas();
      sounds.playCorrectStroke();
      setStrokeAccuracy(result.accuracy);

      const nextStroke = currentStrokeIdx + 1;
      setCurrentStrokeIdx(nextStroke);
      setCompletedStrokes((prev) => [...prev, currentStrokeIdx]);

      if (nextStroke >= totalStrokes) {
        sounds.playCharacterComplete();
        setFeedbackMsg({
          text: `Xuất sắc! Bạn đã hoàn thành chuẩn 100% nét chữ "${selectedChar.char || selectedChar.kanji}"!`,
          type: 'success'
        });
        if (onCharacterComplete) {
          onCharacterComplete(selectedChar.char || selectedChar.kanji);
        }
      } else {
        setFeedbackMsg({
          text: `Đúng nét ${nextStroke}/${totalStrokes}! Viết tiếp nét số ${nextStroke + 1} theo điểm đỏ nhé.`,
          type: 'success'
        });
      }
    } else {
      sounds.playWrongStroke();
      setShake(true);
      setTimeout(() => setShake(false), 400);

      setFeedbackMsg({
        text: result.reason || 'Chưa chuẩn nét! Bắt đầu từ điểm đỏ và đưa nét dứt khoát.',
        type: 'warning'
      });

      clearUserCanvas();
    }
  };

  const handlePointerCancel = () => {
    isDrawingRef.current = false;
    clearUserCanvas();
  };

  // Determine grid background class (Tian, Mizi, Jing, None)
  const gridClass =
    gridType === 'none'
      ? 'grid-none'
      : gridType === 'mizi'
      ? 'grid-mizi'
      : gridType === 'jing'
      ? 'grid-jing'
      : 'grid-tian';

  // Proportional sizing for SVG stroke weights
  const strokeScale = boxSize === 100 ? 1 : 2.2;
  const sizeFactor = brushSize === 'small' ? 0.8 : brushSize === 'large' ? 1.3 : 1.0;

  return (
    <div
      ref={containerRef}
      className={`relative w-full aspect-square max-w-[400px] sm:max-w-[440px] rounded-3xl p-3 sm:p-4 bg-gradient-to-b from-amber-100/50 via-rose-50/40 to-amber-50/30 dark:from-slate-800 dark:via-slate-850 dark:to-slate-900 border-4 border-amber-300/80 dark:border-slate-700 shadow-xl flex items-center justify-center transition-transform mx-auto ${
        shake ? 'animate-shake' : ''
      }`}
    >
      {/* Paper Surface with Clean Horizontal/Vertical/Mizi Grid */}
      <div
        className={`relative w-full h-full rounded-2xl overflow-hidden shadow-inner select-none ${gridClass}`}
      >
        {/* Background SVG Stroke Order Guide - Perfectly Centered, NO PADDING OFFSET */}
        <svg
          viewBox={viewBox}
          className="absolute inset-0 w-full h-full pointer-events-none select-none"
        >
          {/* 1. Faint Background Guides (Solid, clearly visible line, NO dashes, NO striping) */}
          {showFaint &&
            strokeSvgPaths.map((path, idx) => {
              const isNext = idx === currentStrokeIdx;
              if (idx < currentStrokeIdx) return null; // Rendered in completed layer

              return (
                <path
                  key={`faint-${idx}`}
                  d={path}
                  fill="none"
                  stroke={isNext ? '#f43f5e' : '#cbd5e1'}
                  strokeOpacity={isNext ? 0.65 : 0.28}
                  strokeWidth={(isNext ? 5.2 : 3.5) * strokeScale * sizeFactor}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              );
            })}

          {/* 2. Completed Strokes (Crisp Sumi Ink, Solid, Soft & Smooth) */}
          {strokeSvgPaths.map((path, idx) => {
            const isDrawn = idx < currentStrokeIdx;
            const isReplayingActive = idx === replayStrokeIdx;

            if (!isDrawn && !isReplayingActive) return null;

            return (
              <path
                key={`completed-${idx}`}
                d={path}
                fill="none"
                stroke={isReplayingActive ? '#e11d48' : brushColor}
                strokeWidth={5.8 * strokeScale * sizeFactor}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            );
          })}

          {/* 3. Solid Red Start Beacon for Next Stroke (Solid & Calm, NO JUMPING) */}
          {showFaint &&
            strokeSvgPaths.map((path, idx) => {
              const isCurrent = idx === currentStrokeIdx;
              if (!isCurrent) return null;

              const coords = path.match(/M\s*([\d.]+)\s*([\d.]+)/i);
              if (!coords) return null;
              const x = parseFloat(coords[1]);
              const y = parseFloat(coords[2]);
              const dotRadius = boxSize === 100 ? 5.5 : 12;
              const fontSize = boxSize === 100 ? 6.5 : 13;

              return (
                <g key={`current-marker-${idx}`}>
                  {/* Subtle outer indicator */}
                  <circle
                    cx={x}
                    cy={y}
                    r={dotRadius * 1.3}
                    fill="rgba(244, 63, 94, 0.25)"
                  />
                  {/* Solid red dot */}
                  <circle
                    cx={x}
                    cy={y}
                    r={dotRadius}
                    fill="#e11d48"
                  />
                  {/* Step number */}
                  <text
                    x={x}
                    y={y + (boxSize === 100 ? 2.2 : 4.5)}
                    fill="white"
                    fontSize={fontSize}
                    fontWeight="900"
                    textAnchor="middle"
                  >
                    {idx + 1}
                  </text>
                </g>
              );
            })}
        </svg>

        {/* Real-time HTML5 Touch Canvas with Boundary Lock */}
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
  );
}
