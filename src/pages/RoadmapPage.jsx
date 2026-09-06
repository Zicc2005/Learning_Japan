import React, { useState } from 'react';
import { STAGES_DATA, USER_PROFILE_DATA, KANA_DAILY_MAP, KANA_CURRICULUM_METADATA } from '../data/roadmapData';
import { sounds } from '../utils/soundEffects';

export function RoadmapPage({ onNavigate, onOpenQuests, xp = 0, setXp, streak = 1, masteredCount = 0, masteredChars, setMasteredChars }) {
  // Main view mode: 'map' (The Hero S-Curve Adventure Map) or 'curriculum' (The 14-Day Detailed Plan)
  const [viewMode, setViewMode] = useState('map');
  
  // Selected day in 14-day curriculum view (1 to 14)
  const [selectedCurriculumDay, setSelectedCurriculumDay] = useState(1);
  
  // Quick detail modal for a specific day opened directly from map nodes
  const [quickDayModal, setQuickDayModal] = useState(null);

  // Completed days persistence in localStorage
  const [completedDays, setCompletedDays] = useState(() => {
    try {
      const saved = localStorage.getItem('nihon_v2_completed_days');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const isDayDone = (plan) => {
    if (!plan) return false;
    if (completedDays.includes(plan.day)) return true;
    if (!plan.targetChars || plan.targetChars.length === 0) return false;
    const mSet = masteredChars instanceof Set ? masteredChars : new Set(masteredChars || []);
    const masteredInDay = plan.targetChars.filter(c => mSet.has(c)).length;
    return masteredInDay >= plan.targetChars.length;
  };

  const toggleCompleteDay = (day) => {
    sounds.playClick();
    const plan = KANA_DAILY_MAP.find(p => p.day === day);
    const isAlreadyDone = completedDays.includes(day);
    const nextCompleted = isAlreadyDone
      ? completedDays.filter(d => d !== day)
      : [...completedDays, day];
    
    setCompletedDays(nextCompleted);
    try {
      localStorage.setItem('nihon_v2_completed_days', JSON.stringify(nextCompleted));
    } catch (e) {}

    // If newly completing, add all 5 target characters to masteredChars and award XP
    if (!isAlreadyDone && plan?.targetChars) {
      sounds.playLevelUp?.();
      if (setMasteredChars) {
        setMasteredChars((prevSet) => {
          const next = new Set(prevSet);
          plan.targetChars.forEach(c => next.add(c));
          return next;
        });
      }
      if (setXp) {
        setXp(prev => prev + 100);
      }
    }
  };

  const [companionTipIndex, setCompanionTipIndex] = useState(0);
  const companionTips = [
    'Thứ tự chuẩn hóa: Học Hiragana -> Katakana -> Kanji N5. 214 Bộ Thủ là phụ bản học bổ trợ tùy chọn!',
    'Mỗi ngày học 5 chữ Kana kết hợp luyện viết 5 lần trên ô Mễ tự (米) sẽ nhớ sâu không bao giờ quên!',
    'Hãy nhớ quy tắc bút thuận: Ngang trước sổ sau, trên trước dưới sau, phẩy trước mác sau!',
    'Phân biệt bẫy Katakana: シ (Shi) nét vuốt từ dưới lên, còn ツ (Tsu) nét phẩy từ trên xuống!',
    'Hoàn thành Hiragana & Katakana để mở khóa 103 chữ Hán cốt lõi N5 và giao tiếp thực chiến!'
  ];

  const handleNextTip = () => {
    sounds.playClick();
    setCompanionTipIndex((prev) => (prev + 1) % companionTips.length);
  };

  const activeStage = STAGES_DATA.find((s) => s.status === 'active') || STAGES_DATA[0];
  const completedStagesCount = STAGES_DATA.filter((s) => s.status === 'completed').length;
  const overallProgress = STAGES_DATA.length > 0 ? Math.round((completedStagesCount / STAGES_DATA.length) * 100) : 0;

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
              <span className="text-emerald-400 font-bold">• {overallProgress}% Tiến độ chặng</span>
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
              <div className="relative w-full h-[980px] rounded-3xl bg-slate-950/50 border border-slate-800/80 overflow-visible p-4 sm:p-6 shadow-2xl">
                
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

                    <linearGradient id="curve-grad-1" x1="22%" y1="9%" x2="72%" y2="32%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                    <linearGradient id="curve-grad-2" x1="72%" y1="32%" x2="22%" y2="56%">
                      <stop offset="0%" stopColor="#06b6d4" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                    <linearGradient id="curve-grad-3" x1="22%" y1="56%" x2="50%" y2="80%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#f43f5e" />
                    </linearGradient>
                  </defs>

                  {/* Segment 1: Ải 1 (22%, 9%) -> Phụ bản 1 (72%, 32%) */}
                  <path 
                    d="M 22 9 C 48 9, 52 32, 72 32"
                    fill="none"
                    stroke="url(#curve-grad-1)"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    filter="url(#glow-cyan-filter)"
                  />

                  {/* Segment 2: Phụ bản 1 (72%, 32%) -> Ải 2 (22%, 56%) */}
                  <path 
                    d="M 72 32 C 52 32, 48 56, 22 56"
                    fill="none"
                    stroke="url(#curve-grad-2)"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    filter="url(#glow-cyan-filter)"
                  />

                  {/* Segment 3: Ải 2 (22%, 56%) -> Ải 3 Boss Kanji (50%, 80%) */}
                  <path 
                    d="M 22 56 C 22 72, 38 80, 50 80"
                    fill="none"
                    stroke="url(#curve-grad-3)"
                    strokeWidth="2.0"
                    strokeLinecap="round"
                    filter="url(#glow-rose-filter)"
                  />
                </svg>

                {/* STAGES OF THE ADVENTURE ROADMAP (PERMANENT CARDS VISIBLE DIRECTLY ON MAP) */}
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
                          <div className="w-full max-w-md pt-5 pb-5 px-6 rounded-2xl bg-slate-950/95 border-2 border-rose-500/80 shadow-[0_0_30px_rgba(244,63,94,0.25)] text-center relative overflow-hidden backdrop-blur-xl group-hover:border-rose-400 transition-all">
                            <div className="flex items-center justify-center gap-1.5 text-rose-400 text-xs font-black tracking-widest uppercase mb-1.5 leading-normal">
                              <span>🔥</span>
                              <span>ĐÍCH ĐẾN CỐT LÕI N5</span>
                              <span>🔥</span>
                            </div>
                            <h3 className="text-sm sm:text-base font-black text-white tracking-wide leading-snug break-words">
                              {stage.name}
                            </h3>
                            <p className="text-[11px] text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed break-words">
                              {stage.subtitle}
                            </p>
                            <div className="mt-3">
                              <span className="inline-block px-4 py-1.5 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-black leading-normal">
                                {isCompleted ? '✓ ĐÃ HOÀN THÀNH' : `Mở khóa khi đạt ${stage.unlockXp} XP`}
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
                              className={`p-4 sm:p-5 rounded-2xl border shadow-xl backdrop-blur-xl transition-all cursor-pointer w-60 sm:w-76 overflow-visible ${
                                isCompleted
                                  ? 'bg-[#0a1816]/90 border-emerald-500/70 text-emerald-100 hover:scale-102'
                                  : isActive
                                    ? 'bg-[#200d16]/95 border-2 border-rose-500 text-rose-100 shadow-[0_0_25px_rgba(244,63,94,0.35)] hover:scale-102'
                                    : 'bg-[#0a0f1b]/90 border-slate-800 text-slate-400 hover:border-slate-700'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2 mb-2">
                                <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] sm:text-[11px] font-black uppercase tracking-wider leading-normal ${
                                  isCompleted 
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                                    : isActive 
                                      ? 'bg-rose-500/25 text-rose-200 border border-rose-500/50' 
                                      : 'bg-slate-800/80 text-slate-400 border border-slate-700/60'
                                }`}>
                                  {isActive ? (stage.dailyCurriculumDays ? `📍 ĐANG HỌC • Ngày 1/${stage.dailyCurriculumDays.length}` : '📍 ĐANG HỌC') : isCompleted ? `${stage.stageNum} • HOÀN THÀNH` : `${stage.stageNum} • ĐANG KHÓA`}
                                </span>
                                {isCompleted ? (
                                  <span className="text-amber-400 text-xs font-bold">★★★</span>
                                ) : isLocked ? (
                                  <span className="text-slate-500 text-[10px] font-medium whitespace-nowrap">Cần {stage.unlockXp} XP</span>
                                ) : null}
                              </div>

                              <h4 className="text-xs sm:text-sm font-black text-white leading-snug break-words">{stage.name}</h4>
                              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed break-words">{stage.subtitle}</p>

                              {/* Active Action Button */}
                              {isActive && (
                                <button 
                                  onClick={(e) => { 
                                    e.stopPropagation(); 
                                    if (stage.dailyCurriculumDays && stage.dailyCurriculumDays.length > 0) {
                                      setSelectedCurriculumDay(stage.dailyCurriculumDays[0]);
                                      setViewMode('curriculum');
                                    } else if (onNavigate) {
                                      onNavigate(stage.route);
                                    }
                                  }}
                                  className="mt-3 w-full py-2 px-3 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-rose-600/30 cursor-pointer"
                                >
                                  <span>VÀO HỌC NGAY {stage.stageNum.toUpperCase()}</span>
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
                              className={`p-4 sm:p-5 rounded-2xl border shadow-xl backdrop-blur-xl transition-all cursor-pointer w-60 sm:w-76 overflow-visible ${
                                isCompleted
                                  ? 'bg-[#0a1816]/90 border-emerald-500/70 text-emerald-100 hover:scale-102'
                                  : isActive
                                    ? 'bg-[#200d16]/95 border-2 border-rose-500 text-rose-100 shadow-[0_0_25px_rgba(244,63,94,0.35)] hover:scale-102'
                                    : 'bg-[#0a0f1b]/90 border-slate-800 text-slate-400 hover:border-slate-700'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2 mb-2">
                                <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] sm:text-[11px] font-black uppercase tracking-wider leading-normal ${
                                  isCompleted 
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                                    : isActive 
                                      ? 'bg-rose-500/25 text-rose-200 border border-rose-500/50' 
                                      : 'bg-slate-800/80 text-slate-400 border border-slate-700/60'
                                }`}>
                                  {isActive ? (stage.dailyCurriculumDays ? `📍 ĐANG HỌC • Ngày 1/${stage.dailyCurriculumDays.length}` : '📍 ĐANG HỌC') : isCompleted ? `${stage.stageNum} • HOÀN THÀNH` : `${stage.stageNum} • ĐANG KHÓA`}
                                </span>
                                {isCompleted ? (
                                  <span className="text-amber-400 text-xs font-bold">★★★</span>
                                ) : isLocked ? (
                                  <span className="text-slate-500 text-[10px] font-medium whitespace-nowrap">Cần {stage.unlockXp} XP</span>
                                ) : null}
                              </div>

                              <h4 className="text-xs sm:text-sm font-black text-white leading-snug break-words">{stage.name}</h4>
                              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed break-words">{stage.subtitle}</p>

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
                    ẢI ĐANG HỌC: {activeStage.stageNum} {activeStage.dailyCurriculumDays ? '• Ngày 1/8' : ''}
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-black text-white">
                    {activeStage.name}
                  </h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {activeStage.description || USER_PROFILE_DATA.activeStageDesc}
                  </p>
                </div>
                <button
                  onClick={() => { 
                    sounds.playClick(); 
                    if (activeStage.dailyCurriculumDays && activeStage.dailyCurriculumDays.length > 0) {
                      setSelectedCurriculumDay(activeStage.dailyCurriculumDays[0]);
                      setViewMode('curriculum');
                    } else if (onNavigate) {
                      onNavigate(activeStage.route); 
                    }
                  }}
                  className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 cursor-pointer transition-all active:scale-95"
                >
                  <span>VÀO HỌC NGAY {activeStage.stageNum.toUpperCase()} ({activeStage.name})</span>
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
                    onClick={() => { sounds.playClick(); onNavigate && onNavigate('practice'); }}
                    className="p-3 rounded-2xl bg-slate-950/70 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-left transition-all cursor-pointer group"
                  >
                    <div className="text-indigo-400 text-base mb-1">部</div>
                    <div className="text-xs font-bold text-white group-hover:text-indigo-300">214 Bộ Thủ</div>
                    <div className="text-[10px] text-slate-500">Gốc rễ chữ Hán</div>
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
            <div className="p-5 sm:p-7 md:p-8 rounded-2xl bg-gradient-to-r from-[#0b1b2d] via-[#10233b] to-[#0b1222] border-2 border-cyan-500/40 shadow-2xl relative overflow-hidden">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
                <div className="space-y-3 w-full max-w-3xl">
                  <div className="flex items-center gap-2.5 flex-wrap pt-0.5">
                    <span className="inline-flex items-center px-3.5 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-black uppercase tracking-wider leading-normal shadow-sm">
                      LỘ TRÌNH CHI TIẾT 14 NGÀY
                    </span>
                    <span className="text-xs text-slate-300 font-medium">• 30 - 45 phút / ngày</span>
                    <span className="text-xs text-amber-400 font-bold">• 4 bước kiểm tra chắc chắn</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white leading-snug break-words">
                    {KANA_CURRICULUM_METADATA.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed break-words">
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
                  const isDone = isDayDone(plan);
                  const isHiragana = plan.phase === 'hiragana';
                  const isBossDay = plan.day === 8 || plan.day === 14;

                  return (
                    <button
                      key={plan.day}
                      onClick={() => { sounds.playClick(); setSelectedCurriculumDay(plan.day); }}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between h-24 relative ${
                        isSelected
                          ? 'bg-gradient-to-b from-cyan-500/25 to-blue-600/35 border-2 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.35)] scale-102 z-10'
                          : isDone
                          ? 'bg-emerald-950/40 border-2 border-emerald-500/80 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.25)] hover:bg-emerald-900/40'
                          : 'bg-[#0b1222]/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                      }`}
                    >
                      {/* Floating Green Tick Checkmark if Completed */}
                      {isDone && (
                        <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-emerald-500 text-slate-950 font-black flex items-center justify-center text-[10px] shadow-md border-2 border-[#080d1a]">
                          ✓
                        </span>
                      )}

                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                          isDone
                            ? 'bg-emerald-500 text-slate-950 font-black'
                            : isBossDay
                              ? 'bg-amber-500/30 text-amber-300 border border-amber-500/40'
                              : isHiragana
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : 'bg-rose-500/20 text-rose-300'
                        }`}>
                          {isDone ? `✓ N.${plan.day}` : `N.${plan.day}`} {isBossDay ? '👑' : ''}
                        </span>
                        <span className={`text-[10px] font-mono font-bold ${isDone ? 'text-emerald-400' : 'text-slate-400'}`}>
                          {isDone ? '✓ Xong' : (plan.newCharsCount ? `+${plan.newCharsCount}` : 'Ôn')}
                        </span>
                      </div>

                      <div className="font-bold text-xs text-white line-clamp-1 mt-1">
                        {plan.targetChars.slice(0, 5).join(' ')}
                      </div>

                      <div className="flex items-center justify-between text-[9px]">
                        <span className={isDone ? 'text-emerald-300 font-semibold' : 'text-slate-400'}>
                          {isHiragana ? 'Hiragana' : 'Katakana'}
                        </span>
                        {isDone && (
                          <span className="text-emerald-400 font-bold">5/5 chữ ✓</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* DETAILED DAY STUDY CARD: 4 KEY AREAS REQUESTED BY USER */}
            <div className="bg-[#0b1222]/90 border-2 border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6">
              
              {/* Day Header */}
              {(() => {
                const isCurrentDone = isDayDone(currentPlan);
                const mSet = masteredChars instanceof Set ? masteredChars : new Set(masteredChars || []);
                const currentPlanMasteredCount = currentPlan.targetChars.filter(c => mSet.has(c)).length;

                return (
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-800">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 text-xs font-black font-mono">
                          NGÀY {currentPlan.day} / 14
                        </span>
                        <span className="text-xs text-slate-400">
                          Phase: {currentPlan.phase === 'hiragana' ? '🌸 Bảng chữ mềm Hiragana' : '⚡ Bảng chữ cứng Katakana'}
                        </span>
                        {isCurrentDone && (
                          <span className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/60 text-xs font-black flex items-center gap-1.5 shadow-sm">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                            ✓ ĐÃ HOÀN THÀNH (5/5 chữ)
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg sm:text-xl font-black text-white mt-1.5 flex items-center gap-2">
                        <span>{currentPlan.title}</span>
                        {isCurrentDone && (
                          <span className="text-emerald-400 text-base">✓</span>
                        )}
                      </h3>
                      <p className="text-xs text-slate-300 mt-1">{currentPlan.subtitle}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                      <button
                        onClick={() => toggleCompleteDay(currentPlan.day)}
                        className={`py-2 px-3.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition cursor-pointer shadow-md active:scale-95 ${
                          isCurrentDone
                            ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30 border border-emerald-400/50'
                        }`}
                        title="Đánh dấu tiến độ ngày học này"
                      >
                        <span>{isCurrentDone ? 'Đánh dấu chưa học' : '✓ Đánh dấu đã thuộc 5 chữ (+100 XP)'}</span>
                      </button>

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
                );
              })()}

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
                    {currentPlan.characters.map((c, idx) => {
                      const mSet = masteredChars instanceof Set ? masteredChars : new Set(masteredChars || []);
                      const isCharMastered = mSet.has(c.char) || isDayDone(currentPlan);

                      return (
                        <div key={idx} className={`p-3.5 rounded-xl border flex flex-col justify-between gap-2 transition-all ${
                          isCharMastered
                            ? 'bg-[#0d1e26] border-emerald-500/50 shadow-sm'
                            : 'bg-[#0d1629] border-slate-800'
                        }`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <div className={`w-12 h-12 rounded-xl border flex items-center justify-center text-2xl font-black jp-font shadow-inner ${
                                isCharMastered
                                  ? 'bg-emerald-950/50 border-emerald-500/60 text-emerald-300'
                                  : 'bg-slate-900 border-slate-700 text-white'
                              }`}>
                                {c.char}
                              </div>
                              {isCharMastered && (
                                <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/25 border border-emerald-500/70 text-emerald-300 text-[10px] font-black leading-normal">
                                  ✓ Đã thuộc
                                </span>
                              )}
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
                      );
                    })}
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
