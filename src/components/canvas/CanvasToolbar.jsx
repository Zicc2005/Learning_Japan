import React from 'react';
import { PenTool, Eye, EyeOff } from 'lucide-react';
import { sounds } from '../../utils/soundEffects';

export function CanvasToolbar({
  brushType,
  setBrushType,
  brushSize = 'medium',
  setBrushSize,
  brushColor,
  setBrushColor,
  gridType,
  setGridType,
  showFaint,
  setShowFaint
}) {
  const colors = [
    { color: '#1e293b', label: 'Mực đen mun (Sumi)' },
    { color: '#e11d48', label: 'Đỏ son Torii' },
    { color: '#d97706', label: 'Hổ phách' },
    { color: '#2563eb', label: 'Xanh chàm Indigo' },
    { color: '#059669', label: 'Xanh Matcha' },
  ];

  const grids = [
    { id: 'tian', label: '田字格 (Ô Điền)' },
    { id: 'mizi', label: '米字格 (Ô Mễ)' },
    { id: 'jing', label: '井字格 (Ô Tỉnh)' },
    { id: 'none', label: 'Ô Trơn' }
  ];

  const brushSizes = [
    { id: 'small', label: 'Nhỏ', dotSize: 'w-1.5 h-1.5' },
    { id: 'medium', label: 'Vừa', dotSize: 'w-2.5 h-2.5' },
    { id: 'large', label: 'To', dotSize: 'w-3.5 h-3.5' }
  ];

  return (
    <div className="w-full flex flex-wrap items-center justify-between gap-2.5 bg-slate-100/90 dark:bg-[#0b1120] p-2.5 sm:p-3 rounded-2xl border border-slate-200 dark:border-slate-800 transition-colors">
      
      {/* 1. Brush Style Selector (Bút Dạ / Bút Lông) */}
      <div className="flex items-center gap-1 bg-white dark:bg-[#151f33] p-1 rounded-xl border border-slate-200/80 dark:border-slate-700/60 shadow-2xs">
        <button
          onClick={() => { sounds.playClick(); setBrushType('felt'); }}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            brushType === 'felt'
              ? 'bg-rose-500 text-white shadow-xs font-black'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <PenTool className="w-3.5 h-3.5" />
          <span>Bút Dạ</span>
        </button>

        <button
          onClick={() => { sounds.playClick(); setBrushType('calligraphy'); }}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            brushType === 'calligraphy'
              ? 'bg-rose-500 text-white shadow-xs font-black'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <span>🖌 Bút Lông</span>
        </button>
      </div>

      {/* 2. Brush Size Selector (Cỡ nét: 3 nấc chấm tròn như Ảnh 3 & 4) */}
      <div className="flex items-center gap-1.5 bg-white dark:bg-[#151f33] px-2.5 py-1.5 rounded-xl border border-slate-200/80 dark:border-slate-700/60 shadow-2xs">
        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:inline">Cỡ nét:</span>
        <div className="flex items-center gap-1">
          {brushSizes.map((s) => (
            <button
              key={s.id}
              onClick={() => { sounds.playClick(); if (setBrushSize) setBrushSize(s.id); }}
              title={`Cỡ nét ${s.label}`}
              className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                brushSize === s.id
                  ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-400 shadow-2xs'
                  : 'text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span className={`${s.dotSize} rounded-full bg-current`} />
            </button>
          ))}
        </div>
      </div>

      {/* 3. Color Palette */}
      <div className="flex items-center gap-2 bg-white dark:bg-[#151f33] px-3 py-1.5 rounded-xl border border-slate-200/80 dark:border-slate-700/60 shadow-2xs">
        {colors.map((c) => (
          <button
            key={c.color}
            onClick={() => { sounds.playClick(); setBrushColor(c.color); }}
            style={{ backgroundColor: c.color }}
            className={`w-5 h-5 rounded-full transition-all cursor-pointer ${
              brushColor === c.color 
                ? 'scale-125 ring-2 ring-rose-500 ring-offset-2 ring-offset-white dark:ring-offset-[#151f33] shadow-xs' 
                : 'opacity-75 hover:opacity-100 hover:scale-110'
            }`}
            title={c.label}
          />
        ))}
      </div>

      {/* 4. Grid Types (田字格, 米字格, 井字格, Ô Trơn) */}
      <div className="flex items-center gap-1 bg-white dark:bg-[#151f33] p-1 rounded-xl border border-slate-200/80 dark:border-slate-700/60 shadow-2xs">
        {grids.map((g) => (
          <button
            key={g.id}
            onClick={() => { sounds.playClick(); setGridType(g.id); }}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              gridType === g.id
                ? 'bg-amber-500 text-white shadow-xs font-black'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {g.label}
          </button>
        ))}
      </div>

      {/* 5. Faint Stroke Switcher */}
      <button
        onClick={() => { sounds.playClick(); setShowFaint(!showFaint); }}
        className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border cursor-pointer ${
          showFaint
            ? 'bg-rose-50 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-500/40 shadow-2xs'
            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:text-slate-900 dark:hover:text-slate-200'
        }`}
      >
        {showFaint ? <Eye className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" /> : <EyeOff className="w-3.5 h-3.5" />}
        <span>Nét mờ: {showFaint ? 'BẬT' : 'TẮT'}</span>
      </button>

    </div>
  );
}
