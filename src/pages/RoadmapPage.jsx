import React, { useState } from 'react';
import { STAGES_DATA, CONSTELLATION_BRANCHES, USER_PROFILE_DATA, KANA_DAILY_MAP, KANA_CURRICULUM_METADATA } from '../data/roadmapData';
import { sounds } from '../utils/soundEffects';

export function RoadmapPage({ onNavigate, onOpenQuests, xp = 540, streak = 3, masteredCount = 8 }) {
  // Main view mode: 'map' (The Hero S-Curve Adventure Map) or 'curriculum' (The 14-Day Detailed Plan)
  const [viewMode, setViewMode] = useState('map');
  
  // Selected day in 14-day curriculum view (1 to 14)
  const [selectedCurriculumDay, setSelectedCurriculumDay] = useState(1);
  
  // Quick detail modal for a specific day opened directly from map nodes
  const [quickDayModal, setQuickDayModal] = useState(null);

  const [companionTipIndex, setCompanionTipIndex] = useState(0);
  const companionTips = [
    'Mỗi ngày học 5 chữ Kana kết hợp luyện viết 5 lần trên ô Mễ tự (米) sẽ nhớ sâu không bao giờ quên!',
    'Hãy nhớ quy tắc bút thuận: Ngang trước sổ sau, trên trước dưới sau, phẩy trước mác sau!',
    'Phân biệt bẫy Katakana: シ (Shi) nét vuốt từ dưới lên, còn ツ (Tsu) nét phẩy từ trên xuống!',
    'Hoàn thành 14 ngày bảng chữ cái để tiến thẳng vào Ải 3: Chào hỏi & Giới thiệu bản thân nhé!'
  ];

  const handleNextTip = () => {
    sounds.playClick();
    setCompanionTipIndex((prev) => (prev + 1) % companionTips.length);
  };

  const handleStageClick = (stage) => {
    sounds.playClick();
    if (stage.status === 'locked') {
      sounds.playWrongStroke?.();
      alert(`Ải này đang khóa! Cần tích lũy đủ ${stage.unlockXp} XP để khai mở.`);
      return;
    }
    if (stage.dailyCurriculumDays && stage.dailyCurriculumDays.length > 0) {
      setSelectedCurriculumDay(stage.dailyCurriculumDays[0]);
      setViewMode('curriculum');
    } else if (onNavigate) {
      onNavigate(stage.route);
    }
  };

  const currentPlan = KANA_DAILY_MAP.find((p) => p.day === selectedCurriculumDay) || KANA_DAILY_MAP[0];

  return (
    <section 
      className="tab-screen flex-1 flex flex-col w-full min-h-[calc(100vh-4.5rem)] text-slate-100 relative overflow-hidden pb-16"
      style={{
        background: 'radial-gradient(ellipse at 50% 20%, #0d1629 0%, #060a14 55%, #03050c 100%)'
      }}
      id="screen-tab-map"
    >
      {/* Background Stardust & Cosmic Nebula Accents */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 bg-grid-pattern opacity-40" />
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[8%] left-[15%] w-96 h-96 rounded-full bg-emerald-500/10 blur-[130px]" />
        <div className="absolute top-[35%] right-[10%] w-96 h-96 rounded-full bg-rose-500/10 blur-[140px]" />
        <div className="absolute bottom-[10%] left-[25%] w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[150px]" />
        
        {/* Twinkling Stars */}
        <div className="stardust-star absolute top-[10%] left-[12%] text-cyan-300 text-xs">✦</div>
        <div className="stardust-star absolute top-[25%] right-[18%] text-amber-200 text-sm" style={{ animationDelay: '1.2s' }}>✧</div>
        <div className="stardust-star absolute top-[50%] left-[8%] text-rose-300 text-xs" style={{ animationDelay: '0.8s' }}>✦</div>
        <div className="stardust-star absolute top-[72%] right-[22%] text-cyan-200 text-base" style={{ animationDelay: '1.8s' }}>✦</div>
        <div className="stardust-star absolute bottom-[6%] right-[10%] text-amber-300 text-xl" style={{ animationDelay: '2.3s' }}>✧</div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-2 sm:px-4 py-3 sm:py-5 flex flex-col gap-5">
        
        {/* ========================================================================= */}
        {/* TOP BAR: LEVEL / PROGRESS & MODE SWITCHER                                 */}
        {/* ========================================================================= */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="px-2 py-0.5 rounded-md bg-rose-500/20 border border-rose-500/40 text-rose-400 text-xs font-black">
                JLPT N5
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-wide">
                Chặng 1: Tân Thủ Sơ Cấp (N5)
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
              <span>Lộ trình phiêu lưu S-Curve từ con số 0 đến đỗ chuẩn kỳ thi JLPT N5</span>
              <span className="text-emerald-400 font-bold">• 42% Tiến độ chặng</span>
            </p>
          </div>

          {/* View Mode Toggle Buttons */}
          <div className="flex items-center p-1 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl self-start sm:self-auto">
            <button
              onClick={() => { sounds.playClick(); setViewMode('map'); }}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
                viewMode === 'map'
                  ? 'bg-gradient-to-r from-rose-600 to-rose-500 text-white shadow-lg shadow-rose-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>🗺️</span>
              <span>Bản Đồ Chiến Dịch RPG</span>
            </button>
            <button
              onClick={() => { sounds.playClick(); setViewMode('curriculum'); }}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
                viewMode === 'curriculum'
                  ? 'bg-gradient-to-r from-cyan-600 to-cyan-500 text-white shadow-lg shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>📅</span>
              <span>Lộ Trình 14 Ngày Ôn 2 Bảng Chữ</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* VIEW MODE 1: HERO S-CURVE ADVENTURE MAP (THE BELOVED RPG ROADMAP)          */}
        {/* ========================================================================= */}
        {viewMode === 'map' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* COLUMN 1: CENTER S-CURVE RPG MAP (8 COLUMNS) */}
            <main className="lg:col-span-8 flex flex-col relative w-full">
              
              {/* S-Curve Map Board Canvas */}
              <div className="relative w-full h-[1220px] rounded-3xl bg-slate-950/50 border border-slate-800/80 overflow-visible p-3 sm:p-5 shadow-2xl">
                
                {/* SVG Connecting Paths (The Glowing S-Curve Lines) */}
                <svg 
                  className="absolute inset-0 w-full h-full pointer-events-none z-0"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <filter id="glow-cyan-filter" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="1.6" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                    <filter id="glow-rose-filter" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="1.8" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>

                    <linearGradient id="curve-grad-1" x1="22%" y1="5%" x2="72%" y2="16%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                    <linearGradient id="curve-grad-2" x1="72%" y1="16%" x2="22%" y2="28%">
                      <stop offset="0%" stopColor="#06b6d4" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                    <linearGradient id="curve-grad-3" x1="22%" y1="28%" x2="70%" y2="40%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#f43f5e" />
                    </linearGradient>
                  </defs>

                  {/* Segment 1: Ải 1 (22%, 5%) -> Phụ bản 1 (72%, 16%) */}
                  <path 
                    d="M 22 5 C 45 5, 52 16, 72 16"
                    fill="none"
                    stroke="url(#curve-grad-1)"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    filter="url(#glow-cyan-filter)"
                  />

                  {/* Segment 2: Phụ bản 1 (72%, 16%) -> Ải 2 (22%, 28%) */}
                  <path 
                    d="M 72 16 C 50 16, 45 28, 22 28"
                    fill="none"
                    stroke="url(#curve-grad-2)"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    filter="url(#glow-cyan-filter)"
                  />

                  {/* Segment 3: Ải 2 (22%, 28%) -> Ải 3 (70%, 40%) */}
                  <path 
                    d="M 22 28 C 45 28, 50 40, 70 40"
                    fill="none"
                    stroke="url(#curve-grad-3)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    filter="url(#glow-rose-filter)"
                  />

                  {/* Segment 4: Ải 3 (70%, 40%) -> Ải 4 (22%, 53%) */}
                  <path 
                    d="M 70 40 C 48 40, 42 53, 22 53"
                    fill="none"
                    stroke="#334155"
                    strokeWidth="1.0"
                    strokeDasharray="1.8 1.8"
                    strokeLinecap="round"
                  />

                  {/* Segment 5: Ải 4 (22%, 53%) -> Ải 5 (70%, 65%) */}
                  <path 
                    d="M 22 53 C 45 53, 50 65, 70 65"
                    fill="none"
                    stroke="#334155"
                    strokeWidth="1.0"
                    strokeDasharray="1.8 1.8"
                    strokeLinecap="round"
                  />

                  {/* Segment 6: Ải 5 (70%, 65%) -> Phụ bản 2 (25%, 77%) */}
                  <path 
                    d="M 70 65 C 50 65, 45 77, 25 77"
                    fill="none"
                    stroke="#334155"
                    strokeWidth="1.0"
                    strokeDasharray="1.8 1.8"
                    strokeLinecap="round"
                  />

                  {/* Segment 7: Phụ bản 2 (25%, 77%) -> Boss N5 (48%, 90%) */}
                  <path 
                    d="M 25 77 C 35 77, 40 90, 48 90"
                    fill="none"
                    stroke="#475569"
                    strokeWidth="1.1"
                    strokeDasharray="1.8 1.8"
                    strokeLinecap="round"
                  />

                  {/* Constellation Branches from Boss N5 to N4, N3, N2, N1 */}
                  <path d="M 48 90 Q 64 88, 75 84" fill="none" stroke="#334155" strokeWidth="0.8" strokeDasharray="1.5 1.5" />
                  <path d="M 75 84 Q 82 80, 88 76" fill="none" stroke="#334155" strokeWidth="0.8" strokeDasharray="1.5 1.5" />
                  <path d="M 75 84 Q 82 86, 88 88" fill="none" stroke="#334155" strokeWidth="0.8" strokeDasharray="1.5 1.5" />
                  <path d="M 75 84 Q 75 90, 76 94" fill="none" stroke="#334155" strokeWidth="0.8" strokeDasharray="1.5 1.5" />
                </svg>

                {/* Constellation Nodes (N4, N3, N2, N1 in space) */}
                {CONSTELLATION_BRANCHES.map((branch) => (
                  <div
                    key={branch.id}
                    className="absolute z-10 -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                    style={{ left: `${branch.coords.x}%`, top: `${branch.coords.y}%` }}
                    onClick={() => {
                      sounds.playWrongStroke?.();
                      alert(`Chòm sao ${branch.level} (${branch.title}) đang ngủ say!\n${branch.hint}`);
                    }}
                  >
                    <div className="w-11 h-11 rounded-full bg-slate-950/80 border border-dashed border-slate-700/80 flex flex-col items-center justify-center text-slate-500 group-hover:border-cyan-400 group-hover:text-cyan-300 transition-all backdrop-blur-sm">
                      <span className="text-[11px] font-black">{branch.level}</span>
                    </div>
                    <div className="text-center mt-0.5">
                      <span className="text-[9px] font-mono text-slate-600 group-hover:text-slate-400">
                        {branch.level}
                      </span>
                    </div>
                  </div>
                ))}

                {/* 8 STAGES OF THE ADVENTURE ROADMAP (PERMANENT CARDS VISIBLE DIRECTLY ON MAP) */}
                {STAGES_DATA.map((stage) => {
                  const isCompleted = stage.status === 'completed';
                  const isActive = stage.status === 'active';
                  const isLocked = stage.status === 'locked';
                  const isBoss = stage.type === 'boss';

                  return (
                    <div
                      key={stage.id}
                      className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
                      style={{ left: `${stage.coords.x}%`, top: `${stage.coords.y}%` }}
                    >
                      {/* Boss Node (Centered Layout) */}
                      {isBoss ? (
                        <div className="flex flex-col items-center cursor-pointer group" onClick={() => handleStageClick(stage)}>
                          <div className="w-full max-w-md p-4 sm:p-5 rounded-3xl bg-slate-950/90 border-2 border-amber-500/80 shadow-[0_0_30px_rgba(245,158,11,0.25)] text-center relative overflow-hidden backdrop-blur-xl group-hover:border-amber-400 transition-all">
                            <div className="flex items-center justify-center gap-1.5 text-amber-400 text-xs font-black tracking-widest uppercase mb-1">
                              <span>🔥</span>
                              <span>BOSS FINAL STAGE</span>
                              <span>🔥</span>
                            </div>
                            <h3 className="text-sm sm:text-base font-black text-white tracking-wide">
                              {stage.name}
                            </h3>
                            <p className="text-[11px] text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">
                              {stage.subtitle}
                            </p>
                            <div className="mt-3">
                              <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-black">
                                Mở khóa khi đạt {stage.unlockXp} XP
                              </span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* Normal Stages (Node + Side Card Connected) */
                        <div className="flex items-center gap-3 sm:gap-4 relative">
                          
                          {/* Left Card (if cardSide === 'left') */}
                          {stage.cardSide === 'left' && (
                            <div 
                              onClick={() => handleStageClick(stage)}
                              className={`p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl border shadow-xl backdrop-blur-xl transition-all cursor-pointer w-56 sm:w-72 ${
                                isCompleted
                                  ? 'bg-[#0a1816]/90 border-emerald-500/70 text-emerald-100 hover:scale-102'
                                  : isActive
                                    ? 'bg-[#200d16]/95 border-2 border-rose-500 text-rose-100 shadow-[0_0_25px_rgba(244,63,94,0.35)] hover:scale-102'
                                    : 'bg-[#0a0f1b]/90 border-slate-800 text-slate-400 hover:border-slate-700'
                              }`}
                            >
                              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider mb-1">
                                <span className={isCompleted ? 'text-emerald-400' : isActive ? 'text-rose-400' : 'text-slate-500'}>
                                  {isActive ? '📍 ĐANG HỌC • Lượt 2/4' : isCompleted ? `${stage.stageNum} • HOÀN THÀNH` : `${stage.stageNum} • KHÓA`}
                                </span>
                                {isCompleted ? (
                                  <span className="text-amber-400 text-xs">★★★</span>
                                ) : isLocked ? (
                                  <span className="text-slate-500 text-[10px]">Cần {stage.unlockXp} XP</span>
                                ) : null}
                              </div>

                              <h4 className="text-xs sm:text-sm font-black text-white">{stage.name}</h4>
                              <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">{stage.subtitle}</p>

                              {/* Active Action Button */}
                              {isActive && (
                                <button 
                                  onClick={(e) => { e.stopPropagation(); onNavigate && onNavigate(stage.route); }}
                                  className="mt-3 w-full py-2 px-3 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-rose-600/30 cursor-pointer"
                                >
                                  <span>VÀO HỌC NGAY ẢI 3</span>
                                  <span>→</span>
                                </button>
                              )}
                            </div>
                          )}

                          {/* Node Icon Button */}
                          <div className="flex flex-col items-center relative">
                            {/* XP Pill */}
                            <div className="mb-1 -mt-5">
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold shadow-sm border ${
                                isCompleted
                                  ? 'bg-amber-400/90 text-slate-950 border-amber-300'
                                  : isActive
                                    ? 'bg-rose-500 text-white border-rose-400 animate-pulse'
                                    : 'bg-slate-900 text-slate-500 border-slate-800'
                              }`}>
                                +{stage.xp} XP
                              </span>
                            </div>

                            <button
                              onClick={() => handleStageClick(stage)}
                              className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl sm:rounded-3xl flex items-center justify-center relative transition-all duration-300 cursor-pointer ${
                                isCompleted
                                  ? 'bg-[#09231d] border-2 border-emerald-400 text-emerald-300 neon-completed-glow hover:scale-110'
                                  : isActive
                                    ? 'bg-[#2b0e1a] border-2 border-rose-500 text-rose-200 active-node-glow hover:scale-110'
                                    : 'bg-[#080d18] border-2 border-slate-800 text-slate-600 hover:border-slate-700'
                              }`}
                            >
                              <span className={`font-black text-lg sm:text-xl ${
                                isCompleted ? 'text-emerald-300 jp-font' : isActive ? 'text-rose-200' : 'text-slate-600'
                              }`}>
                                {isLocked ? (
                                  <span className="material-symbols-outlined text-lg sm:text-xl text-slate-600">lock</span>
                                ) : (
                                  stage.icon
                                )}
                              </span>

                              {/* Checkmark badge */}
                              {isCompleted && (
                                <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#040711] flex items-center justify-center text-white text-[10px] font-black shadow-lg">
                                  ✓
                                </span>
                              )}

                              {/* Side quest tag */}
                              {stage.type === 'side' && (
                                <span className="absolute -top-2 px-1.5 py-0.2 rounded bg-purple-600 text-[8px] font-black text-white uppercase border border-purple-400">
                                  Phụ bản
                                </span>
                              )}
                            </button>
                          </div>

                          {/* Right Card (if cardSide === 'right') */}
                          {stage.cardSide === 'right' && (
                            <div 
                              onClick={() => handleStageClick(stage)}
                              className={`p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl border shadow-xl backdrop-blur-xl transition-all cursor-pointer w-56 sm:w-72 ${
                                isCompleted
                                  ? 'bg-[#0a1816]/90 border-emerald-500/70 text-emerald-100 hover:scale-102'
                                  : isActive
                                    ? 'bg-[#200d16]/95 border-2 border-rose-500 text-rose-100 shadow-[0_0_25px_rgba(244,63,94,0.35)] hover:scale-102'
                                    : 'bg-[#0a0f1b]/90 border-slate-800 text-slate-400 hover:border-slate-700'
                              }`}
                            >
                              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider mb-1">
                                <span className={isCompleted ? 'text-emerald-400' : isActive ? 'text-rose-400' : 'text-slate-500'}>
                                  {isCompleted ? `${stage.stageNum} • HOÀN THÀNH` : isLocked ? `${stage.stageNum} • ĐANG KHÓA` : `${stage.stageNum}`}
                                </span>
                                {isCompleted ? (
                                  <span className="text-amber-400 text-xs">★★★</span>
                                ) : isLocked ? (
                                  <span className="text-slate-500 text-[10px]">Cần {stage.unlockXp} XP</span>
                                ) : null}
                              </div>

                              <h4 className="text-xs sm:text-sm font-black text-white">{stage.name}</h4>
                              <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">{stage.subtitle}</p>

                              {/* Action link to view daily plan if Hiragana or Katakana */}
                              {stage.dailyCurriculumDays && stage.dailyCurriculumDays.length > 0 && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedCurriculumDay(stage.dailyCurriculumDays[0]);
                                    setViewMode('curriculum');
                                  }}
                                  className="mt-2.5 inline-flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 font-bold cursor-pointer"
                                >
                                  <span>📅 Xem Lộ Trình {stage.dailyCurriculumDays.length} Ngày</span>
                                  <span>→</span>
                                </button>
                              )}
                            </div>
                          )}

                        </div>
                      )}
                    </div>
                  );
                })}

              </div>
            </main>

            {/* COLUMN 2: GAMIFICATION PROFILE & MISSIONS SIDEBAR (4 COLUMNS) */}
            <aside className="lg:col-span-4 flex flex-col gap-4">
              
              {/* Profile Card */}
              <div className="bg-[#0b1222]/90 border border-slate-800/80 rounded-3xl p-5 shadow-2xl backdrop-blur-xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-rose-700 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-rose-600/30">
                    漢
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-black text-white">{USER_PROFILE_DATA.rank}</h3>
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                        {USER_PROFILE_DATA.tier}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{USER_PROFILE_DATA.track}</p>
                  </div>
                </div>

                {/* Level Up Progress Bar */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Tiến độ thăng hạng (Lên Bạc)</span>
                    <span className="font-mono text-amber-400 font-bold">{xp} / {USER_PROFILE_DATA.nextTierXp} XP</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 shadow-[0_0_12px_rgba(251,191,36,0.6)]"
                      style={{ width: `${Math.min(100, (xp / USER_PROFILE_DATA.nextTierXp) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Quick Stats Pill Row */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                    <div className="text-amber-400 font-black text-xs">🔥 {streak} ngày</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Chuỗi học</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                    <div className="text-emerald-400 font-black text-xs">✓ {masteredCount}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Ký tự thuộc</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                    <div className="text-cyan-400 font-black text-xs">✨ +{xp}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Tổng XP</div>
                  </div>
                </div>
              </div>

              {/* Current Active Mission Card */}
              <div className="bg-[#180d19]/90 border-2 border-rose-500/70 rounded-3xl p-5 shadow-[0_0_25px_rgba(244,63,94,0.25)] backdrop-blur-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                    ẢI ĐANG HỌC: Ải 3 • Lượt 2/4
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-black text-white">
                    {USER_PROFILE_DATA.activeStageTitle}
                  </h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {USER_PROFILE_DATA.activeStageDesc}
                  </p>
                </div>
                <button
                  onClick={() => { sounds.playClick(); onNavigate && onNavigate('practice'); }}
                  className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 cursor-pointer transition-all active:scale-95"
                >
                  <span>VÀO HỌC NGAY ẢI 3</span>
                  <span>→</span>
                </button>
              </div>

              {/* Bé Shiba Mascot Companion Widget */}
              <div className="bg-[#0b1222]/90 border border-slate-800/80 rounded-3xl p-4 shadow-xl backdrop-blur-xl space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-13 h-13 rounded-2xl overflow-hidden bg-slate-900 border-2 border-amber-400/40 shadow-[0_0_15px_rgba(251,191,36,0.3)] shrink-0">
                    <img 
                      src="/shiba_mascot.jpg" 
                      alt="Bé Shiba Kimono" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-amber-300 flex items-center gap-1">
                      <span>Bé Shiba Đồng Hành</span>
                      <span className="text-[10px] px-1.5 py-0.2 bg-amber-500/20 text-amber-300 rounded-full border border-amber-500/30">Lv.1</span>
                    </h4>
                    <p className="text-[10px] text-slate-400">Võ sư thư pháp nhí</p>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs text-slate-200 leading-relaxed">
                  <p className="text-[11px] leading-snug">{companionTips[companionTipIndex]}</p>
                </div>

                <button
                  onClick={handleNextTip}
                  className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/60 text-left flex items-center justify-between text-xs text-slate-300 font-bold cursor-pointer transition-all"
                >
                  <span className="text-[11px] text-rose-400">Gợi ý mẹo học tiếp theo</span>
                  <span className="material-symbols-outlined text-sm text-slate-400">chevron_right</span>
                </button>
              </div>

              {/* Daily Quests Box */}
              <div className="bg-[#0b1222]/90 border border-slate-800/80 rounded-3xl p-5 shadow-xl backdrop-blur-xl space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                    <span>🏆</span>
                    <span>NHIỆM VỤ HÀNG NGÀY</span>
                  </h4>
                  <button 
                    onClick={() => { sounds.playClick(); onOpenQuests && onOpenQuests(); }}
                    className="text-[11px] text-cyan-400 hover:underline font-bold cursor-pointer"
                  >
                    Xem tất cả →
                  </button>
                </div>

                <div className="space-y-2">
                  {USER_PROFILE_DATA.dailyQuests.map((quest) => (
                    <div 
                      key={quest.id}
                      className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={quest.completed ? 'text-emerald-400 font-black' : 'text-amber-400 font-bold'}>
                          {quest.completed ? '✓' : '✏️'}
                        </span>
                        <div>
                          <div className={`font-bold ${quest.completed ? 'text-slate-300 line-through' : 'text-white'}`}>
                            {quest.text}
                          </div>
                          <div className="text-[10px] text-slate-500">{quest.statusText}</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-amber-400 shrink-0">
                        +{quest.xp} XP
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Practice Shortcuts */}
              <div className="bg-[#0b1222]/90 border border-slate-800/80 rounded-3xl p-5 shadow-xl backdrop-blur-xl space-y-3">
                <h4 className="text-xs font-black text-slate-300 uppercase tracking-wider">
                  LỐI TẮT LUYỆN TẬP:
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => { sounds.playClick(); onNavigate && onNavigate('practice'); }}
                    className="p-3 rounded-2xl bg-slate-950/70 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-left transition-all cursor-pointer group"
                  >
                    <div className="text-rose-400 text-base mb-1">✒️</div>
                    <div className="text-xs font-bold text-white group-hover:text-rose-300">Luyện Bút Thuận</div>
                    <div className="text-[10px] text-slate-500">Ô Mễ tự thư pháp</div>
                  </button>
                  <button
                    onClick={() => { sounds.playClick(); onNavigate && onNavigate('kana'); }}
                    className="p-3 rounded-2xl bg-slate-950/70 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-left transition-all cursor-pointer group"
                  >
                    <div className="text-cyan-400 text-base mb-1">📇</div>
                    <div className="text-xs font-bold text-white group-hover:text-cyan-300">92 Thẻ Nhớ 3D</div>
                    <div className="text-[10px] text-slate-500">Lật thẻ liên tưởng</div>
                  </button>
                  <button
                    onClick={() => { sounds.playClick(); onNavigate && onNavigate('kanji'); }}
                    className="p-3 rounded-2xl bg-slate-950/70 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-left transition-all cursor-pointer group"
                  >
                    <div className="text-amber-400 text-base mb-1">📖</div>
                    <div className="text-xs font-bold text-white group-hover:text-amber-300">103 Chữ Hán N5</div>
                    <div className="text-[10px] text-slate-500">Âm On / Kun cốt lõi</div>
                  </button>
                  <button
                    onClick={() => { sounds.playClick(); onNavigate && onNavigate('exam'); }}
                    className="p-3 rounded-2xl bg-slate-950/70 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-left transition-all cursor-pointer group"
                  >
                    <div className="text-emerald-400 text-base mb-1">📝</div>
                    <div className="text-xs font-bold text-white group-hover:text-emerald-300">Thi Thử CBT</div>
                    <div className="text-[10px] text-slate-500">Phòng thi đếm ngược</div>
                  </button>
                </div>
              </div>

            </aside>

          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW MODE 2: THE 14-DAY DETAILED KANA CURRICULUM (DAY BY DAY LEARNING)    */}
        {/* ========================================================================= */}
        {viewMode === 'curriculum' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            {/* Header Hero Banner for Curriculum */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-[#0b1b2d] via-[#10233b] to-[#0b1222] border-2 border-cyan-500/40 shadow-2xl relative overflow-hidden">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-black uppercase">
                      LỘ TRÌNH CHI TIẾT 14 NGÀY
                    </span>
                    <span className="text-xs text-slate-300 font-medium">• 30 - 45 phút / ngày</span>
                    <span className="text-xs text-amber-400 font-bold">• 4 bước kiểm tra chắc chắn</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white">
                    {KANA_CURRICULUM_METADATA.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Kế hoạch học tập sư phạm chuẩn xác từ con số 0: Rõ từng ngày học bao nhiêu chữ, luyện nghĩa từ vựng đời sống, viết bút thuận ô Mễ tự (米) và bài kiểm tra 4 bước chống quên.
                  </p>
                </div>

                {/* Overall Stats Pill */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/70 p-4 rounded-2xl border border-slate-800 shrink-0">
                  <div className="text-center">
                    <div className="text-lg font-black text-emerald-400 font-mono">46</div>
                    <div className="text-[10px] text-slate-400">Hiragana</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-black text-cyan-400 font-mono">46</div>
                    <div className="text-[10px] text-slate-400">Katakana</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-black text-amber-400 font-mono">58</div>
                    <div className="text-[10px] text-slate-400">Đục / Ảo âm</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-black text-rose-400 font-mono">85+</div>
                    <div className="text-[10px] text-slate-400">Từ vựng mẫu</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Phase Selector & Day Pills Navigation */}
            <div className="space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-black text-slate-300 uppercase tracking-wider">
                  Chọn ngày học trong lộ trình 14 ngày:
                </span>
                <span className="text-xs text-cyan-400 font-mono font-bold">
                  Đang xem: Ngày {currentPlan.day} / 14
                </span>
              </div>

              {/* Horizontal Day Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                {KANA_DAILY_MAP.map((plan) => {
                  const isSelected = selectedCurriculumDay === plan.day;
                  const isHiragana = plan.phase === 'hiragana';
                  const isBossDay = plan.day === 8 || plan.day === 14;

                  return (
                    <button
                      key={plan.day}
                      onClick={() => { sounds.playClick(); setSelectedCurriculumDay(plan.day); }}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between h-22 ${
                        isSelected
                          ? 'bg-gradient-to-b from-cyan-500/20 to-blue-600/30 border-2 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.35)] scale-102'
                          : 'bg-[#0b1222]/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                          isBossDay
                            ? 'bg-amber-500/30 text-amber-300 border border-amber-500/40'
                            : isHiragana
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-rose-500/20 text-rose-300'
                        }`}>
                          N.{plan.day} {isBossDay ? '👑' : ''}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {plan.newCharsCount ? `+${plan.newCharsCount}` : 'Ôn'}
                        </span>
                      </div>

                      <div className="font-bold text-xs text-white line-clamp-1 mt-1">
                        {plan.targetChars.slice(0, 5).join(' ')}
                      </div>

                      <div className="text-[9px] text-slate-400 truncate">
                        {isHiragana ? 'Hiragana' : 'Katakana'}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* DETAILED DAY STUDY CARD: 4 KEY AREAS REQUESTED BY USER */}
            <div className="bg-[#0b1222]/90 border-2 border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6">
              
              {/* Day Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-black font-mono">
                      NGÀY {currentPlan.day} / 14
                    </span>
                    <span className="text-xs text-slate-400">
                      Phase: {currentPlan.phase === 'hiragana' ? '🌸 Bảng chữ mềm Hiragana' : '⚡ Bảng chữ cứng Katakana'}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-white mt-1.5">
                    {currentPlan.title}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">{currentPlan.subtitle}</p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      sounds.playClick();
                      if (onNavigate) onNavigate('practice');
                    }}
                    className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-rose-600/30 cursor-pointer transition-all active:scale-95"
                  >
                    <span>✍️ Vào Luyện Viết Ngày Này</span>
                    <span>→</span>
                  </button>
                </div>
              </div>

              {/* 4 COLUMNS / SECTIONS CORRESPONDING TO USER'S EXACT INSTRUCTIONS */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* 1. SỐ LƯỢNG CHỮ HỌC & CHI TIẾT NÉT */}
                <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                      <span>🎯</span>
                      <span>1. Số chữ học hôm nay: {currentPlan.newCharsCount} chữ mới</span>
                    </h4>
                    <span className="text-[10px] font-mono text-slate-400">
                      Ôn tập: {currentPlan.reviewCharsCount} chữ
                    </span>
                  </div>

                  {/* Character Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {currentPlan.characters.map((c, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-[#0d1629] border border-slate-800 flex flex-col justify-between gap-2">
                        <div className="flex items-center justify-between">
                          <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-2xl font-black text-white jp-font shadow-inner">
                            {c.char}
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-mono font-black text-cyan-300">/{c.romaji}/</span>
                            <div className="text-[10px] text-slate-400">{c.strokeCount} nét bút</div>
                          </div>
                        </div>

                        <div className="text-[11px] text-slate-300 leading-snug">
                          <strong className="text-amber-300">Mẹo nhớ: </strong>
                          {c.mnemonic}
                        </div>

                        {c.soundGuide && (
                          <div className="text-[10px] text-slate-400 leading-snug border-t border-slate-800/80 pt-1.5">
                            🗣️ {c.soundGuide}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. LUYỆN NGHĨA TỪ VỰNG THỰC TẾ ĐỜI SỐNG */}
                <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
                  <h4 className="text-xs font-black text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                    <span>📖</span>
                    <span>2. Luyện nghĩa & Từ vựng thực tế đời sống</span>
                  </h4>
                  <p className="text-xs text-slate-400">
                    Từ vựng chỉ cấu thành từ các chữ cái đã học tính đến ngày hôm nay:
                  </p>

                  <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                    {currentPlan.vocabularyPractice.map((v, i) => (
                      <div key={i} className="p-3 rounded-xl bg-[#0d1629] border border-slate-800 flex items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-black text-white jp-font">{v.word}</span>
                            <span className="text-xs font-mono text-cyan-300">({v.romaji})</span>
                            {v.hanviet && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-serif">
                                Hán-Việt: {v.hanviet}
                              </span>
                            )}
                          </div>
                          <div className="text-xs font-bold text-emerald-300 mt-0.5">
                            Ý nghĩa: {v.meaning}
                          </div>
                          {v.example && (
                            <div className="text-[10px] text-slate-400 mt-1 italic">
                              VD: {v.example} ({v.exampleMeaning})
                            </div>
                          )}
                        </div>

                        <div className="flex gap-1 shrink-0">
                          {v.components.map((comp, ci) => (
                            <span key={ci} className="w-5 h-5 rounded bg-slate-900 border border-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-300">
                              {comp}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. LUYỆN VIẾT BÚT THUẬN CHUẨN THƯ PHÁP */}
                <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                  <h4 className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-2">
                    <span>✍️</span>
                    <span>3. Luyện viết bút thuận trên ô Mễ tự (米)</span>
                  </h4>
                  
                  <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
                    <div className="p-3 rounded-xl bg-[#0d1629] border border-slate-800 space-y-1">
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <span>📐</span>
                        <span>Nguyên tắc căn lề & bút thuận:</span>
                      </div>
                      <p className="text-slate-300 text-[11px]">{currentPlan.writingFocus.gridGuide}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-3 rounded-xl bg-[#0d1629] border border-slate-800">
                        <span className="text-[10px] font-black text-slate-400 uppercase">Độ chuẩn yêu cầu:</span>
                        <div className="text-base font-black text-emerald-400 font-mono mt-0.5">
                          &ge; {currentPlan.writingFocus.minAccuracy}%
                        </div>
                      </div>
                      <div className="p-3 rounded-xl bg-[#0d1629] border border-slate-800">
                        <span className="text-[10px] font-black text-slate-400 uppercase">Mỗi chữ viết tối thiểu:</span>
                        <div className="text-base font-black text-amber-400 font-mono mt-0.5">
                          {currentPlan.writingFocus.recommendedRepeats}
                        </div>
                      </div>
                    </div>

                    {/* Key Techniques */}
                    {currentPlan.writingFocus?.keyTechniques && (
                      <div className="p-3 rounded-xl bg-[#0d1629] border border-slate-800 space-y-1.5">
                        <div className="text-[10px] font-black text-cyan-400 uppercase tracking-wider">
                          Kỹ thuật bút thuận cốt lõi:
                        </div>
                        <ul className="list-disc list-inside text-[11px] text-slate-300 space-y-1">
                          {currentPlan.writingFocus.keyTechniques.map((tech, ti) => (
                            <li key={ti}>{tech}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-3 rounded-xl bg-[#0d1629] border border-slate-800">
                        <span className="text-[10px] font-black text-slate-400 uppercase">Độ chuẩn yêu cầu:</span>
                        <div className="text-base font-black text-emerald-400 font-mono mt-0.5">
                          &ge; {currentPlan.writingFocus?.minAccuracy || 85}%
                        </div>
                      </div>
                      <div className="p-3 rounded-xl bg-[#0d1629] border border-slate-800">
                        <span className="text-[10px] font-black text-slate-400 uppercase">Mỗi chữ viết tối thiểu:</span>
                        <div className="text-base font-black text-amber-400 font-mono mt-0.5">
                          {currentPlan.writingFocus?.requiredWritesPerChar || 5} lần
                        </div>
                      </div>
                    </div>

                    {/* Common Mistakes */}
                    {currentPlan.writingFocus?.commonMistakes && (
                      <div className="p-3 rounded-xl bg-[#0d1629] border border-slate-800">
                        <div className="text-[10px] font-black text-rose-400 uppercase mb-1">
                          Lỗi sai thường gặp cần tránh:
                        </div>
                        <p className="text-[11px] text-slate-300 leading-relaxed">
                          {currentPlan.writingFocus.commonMistakes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* 4. KIỂM TRA BÀI 4 BƯỚC CHẮC CHẮN (CHỐNG QUÊN) */}
                <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                  <h4 className="text-xs font-black text-rose-400 uppercase tracking-wider flex items-center gap-2">
                    <span>🛡️</span>
                    <span>4. Quy trình kiểm tra 4 bước chắc chắn</span>
                  </h4>
                  <p className="text-xs text-slate-400">
                    Bảo đảm thuộc làu 100%, không bị lẫn lộn giữa các ký tự:
                  </p>

                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-[#0d1629] border border-slate-800 flex items-start gap-2.5">
                      <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono text-[10px] font-black shrink-0">
                        B.1
                      </span>
                      <div className="text-[11px] text-slate-300">
                        <strong className="text-white">Nghe phản xạ: </strong>
                        Thực hiện {currentPlan.testingProtocol?.step1AudioQuizCount || 10} câu trắc nghiệm nghe audio phát âm Tokyo chọn chữ đúng.
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[#0d1629] border border-slate-800 flex items-start gap-2.5">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-black shrink-0">
                        B.2
                      </span>
                      <div className="text-[11px] text-slate-300">
                        <strong className="text-white">Nối nghĩa từ vựng: </strong>
                        Ghép đúng {currentPlan.testingProtocol?.step2MeaningMatchCount || 5} từ vựng mới học với ý nghĩa tiếng Việt tương ứng.
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[#0d1629] border border-slate-800 flex items-start gap-2.5">
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-[10px] font-black shrink-0">
                        B.3
                      </span>
                      <div className="text-[11px] text-slate-300">
                        <strong className="text-white">Vẽ mù (Blind Canvas): </strong>
                        Tự viết từ trí nhớ {currentPlan.testingProtocol?.step3BlindCanvasWrites || 5} chữ trên Canvas không nhìn nét mờ gợi ý (đạt &ge; {currentPlan.writingFocus?.minAccuracy || 85}%).
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[#0d1629] border border-slate-800 flex items-start gap-2.5">
                      <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono text-[10px] font-black shrink-0">
                        B.4
                      </span>
                      <div className="text-[11px] text-slate-300">
                        <strong className="text-white">Tiêu chuẩn đỗ: </strong>
                        Đạt điểm kiểm tra từ {currentPlan.testingProtocol?.passingScorePercent || 85}% trở lên để hoàn tất và nhận +{currentPlan.xpReward || 100} XP.
                      </div>
                    </div>

                    {currentPlan.srsPlan && (
                      <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-[11px] text-cyan-300 flex items-center justify-between">
                        <span>🔄 <strong>Lịch ôn ngắt quãng SRS: </strong> Ngày {currentPlan.srsPlan.nextReviewDays.join(', ')}</span>
                        <span className="text-[10px] font-mono text-amber-300">Ôn {currentPlan.srsPlan.charsToReview.length} chữ</span>
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* Bottom Quick Switch back to Map */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => { sounds.playClick(); setViewMode('map'); }}
                  className="py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <span>←</span>
                  <span>Quay lại Bản Đồ Chiến Dịch RPG</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    disabled={selectedCurriculumDay <= 1}
                    onClick={() => { sounds.playClick(); setSelectedCurriculumDay(p => Math.max(1, p - 1)); }}
                    className="p-2 rounded-xl bg-slate-800 disabled:opacity-40 text-xs font-bold text-slate-300 hover:text-white cursor-pointer"
                  >
                    ◀ Ngày trước
                  </button>
                  <button
                    disabled={selectedCurriculumDay >= 14}
                    onClick={() => { sounds.playClick(); setSelectedCurriculumDay(p => Math.min(14, p + 1)); }}
                    className="p-2 rounded-xl bg-slate-800 disabled:opacity-40 text-xs font-bold text-slate-300 hover:text-white cursor-pointer"
                  >
                    Ngày tiếp ▶
                  </button>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </section>
  );
}
