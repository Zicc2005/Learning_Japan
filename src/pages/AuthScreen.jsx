import { useState, useEffect } from "react";
import { playChime } from "../utils/audio";
import { authDb } from "../services/authDatabase";

export const AuthScreen = ({ onLoginSuccess, onBackToApp }) => {
  const [activeTab, setActiveTab] = useState("login");
  const [email, setEmail] = useState("samurai.dev@nihonlearn.jp");
  const [password, setPassword] = useState("NihonMaster2025#");
  const [fullName, setFullName] = useState("Minh Tuấn");
  const [confirmPassword, setConfirmPassword] = useState("NihonMaster2025#");
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [petals, setPetals] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);
  const [activeModal, setActiveModal] = useState("none");
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);

  const [bgSrc, setBgSrc] = useState(
    "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070&auto=format&fit=crop"
  );

  // Generate 36 dynamic layered Sakura petals for fluttering effect with pre-staggered delays
  useEffect(() => {
    const generated = [];
    const count = 36;
    for (let i = 0; i < count; i++) {
      const left = (Math.random() * 98).toFixed(1) + "%";
      const fallDuration = (9 + Math.random() * 11).toFixed(1) + "s";
      const swayDuration = (2.8 + Math.random() * 2.8).toFixed(1) + "s";
      // Negative delays allow petals to already be mid-fall on initial render
      const fallDelay = (-Math.random() * 14).toFixed(1) + "s";
      const swayDelay = (-Math.random() * 3.5).toFixed(1) + "s";
      const driftX = Math.floor(50 + Math.random() * 180) + "px";
      const swayX = (Math.random() > 0.5 ? 1 : -1) * Math.floor(25 + Math.random() * 40) + "px";
      const rotEnd = Math.floor(280 + Math.random() * 540) + "deg";
      const flipEnd = Math.floor(360 + Math.random() * 720) + "deg";
      const size = Math.floor(12 + Math.random() * 14);
      const variant = i % 4;

      generated.push({
        id: i,
        left,
        fallDuration,
        swayDuration,
        fallDelay,
        swayDelay,
        driftX,
        swayX,
        rotEnd,
        flipEnd,
        size,
        variant
      });
    }
    setPetals(generated);
  }, []);

  const triggerToast = (text, type = "info") => {
    setToastMessage({ type, text });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      triggerToast("Vui lòng điền đầy đủ Email và Mật khẩu.", "error");
      return;
    }
    if (activeTab === "register") {
      if (!fullName) {
        triggerToast("Vui lòng nhập họ tên của bạn.", "error");
        return;
      }
      if (password !== confirmPassword) {
        triggerToast("Mật khẩu xác nhận không trùng khớp!", "error");
        return;
      }
      if (!agreeTerms) {
        triggerToast("Vui lòng đồng ý với Điều khoản môn phái.", "error");
        return;
      }
    }
    setIsLoading(true);
    playChime("bell");

    setTimeout(() => {
      setIsLoading(false);
      if (activeTab === "login") {
        const res = authDb.login(email, password);
        if (!res.success) {
          triggerToast(res.error, "error");
          return;
        }
        triggerToast("Đăng nhập thành công! Đang vào võ đường...", "success");
        setTimeout(() => {
          onLoginSuccess(res.user);
        }, 400);
      } else {
        const res = authDb.register({ email, password, name: fullName });
        if (!res.success) {
          triggerToast(res.error, "error");
          return;
        }
        triggerToast("Tạo tài khoản thành công! Bắt đầu tu luyện...", "success");
        setTimeout(() => {
          onLoginSuccess(res.user);
        }, 400);
      }
    }, 400);
  };

  const handleGoogleSignIn = () => {
    setIsLoading(true);
    playChime("success");
    triggerToast("Đang kết nối tài khoản Google...", "info");
    setTimeout(() => {
      setIsLoading(false);
      let existing = authDb.findUserByEmail("samurai.dev@nihonlearn.jp");
      if (!existing) {
        const res = authDb.register({
          email: "samurai.dev@nihonlearn.jp",
          password: "NihonMaster2025#",
          name: "Minh Tuấn"
        });
        existing = res.user;
      } else {
        authDb.saveSession(existing);
      }
      triggerToast("Đã liên kết Google ID thành công!", "success");
      setTimeout(() => {
        onLoginSuccess(existing);
      }, 300);
    }, 400);
  };

  const handleQuickDemo = () => {
    setIsLoading(true);
    playChime("success");
    triggerToast("Đang truy cập tài khoản Học Viên Mẫu...", "success");
    setTimeout(() => {
      setIsLoading(false);
      const res = authDb.login("samurai.dev@nihonlearn.jp", "NihonMaster2025#");
      const user = res.user || authDb.getCurrentUser();
      onLoginSuccess(user);
    }, 300);
  };

  const toggleTab = (tab) => {
    playChime("wood");
    setActiveTab(tab);
  };

  const handleSendReset = (e) => {
    e.preventDefault();
    if (!resetEmail) {
      triggerToast("Vui lòng nhập email tài khoản của bạn.", "error");
      return;
    }
    playChime("bell");
    setResetSent(true);
    triggerToast(`Đã gửi liên kết khôi phục mật khẩu đến: ${resetEmail}`, "success");
  };

  return (
    <div className="bg-[#0c0e12] text-neutral-200 font-sans antialiased min-h-screen relative overflow-x-hidden selection:bg-[#b84a39] selection:text-white">
      {/* 1. Full bleed scenic Torii background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <img
          alt="Torii Gate Scenic Background"
          src={bgSrc}
          onError={() =>
            setBgSrc("https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=2000&auto=format&fit=crop")
          }
          className="w-full h-full object-cover object-center scale-105 filter brightness-[0.70] contrast-[1.08] blur-[0.3px]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0c10]/95 via-[#0a0c10]/75 to-[#0a0c10]/90 lg:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0e12] via-[#0c0e12]/60 to-black/70" />
        <div className="absolute top-1/4 left-1/3 w-[550px] h-[550px] bg-[#b84a39]/12 rounded-full blur-[140px]" />
        <div className="mist-layer-1 absolute -inset-x-1/4 top-1/3 w-[150%] h-[380px] pointer-events-none" />
        <div className="mist-layer-2 absolute -inset-x-1/4 bottom-10 w-[150%] h-[420px] pointer-events-none" />
      </div>

      {/* 2. Floating & Falling Sakura Petals (Hiệu ứng cánh hoa anh đào rơi tự nhiên) */}
      <div aria-hidden="true" className="fixed inset-0 z-[6] pointer-events-none overflow-hidden">
        {petals.map((p) => (
          <div
            key={p.id}
            className="sakura-petal"
            style={{
              left: p.left,
              animationDuration: `${p.fallDuration}, ${p.swayDuration}`,
              animationDelay: `${p.fallDelay}, ${p.swayDelay}`,
              "--drift-x": p.driftX,
              "--sway-x": p.swayX,
              "--rot-end": p.rotEnd,
              "--flip-end": p.flipEnd
            }}
          >
            {p.variant === 0 && (
              <svg width={p.size} height={p.size} viewBox="0 0 30 30" fill="none">
                <path
                  d="M15 2 C23 2, 29 11, 26 21 C23 27, 16 28, 15 28 C14 28, 7 27, 4 21 C1 11, 7 2, 15 2 Z"
                  fill="rgba(255, 183, 197, 0.85)"
                />
                <path
                  d="M15 5 C19 10, 18 19, 15 25"
                  stroke="rgba(255, 140, 165, 0.45)"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </svg>
            )}
            {p.variant === 1 && (
              <svg width={p.size} height={p.size} viewBox="0 0 30 30" fill="none">
                <path
                  d="M15 2 C23 2, 29 11, 26 21 C23 27, 16 28, 15 28 C14 28, 7 27, 4 21 C1 11, 7 2, 15 2 Z"
                  fill="rgba(255, 220, 230, 0.78)"
                />
              </svg>
            )}
            {p.variant === 2 && (
              <svg width={p.size} height={p.size} viewBox="0 0 30 30" fill="none">
                <path
                  d="M15 2 C23 2, 29 11, 26 21 C23 27, 16 28, 15 28 C14 28, 7 27, 4 21 C1 11, 7 2, 15 2 Z"
                  fill="rgba(255, 160, 180, 0.80)"
                />
                <path
                  d="M15 5 C19 10, 18 19, 15 25"
                  stroke="rgba(255, 130, 155, 0.4)"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </svg>
            )}
            {p.variant === 3 && (
              <svg width={p.size * 1.1} height={p.size * 1.1} viewBox="0 0 34 34" fill="none">
                <path
                  d="M17 3 C25 3, 31 12, 28 23 C25 29, 18 30, 17 30 C16 30, 9 29, 6 23 C3 12, 9 3, 17 3 Z"
                  fill="rgba(255, 192, 203, 0.90)"
                />
                <circle cx="17" cy="18" r="3" fill="rgba(255, 140, 165, 0.35)" />
              </svg>
            )}
          </div>
        ))}
      </div>

      {/* Floating Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 animate-bounce">
          <div
            className={`px-4 py-3 rounded-xl border backdrop-blur-xl shadow-2xl flex items-center gap-3 text-xs font-medium ${
              toastMessage.type === "success"
                ? "bg-emerald-950/90 border-emerald-500/50 text-emerald-200"
                : toastMessage.type === "error"
                ? "bg-rose-950/90 border-rose-500/50 text-rose-200"
                : "bg-black/90 border-white/20 text-white"
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {toastMessage.type === "success" ? "check_circle" : toastMessage.type === "error" ? "error" : "info"}
            </span>
            <span>{toastMessage.text}</span>
            <button onClick={() => setToastMessage(null)} className="ml-2 text-white/50 hover:text-white cursor-pointer">
              ✕
            </button>
          </div>
        </div>
      )}

      {/* 3. Main Foreground Container - Full Bleed Naturally Responsive */}
      <div className="relative z-10 min-h-screen flex flex-col justify-between p-4 sm:p-6 lg:p-10 transition-all duration-300 mx-auto max-w-[1580px] w-full">
        {/* Top Editorial Header Navigation */}
        <header className="w-full flex items-center justify-between py-2 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            {/* Inkan (Hanko Stamp Seal) */}
            <div
              onClick={() => (onBackToApp ? onBackToApp() : onLoginSuccess())}
              className="w-10 h-10 rounded-md border-2 border-[#b84a39] bg-[#b84a39]/20 flex items-center justify-center text-[#d45846] font-kanji font-bold text-lg shadow-inner shadow-[#b84a39]/30 relative cursor-pointer hover:scale-105 transition-transform"
              title="Vào giao diện chính"
            >
              <span>日本</span>
              <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-[#b84a39] rounded-full" />
            </div>
            <div>
              <span className="font-editorial tracking-[0.25em] text-base sm:text-lg font-bold text-white uppercase block leading-none">
                NIHONLEARN
              </span>
              <span className="font-kanji text-[10px] tracking-[0.3em] text-white/50 block mt-1">
                日本語オンライン学習機構
              </span>
            </div>
          </div>

          {/* Center Minimal Sub-nav (Visible on Desktop / PC) */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-[12px] font-sans tracking-[0.15em] uppercase text-white/70">
            <button
              onClick={() => (onBackToApp ? onBackToApp() : onLoginSuccess())}
              className="text-white hover:text-[#e2c59f] transition-colors pb-1 border-b border-[#b84a39] cursor-pointer"
            >
              Lộ Trình RPG
            </button>
            <button
              onClick={() => (onBackToApp ? onBackToApp() : onLoginSuccess())}
              className="hover:text-[#e2c59f] transition-colors cursor-pointer"
            >
              Bút Thuận Kyuuji
            </button>
            <button
              onClick={() => (onBackToApp ? onBackToApp() : onLoginSuccess())}
              className="hover:text-[#e2c59f] transition-colors cursor-pointer"
            >
              103 Hán Tự N5
            </button>
            <button
              onClick={() => setActiveModal("support")}
              className="hover:text-[#e2c59f] transition-colors cursor-pointer"
            >
              Trợ Giúp
            </button>
          </nav>

          {/* Right Language & Quick Back to App Button */}
          <div className="flex items-center gap-2.5">
            <span className="hidden sm:inline-block text-[10px] font-mono tracking-widest text-[#e2c59f]/90 border border-[#e2c59f]/30 px-2.5 py-1 rounded bg-black/30 backdrop-blur-sm">
              JLPT N5
            </span>
            {onBackToApp ? (
              <button
                onClick={onBackToApp}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                <span>Quay lại</span>
              </button>
            ) : (
              <button
                onClick={() => onLoginSuccess()}
                className="px-3 py-1.5 rounded-lg bg-[#983224] hover:bg-[#b84a39] text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
              >
                <span>Vào học</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            )}
          </div>
        </header>

        {/* Center Stage: Responsive Hero and Card */}
        <main className="items-center my-auto py-6 sm:py-8 lg:py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Editorial Atmospheric Hero Section */}
          <div className="flex flex-col justify-center space-y-4 sm:space-y-6 relative lg:col-span-7 lg:pr-6 text-center lg:text-left items-center lg:items-start">
            {/* Vertical Decorative Calligraphy (Desktop only) */}
            <div className="hidden xl:flex absolute -left-12 top-0 text-white/10 font-kanji text-5xl font-light writing-v tracking-[0.4em] select-none pointer-events-none">
              一期一会 • 精神統一
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/15 bg-white/5 backdrop-blur-md w-fit">
              <span className="w-2 h-2 rounded-full bg-[#b84a39] animate-pulse" />
              <span className="font-kanji text-[11px] text-white/80 tracking-widest">
                静寂と精進 • KHỞI ĐẦU TỊNH TÂM
              </span>
            </div>

            <div className="space-y-1.5">
              <h1 className="font-editorial font-bold tracking-tight text-white leading-[1.08] text-glow uppercase text-3xl sm:text-5xl xl:text-6xl">
                TIẾNG NHẬT <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-[#d45846]">
                  N5 TRUYỀN THỐNG
                </span>
              </h1>
              <p className="font-kanji text-sm sm:text-lg text-[#e2c59f]/90 tracking-wide pt-1">
                "Hành trình thẩm thấu Nhật ngữ &amp; nét bút chân thực."
              </p>
            </div>

            <p className="hidden sm:block text-xs sm:text-sm text-[#a4abb6]/90 font-light leading-relaxed max-w-xl">
              Đắm chìm vào không gian luyện chữ Hán Kyuuji và ngữ pháp kỳ thi JLPT N5. Từng nét vẽ là một khoảnh khắc tĩnh tại, tựa sự vững chãi vĩnh cửu của cánh cổng Torii trên làn sương sớm.
            </p>

            {/* Highlights / Visual badges */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-2 max-w-lg w-full border-t border-white/10">
              <div className="p-2.5 sm:p-3 rounded-xl bg-black/40 border border-white/10 backdrop-blur-md text-center sm:text-left">
                <span className="text-[#b84a39] text-[11px] sm:text-xs font-mono font-bold block">103 KANJI</span>
                <span className="text-[10px] sm:text-[12px] text-white/80 font-kanji">Chữ Hán N5</span>
              </div>
              <div className="p-2.5 sm:p-3 rounded-xl bg-black/40 border border-white/10 backdrop-blur-md text-center sm:text-left">
                <span className="text-[#e2c59f] text-[11px] sm:text-xs font-mono font-bold block">S-CURVE RPG</span>
                <span className="text-[10px] sm:text-[12px] text-white/80 font-kanji">14 ngày N5</span>
              </div>
              <div className="p-2.5 sm:p-3 rounded-xl bg-black/40 border border-white/10 backdrop-blur-md text-center sm:text-left">
                <span className="text-white text-[11px] sm:text-xs font-mono font-bold block">WASHI CANVAS</span>
                <span className="text-[10px] sm:text-[12px] text-white/80 font-kanji">Lực bút cọ</span>
              </div>
            </div>
          </div>

          {/* Right Column: Refined Japanese Lacquer & Frosted Glass Login Card */}
          <div className="w-full lg:col-span-5 max-w-lg mx-auto lg:max-w-none">
            <div className="relative rounded-2xl p-5 sm:p-7 lg:p-8 bg-[#12161c]/90 backdrop-blur-xl border border-white/15 shadow-2xl shadow-black/80 overflow-hidden">
              {/* Subtle Torii Corner Accents */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#b84a39]/25 via-transparent to-transparent pointer-events-none" />
              <div className="absolute top-3 right-3 text-white/10 font-kanji text-4xl select-none font-thin pointer-events-none">
                道
              </div>

              {/* Tab Switcher with Minimal Japanese Line Indicator */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-5">
                <div className="flex items-center space-x-5">
                  <button
                    onClick={() => toggleTab("login")}
                    className={`relative pb-2 font-kanji text-sm sm:text-base tracking-wider transition-all cursor-pointer ${
                      activeTab === "login" ? "font-bold text-white" : "text-white/50 hover:text-white/80"
                    }`}
                    type="button"
                  >
                    <span>Đăng Nhập</span>
                    <span className="text-[11px] text-[#d45846] font-mono ml-1">/ ログイン</span>
                    {activeTab === "login" && (
                      <div className="absolute -bottom-[13px] left-0 right-0 h-[2px] bg-[#b84a39] shadow-sm shadow-[#b84a39]" />
                    )}
                  </button>

                  <button
                    onClick={() => toggleTab("register")}
                    className={`relative pb-2 font-kanji text-sm sm:text-base tracking-wider transition-all cursor-pointer ${
                      activeTab === "register" ? "font-bold text-white" : "text-white/50 hover:text-white/80"
                    }`}
                    type="button"
                  >
                    <span>Đăng Ký</span>
                    <span className="text-[11px] text-white/40 font-mono ml-1">/ 新規登録</span>
                    {activeTab === "register" && (
                      <div className="absolute -bottom-[13px] left-0 right-0 h-[2px] bg-[#b84a39] shadow-sm shadow-[#b84a39]" />
                    )}
                  </button>
                </div>
                <span className="text-[10px] font-mono text-white/40 tracking-widest uppercase">
                  TORII
                </span>
              </div>

              {/* Quick Actions: Google ID & 1-Click Demo Account */}
              <div className="grid grid-cols-2 gap-2.5 mb-4">
                <button
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-black/40 hover:bg-white/10 border border-white/15 text-white/90 text-xs font-medium transition-all cursor-pointer active:scale-[0.99]"
                  type="button"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path
                      d="M12 5c1.5 0 2.8.5 3.9 1.5l2.9-2.9C17 1.8 14.7 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.6 2.8C6.4 7.2 8.9 5 12 5z"
                      fill="#EA4335"
                    />
                    <path
                      d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
                      fill="#4285F4"
                    />
                    <path
                      d="M5.5 14.8c-.3-.8-.4-1.8-.4-2.8s.2-1.9.4-2.8L1.9 6.4C.7 8.8 0 10.3 0 12s.7 3.2 1.9 5.6l3.6-2.8z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.6-2.2-6.5-5.1L1.9 16c1.8 3.7 5.6 7 10.1 7z"
                      fill="#34A853"
                    />
                  </svg>
                  <span>Google ID</span>
                </button>

                <button
                  onClick={handleQuickDemo}
                  disabled={isLoading}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#b84a39]/20 hover:bg-[#b84a39]/30 border border-[#b84a39]/40 text-[#ffdad4] text-xs font-semibold transition-all cursor-pointer active:scale-[0.99]"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#ffdad4]">
                    bolt
                  </span>
                  <span>1-Click Demo</span>
                </button>
              </div>

              {/* Divider */}
              <div className="relative flex items-center justify-center my-3.5">
                <div className="w-full h-px bg-white/10" />
                <span className="absolute px-3 bg-[#12161c] text-white/40 text-[10px] font-mono tracking-widest uppercase">
                  hoặc email
                </span>
              </div>

              {/* Form Fields */}
              <form className="space-y-3" onSubmit={handleSubmit}>
                {/* Full name in register mode */}
                {activeTab === "register" && (
                  <div>
                    <label className="block text-xs font-medium text-white/80 mb-1 flex justify-between" htmlFor="reg-name">
                      <span>Họ và Tên</span>
                      <span className="text-white/40 font-kanji text-[11px]">氏名</span>
                    </label>
                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined absolute left-3 text-white/40 text-lg pointer-events-none">
                        person
                      </span>
                      <input
                        id="reg-name"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Nhập họ và tên môn sinh..."
                        className="w-full bg-black/50 border border-white/15 focus:border-[#b84a39] rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-[#b84a39] transition-all"
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Email Field */}
                <div>
                  <label className="block text-xs font-medium text-white/80 mb-1 flex justify-between" htmlFor="login-email">
                    <span>Email đăng nhập</span>
                    <span className="text-white/40 font-kanji text-[11px]">メールアドレス</span>
                  </label>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-3 text-white/40 text-lg pointer-events-none">
                      mail
                    </span>
                    <input
                      id="login-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="samurai@nihonlearn.jp"
                      className="w-full bg-black/50 border border-white/15 focus:border-[#b84a39] rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-[#b84a39] transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium text-white/80 flex items-center gap-1" htmlFor="login-password">
                      <span>Mật khẩu</span>
                      <span className="text-white/40 font-kanji text-[11px]">パスワード</span>
                    </label>
                    {activeTab === "login" && (
                      <button
                        type="button"
                        onClick={() => {
                          playChime("wood");
                          setActiveModal("forgot_password");
                        }}
                        className="text-[11px] text-[#e2c59f] hover:underline cursor-pointer"
                      >
                        Quên mật khẩu?
                      </button>
                    )}
                  </div>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-3 text-white/40 text-lg pointer-events-none">
                      lock
                    </span>
                    <input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-black/50 border border-white/15 focus:border-[#b84a39] rounded-xl pl-9 pr-10 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-[#b84a39] transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 text-white/40 hover:text-white/80 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-lg">
                        {showPassword ? "visibility_off" : "visibility"}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Confirm Password in register mode */}
                {activeTab === "register" && (
                  <div>
                    <label className="block text-xs font-medium text-white/80 mb-1 flex justify-between" htmlFor="reg-confirm-pw">
                      <span>Xác nhận mật khẩu</span>
                      <span className="text-white/40 font-kanji text-[11px]">確認</span>
                    </label>
                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined absolute left-3 text-white/40 text-lg pointer-events-none">
                        lock_reset
                      </span>
                      <input
                        id="reg-confirm-pw"
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Nhập lại mật khẩu"
                        className="w-full bg-black/50 border border-white/15 focus:border-[#b84a39] rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-[#b84a39] transition-all"
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Checkbox & Status */}
                <div className="flex items-center justify-between pt-0.5">
                  {activeTab === "login" ? (
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-3.5 h-3.5 rounded bg-black/60 border-white/20 text-[#b84a39] focus:ring-0 cursor-pointer"
                      />
                      <span className="text-[11px] text-white/70">Ghi nhớ đăng nhập</span>
                    </label>
                  ) : (
                    <label className="flex items-center gap-2 cursor-pointer select-none text-[11px] text-white/70">
                      <input
                        type="checkbox"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                        className="w-3.5 h-3.5 rounded bg-black/60 border-white/20 text-[#b84a39] focus:ring-0 cursor-pointer"
                      />
                      <span>
                        Tôi đồng ý với{" "}
                        <button
                          type="button"
                          onClick={() => setActiveModal("terms")}
                          className="text-[#e2c59f] underline cursor-pointer"
                        >
                          Điều khoản môn phái
                        </button>
                      </span>
                    </label>
                  )}
                </div>

                {/* Primary Torii Vermilion CTA Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-2.5 px-5 rounded-xl bg-gradient-to-r from-[#b84a39] to-[#983224] hover:from-[#d45846] hover:to-[#b84a39] text-white font-medium text-xs tracking-wider flex items-center justify-center gap-2 cursor-pointer hover:brightness-110 active:scale-[0.99] transition-all shadow-lg shadow-[#b84a39]/30"
                >
                  <span className="font-editorial tracking-widest font-semibold uppercase">
                    {isLoading
                      ? "Đang Xác Thực..."
                      : activeTab === "login"
                      ? "Bắt Đầu Hành Trình"
                      : "Tạo Tài Khoản Học Viên"}
                  </span>
                  <span className="font-kanji text-xs opacity-80">
                    {activeTab === "login" ? "(修業開始)" : "(新規登録)"}
                  </span>
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </button>
              </form>

              {/* Secure Encryption Footer Badge */}
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-white/40">
                <span className="flex items-center gap-1 font-mono">
                  <span className="material-symbols-outlined text-xs text-emerald-400">lock</span>
                  <span>Bảo mật chuẩn TLS 1.3</span>
                </span>
                <span className="font-kanji">一意専心 • Nhất Ý Chuyên Tâm</span>
              </div>
            </div>
          </div>
        </main>

        {/* Footer Editorial Copyright & Legal */}
        <footer className="w-full pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[11px] text-white/50 gap-2">
          <div>
            © 2025-2026 NihonLearn N5 Edition. Bản quyền thuộc Viện Nghiên Cứu Nhật Ngữ.
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveModal("terms")}
              className="hover:text-[#e2c59f] transition-colors cursor-pointer"
            >
              Điều khoản
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveModal("privacy")}
              className="hover:text-[#e2c59f] transition-colors cursor-pointer"
            >
              Quyền riêng tư
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveModal("support")}
              className="hover:text-[#e2c59f] transition-colors cursor-pointer"
            >
              Hỗ trợ
            </button>
          </div>
        </footer>
      </div>

      {/* POPUP MODAL: QUÊN MẬT KHẨU */}
      {activeModal === "forgot_password" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#181c22] border border-white/20 rounded-2xl p-6 max-w-md w-full shadow-2xl relative">
            <button
              onClick={() => {
                setActiveModal("none");
                setResetSent(false);
              }}
              className="absolute top-4 right-4 text-white/50 hover:text-white cursor-pointer"
            >
              ✕
            </button>

            <h3 className="font-headline text-base font-bold text-white mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#b84a39]">lock_reset</span>
              <span>Khôi Phục Mật Khẩu Môn Sinh</span>
            </h3>

            {!resetSent ? (
              <form onSubmit={handleSendReset} className="space-y-4">
                <p className="text-xs text-white/70 leading-relaxed">
                  Nhập địa chỉ email tài khoản học viên. Chúng tôi sẽ gửi hướng dẫn khôi phục bảo mật.
                </p>
                <div>
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="email@nihonlearn.jp"
                    className="w-full bg-black/50 border border-white/20 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#b84a39]"
                    required
                  />
                </div>
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveModal("none")}
                    className="px-4 py-2 rounded-xl text-xs text-white/70 hover:text-white cursor-pointer"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#b84a39] hover:bg-[#d45846] text-white text-xs font-bold transition-all shadow-md cursor-pointer"
                  >
                    Gửi Mã Khôi Phục
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4 text-center py-2">
                <span className="material-symbols-outlined text-emerald-400 text-4xl">
                  mark_email_read
                </span>
                <p className="text-xs text-emerald-300">
                  Thư hướng dẫn đã được gửi tới <strong>{resetEmail}</strong>. Vui lòng kiểm tra hòm thư của bạn.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setActiveModal("none");
                    setResetSent(false);
                  }}
                  className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer"
                >
                  Đã hiểu &amp; Đóng
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* POPUP MODAL: ĐIỀU KHOẢN & BẢO MẬT */}
      {(activeModal === "terms" || activeModal === "privacy") && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#181c22] border border-white/20 rounded-2xl p-6 max-w-lg w-full shadow-2xl relative max-h-[85vh] flex flex-col">
            <button
              onClick={() => setActiveModal("none")}
              className="absolute top-4 right-4 text-white/50 hover:text-white cursor-pointer"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 mb-3 shrink-0">
              <span className="material-symbols-outlined text-[#b84a39] text-2xl">
                {activeModal === "terms" ? "gavel" : "shield"}
              </span>
              <h3 className="font-headline text-base font-bold text-white">
                {activeModal === "terms" ? "Điều Khoản Môn Sinh NihonLearn" : "Chính Sách Bảo Mật Dữ Liệu"}
              </h3>
            </div>

            <div className="overflow-y-auto pr-2 space-y-3 text-xs text-white/70 leading-relaxed border-t border-b border-white/10 py-3 my-2">
              <p>
                <strong>1. Chuẩn Kiểm Định JLPT:</strong> Toàn bộ giáo trình 103 chữ Hán và ngữ pháp N5 được biên soạn dựa trên cấu trúc đề thi chính thức của Hiệp hội Hỗ trợ Giáo dục Quốc tế Nhật Bản (JEES).
              </p>
              <p>
                <strong>2. Bản Quyền Thư Pháp Kyuuji:</strong> Các thuật toán nhận diện nét bút thuận và bài tập thư pháp Washi thuộc sở hữu trí tuệ của viện nghiên cứu NihonLearn.
              </p>
              <p>
                <strong>3. Quyền Riêng Tư &amp; Bảo Mật:</strong> Chúng tôi lưu trữ tiến độ nét vẽ và điểm kinh nghiệm XP của bạn an toàn, không chia sẻ thông tin cá nhân cho bên thứ ba.
              </p>
              <p>
                <strong>4. Tinh Thần Đạo Học:</strong> Môn sinh cam kết duy trì kỷ luật học tập hàng ngày theo tinh thần Ichigo Ichie (一期一会 - Nhất kỳ nhất hội).
              </p>
            </div>

            <div className="flex justify-end pt-2 shrink-0">
              <button
                onClick={() => setActiveModal("none")}
                className="px-5 py-2 rounded-xl bg-[#b84a39] hover:bg-[#d45846] text-white text-xs font-bold cursor-pointer"
              >
                Đồng Ý &amp; Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP MODAL: TRỢ GIÚP HỌC VIÊN */}
      {activeModal === "support" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#181c22] border border-white/20 rounded-2xl p-6 max-w-md w-full shadow-2xl relative">
            <button
              onClick={() => setActiveModal("none")}
              className="absolute top-4 right-4 text-white/50 hover:text-white cursor-pointer"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-[#005f5e] text-3xl">
                support_agent
              </span>
              <div>
                <h3 className="font-headline text-base font-bold text-white">
                  Trung Tâm Hỗ Trợ Môn Sinh
                </h3>
                <p className="text-xs text-white/60">Giải đáp thắc mắc &amp; kỹ thuật thư pháp</p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-white/70 leading-relaxed mb-4">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <strong className="text-white block mb-1">Hòm thư học vụ:</strong>
                <span className="text-[#ffb4a9] font-mono">support@nihonlearn.jp</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <strong className="text-white block mb-1">Cố vấn Sensei Kyuuji:</strong>
                <span>Trực tiếp chấm điểm thứ tự nét và giải thích ngữ pháp 24/7.</span>
              </div>
            </div>

            <button
              onClick={() => setActiveModal("none")}
              className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer"
            >
              Đóng Cửa Sổ
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
