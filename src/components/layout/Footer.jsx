import React from 'react';
import { Heart, Sparkles, BookCheck, ShieldCheck } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0b1120] py-6 px-4 text-center text-xs text-slate-500 dark:text-slate-400 transition-colors mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-medium text-slate-700 dark:text-slate-300">
            NihonLearn N5 • Hệ thống học & Luyện viết chữ Nhật Bản chuẩn sư phạm
          </span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-[11px]">
          <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
            <BookCheck className="w-3.5 h-3.5 text-rose-500" /> Chuẩn JLPT N5 & KanjiVG
          </span>
          <span>•</span>
          <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Offline First & Web Audio
          </span>
          <span>•</span>
          <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
            Thiết kế với <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> phong cách Nhật Bản
          </span>
        </div>
      </div>
    </footer>
  );
}
