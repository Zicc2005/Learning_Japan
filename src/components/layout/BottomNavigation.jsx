import React from 'react';
import { sounds } from '../../utils/soundEffects';

export function BottomNavigation({ activePage, setActivePage }) {
  const items = [
    { id: 'roadmap', label: 'Bản Đồ', icon: 'explore' },
    { id: 'practice', label: 'Bút Thuận', icon: 'draw' },
    { id: 'kana', label: 'Kho Thẻ', icon: 'style' },
    { id: 'exam', label: 'Thi Thử', icon: 'assignment' },
    { id: 'sensei', label: 'AI Sensei', icon: 'smart_toy', isBadge: true }
  ];

  const handleClick = (id) => {
    sounds.playClick();
    setActivePage(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="md:hidden fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-[#090e1d]/95 backdrop-blur-xl border-t border-slate-800/80 px-4 py-2 z-50 transition-colors">
      <div className="grid grid-cols-5 items-center">
        {items.map((item) => {
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleClick(item.id)}
              className={`bottom-nav-item flex flex-col items-center justify-center py-1 transition-all cursor-pointer select-none ${
                isActive ? 'text-rose-500 font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative flex items-center justify-center">
                <span className="material-symbols-outlined text-xl">{item.icon}</span>
                {item.isBadge && !isActive && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                )}
              </div>
              <span className={`text-[10px] mt-0.5 ${isActive ? 'font-black' : 'font-medium'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </footer>
  );
}
