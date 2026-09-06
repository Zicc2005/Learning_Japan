import React from 'react';

export function Navigation({
  currentScreen,
  onNavigate,
  user,
  darkMode,
  onToggleDarkMode,
  onResetProgress
}) {
  const navItems = [
    { id: 'roadmap', label: 'Bản Đồ RPG N5', icon: 'explore' },
    { id: 'practice', label: 'Luyện Bút Thuận', icon: 'draw' },
    { id: 'kana', label: 'Bảng Chữ Cái 3D', icon: 'view_in_ar' },
    { id: 'kanji', label: 'Kho 103 Hán Tự', icon: 'translate' },
    { id: 'grammar', label: 'Ngữ Pháp N5', icon: 'menu_book' },
    { id: 'exam', label: 'Thi Thử N5', icon: 'assignment_turned_in' },
  ];

  return (
    <>
      {/* DESKTOP & TABLET SIDEBAR */}
      <aside
        id="desktop-sidebar"
        className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-[#1A1D20] z-40 hidden md:flex flex-col justify-between shadow-[0_1px_8px_rgba(0,0,0,0.06)] border-r border-[#eceef2] dark:border-[#2e3134] transition-all duration-300"
      >
        <div className="flex flex-col">
          {/* Logo & Brand Header */}
          <div
            className="h-16 px-6 flex items-center gap-3 cursor-pointer select-none"
            onClick={() => onNavigate('roadmap')}
          >
            <div className="w-10 h-10 rounded-xl bg-[#983224] flex items-center justify-center text-white font-headline text-lg font-bold shadow-sm">
              日
            </div>
            <div>
              <div className="font-headline text-base text-[#191c1f] dark:text-white font-bold tracking-tight">
                NihonLearn
              </div>
              <div className="text-[11px] text-[#B84A39] font-medium tracking-wide">
                JLPT N5 Sơ Cấp
              </div>
            </div>
          </div>

          {/* Quick Streak & XP Badge Box */}
          <div className="px-4 py-2">
            <div className="bg-[#f2f3f8] dark:bg-[#25282c] rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="material-symbols-outlined text-[#983224] text-[20px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  local_fire_department
                </span>
                <span className="text-xs font-bold text-[#191c1f] dark:text-white">
                  {user?.streakDays || 1} Ngày
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span
                  className="material-symbols-outlined text-[#005f5e] text-[20px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  bolt
                </span>
                <span className="text-xs font-bold text-[#191c1f] dark:text-white">
                  {(user?.totalXP || 0).toLocaleString()} XP
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Items List */}
          <nav className="flex flex-col gap-1 px-4 mt-2">
            {navItems.map((item) => {
              const isActive = currentScreen === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}`}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all text-left cursor-pointer ${
                    isActive
                      ? 'bg-[#B84A39] text-white font-semibold shadow-sm'
                      : 'text-[#57423e] dark:text-[#c7c6c6] hover:bg-[#eceef2] dark:hover:bg-[#2e3134] hover:text-[#191c1f] dark:hover:text-white font-medium'
                  }`}
                >
                  <span
                    className="material-symbols-outlined text-[20px]"
                    style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* Auth screen preview link */}
            <button
              id="nav-auth"
              onClick={() => onNavigate('auth')}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all text-left mt-2 border border-dashed border-[#dec0bb] dark:border-[#57423e] cursor-pointer ${
                currentScreen === 'auth'
                  ? 'bg-[#1A1D20] text-white font-semibold'
                  : 'text-[#8A716D] dark:text-[#dec0bb] hover:bg-[#ffdad4]/30'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">lock_reset</span>
              <span>Trang Khởi Đầu / Đăng Nhập</span>
            </button>
          </nav>
        </div>

        {/* Bottom Hardware Stylus & Level Status */}
        <div className="p-4 flex flex-col gap-2 border-t border-[#eceef2] dark:border-[#2e3134]">
          <div className="bg-[#f2f3f8] dark:bg-[#25282c] rounded-xl p-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#8A716D] text-[18px]">
                stylus
              </span>
              <span className="text-xs text-[#57423e] dark:text-[#c7c6c6] font-medium">
                Apple Pencil / Stylus
              </span>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-[#005f5e] animate-pulse" title="Stylus Đã Kết Nối" />
          </div>
          <div className="flex items-center justify-between px-1 text-xs">
            <span className="text-[#8C8C8C]">{user?.title || 'Học Viên Tinh Hoa'}</span>
            <span className="text-[#B84A39] font-bold">Lv. {user?.level || 1}</span>
          </div>
        </div>
      </aside>

      {/* FIXED TOP HEADER */}
      <header className="fixed top-0 right-0 left-0 md:left-64 h-16 bg-white/90 dark:bg-[#1A1D20]/90 backdrop-blur-md z-30 shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-[#eceef2] dark:border-[#2e3134] transition-all duration-300">
        <div className="h-16 w-full px-4 sm:px-6 flex items-center justify-between">
          {/* Breadcrumb & Screen Title */}
          <div className="flex items-center gap-2 text-sm">
            <div
              className="md:hidden w-8 h-8 rounded-lg bg-[#983224] flex items-center justify-center text-white font-headline text-sm font-bold mr-1 cursor-pointer"
              onClick={() => onNavigate('roadmap')}
            >
              日
            </div>
            <span
              className="text-[#983224] font-semibold cursor-pointer hover:underline"
              onClick={() => onNavigate('roadmap')}
            >
              NihonLearn
            </span>
            <span className="material-symbols-outlined text-[16px] text-[#8C8C8C]">
              chevron_right
            </span>
            <span className="text-[#191c1f] dark:text-white font-medium truncate max-w-[140px] sm:max-w-none">
              {currentScreen === 'roadmap' && 'Lộ Trình RPG N5'}
              {currentScreen === 'practice' && 'Phòng Luyện Bút Thuận'}
              {currentScreen === 'kana' && 'Bảng Chữ Cái 3D'}
              {currentScreen === 'kanji' && 'Kho 103 Hán Tự N5'}
              {currentScreen === 'grammar' && 'Sổ Ngữ Pháp N5'}
              {currentScreen === 'exam' && 'Phòng Thi Thử N5'}
              {currentScreen === 'auth' && 'Khởi Đầu Tịnh Tâm'}
            </span>
          </div>

          {/* Action Tools: Elite Badge, Theme Toggle, Reset, Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Elite Badge */}
            <div className="hidden sm:flex items-center gap-1.5 bg-[#f2f3f8] dark:bg-[#25282c] px-3 py-1 rounded-full text-xs font-semibold text-[#191c1f] dark:text-white">
              <span className="material-symbols-outlined text-[#983224] text-[18px]">
                military_tech
              </span>
              <span>{user?.title || 'Học Viên Tinh Hoa'}</span>
            </div>

            {/* Dark Mode Toggle */}
            <button
              id="btn-toggle-theme"
              onClick={onToggleDarkMode}
              className="w-9 h-9 rounded-xl bg-[#f2f3f8] dark:bg-[#25282c] flex items-center justify-center text-[#57423e] dark:text-[#c7c6c6] hover:text-[#983224] transition-colors cursor-pointer"
              title="Chuyển giao diện Sáng / Tối"
            >
              <span className="material-symbols-outlined text-[20px]">
                {darkMode ? 'light_mode' : 'dark_mode'}
              </span>
            </button>

            {/* Reset Progress Button */}
            {onResetProgress && (
              <button
                onClick={() => {
                  if (window.confirm('Đặt lại toàn bộ tiến độ về Chặng 1 (0 XP)?')) {
                    onResetProgress();
                  }
                }}
                className="w-9 h-9 rounded-xl bg-[#f2f3f8] dark:bg-[#25282c] flex items-center justify-center text-[#57423e] dark:text-[#c7c6c6] hover:text-[#983224] transition-colors cursor-pointer"
                title="Đặt lại tiến độ về 0 XP"
              >
                <span className="material-symbols-outlined text-[18px]">restart_alt</span>
              </button>
            )}

            {/* User Profile Avatar */}
            <div
              onClick={() => onNavigate('auth')}
              className="w-8 h-8 rounded-full bg-[#983224] flex items-center justify-center text-white cursor-pointer shadow-sm ring-2 ring-white dark:ring-[#2e3134]"
              title="Tài khoản học viên"
            >
              <span className="material-symbols-outlined text-[18px]">person</span>
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE BOTTOM NAVIGATION BAR (Naturally visible on screens < 768px) */}
      <nav
        id="mobile-bottom-nav"
        className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-[#1A1D20]/95 backdrop-blur-xl border-t border-[#eceef2] dark:border-[#2e3134] shadow-lg transition-all md:hidden"
      >
        <div className="h-16 max-w-lg mx-auto grid grid-cols-6 items-center px-1">
          <button
            onClick={() => onNavigate('roadmap')}
            className={`flex flex-col items-center justify-center gap-0.5 py-1 transition-colors cursor-pointer ${
              currentScreen === 'roadmap'
                ? 'text-[#983224] font-bold'
                : 'text-[#8C8C8C] hover:text-[#191c1f] dark:hover:text-white'
            }`}
          >
            <span
              className="material-symbols-outlined text-[20px]"
              style={{ fontVariationSettings: currentScreen === 'roadmap' ? "'FILL' 1" : "'FILL' 0" }}
            >
              explore
            </span>
            <span className="text-[10px] font-medium tracking-tight">Lộ Trình</span>
          </button>

          <button
            onClick={() => onNavigate('practice')}
            className={`flex flex-col items-center justify-center gap-0.5 py-1 transition-colors cursor-pointer relative ${
              currentScreen === 'practice'
                ? 'text-[#983224] font-bold'
                : 'text-[#8C8C8C] hover:text-[#191c1f] dark:hover:text-white'
            }`}
          >
            <span
              className="material-symbols-outlined text-[20px]"
              style={{ fontVariationSettings: currentScreen === 'practice' ? "'FILL' 1" : "'FILL' 0" }}
            >
              draw
            </span>
            <span className="text-[10px] font-medium tracking-tight">Luyện Viết</span>
          </button>

          <button
            onClick={() => onNavigate('kana')}
            className={`flex flex-col items-center justify-center gap-0.5 py-1 transition-colors cursor-pointer relative ${
              currentScreen === 'kana'
                ? 'text-[#983224] font-bold'
                : 'text-[#8C8C8C] hover:text-[#191c1f] dark:hover:text-white'
            }`}
          >
            <span
              className="material-symbols-outlined text-[20px]"
              style={{ fontVariationSettings: currentScreen === 'kana' ? "'FILL' 1" : "'FILL' 0" }}
            >
              view_in_ar
            </span>
            <span className="text-[10px] font-medium tracking-tight">Thẻ 3D</span>
          </button>

          <button
            onClick={() => onNavigate('kanji')}
            className={`flex flex-col items-center justify-center gap-0.5 py-1 transition-colors cursor-pointer ${
              currentScreen === 'kanji'
                ? 'text-[#983224] font-bold'
                : 'text-[#8C8C8C] hover:text-[#191c1f] dark:hover:text-white'
            }`}
          >
            <span
              className="material-symbols-outlined text-[20px]"
              style={{ fontVariationSettings: currentScreen === 'kanji' ? "'FILL' 1" : "'FILL' 0" }}
            >
              translate
            </span>
            <span className="text-[10px] font-medium tracking-tight">Hán Tự</span>
          </button>

          <button
            onClick={() => onNavigate('grammar')}
            className={`flex flex-col items-center justify-center gap-0.5 py-1 transition-colors cursor-pointer ${
              currentScreen === 'grammar'
                ? 'text-[#983224] font-bold'
                : 'text-[#8C8C8C] hover:text-[#191c1f] dark:hover:text-white'
            }`}
          >
            <span
              className="material-symbols-outlined text-[20px]"
              style={{ fontVariationSettings: currentScreen === 'grammar' ? "'FILL' 1" : "'FILL' 0" }}
            >
              menu_book
            </span>
            <span className="text-[10px] font-medium tracking-tight">Ngữ Pháp</span>
          </button>

          <button
            onClick={() => onNavigate('exam')}
            className={`flex flex-col items-center justify-center gap-0.5 py-1 transition-colors cursor-pointer ${
              currentScreen === 'exam'
                ? 'text-[#983224] font-bold'
                : 'text-[#8C8C8C] hover:text-[#191c1f] dark:hover:text-white'
            }`}
          >
            <span
              className="material-symbols-outlined text-[20px]"
              style={{ fontVariationSettings: currentScreen === 'exam' ? "'FILL' 1" : "'FILL' 0" }}
            >
              assignment_turned_in
            </span>
            <span className="text-[10px] font-medium tracking-tight">Thi Thử</span>
          </button>
        </div>
      </nav>
    </>
  );
}
