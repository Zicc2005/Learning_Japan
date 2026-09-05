import React from 'react';
import { sounds } from '../../utils/soundEffects';

export function NavigationBar({ activePage, setActivePage }) {
  const tabs = [
    { id: 'roadmap', label: 'Bản Đồ N5', icon: 'explore', iconColor: 'text-rose-400', badge: 'S-Curve', isBadge: true },
    { id: 'practice', label: 'Bút Thuận', icon: 'draw', iconColor: 'text-rose-400', badge: 'HOT', isBadge: true },
    { id: 'kana', label: 'Bảng Chữ Cái', icon: 'translate', iconColor: 'text-cyan-400', badge: '92', isCount: true },
    { id: 'kanji', label: '103 Chữ Hán', icon: 'menu_book', iconColor: 'text-indigo-400', badge: '103', isCount: true },
    { id: 'grammar', label: 'Ngữ Pháp N5', icon: 'bolt', iconColor: 'text-teal-400', badge: '40+', isCount: true },
    { id: 'exam', label: 'Thi Thử JLPT', icon: 'assignment_turned_in', iconColor: 'text-amber-400', badge: 'ĐỀ CHUẨN', isBadge: true },
    { id: 'sensei', label: 'AI Sensei', icon: 'smart_toy', iconColor: 'text-emerald-400', badge: '24/7', isPing: true }
  ];

  const handleTabClick = (tabId) => {
    sounds.playClick();
    setActivePage(tabId);
  };

  return (
    <nav className="w-full bg-[#090e1d]/95 border-b border-slate-800/40">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 pb-2.5 pt-1.5 flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth" id="navTabsContainer">
        {tabs.map((tab) => {
          const isActive = activePage === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`nav-tab-btn flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer select-none ${
                isActive
                  ? 'bg-gradient-to-r from-rose-600 to-red-500 text-white shadow-md shadow-rose-600/30 border border-rose-400/40'
                  : 'text-slate-300 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 font-semibold'
              }`}
            >
              {tab.isPing && !isActive && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping mr-0.5"></span>
              )}
              <span className={`material-symbols-outlined text-sm ${isActive ? 'text-white' : tab.iconColor}`}>
                {tab.icon}
              </span>
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`ml-0.5 ${
                  isActive
                    ? 'px-1 py-0.2 bg-white/20 text-[8px] uppercase tracking-wider rounded text-white font-extrabold'
                    : tab.isCount
                      ? 'text-[9px] text-slate-400 font-bold'
                      : tab.id === 'practice'
                        ? 'px-1 py-0.2 bg-rose-500/20 text-rose-400 border border-rose-500/40 text-[8px] uppercase font-bold rounded'
                        : tab.id === 'exam'
                          ? 'px-1 py-0.2 bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[8px] uppercase font-bold rounded'
                          : tab.id === 'sensei'
                            ? 'px-1 py-0.2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[8px] uppercase font-bold rounded'
                            : 'px-1 py-0.2 bg-slate-700 text-[8px] font-bold rounded text-slate-300'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
