import { useState, useEffect } from "react";
import { playChime } from "../utils/audio";
export const ExamScreen = ({ onAddXP }) => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);
  const questions = [
    {
      id: 1,
      type: "C\xE1ch \u0111\u1ECDc H\xE1n t\u1EF1 (Kanji)",
      questionText: "Ch\u1ECDn c\xE1ch \u0111\u1ECDc Hiragana \u0111\xFAng cho ch\u1EEF H\xE1n trong ngo\u1EB7c: \u300C\u6BCE\u65E5 (\u65E5\u672C\u8A9E) \u3092\u3079\u3093\u304D\u3087\u3046\u3057\u307E\u3059\u3002\u300D",
      options: ["\u306B\u307B\u3093\u3054", "\u306B\u3063\u307D\u3093\u3054", "\u306B\u307B\u3093\u3058\u3093", "\u306B\u307B\u3093\u3053"],
      correctIndex: 0,
      explanation: '\u65E5\u672C\u8A9E \u0111\u1ECDc l\xE0 \u306B\u307B\u3093\u3054 (Nihongo), c\xF3 ngh\u0129a l\xE0 "Ti\u1EBFng Nh\u1EADt".'
    },
    {
      id: 2,
      type: "C\xE1ch \u0111\u1ECDc H\xE1n t\u1EF1 (Kanji)",
      questionText: "Ch\u1ECDn c\xE1ch \u0111\u1ECDc \u0111\xFAng cho t\u1EEB: \u300C(\u65E5\u66DC\u65E5) \u306B\u53CB\u9054\u3068\u4F1A\u3044\u307E\u3059\u3002\u300D",
      options: ["\u3052\u3064\u3088\u3046\u3073", "\u304B\u3088\u3046\u3073", "\u306B\u3061\u3088\u3046\u3073", "\u3059\u3044\u3088\u3046\u3073"],
      correctIndex: 2,
      explanation: '\u65E5\u66DC\u65E5 \u0111\u1ECDc l\xE0 \u306B\u3061\u3088\u3046\u3073 (Nichiyoubi), c\xF3 ngh\u0129a l\xE0 "Ch\u1EE7 nh\u1EADt".'
    },
    {
      id: 3,
      type: "Tr\u1EE3 t\u1EEB (Particles)",
      questionText: "\u0110i\u1EC1n tr\u1EE3 t\u1EEB th\xEDch h\u1EE3p v\xE0o ch\u1ED7 tr\u1ED1ng: \u300C\u308F\u305F\u3057\u306F \u3068\u3057\u3087\u304B\u3093 ( ___ ) \u307B\u3093 \u3092 \u3088\u307F\u307E\u3059\u3002\u300D",
      options: ["\u306B", "\u3067", "\u3078", "\u3092"],
      correctIndex: 1,
      explanation: 'D\xF9ng tr\u1EE3 t\u1EEB \u3067 \u0111\u1EC3 ch\u1EC9 \u0111\u1ECBa \u0111i\u1EC3m di\u1EC5n ra h\xE0nh \u0111\u1ED9ng "\u0111\u1ECDc s\xE1ch" t\u1EA1i th\u01B0 vi\u1EC7n.'
    },
    {
      id: 4,
      type: "T\u1EEB v\u1EF1ng (Vocabulary)",
      questionText: "T\u1EEB n\xE0o tr\xE1i ngh\u0129a v\u1EDBi t\u1EEB \u300C\u5927\u304D\u3044\u300D(Ookii - To l\u1EDBn)?",
      options: ["\u9AD8\u3044 (Takai)", "\u5C0F\u3055\u3044 (Chiisai)", "\u65B0\u3057\u3044 (Atarashii)", "\u9577\u3044 (Nagai)"],
      correctIndex: 1,
      explanation: "\u5927\u304D\u3044 (To l\u1EDBn) tr\xE1i ngh\u0129a v\u1EDBi \u5C0F\u3055\u3044 (Nh\u1ECF b\xE9)."
    },
    {
      id: 5,
      type: "Ng\u1EEF ph\xE1p (Grammar)",
      questionText: "Ch\u1ECDn d\u1EA1ng \u0111\u1ED9ng t\u1EEB th\xEDch h\u1EE3p: \u300C\u3059\u307F\u307E\u305B\u3093\u3001\u30DA\u30F3\u3092 ( ___ ) \u304F\u3060\u3055\u3044\u3002\u300D",
      options: ["\u304B\u3057\u307E\u3059", "\u304B\u3057\u3066", "\u304B\u3057\u305F", "\u304B\u3055\u306A\u3044"],
      correctIndex: 1,
      explanation: "M\u1EABu c\xE2u y\xEAu c\u1EA7u l\u1ECBch s\u1EF1: V-\u3066 + \u304F\u3060\u3055\u3044. \u304B\u3059 -> \u304B\u3057\u3066 \u304F\u3060\u3055\u3044 (Xin h\xE3y cho m\u01B0\u1EE3n)."
    }
  ];
  useEffect(() => {
    if (isSubmitted || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1e3);
    return () => clearInterval(timer);
  }, [isSubmitted, timeLeft]);
  const handleSelectOption = (qId, optionIdx) => {
    if (isSubmitted) return;
    playChime("wood");
    setSelectedAnswers((prev) => ({
      ...prev,
      [qId]: optionIdx
    }));
  };
  const handleSubmit = () => {
    setIsSubmitted(true);
    playChime("success");
    let correct = 0;
    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        correct++;
      }
    });
    onAddXP(correct * 30);
  };
  const handleRestart = () => {
    playChime("wood");
    setSelectedAnswers({});
    setIsSubmitted(false);
    setCurrentQIndex(0);
    setTimeLeft(300);
  };
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };
  const currentQ = questions[currentQIndex];
  const score = questions.reduce(
    (acc, q) => selectedAnswers[q.id] === q.correctIndex ? acc + 1 : acc,
    0
  );
  return <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-12 flex flex-col gap-6">
      {
    /* HEADER WITH TIMER */
  }
      <div className="bg-white dark:bg-[#1A1D20] rounded-3xl p-6 shadow-sm border border-[#eceef2] dark:border-[#2e3134] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-[#983224] text-white text-[10px] font-bold">
              JLPT N5
            </span>
            <span className="text-xs text-[#8C8C8C]">Mô Phỏng Phòng Thi Chuẩn</span>
          </div>
          <h1 className="font-headline text-xl font-bold text-[#191c1f] dark:text-white mt-1">
            Khảo Thí Thực Chiến Sơ Cấp (5 Câu Hỏi)
          </h1>
        </div>

        {
    /* Countdown Timer */
  }
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-[#f8f9fd] dark:bg-[#25282c] border border-[#eceef2] dark:border-[#2e3134] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#983224] text-[20px]">
              timer
            </span>
            <span className="font-mono font-bold text-sm text-[#191c1f] dark:text-white">
              {formatTime(timeLeft)}
            </span>
          </div>

          {!isSubmitted ? <button
    onClick={handleSubmit}
    disabled={Object.keys(selectedAnswers).length === 0}
    className="px-5 py-2 rounded-2xl bg-[#983224] hover:bg-[#b84a39] disabled:opacity-50 text-white text-xs font-bold transition-all shadow-sm"
  >
              Nộp Bài Thi
            </button> : <button
    onClick={handleRestart}
    className="px-5 py-2 rounded-2xl bg-[#005f5e] hover:bg-[#004e4d] text-white text-xs font-bold transition-all shadow-sm"
  >
              Làm Lại Đề
            </button>}
        </div>
      </div>

      {
    /* RESULTS BANNER (IF SUBMITTED) */
  }
      {isSubmitted && <div className="bg-gradient-to-br from-[#fff7f5] to-white dark:from-[#251e1d] dark:to-[#1A1D20] rounded-3xl p-6 border-2 border-[#983224] shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#983224] text-white flex items-center justify-center font-bold text-2xl shadow-lg">
              {score}/{questions.length}
            </div>
            <div>
              <h3 className="font-headline text-lg font-bold text-[#191c1f] dark:text-white">
                {score >= 4 ? "\u{1F389} \u0110\u1EA1t Chu\u1EA9n Xu\u1EA5t S\u1EAFc!" : "C\u1EA7n Ti\u1EBFp T\u1EE5c \xD4n Luy\u1EC7n"}
              </h3>
              <p className="text-xs text-[#57423e] dark:text-[#c7c6c6] mt-0.5">
                Bạn đã đạt {Math.round(score / questions.length * 100)}% điểm số. Thưởng +{score * 30} XP vào hồ sơ!
              </p>
            </div>
          </div>
        </div>}

      {
    /* QUESTION CARD */
  }
      <div className="bg-white dark:bg-[#1A1D20] rounded-3xl p-6 shadow-sm border border-[#eceef2] dark:border-[#2e3134] flex flex-col gap-5">
        {
    /* Question Counter Header */
  }
        <div className="flex items-center justify-between pb-3 border-b border-[#eceef2] dark:border-[#2e3134]">
          <span className="text-xs font-bold text-[#983224] uppercase tracking-wider">
            CÂU {currentQIndex + 1} / {questions.length} • {currentQ.type}
          </span>
          <div className="flex items-center gap-1">
            {questions.map((q, idx) => <button
    key={q.id}
    onClick={() => setCurrentQIndex(idx)}
    className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${idx === currentQIndex ? "bg-[#983224] text-white shadow-sm" : selectedAnswers[q.id] !== void 0 ? "bg-[#ffdad4] text-[#983224]" : "bg-[#f2f3f8] dark:bg-[#25282c] text-[#8C8C8C]"}`}
  >
                {idx + 1}
              </button>)}
          </div>
        </div>

        {
    /* Question Text */
  }
        <h2 className="font-headline text-base sm:text-lg font-bold text-[#191c1f] dark:text-white leading-relaxed">
          {currentQ.questionText}
        </h2>

        {
    /* Multiple Choice Options */
  }
        <div className="flex flex-col gap-3">
          {currentQ.options.map((opt, oIdx) => {
    const isSelected = selectedAnswers[currentQ.id] === oIdx;
    const isCorrect = isSubmitted && oIdx === currentQ.correctIndex;
    const isWrongSelected = isSubmitted && isSelected && !isCorrect;
    return <button
      key={oIdx}
      onClick={() => handleSelectOption(currentQ.id, oIdx)}
      className={`p-4 rounded-2xl text-left border text-xs sm:text-sm font-medium transition-all flex items-center justify-between ${isCorrect ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-bold" : isWrongSelected ? "border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300" : isSelected ? "border-[#983224] bg-[#fff6f5] dark:bg-[#2a1d1c]/60 text-[#983224] font-bold shadow-sm" : "border-[#eceef2] dark:border-[#2e3134] bg-[#f8f9fd] dark:bg-[#25282c] hover:border-[#dec0bb] text-[#191c1f] dark:text-white"}`}
    >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs font-bold shrink-0">
                    {String.fromCharCode(65 + oIdx)}
                  </span>
                  <span>{opt}</span>
                </div>

                {isCorrect && <span className="material-symbols-outlined text-emerald-600 text-[20px]">
                    check_circle
                  </span>}
                {isWrongSelected && <span className="material-symbols-outlined text-rose-600 text-[20px]">
                    cancel
                  </span>}
              </button>;
  })}
        </div>

        {
    /* Explanation (Visible after submit) */
  }
        {isSubmitted && <div className="bg-[#f8f9fd] dark:bg-[#25282c] p-4 rounded-2xl border border-[#eceef2] dark:border-[#2e3134] text-xs text-[#57423e] dark:text-[#c7c6c6] leading-relaxed">
            <strong className="text-[#983224]">Giải thích chi tiết: </strong>
            {currentQ.explanation}
          </div>}

        {
    /* Nav Buttons */
  }
        <div className="flex items-center justify-between pt-3 border-t border-[#eceef2] dark:border-[#2e3134]">
          <button
    onClick={() => setCurrentQIndex((prev) => Math.max(0, prev - 1))}
    disabled={currentQIndex === 0}
    className="px-4 py-2 rounded-xl bg-[#f2f3f8] dark:bg-[#25282c] disabled:opacity-40 text-xs font-semibold text-[#191c1f] dark:text-white flex items-center gap-1.5"
  >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>Câu Trước</span>
          </button>

          <button
    onClick={() => setCurrentQIndex((prev) => Math.min(questions.length - 1, prev + 1))}
    disabled={currentQIndex === questions.length - 1}
    className="px-4 py-2 rounded-xl bg-[#983224] hover:bg-[#b84a39] disabled:opacity-40 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
  >
            <span>Câu Tiếp</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>;
};
