import React, { useState, useEffect } from 'react';
import { X, Flame, Gift, CheckCircle2, ArrowRight, Sparkles, Trophy, PenTool, BookOpen, Bot } from 'lucide-react';
import { sounds } from '../../utils/soundEffects';
import dailyQuestsData from '../../data/daily_quests.json';

export function DailyQuestsModal({ isOpen, onClose, onNavigate }) {
  // Load quest progress from localStorage or default
  const getTodayKey = () => new Date().toISOString().slice(0, 10);
  const storageKey = `nihonlearn_quests_${getTodayKey()}`;

  const [questState, setQuestState] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch (e) {}

    return {
      quest_write: 2,
      quest_quiz: 3,
      quest_ai: 1,
      quest_exam: 0,
      quest_kana: 6,
      claimed: {},
      streakClaimed: false,
      streakCount: 3
    };
  });

  const [claimedNotice, setClaimedNotice] = useState('');

  // Persist quest state
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(questState));
    } catch (e) {}
  }, [questState]);

  if (!isOpen) return null;

  const handleClaim = (questId, xp) => {
    sounds.playLevelUp();
    setQuestState((prev) => ({
      ...prev,
      claimed: { ...prev.claimed, [questId]: true }
    }));

    // Add XP to total user score in localStorage
    try {
      const curXp = parseInt(localStorage.getItem('nihonlearn_xp') || '270', 10);
      localStorage.setItem('nihonlearn_xp', (curXp + xp).toString());
    } catch (e) {}

    setClaimedNotice(`Chúc mừng bạn nhận được +${xp} XP!`);
    setTimeout(() => setClaimedNotice(''), 3000);
  };

  const handleClaimStreak = () => {
    sounds.playLevelUp();
    setQuestState((prev) => ({
      ...prev,
      streakClaimed: true
    }));

    try {
      const curXp = parseInt(localStorage.getItem('nihonlearn_xp') || '270', 10);
      localStorage.setItem('nihonlearn_xp', (curXp + 100).toString());
    } catch (e) {}

    setClaimedNotice('Tuyệt vời! Bạn đã mở khóa Rương Kho Báu +100 XP!');
    setTimeout(() => setClaimedNotice(''), 3500);
  };

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'pen': return <PenTool className="w-5 h-5 text-rose-500" />;
      case 'book': return <BookOpen className="w-5 h-5 text-blue-500" />;
      case 'bot': return <Bot className="w-5 h-5 text-purple-500" />;
      case 'trophy': return <Trophy className="w-5 h-5 text-amber-500" />;
      default: return <Sparkles className="w-5 h-5 text-emerald-500" />;
    }
  };

  const completedCount = dailyQuestsData.quests.filter(
    (q) => (questState[q.id] || 0) >= q.target
  ).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#111927] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header with Flame Banner */}
        <div className="bg-gradient-to-r from-amber-500 via-rose-500 to-rose-600 p-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
              <Flame className="w-7 h-7 text-amber-200 fill-amber-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black tracking-tight">{dailyQuestsData.title}</h3>
                <span className="bg-white/25 text-white text-[11px] font-black px-2 py-0.5 rounded-full">
                  Chuỗi {questState.streakCount} ngày 🔥
                </span>
              </div>
              <p className="text-xs text-rose-100 mt-0.5 font-medium">
                Hoàn thành: {completedCount}/{dailyQuestsData.quests.length} nhiệm vụ hôm nay
              </p>
            </div>
          </div>

          <button
            onClick={() => { sounds.playClick(); onClose(); }}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Claim Notice Alert */}
        {claimedNotice && (
          <div className="bg-emerald-500 text-white text-xs font-bold py-2 px-4 text-center flex items-center justify-center gap-1.5 shadow-inner animate-fade-in">
            <Sparkles className="w-4 h-4" />
            <span>{claimedNotice}</span>
          </div>
        )}

        {/* Modal Scroll Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          
          {/* Streak Treasure Chest Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/20 border-2 border-amber-300/80 dark:border-amber-500/40 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-500 flex items-center justify-center shadow-md shrink-0">
                <Gift className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-black text-amber-950 dark:text-amber-200">
                  {dailyQuestsData.streakReward.title}
                </div>
                <div className="text-[11px] text-amber-800 dark:text-amber-400/80 mt-0.5 font-medium">
                  {dailyQuestsData.streakReward.description}
                </div>
              </div>
            </div>

            <div className="shrink-0">
              {questState.streakClaimed ? (
                <span className="px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-xs font-bold flex items-center gap-1 border border-emerald-300 dark:border-emerald-500/30">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Đã nhận
                </span>
              ) : (
                <button
                  onClick={handleClaimStreak}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-black shadow-md shadow-amber-500/25 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Gift className="w-3.5 h-3.5" />
                  <span>+100 XP</span>
                </button>
              )}
            </div>
          </div>

          {/* Quests List */}
          <div className="space-y-3">
            {dailyQuestsData.quests.map((quest) => {
              const currentVal = Math.min(questState[quest.id] || 0, quest.target);
              const isDone = currentVal >= quest.target;
              const isClaimed = questState.claimed && questState.claimed[quest.id];
              const pct = Math.round((currentVal / quest.target) * 100);

              return (
                <div
                  key={quest.id}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#151f30] border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 shadow-2xs">
                      {getIcon(quest.icon)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                          {quest.title}
                        </span>
                        <span className="text-[11px] font-black text-slate-500 dark:text-slate-400 shrink-0">
                          {currentVal}/{quest.target}
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isDone ? 'bg-emerald-500' : 'bg-rose-500'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Action or Claim Button */}
                  <div className="shrink-0 ml-1">
                    {isClaimed ? (
                      <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Đã nhận
                      </span>
                    ) : isDone ? (
                      <button
                        onClick={() => handleClaim(quest.id, quest.xp)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-xs active:scale-95 transition-all cursor-pointer flex items-center gap-1"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>+{quest.xp} XP</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          sounds.playClick();
                          onClose();
                          if (onNavigate) onNavigate(quest.actionRoute);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <span>Làm</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-[#0d1422] border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
          Nhiệm vụ tự động làm mới vào 00:00 mỗi ngày. Chăm chỉ học tập nhé!
        </div>

      </div>
    </div>
  );
}
