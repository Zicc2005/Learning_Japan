import React, { useState, useEffect } from "react";
import { playChime } from "../utils/audio";

export const RoadmapScreen = ({
  user,
  onNavigate,
  onAddXP
}) => {
  const [viewMode, setViewMode] = useState("scurve"); // 'scurve' | 'syllabus'
  const [tipIndex, setTipIndex] = useState(0);
  const [toastText, setToastText] = useState("");
  const [showToast, setShowToast] = useState(false);

  const kitsuneTips = [
    "Viết nét từ trái sang phải, trên xuống dưới. Hít thở sâu và nhẩm theo nhịp thơ cổ Haiku!",
    "Katakana thường dùng cho từ vay mượn. Hãy liên tưởng chữ 'KA' (カ) với lưỡi dao sắc bén!",
    "Mỗi ngày học 15 phút đều đặn sẽ giúp não bộ ghi nhớ sâu hơn học dồn 3 tiếng cuối tuần.",
    "Luyện phát âm to rõ ràng trước gương để cơ miệng làm quen với khẩu hình tiếng Nhật.",
    "Bộ thủ Hán tự là chìa khóa: Nhìn thấy bộ 'Thủy' (氵) là biết chữ có liên quan đến nước!"
  ];

  // Daily Quests State
  const [quests, setQuests] = useState([
    {
      id: "q1",
      title: "Ôn tập 10 từ Hiragana hàng Ma",
      xp: 20,
      completed: true
    },
    {
      id: "q2",
      title: "Luyện viết 5 chữ Katakana mới",
      xp: 30,
      completed: true
    },
    {
      id: "q3",
      title: "Hoàn thành 1 bài kiểm tra tốc độ",
      xp: 50,
      completed: false
    }
  ]);

  const completedQuestsCount = quests.filter((q) => q.completed).length;

  const triggerToast = (msg) => {
    setToastText(msg);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3500);
  };

  const changeFoxTip = () => {
    playChime("wood");
    setTipIndex((prev) => (prev + 1) % kitsuneTips.length);
  };

  const handleToggleQuest = (id) => {
    setQuests((prev) =>
      prev.map((q) => {
        if (q.id === id) {
          const nextVal = !q.completed;
          if (nextVal) {
            playChime("success");
            onAddXP?.(q.xp);
            triggerToast(`🎉 Hoàn thành nhiệm vụ: +${q.xp} XP!`);
          } else {
            playChime("wood");
          }
          return { ...q, completed: nextVal };
        }
        return q;
      })
    );
  };

  return (
    <div className="w-full min-h-screen bg-surface dark:bg-[#131518] text-on-surface dark:text-gray-100 flex flex-col antialiased">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 pb-28 md:pb-16 flex flex-col gap-5 w-full">
        {/* 1. Top JLPT N5 Milestone Banner & View Switcher */}
        <section className="bg-surface-container-lowest dark:bg-[#1e2126] p-4 sm:p-5 rounded-2xl shadow-sm border border-surface-container-high/60 dark:border-white/5 flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-fixed dark:bg-primary/20 flex items-center justify-center text-primary font-bold text-base">
                N5
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-headline text-base sm:text-lg font-bold text-on-surface dark:text-white">
                    Hành Trình Chinh Phục JLPT N5
                  </h1>
                  <span className="px-2 py-0.5 rounded-full bg-primary-fixed dark:bg-primary/20 text-primary text-[11px] font-bold">
                    Chặng 1
                  </span>
                </div>
                <p className="text-xs text-secondary dark:text-gray-400 mt-0.5">
                  Tân Thủ Sơ Cấp • 450 / 800 XP • 38% Hoàn thành
                </p>
              </div>
            </div>

            {/* View Switcher Tabs */}
            <div className="flex items-center p-1 bg-surface-container dark:bg-white/5 rounded-xl self-start sm:self-auto">
              <button
                onClick={() => {
                  setViewMode("scurve");
                  playChime("wood");
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  viewMode === "scurve"
                    ? "bg-surface-container-lowest dark:bg-[#25282c] text-on-surface dark:text-white shadow-sm"
                    : "text-on-surface-variant dark:text-gray-400 hover:text-on-surface"
                }`}
              >
                <span className="material-symbols-outlined text-[17px] text-primary">alt_route</span>
                <span>Bản Đồ Hành Trình</span>
              </button>
              <button
                onClick={() => {
                  setViewMode("syllabus");
                  playChime("wood");
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  viewMode === "syllabus"
                    ? "bg-surface-container-lowest dark:bg-[#25282c] text-on-surface dark:text-white shadow-sm"
                    : "text-on-surface-variant dark:text-gray-400 hover:text-on-surface"
                }`}
              >
                <span className="material-symbols-outlined text-[17px]">calendar_month</span>
                <span>Giáo Trình 14 Ngày</span>
              </button>
            </div>
          </div>

          {/* Overall Progress Track */}
          <div className="w-full bg-surface-container dark:bg-white/10 h-2 rounded-full overflow-hidden mt-1">
            <div
              className="bg-gradient-to-r from-vermilion to-primary h-full rounded-full transition-all duration-500"
              style={{ width: "38%" }}
            />
          </div>
        </section>

        {/* 2. Main Responsive Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT / MAIN COLUMN: Adventure Journey Map or Syllabus (cols 7 on lg, 8 on xl) */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-5">
            {viewMode === "scurve" ? (
              <div className="bg-surface-container-lowest dark:bg-[#1e2126] rounded-2xl p-4 sm:p-6 shadow-sm border border-surface-container-high/60 dark:border-white/5">
                <div className="flex items-center justify-between pb-3 border-b border-surface-container-high/40 dark:border-white/5 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[22px]">explore</span>
                    <h2 className="font-headline text-base font-bold text-on-surface dark:text-white">
                      Bản Đồ Tiến Trình Chữ Nhật
                    </h2>
                  </div>
                  <span className="text-xs text-secondary dark:text-gray-400">
                    4 Chặng Chính &bull; 1 Phụ Bản
                  </span>
                </div>

                {/* Adventure Path Centered Container (Constrained max-width prevents wide stretching) */}
                <div className="max-w-xl mx-auto w-full relative py-2">
                  {/* Subtle Stepped Vertical Connecting Path */}
                  <div className="absolute top-10 bottom-10 left-8 md:left-9 w-1 border-l-2 border-dashed border-primary/30 dark:border-white/15 pointer-events-none" />

                  {/* Milestone Stages Stack */}
                  <div className="flex flex-col gap-6 relative">
                    {/* Stage 1: Hiragana (Completed) */}
                    <div className="flex items-start gap-4 group">
                      <div className="relative z-10 w-16 h-16 rounded-2xl bg-tertiary-container dark:bg-emerald-950/60 flex items-center justify-center text-on-tertiary dark:text-emerald-300 shadow-sm shrink-0 border-2 border-tertiary dark:border-emerald-600">
                        <span className="material-symbols-outlined text-[30px]">check_circle</span>
                        <span className="absolute -top-2 -right-2 w-6 h-6 bg-tertiary text-on-tertiary rounded-full flex items-center justify-center text-xs font-bold shadow-xs">
                          1
                        </span>
                      </div>
                      <div className="flex-1 bg-surface-container-low dark:bg-white/5 p-4 rounded-2xl border border-surface-container-high/40 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-tertiary-fixed text-on-tertiary-fixed text-[10px] rounded font-semibold">
                              ẢI 1 • HOÀN TẤT
                            </span>
                            <span className="text-tertiary text-xs font-semibold">+100 XP</span>
                          </div>
                          <h3 className="font-headline text-sm sm:text-base font-bold text-on-surface dark:text-white mt-1">
                            Khai Môn Hiragana
                          </h3>
                          <p className="text-xs text-secondary dark:text-gray-400 mt-0.5">
                            46 âm cơ bản &bull; Biến âm Dakuon &bull; Âm ghép Yoon
                          </p>
                        </div>
                        <button
                          onClick={() => onNavigate?.("kana")}
                          className="px-3.5 py-2 rounded-xl bg-surface-container dark:bg-white/10 text-on-surface dark:text-white text-xs font-semibold hover:bg-surface-container-high transition-colors flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
                        >
                          <span className="material-symbols-outlined text-[16px]">replay</span>
                          <span>Xem lại</span>
                        </button>
                      </div>
                    </div>

                    {/* Stage 1.5: Sub-quest (214 Radicals) */}
                    <div className="flex items-start gap-4 pl-3 sm:pl-6 group">
                      <div
                        className="relative z-10 w-14 h-14 rounded-2xl bg-primary-container text-on-primary flex items-center justify-center shrink-0 shadow-md ring-4 ring-primary/20 animate-pulse"
                        style={{ animationDuration: "3.5s" }}
                      >
                        <span className="font-headline text-xl font-bold">部</span>
                      </div>
                      <div className="flex-1 bg-primary-fixed/30 dark:bg-primary/15 p-4 rounded-2xl border border-primary/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-primary text-on-primary text-[10px] rounded font-semibold">
                              PHỤ BẢN ĐẶC BIỆT
                            </span>
                            <span className="text-primary font-bold text-xs">+120 XP</span>
                          </div>
                          <h3 className="font-headline text-sm sm:text-base font-bold text-on-surface dark:text-white mt-1">
                            214 Bộ Thủ Hán Tự
                          </h3>
                          <p className="text-xs text-on-surface-variant dark:text-gray-300 mt-0.5">
                            Chiếc chìa khóa giải mã Kanji &bull; Quy tắc phân mảnh
                          </p>
                        </div>
                        <button
                          onClick={() => onNavigate?.("practice")}
                          className="px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-semibold hover:bg-vermilion transition-colors shrink-0 shadow-sm self-start sm:self-auto flex items-center gap-1"
                        >
                          <span>Khám phá</span>
                          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                        </button>
                      </div>
                    </div>

                    {/* Stage 2: Katakana (Current Active) */}
                    <div className="flex items-start gap-4 group">
                      <div className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br from-vermilion to-primary text-on-primary flex items-center justify-center shadow-lg shrink-0 ring-4 ring-primary/30">
                        <span className="material-symbols-outlined text-[32px] animate-bounce">
                          edit_note
                        </span>
                        <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-surface-container-lowest dark:bg-[#1e2126] text-primary text-[10px] rounded-full font-bold shadow-sm border border-primary/40">
                          3/6
                        </span>
                      </div>
                      <div className="flex-1 bg-surface-container-lowest dark:bg-[#25282c] p-4 sm:p-5 rounded-2xl shadow-md border-2 border-primary/40 dark:border-primary/50 flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-primary-fixed dark:bg-primary/30 text-on-primary-fixed-variant dark:text-primary-fixed text-[10px] rounded font-semibold">
                              ẢI 2 &bull; ĐANG HỌC
                            </span>
                            <span className="text-xs text-primary font-bold">Ngày 3/6</span>
                          </div>
                          <span className="text-xs font-semibold text-secondary dark:text-gray-400">
                            +180 XP khi xong
                          </span>
                        </div>
                        <div>
                          <h3 className="font-headline text-base font-bold text-on-surface dark:text-white">
                            Nhập Thế Katakana
                          </h3>
                          <p className="text-xs text-on-surface-variant dark:text-gray-300 mt-0.5">
                            Hàng âm Ma, Ya, Ra, Wa &bull; Từ mượn ngoại lai Gairaigo &bull; Âm ngắt Sokuon
                          </p>
                        </div>
                        <div className="flex items-center gap-2.5 pt-1">
                          <button
                            onClick={() => onNavigate?.("kana")}
                            className="flex-1 py-2.5 px-4 rounded-xl bg-primary text-on-primary text-xs font-bold text-center hover:bg-vermilion transition-all shadow-sm flex items-center justify-center gap-1.5"
                          >
                            <span className="material-symbols-outlined text-[17px]">draw</span>
                            <span>Luyện tập tiếp ngay</span>
                          </button>
                          <button
                            onClick={() => onNavigate?.("mock-test")}
                            className="h-10 px-3.5 rounded-xl bg-surface-container dark:bg-white/10 text-on-surface dark:text-white hover:bg-surface-container-high transition-colors flex items-center justify-center gap-1 text-xs font-semibold"
                            title="Làm bài kiểm tra tiến độ"
                          >
                            <span className="material-symbols-outlined text-[18px]">quiz</span>
                            <span className="hidden sm:inline">Thử Thách</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Stage 3: Kanji N5 103 Chữ (Locked) */}
                    <div className="flex items-start gap-4 opacity-75 hover:opacity-100 transition-opacity">
                      <div className="relative z-10 w-16 h-16 rounded-2xl bg-surface-container-high dark:bg-white/10 text-on-surface-variant dark:text-gray-400 flex items-center justify-center shrink-0 border border-surface-container-highest">
                        <span className="material-symbols-outlined text-[28px]">lock</span>
                      </div>
                      <div
                        onClick={() =>
                          triggerToast("Cần tích lũy đủ 800 XP để khai mở Đích Đến N5! (Hiện tại: 450 XP)")
                        }
                        className="flex-1 cursor-pointer bg-surface-container dark:bg-white/5 p-4 rounded-2xl border border-surface-container-high/40 dark:border-white/5 flex items-center justify-between gap-3 hover:border-primary/40 transition-colors"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-surface-container-highest dark:bg-white/10 text-on-surface-variant dark:text-gray-400 text-[10px] rounded font-semibold">
                              ĐÍCH ĐẾN 1 &bull; KHÓA
                            </span>
                            <span className="text-error text-xs font-semibold">Cần 800 XP</span>
                          </div>
                          <h3 className="font-headline text-sm sm:text-base font-bold text-on-surface dark:text-white mt-1">
                            103 Chữ Hán Cốt Lõi N5
                          </h3>
                          <p className="text-xs text-secondary dark:text-gray-400 mt-0.5">
                            Vượt ải Katakana để giải phong ấn kho chữ Hán
                          </p>
                        </div>
                        <span className="material-symbols-outlined text-secondary text-[22px]">
                          chevron_right
                        </span>
                      </div>
                    </div>

                    {/* Stage 4: JLPT Mock Exam (Locked) */}
                    <div className="flex items-start gap-4 opacity-60 hover:opacity-90 transition-opacity">
                      <div className="relative z-10 w-16 h-16 rounded-2xl bg-surface-container-high dark:bg-white/10 text-on-surface-variant dark:text-gray-400 flex items-center justify-center shrink-0 border border-surface-container-highest">
                        <span className="material-symbols-outlined text-[28px]">military_tech</span>
                      </div>
                      <div
                        onClick={() =>
                          triggerToast("Cần hoàn tất 103 chữ Hán N5 để mở kỳ thi thử chuẩn hóa JLPT.")
                        }
                        className="flex-1 cursor-pointer bg-surface-container dark:bg-white/5 p-4 rounded-2xl border border-surface-container-high/40 dark:border-white/5 flex items-center justify-between gap-3 hover:border-primary/40 transition-colors"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-surface-container-highest dark:bg-white/10 text-on-surface-variant dark:text-gray-400 text-[10px] rounded font-semibold">
                              ĐÍCH ĐẾN 2 &bull; ĐẠI CHIẾN
                            </span>
                            <span className="text-secondary text-xs font-semibold">Cần 1,200 XP</span>
                          </div>
                          <h3 className="font-headline text-sm sm:text-base font-bold text-on-surface dark:text-white mt-1">
                            Phòng Thi Thử Chuẩn JLPT N5
                          </h3>
                          <p className="text-xs text-secondary dark:text-gray-400 mt-0.5">
                            3 phần thi tính giờ &bull; Chấm điểm tức thì &bull; Đề thi phong phú
                          </p>
                        </div>
                        <span className="material-symbols-outlined text-secondary text-[22px]">
                          chevron_right
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* 14-Day Syllabus Timeline */
              <div className="bg-surface-container-lowest dark:bg-[#1e2126] p-4 sm:p-6 rounded-2xl shadow-sm border border-surface-container-high/60 dark:border-white/5 flex flex-col gap-3">
                <div className="flex items-center justify-between pb-3 border-b border-surface-container-high/40 dark:border-white/5">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[22px]">calendar_month</span>
                    <h3 className="font-headline text-base font-bold text-on-surface dark:text-white">
                      Lộ Trình Cấp Tốc 14 Ngày
                    </h3>
                  </div>
                  <span className="text-xs text-secondary dark:text-gray-400">Tuần 1 &bull; Nhập Môn</span>
                </div>

                <div className="flex flex-col gap-2.5">
                  {[
                    { day: "D1", title: "Hiragana Căn Bản", desc: "Bảng chữ mềm 46 âm cơ bản", status: "done" },
                    { day: "D2", title: "Biến Âm & Bán Đục", desc: "Dakuon (Ga, Za, Da, Ba) & Handakuon (Pa)", status: "done" },
                    { day: "D3", title: "Âm Ghép & Trường Âm", desc: "Hiragana nâng cao & tốc ký", status: "done" },
                    { day: "D4", title: "Katakana Nhập Môn", desc: "Hàng A, Ka, Sa, Ta, Na căn bản", status: "current" },
                    { day: "D5", title: "Katakana Nâng Cao", desc: "Hàng Ha, Ma, Ya, Ra, Wa & Từ mượn", status: "locked" },
                    { day: "D6", title: "214 Bộ Thủ Hán Tự", desc: "Bộ thủ phổ biến trong Kanji N5", status: "locked" },
                    { day: "D7", title: "Kiểm Tra Chặng 1", desc: "Thi kiểm tra tổng hợp Kana & Bộ thủ", status: "locked" },
                    { day: "D8", title: "Kanji N5: Số Đếm & Thời Gian", desc: "Nhất, Nhị, Tam, Tứ, Ngũ, Nhật, Nguyệt...", status: "locked" },
                    { day: "D14", title: "Đại Kỳ Thi Thử N5", desc: "Làm đề thi thử tổng hợp 3 phần", status: "locked" }
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-xl flex items-center justify-between transition-all ${
                        item.status === "current"
                          ? "bg-primary-fixed/40 dark:bg-primary/20 border-2 border-primary/40"
                          : "bg-surface-container-low dark:bg-white/5 border border-surface-container-high/30 dark:border-white/5"
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                            item.status === "done"
                              ? "bg-tertiary text-on-tertiary"
                              : item.status === "current"
                              ? "bg-primary text-on-primary shadow-sm"
                              : "bg-surface-container-high dark:bg-white/10 text-on-surface-variant dark:text-gray-400"
                          }`}
                        >
                          {item.day}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p
                              className={`text-xs sm:text-sm font-bold ${
                                item.status === "current"
                                  ? "text-primary dark:text-primary-fixed"
                                  : "text-on-surface dark:text-white"
                              }`}
                            >
                              {item.title}
                            </p>
                            {item.status === "current" && (
                              <span className="px-2 py-0.5 bg-primary text-on-primary text-[10px] rounded-full font-bold">
                                Hôm nay
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-secondary dark:text-gray-400 mt-0.5">{item.desc}</p>
                        </div>
                      </div>

                      {item.status === "done" ? (
                        <span className="material-symbols-outlined text-tertiary text-[22px]">check_circle</span>
                      ) : item.status === "current" ? (
                        <button
                          onClick={() => onNavigate?.("kana")}
                          className="px-3 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-bold shadow-xs hover:bg-vermilion transition-colors"
                        >
                          Học Ngay
                        </button>
                      ) : (
                        <span className="material-symbols-outlined text-secondary dark:text-gray-500 text-[20px]">
                          lock
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT SIDEBAR COLUMN: Kitsune Mentor, Daily Quests & Quick Shortcuts (cols 5 on lg, 4 on xl) */}
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-5">
            {/* 1. Kitsune Companion Card */}
            <section className="relative bg-surface-container-lowest dark:bg-[#1e2126] rounded-2xl p-4 sm:p-5 shadow-sm overflow-hidden flex flex-col gap-3.5 border border-surface-container-high/60 dark:border-white/5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="relative w-14 h-14 rounded-2xl bg-primary-fixed dark:bg-primary/20 flex items-center justify-center shrink-0">
                    <img
                      className="w-12 h-12 rounded-xl object-cover shadow-sm"
                      alt="Kitsune Fox Mascot"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCtBF-Z3KWfVRJPitedcDELxeMJ2ApTcVI-4w8Ow6Ys0glse_g1aqhMmrWgmtoFNqpSIzDVpjkNy81GDJ-tVBOexdOR5Qt2b4qYjZ7q1p5aNCiaUttlpmr3XOzzE4i1utEC3YtBtahjhxAlutW6lZg7F2bTe9sV8arV7KqhU3hg6fI2JoIpiI5wXM9Ldy26sRx1LfBWVOssOowLiMN0tEcxxV7TTcAn-0Vgv766UKJK2Ox8x7dY4-mH"
                    />
                    <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full bg-primary text-on-primary text-[10px] leading-tight font-bold shadow-xs">
                      Lv.4
                    </span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h2 className="font-headline text-base font-bold text-on-surface dark:text-white truncate">
                        Kitsune Sensei
                      </h2>
                      <span className="text-secondary text-xs">霊狐</span>
                    </div>
                    <p className="text-xs text-secondary dark:text-gray-400">
                      Cố Vấn Tu Luyện N5
                    </p>
                  </div>
                </div>

                <button
                  onClick={changeFoxTip}
                  className="w-8 h-8 rounded-xl bg-surface-container dark:bg-white/10 flex items-center justify-center text-on-surface-variant dark:text-gray-300 hover:bg-surface-container-high transition-colors"
                  title="Đổi lời khuyên của Kitsune"
                >
                  <span className="material-symbols-outlined text-[18px]">refresh</span>
                </button>
              </div>

              {/* Fox XP Level Progress */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-secondary dark:text-gray-400">Tiến độ thăng hoa Lv.5</span>
                  <span className="font-bold text-primary">450 / 800 XP</span>
                </div>
                <div className="w-full bg-surface-container dark:bg-white/10 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-vermilion to-primary h-full rounded-full transition-all duration-500"
                    style={{ width: "56.25%" }}
                  />
                </div>
              </div>

              {/* Haiku Wisdom Advice Capsule */}
              <div className="bg-surface-container-low dark:bg-white/5 px-3.5 py-2.5 rounded-xl flex items-start gap-2.5 border border-surface-container-high/40 dark:border-white/5">
                <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5">
                  lightbulb
                </span>
                <p className="text-xs text-on-surface-variant dark:text-gray-300 italic leading-snug">
                  "{kitsuneTips[tipIndex]}"
                </p>
              </div>

              {/* Streak Badge */}
              <div className="flex items-center justify-between pt-1 border-t border-surface-container-high/40 dark:border-white/5 text-xs">
                <div className="flex items-center gap-1.5 text-primary font-bold">
                  <span className="material-symbols-outlined text-[18px]">local_fire_department</span>
                  <span>Chuỗi 5 Ngày Học Liên Tục</span>
                </div>
                <span className="text-secondary dark:text-gray-400">Tuyệt vời!</span>
              </div>
            </section>

            {/* 2. Daily Quests Progress Box */}
            <section className="bg-surface-container-lowest dark:bg-[#1e2126] p-4 sm:p-5 rounded-2xl shadow-sm border border-surface-container-high/60 dark:border-white/5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">task_alt</span>
                  <h3 className="font-headline text-sm font-bold text-on-surface dark:text-white">
                    Nhiệm Vụ Hôm Nay
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-surface-container dark:bg-white/10 text-on-surface-variant dark:text-gray-300 text-xs font-semibold">
                  {completedQuestsCount} / {quests.length} Hoàn tất
                </span>
              </div>

              <div className="flex flex-col gap-2">
                {quests.map((q) => (
                  <div
                    key={q.id}
                    onClick={() => handleToggleQuest(q.id)}
                    className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all border ${
                      q.completed
                        ? "bg-surface-container-low dark:bg-white/5 border-transparent opacity-80"
                        : "bg-surface-container-lowest dark:bg-[#1e2126] border-surface-container-high/60 dark:border-white/5 hover:border-primary/40 hover:shadow-xs"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`material-symbols-outlined text-[20px] ${
                          q.completed ? "text-tertiary" : "text-slate-gray"
                        }`}
                      >
                        {q.completed ? "check_box" : "check_box_outline_blank"}
                      </span>
                      <span
                        className={`text-xs ${
                          q.completed
                            ? "line-through opacity-70 text-on-surface dark:text-gray-400"
                            : "font-medium text-on-surface dark:text-white"
                        }`}
                      >
                        {q.title}
                      </span>
                    </div>
                    <span
                      className={`text-xs font-bold shrink-0 ml-2 ${
                        q.completed ? "text-tertiary" : "text-primary"
                      }`}
                    >
                      +{q.xp} XP
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* 3. 2x2 Quick Action Shortcuts Grid */}
            <section className="grid grid-cols-2 gap-3">
              <div
                onClick={() => onNavigate?.("practice")}
                className="cursor-pointer bg-surface-container-lowest dark:bg-[#1e2126] p-3.5 rounded-2xl shadow-sm flex flex-col justify-between hover:border-primary/40 border border-surface-container-high/60 dark:border-white/5 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-primary-fixed dark:bg-primary/20 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[22px]">auto_stories</span>
                  </div>
                  <span className="text-xs font-bold text-primary">214</span>
                </div>
                <div className="mt-2.5">
                  <p className="font-headline text-xs font-bold text-on-surface dark:text-white">
                    Bộ Thủ Hán Tự
                  </p>
                  <p className="text-[11px] text-secondary dark:text-gray-400">Tra cứu &amp; Ý nghĩa</p>
                </div>
              </div>

              <div
                onClick={() => onNavigate?.("kana")}
                className="cursor-pointer bg-surface-container-lowest dark:bg-[#1e2126] p-3.5 rounded-2xl shadow-sm flex flex-col justify-between hover:border-primary/40 border border-surface-container-high/60 dark:border-white/5 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-tertiary-fixed dark:bg-tertiary/20 flex items-center justify-center text-tertiary">
                    <span className="material-symbols-outlined text-[22px]">headphones</span>
                  </div>
                  <span className="text-xs font-bold text-tertiary">Audio</span>
                </div>
                <div className="mt-2.5">
                  <p className="font-headline text-xs font-bold text-on-surface dark:text-white">
                    Nghe Bản Xứ
                  </p>
                  <p className="text-[11px] text-secondary dark:text-gray-400">Giọng chuẩn Tokyo</p>
                </div>
              </div>

              <div
                onClick={() => onNavigate?.("exam")}
                className="cursor-pointer bg-surface-container-lowest dark:bg-[#1e2126] p-3.5 rounded-2xl shadow-sm flex flex-col justify-between hover:border-primary/40 border border-surface-container-high/60 dark:border-white/5 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-surface-container-high dark:bg-white/10 flex items-center justify-center text-on-surface-variant dark:text-gray-300">
                    <span className="material-symbols-outlined text-[22px]">bolt</span>
                  </div>
                  <span className="text-xs font-bold text-on-surface-variant dark:text-gray-300">
                    PvP
                  </span>
                </div>
                <div className="mt-2.5">
                  <p className="font-headline text-xs font-bold text-on-surface dark:text-white">
                    Đấu Chữ Nhanh
                  </p>
                  <p className="text-[11px] text-secondary dark:text-gray-400">Đua top thử thách</p>
                </div>
              </div>

              <div
                onClick={() => onNavigate?.("grammar")}
                className="cursor-pointer bg-surface-container-lowest dark:bg-[#1e2126] p-3.5 rounded-2xl shadow-sm flex flex-col justify-between hover:border-primary/40 border border-surface-container-high/60 dark:border-white/5 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-secondary-container dark:bg-white/10 flex items-center justify-center text-on-secondary-container dark:text-gray-300">
                    <span className="material-symbols-outlined text-[22px]">bookmark</span>
                  </div>
                  <span className="text-xs font-bold text-secondary">N5</span>
                </div>
                <div className="mt-2.5">
                  <p className="font-headline text-xs font-bold text-on-surface dark:text-white">
                    Sổ Ngữ Pháp
                  </p>
                  <p className="text-[11px] text-secondary dark:text-gray-400">30 mẫu câu cốt lõi</p>
                </div>
              </div>
            </section>

            {/* 4. Editorial Zen Quote at Bottom of Sidebar */}
            <div className="bg-surface-container-low dark:bg-white/5 p-3.5 rounded-2xl border border-surface-container-high/40 dark:border-white/5 text-center">
              <p className="text-xs text-primary font-bold tracking-wider font-jp">千里の行も足下に始まる</p>
              <p className="text-[11px] text-secondary dark:text-gray-400 italic mt-0.5">
                "Hành trình vạn dặm khởi đầu từ một bước chân."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Toast Notification */}
      <div
        className={`fixed bottom-24 left-4 right-4 max-w-md mx-auto z-50 bg-charcoal text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center justify-between transition-all duration-300 border border-white/10 ${
          showToast
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary-fixed text-[20px]">info</span>
          <span className="text-xs font-medium">{toastText}</span>
        </div>
        <button onClick={() => setShowToast(false)} className="text-slate-gray hover:text-white p-1">
          <span className="material-symbols-outlined text-[16px]">close</span>
        </button>
      </div>
    </div>
  );
};
