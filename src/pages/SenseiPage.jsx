import React, { useState, useRef, useEffect } from 'react';
import { sounds } from '../utils/soundEffects';

export function SenseiPage({ speak }) {
  const [messages, setMessages] = useState([
    {
      sender: 'sensei',
      text: 'Konnichiwa! Sensei đây 👋\n\nEm đang vướng mắc ở chữ cái, cách đi nét bút thuận, hay trợ từ nào trong Minna no Nihongo N5? Cứ nhắn Sensei giải thích siêu dễ hiểu nhé!'
    },
    {
      sender: 'user',
      text: 'Sensei ơi, làm sao để nhớ lâu chữ Hán 休 (HƯU - nghỉ ngơi) ạ?'
    },
    {
      sender: 'sensei',
      text: 'Chữ **休** (HƯU) cực kỳ thú vị vì nó ghép từ 2 bộ quen thuộc:\n\n1. Bên trái là bộ **亻 (Nhân đứng - Con người)**\n2. Bên phải là bộ **木 (Mộc - Cái cây)**\n\n🌟 **Hình ảnh tưởng tượng:** Sau một ngày đồng áng vất vả, **Con người (亻) tựa lưng vào gốc Cây (木)** để thảnh thơi **Nghỉ ngơi (休)**!\n\nVí dụ: やすみ (Yasumi - Ngày nghỉ), きゅうけい (Kyuukei - Giải lao).'
    }
  ]);

  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatBottomRef = useRef(null);

  const presetQuestions = [
    { label: '🔍 は khác gì が?', query: 'Phân biệt trợ từ は và が?' },
    { label: '💡 Mẹo nhớ chữ 休', query: 'Tạo mẹo nhớ cho chữ 休 (HƯU)' },
    { label: '⚡ Trợ từ で vs に', query: 'Trợ từ で và に khác nhau ở đâu?' },
    { label: '✍️ Quy tắc nét bút', query: 'Tại sao viết sai nét bút lại bị trừ điểm?' }
  ];

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (textToSend) => {
    const text = (textToSend || inputVal).trim();
    if (!text) return;

    sounds.playClick();
    const userMsg = { sender: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    // Knowledge logic response engine
    setTimeout(() => {
      let reply = '';
      const q = text.toLowerCase();

      if (q.includes('は') && q.includes('が')) {
        reply = `🎓 **Bí kíp phân biệt は (wa) và が (ga):**\n\n1. **A は B です:** Trọng tâm câu nằm ở vị ngữ **B** (ví dụ: "Tôi là [kỹ sư]").\n2. **A が B です:** Trọng tâm câu nằm ở chủ ngữ **A** (ví dụ: Ai là kỹ sư? Chính là [Anh Nam] là kỹ sư).\n\n💡 *Mẹo nhớ:* は dùng cho chủ đề ai cũng biết; が dùng để giới thiệu thông tin mới xuất hiện hoặc nhấn mạnh đúng đối tượng đó!`;
      } else if (q.includes('休') || q.includes('hưu')) {
        reply = `🧙‍♂️ **Mẹo nhớ chữ 休 (HƯU - Nghỉ ngơi):**\n\nChữ 休 được ghép từ 2 bộ quen thuộc:\n- Bên trái: Bộ **Nhân đứng (亻)** tượng trưng cho một người lao động.\n- Bên phải: Chữ **Mộc (木)** tượng trưng cho cây cối.\n\n📖 *Câu chuyện:* Một người đi làm đồng mệt mỏi, ghé lại tựa lưng vào gốc cây để **nghỉ ngơi** (Hưu trí / Nghỉ hè). Quá dễ nhớ đúng không!`;
      } else if (q.includes('で') && q.includes('に')) {
        reply = `📍 **Quy tắc vàng phân biệt で và に:**\n\n- **Hành động diễn ra TẠI ĐÂU?** -> Dùng **で** (VD: レストラン **で** たべます - Ăn tại nhà hàng).\n- **Sự tồn tại ở đâu / Đích đến di chuyển?** -> Dùng **に** (VD: 机の上 **に** 本があります - Có sách ở trên bàn; 東京 **に** 行きます - Đi đến Tokyo).`;
      } else if (q.includes('nét') || q.includes('bút') || q.includes('thứ tự')) {
        reply = `✍️ **Tại sao bắt buộc phải viết đúng nét bút thuận?**\n\nTrong thư pháp Nhật Bản và Hán tự, thứ tự nét không phải ngẫu nhiên mà được tối ưu qua hàng nghìn năm:\n1. **Cân đối chữ:** Viết đúng nét giúp trọng tâm chữ vuông vắn, không bị méo lệch.\n2. **Tốc độ viết thảo:** Khi viết nhanh (hành thư), các nét sẽ nối liền nhau; nếu thứ tự sai chữ viết ra sẽ biến thành chữ khác hoàn toàn!\n3. **Quy tắc cốt lõi:** Ngang trước sổ sau, trên trước dưới sau, trái trước phải sau, vào trước đóng sau!`;
      } else {
        reply = `Sensei phản hồi ngay:\n\nCâu hỏi rất hay về kiến thức "${text}"! Em hãy chú ý nguyên tắc kết hợp và ngữ cảnh nhé. Sensei khuyên em nên làm thêm câu trắc nghiệm dạng này trong tab **Thi Thử JLPT** để nhớ dai 100%!`;
      }

      sounds.playCorrectStroke?.();
      setMessages((prev) => [...prev, { sender: 'sensei', text: reply }]);
      setIsTyping(false);
    }, 600);
  };

  const clearChat = () => {
    sounds.playClick();
    setMessages([
      {
        sender: 'sensei',
        text: 'Konnichiwa! Sensei đây 👋\n\nEm đang vướng mắc ở chữ cái, cách đi nét bút thuận, hay trợ từ nào trong Minna no Nihongo N5? Cứ nhắn Sensei giải thích siêu dễ hiểu nhé!'
      }
    ]);
  };

  return (
    <section className="tab-screen flex-1 flex flex-col px-2 sm:px-4 py-3 space-y-4 pb-16 md:pb-4 w-full" id="screen-tab-ai">
      
      {/* 2-Column Dashboard on Desktop */}
      <div className="lg:grid lg:grid-cols-12 gap-6 xl:gap-8 items-start w-full">
        
        {/* ================= LEFT COLUMN: SENSEI PROFILE & QUICK PROMPTS ================= */}
        <div className="lg:col-span-4 flex flex-col space-y-4">
          
          {/* Sensei Header Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-950/70 via-slate-900 to-teal-950/70 border border-emerald-500/40 shadow-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-2xl shadow-lg shadow-emerald-500/30">
                🤖
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-black text-white">Nihon Sensei AI</h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/20 px-2.5 py-0.5 rounded-md border border-emerald-500/30 leading-normal">
                    Online 24/7
                  </span>
                  <span className="text-[10px] text-slate-400">Gia sư sư phạm N5</span>
                </div>
              </div>
            </div>
            <button
              onClick={clearChat}
              className="px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold active:scale-95 transition-all cursor-pointer hover:bg-emerald-500/30"
              title="Xóa lịch sử cuộc trò chuyện"
            >
              Xóa chat
            </button>
          </div>

          {/* Quick Prompt Cards (Vertical on Desktop, horizontal on mobile) */}
          <div className="bg-slate-900/80 rounded-3xl p-4 border border-slate-800 space-y-2.5 shadow-lg">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-slate-200 uppercase tracking-wider">
                Gợi Ý Câu Hỏi Nhanh:
              </h4>
              <span className="text-[10px] text-slate-400">Nhấp để hỏi ngay</span>
            </div>

            <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto no-scrollbar py-0.5">
              {presetQuestions.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(item.query)}
                  className="px-3.5 py-2.5 rounded-2xl bg-slate-800/80 hover:bg-rose-500/20 hover:text-rose-300 hover:border-rose-500/40 text-slate-200 border border-slate-700/80 text-xs font-medium whitespace-nowrap lg:whitespace-normal text-left transition-all cursor-pointer active:scale-95 shrink-0 flex items-center justify-between group"
                >
                  <span>{item.label}</span>
                  <span className="material-symbols-outlined text-xs text-slate-500 group-hover:text-rose-400 hidden lg:inline">
                    arrow_forward
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Learning Tips Card (Desktop only) */}
          <div className="hidden lg:block bg-gradient-to-br from-slate-900 to-indigo-950/40 rounded-3xl p-4 border border-indigo-500/30 space-y-2 text-xs">
            <div className="flex items-center gap-1.5 text-indigo-300 font-bold">
              <span className="material-symbols-outlined text-sm">psychology</span>
              <span>Bí kíp học N5 cùng Sensei</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Bạn có thể hỏi Sensei về: giải thích trợ từ <strong className="text-rose-400">は / が / で / に</strong>, dịch câu văn ngữ cảnh, mẹo phân tích bộ thủ chữ Hán hoặc quy tắc nét bút thuận!
            </p>
          </div>

        </div>

        {/* ================= RIGHT COLUMN: CHAT STREAM & INPUT ================= */}
        <div className="lg:col-span-8 flex flex-col bg-slate-900/60 rounded-3xl p-4 sm:p-5 border border-slate-800 shadow-xl min-h-[500px] justify-between">
          
          {/* Chat Messages Stream */}
          <div className="flex-1 space-y-3.5 overflow-y-auto max-h-[440px] lg:max-h-[520px] pr-1.5" id="chatContainer">
            {messages.map((m, idx) => {
              const isSensei = m.sender === 'sensei';

              if (isSensei) {
                return (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-2xl bg-emerald-600 flex items-center justify-center text-base flex-shrink-0 shadow-md">
                      🤖
                    </div>
                    <div className="bg-slate-900 border border-emerald-500/30 rounded-3xl rounded-tl-sm p-4 text-xs sm:text-sm text-slate-200 max-w-[85%] shadow-md space-y-2 leading-relaxed whitespace-pre-line">
                      {m.text}
                    </div>
                  </div>
                );
              }

              return (
                <div key={idx} className="flex items-start justify-end gap-3">
                  <div className="bg-gradient-to-r from-rose-600 to-red-500 rounded-3xl rounded-tr-sm p-4 text-xs sm:text-sm text-white max-w-[80%] shadow-md leading-relaxed whitespace-pre-line">
                    {m.text}
                  </div>
                  <div className="w-8 h-8 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-300 flex-shrink-0">
                    Tôi
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-2xl bg-emerald-600 flex items-center justify-center text-base flex-shrink-0 shadow animate-pulse">
                  🤖
                </div>
                <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl rounded-tl-sm p-3 text-xs text-emerald-400 flex items-center gap-2 shadow">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce"></span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.4s]"></span>
                  <span className="text-xs text-slate-400 ml-1">Sensei đang suy nghĩ và phản hồi...</span>
                </div>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* Interactive Chat Input Box */}
          <div className="pt-3 border-t border-slate-800/80 mt-2">
            <form
              className="relative flex items-center"
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
            >
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Hỏi AI Sensei bất kỳ câu hỏi nào về từ vựng, ngữ pháp N5..."
                className="w-full pl-4 pr-24 py-3 bg-slate-950 border border-slate-700/80 rounded-2xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
              <div className="absolute right-2 flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    handleSend('Phát âm và đọc chuẩn câu này');
                  }}
                  className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                  title="Voice Prompt"
                >
                  <span className="material-symbols-outlined text-base">mic</span>
                </button>
                <button
                  type="submit"
                  className="w-8 h-8 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow transition-all cursor-pointer active:scale-90"
                  title="Gửi câu hỏi"
                >
                  <span className="material-symbols-outlined text-base">send</span>
                </button>
              </div>
            </form>
          </div>

        </div>

      </div>

    </section>
  );
}
