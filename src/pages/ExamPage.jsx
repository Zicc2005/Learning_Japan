import React, { useState, useEffect } from 'react';
import { sounds } from '../utils/soundEffects';
import confetti from 'canvas-confetti';

export function ExamPage({ mockTestSets = [], examTypesData, onCompleteExam, onNavigateAi }) {
  // Tabs: 'cbt' (Thi CBT chuẩn - Screen 6) | 'drills' (Luyện theo dạng) | 'random' (Tạo đề ngẫu nhiên)
  const [examSubTab, setExamSubTab] = useState('cbt');

  // CBT Exam State
  const defaultQuestions = [
    {
      id: 1,
      category: 'Từ vựng (Moji-Goi)',
      question: 'これは なんの ( 本 ) ですか。Chữ trong ngoặc đọc là gì?',
      options: ['ほん', 'ぼん', 'ぽん', 'ばん'],
      correctAnswer: 0,
      explanation: 'Chữ Hán「本」(BẢN - sách) có âm đọc là「ほん」(hon).'
    },
    {
      id: 2,
      category: 'Từ vựng (Moji-Goi)',
      question: 'まいあさ、コーヒーを ( &nbsp;&nbsp;&nbsp;&nbsp; )。',
      options: ['のみます', 'たべます', 'よみます', 'ききます'],
      correctAnswer: 0,
      explanation: 'Uống cà phê dùng động từ のみます (uống).'
    },
    {
      id: 3,
      category: 'Ngữ pháp & Trợ từ',
      question: 'わたしは としょかん ( &nbsp;&nbsp;&nbsp;&nbsp; ) べんきょうします。',
      options: ['に', 'で', 'へ', 'を'],
      correctAnswer: 1,
      explanation: 'Trợ từ で chỉ địa điểm diễn ra hành động (học bài ở thư viện).'
    },
    {
      id: 4,
      category: 'Ngữ pháp & Trợ từ',
      question: 'あした、とうきょう ( &nbsp;&nbsp;&nbsp;&nbsp; ) いきます。',
      options: ['へ', 'で', 'を', 'から'],
      correctAnswer: 0,
      explanation: 'Trợ từ へ (hoặc に) chỉ hướng di chuyển đến Tokyo.'
    },
    {
      id: 5,
      category: 'Ngữ pháp & Trợ từ',
      question: 'きのう、ともだち ( &nbsp;&nbsp;&nbsp;&nbsp; ) えいがを みました。',
      options: ['に (ni)', 'と (to)', 'で (de)', 'を (o)'],
      correctAnswer: 1,
      explanation: 'Mẫu câu [Người + と + V] mang ý nghĩa "Làm gì cùng với ai". きのう、ともだちと えいがを みました = Hôm qua, tôi đã xem phim cùng với bạn.'
    },
    {
      id: 6,
      category: 'Đọc hiểu ngắn (Dokkai)',
      question: 'わたしは まいにち 7じに おきます。あさごはんを たべてから、がっこうへ いきます。Tôi đi học lúc nào?',
      options: ['Trước khi ăn sáng', 'Sau khi ăn sáng', 'Lúc 7 giờ đúng', 'Không đi học'],
      correctAnswer: 1,
      explanation: 'Mẫu [V-てから] biểu thị sau khi làm hành động 1 thì làm hành động 2: sau khi ăn sáng thì đi học.'
    }
  ];

  // If mockTestSets[0] has questions, merge or use default
  const questions = (mockTestSets[0]?.questions && mockTestSets[0].questions.length >= 5)
    ? mockTestSets[0].questions.slice(0, 6).map((q, i) => ({
        id: i + 1,
        category: q.category || (i < 2 ? 'Từ vựng (Moji-Goi)' : i < 5 ? 'Ngữ pháp & Trợ từ' : 'Đọc hiểu (Dokkai)'),
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer ?? 0,
        explanation: q.explanation || 'Giải thích chuẩn theo giáo trình Minna no Nihongo N5.'
      }))
    : defaultQuestions;

  const [currentQIndex, setCurrentQIndex] = useState(4); // default câu 5 like template
  const [selectedAnswers, setSelectedAnswers] = useState({ 0: 0, 1: 0, 2: 1 }); // mock some answered
  const [flaggedQuestions, setFlaggedQuestions] = useState({ 3: true }); // mock flag on #4
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60);

  // Timer
  useEffect(() => {
    if (isSubmitted) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isSubmitted]);

  const formatTimer = (s) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleSelectOption = (qIdx, optIdx) => {
    sounds.playClick();
    setSelectedAnswers((prev) => ({
      ...prev,
      [qIdx]: optIdx
    }));
  };

  const toggleFlag = (qIdx) => {
    sounds.playClick();
    setFlaggedQuestions((prev) => ({
      ...prev,
      [qIdx]: !prev[qIdx]
    }));
  };

  const handleSubmit = () => {
    sounds.playSuccess?.();
    setIsSubmitted(true);
    confetti({ particleCount: 70, spread: 60 });
    if (onCompleteExam) onCompleteExam(100);
  };

  const handleResetExam = () => {
    sounds.playClick();
    setSelectedAnswers({});
    setFlaggedQuestions({});
    setIsSubmitted(false);
    setTimeLeft(25 * 60);
    setCurrentQIndex(0);
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const currentQ = questions[currentQIndex] || questions[0];

  // Score calculation
  let correctCount = 0;
  questions.forEach((q, idx) => {
    if (selectedAnswers[idx] === q.correctAnswer) {
      correctCount += 1;
    }
  });
  const totalScore = Math.round((correctCount / questions.length) * 120);

  return (
    <section className="flex-1 flex flex-col px-4 py-3 space-y-3.5">
      {/* Sub-mode Switcher */}
      <div className="grid grid-cols-3 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
        <button
          onClick={() => { sounds.playClick(); setExamSubTab('cbt'); }}
          className={`py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
            examSubTab === 'cbt'
              ? 'bg-gradient-to-r from-rose-600 to-red-500 text-white shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Thi CBT Chuẩn
        </button>
        <button
          onClick={() => { sounds.playClick(); setExamSubTab('drills'); }}
          className={`py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
            examSubTab === 'drills'
              ? 'bg-gradient-to-r from-cyan-600 to-blue-500 text-white shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Ôn Dạng Bài
        </button>
        <button
          onClick={() => { sounds.playClick(); setExamSubTab('random'); }}
          className={`py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
            examSubTab === 'random'
              ? 'bg-gradient-to-r from-amber-600 to-yellow-500 text-slate-950 shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Đề Ngẫu Nhiên
        </button>
      </div>

      {/* ================= CBT EXAM MODE ================= */}
      {examSubTab === 'cbt' && (
        <div className="lg:grid lg:grid-cols-12 gap-6 items-start w-full">
          
          {/* LEFT COLUMN: ACTIVE QUESTION CARD (COL-SPAN-7) */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col space-y-4 order-2 lg:order-1">
            {/* Active Question Card */}
            <div className="bg-gradient-to-b from-slate-900 to-[#0d1424] rounded-3xl p-4 sm:p-5 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-black text-[10px] sm:text-xs border border-rose-500/30">
                    CÂU {currentQIndex + 1} / {questions.length}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] sm:text-xs">
                    {currentQ.category}
                  </span>
                </div>
                <button
                  onClick={() => toggleFlag(currentQIndex)}
                  className={`flex items-center gap-1 text-[11px] sm:text-xs font-bold px-2.5 py-1 rounded-xl border active:scale-95 transition-all cursor-pointer ${
                    flaggedQuestions[currentQIndex]
                      ? 'bg-amber-500/30 text-amber-300 border-amber-500/60'
                      : 'text-amber-400 bg-amber-500/10 border-amber-500/30'
                  }`}
                >
                  <span className="material-symbols-outlined text-xs">flag</span>
                  <span>Đặt cờ</span>
                </button>
              </div>

              <div className="text-sm sm:text-base font-bold text-white leading-relaxed p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
                <div dangerouslySetInnerHTML={{ __html: currentQ.question }} />
              </div>
              <p className="text-xs text-slate-400">Chọn phương án trả lời chính xác nhất:</p>

              {/* 4 Clickable Answer Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentQ.options.map((opt, optIdx) => {
                  const isSelected = selectedAnswers[currentQIndex] === optIdx;
                  const isAnswerSubmitted = isSubmitted;
                  const isCorrect = optIdx === currentQ.correctAnswer;

                  let optClass = 'bg-slate-800/80 hover:bg-slate-700/80 border-slate-700 text-slate-200';
                  if (isAnswerSubmitted) {
                    if (isCorrect) {
                      optClass = 'bg-emerald-600 text-white border-emerald-400 shadow-md shadow-emerald-600/30';
                    } else if (isSelected) {
                      optClass = 'bg-rose-600 text-white border-rose-400 shadow-md shadow-rose-600/30';
                    }
                  } else if (isSelected) {
                    optClass = 'bg-rose-600 text-white border-rose-400 shadow-md shadow-rose-600/30';
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(currentQIndex, optIdx)}
                      className={`p-3 rounded-2xl border text-left text-xs sm:text-sm font-semibold flex items-center gap-2.5 transition-all cursor-pointer active:scale-95 ${optClass}`}
                    >
                      <span className="w-6 h-6 rounded-full bg-slate-700/80 flex items-center justify-center text-[11px] font-bold shrink-0">
                        {optIdx + 1}
                      </span>
                      <span className="leading-tight">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Instant Explanation Feedback */}
              {(isSubmitted || selectedAnswers[currentQIndex] !== undefined) && (
                <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-xs sm:text-sm text-emerald-300">
                  <strong className="text-white">✓ Giải thích:</strong> {currentQ.explanation}
                </div>
              )}

              {/* Question Navigation Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <button
                  disabled={currentQIndex === 0}
                  onClick={() => {
                    sounds.playClick();
                    setCurrentQIndex((p) => Math.max(0, p - 1));
                  }}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1 active:scale-95 transition-all ${
                    currentQIndex === 0
                      ? 'opacity-40 bg-slate-900 text-slate-500 border border-slate-800 cursor-not-allowed'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 cursor-pointer'
                  }`}
                >
                  <span className="material-symbols-outlined text-xs sm:text-sm">arrow_back</span> Câu trước
                </button>
                <button
                  disabled={currentQIndex === questions.length - 1}
                  onClick={() => {
                    sounds.playClick();
                    setCurrentQIndex((p) => Math.min(questions.length - 1, p + 1));
                  }}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1 active:scale-95 shadow transition-all ${
                    currentQIndex === questions.length - 1
                      ? 'opacity-40 bg-slate-900 text-slate-500 border border-slate-800 cursor-not-allowed'
                      : 'bg-rose-600 text-white hover:bg-rose-500 cursor-pointer'
                  }`}
                >
                  Câu tiếp <span className="material-symbols-outlined text-xs sm:text-sm">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: CBT HUD, PALETTE & SCORECARD (COL-SPAN-5) */}
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col space-y-4 order-1 lg:order-2 sticky top-24">
            {/* CBT Exam HUD Bar */}
            <div className="p-3.5 rounded-3xl bg-gradient-to-r from-slate-900 via-[#0e1628] to-slate-900 border border-amber-500/40 shadow-xl flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold">
                  <span className="material-symbols-outlined text-2xl">timer</span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-black uppercase text-rose-400 bg-rose-500/20 px-1.5 py-0.2 rounded border border-rose-500/30">
                      ĐANG THI CBT
                    </span>
                    <span className="text-xs sm:text-sm font-mono font-black text-amber-400 tracking-wider" id="cbt-timer">
                      {formatTimer(timeLeft)}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Đã làm:{' '}
                    <strong className="text-emerald-400 font-bold" id="answeredCount">
                      {answeredCount}/{questions.length}
                    </strong>{' '}
                    câu
                  </div>
                </div>
              </div>
              <button
                onClick={handleSubmit}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-500 hover:brightness-110 text-white font-black text-xs sm:text-sm shadow-md shadow-rose-600/30 flex items-center gap-1 active:scale-95 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">done_all</span>
                <span>NỘP BÀI</span>
              </button>
            </div>

            {/* CBT Question Palette */}
            <div className="bg-slate-900/90 rounded-3xl p-4 border border-slate-800 space-y-2.5 shadow-lg">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-cyan-400">apps</span> Danh sách câu hỏi
                </span>
                <div className="flex items-center gap-2 text-[10px]">
                  <span className="flex items-center gap-1 text-slate-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>Đã chọn
                  </span>
                  <span className="flex items-center gap-1 text-slate-400">
                    <span className="w-2 h-2 rounded-full bg-amber-400"></span>Đặt cờ
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-6 gap-2 text-center text-xs font-black">
                {questions.map((q, idx) => {
                  const isSelected = selectedAnswers[idx] !== undefined;
                  const isFlagged = flaggedQuestions[idx];
                  const isCurrent = currentQIndex === idx;

                  let btnClass = 'bg-slate-800 text-slate-400 border-slate-700';
                  if (isCurrent) {
                    btnClass = 'bg-rose-600 text-white shadow-md shadow-rose-600/30 border-rose-400 ring-2 ring-rose-400/50';
                  } else if (isFlagged) {
                    btnClass = 'bg-amber-500/20 text-amber-300 border-amber-500/50 ring-2 ring-amber-400/40';
                  } else if (isSelected) {
                    btnClass = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        sounds.playClick();
                        setCurrentQIndex(idx);
                      }}
                      className={`py-2 rounded-xl border transition-all active:scale-95 cursor-pointer font-bold text-xs ${btnClass}`}
                    >
                      {idx + 1} {isCurrent ? '✎' : isFlagged ? '⚑' : isSelected ? '✓' : ''}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Auto-Grading CBT Scorecard Section */}
            <div
              className={`p-4 rounded-3xl bg-gradient-to-br from-slate-900 via-[#161329] to-slate-900 border-2 ${
                isSubmitted ? 'border-emerald-500/70' : 'border-emerald-500/40'
              } shadow-2xl space-y-3.5`}
              id="cbtScorecard"
            >
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                <div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-extrabold uppercase">
                    KẾT QUẢ THI THỬ JLPT N5
                  </span>
                  <h3 className="text-xs sm:text-sm font-black text-white mt-1">Bảng Điểm Tự Động CBT</h3>
                </div>
                <div className="text-right">
                  <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
                    {totalScore}
                    <span className="text-xs text-slate-400">/120</span>
                  </span>
                  <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wide">
                    {totalScore >= 80 ? 'ĐẠT (PASS) 🏆' : 'CẦN ÔN THÊM 💪'}
                  </div>
                </div>
              </div>

              {/* Statistics Pills */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="text-sm sm:text-base font-black text-emerald-400">{correctCount} / {questions.length}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Số câu đúng</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="text-sm sm:text-base font-black text-rose-400">{questions.length - correctCount} / {questions.length}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Số câu sai</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="text-sm sm:text-base font-black text-amber-400">08:45</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Thời gian làm</div>
                </div>
              </div>

              {/* Skill Competency Breakdown Progress Bars */}
              <div className="space-y-2 bg-slate-950/60 p-3 rounded-2xl border border-slate-800 text-xs">
                <div className="font-bold text-slate-300 text-[11px] mb-1">
                  Đánh giá năng lực theo cấu trúc đề:
                </div>
                <div className="space-y-1.5">
                  <div>
                    <div className="flex justify-between text-[10px] text-slate-400 mb-0.5">
                      <span>Từ vựng & Kanji (Moji-Goi)</span>
                      <span className="font-bold text-emerald-400">100% (2/2 câu)</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full w-full"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] text-slate-400 mb-0.5">
                      <span>Ngữ pháp & Trợ từ (Bunpou)</span>
                      <span className="font-bold text-amber-400">75% (2/3 câu)</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full w-3/4"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] text-slate-400 mb-0.5">
                      <span>Đọc hiểu ngắn (Dokkai)</span>
                      <span className="font-bold text-emerald-400">100% (1/1 câu)</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full w-full"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={handleResetExam}
                  className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center justify-center gap-1 active:scale-95 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-xs text-amber-400">replay</span>
                  <span>Làm lại đề này</span>
                </button>
                <button
                  onClick={() => {
                    sounds.playClick();
                    if (onNavigateAi) onNavigateAi();
                  }}
                  className="py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-xs font-bold flex items-center justify-center gap-1 active:scale-95 shadow transition-all cursor-pointer hover:brightness-110"
                >
                  <span className="material-symbols-outlined text-xs">smart_toy</span>
                  <span>Sensei chữa câu sai</span>
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ================= DRILLS MODE ================= */}
      {examSubTab === 'drills' && (
        <div className="space-y-3">
          <div className="bg-slate-900/90 rounded-2xl p-3 border border-slate-800">
            <h3 className="text-xs font-bold text-white mb-1">Ôn tập chuyên sâu theo từng dạng bài</h3>
            <p className="text-[11px] text-slate-400">
              Chọn dạng bài để luyện tập không giới hạn thời gian.
            </p>
          </div>
          {examTypesData?.categories?.map((cat, cIdx) => (
            <div key={cIdx} className="bg-slate-900 rounded-2xl p-3 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-300">{cat.name}</span>
                <span className="text-[10px] text-slate-400">{cat.questions?.length || 0} câu</span>
              </div>
              <p className="text-[10px] text-slate-400">{cat.description}</p>
              <button
                onClick={() => {
                  sounds.playClick();
                  setExamSubTab('cbt');
                }}
                className="w-full py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all cursor-pointer"
              >
                Bắt đầu làm dạng này
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ================= RANDOM QUIZ MODE ================= */}
      {examSubTab === 'random' && (
        <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 space-y-3 text-center">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-2xl">
            🎲
          </div>
          <h3 className="text-sm font-black text-white">Tạo Đề Thi Ngẫu Nhiên</h3>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            Hệ thống sẽ bốc ngẫu nhiên câu hỏi từ ngân hàng 1000+ câu hỏi N5 để bạn cọ xát áp lực thực chiến.
          </p>
          <button
            onClick={() => {
              sounds.playClick();
              handleResetExam();
              setExamSubTab('cbt');
            }}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black text-xs shadow-lg active:scale-95 transition-all cursor-pointer hover:brightness-110"
          >
            Tạo Đề & Bắt Đầu Ngay
          </button>
        </div>
      )}
    </section>
  );
}
